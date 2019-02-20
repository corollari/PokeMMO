import Packet from "../../src/Packets";
import {charmander, squirtle, bulbasaur} from "./starters";

/**
 * Instance
 * @class Instance
 * @export
 */
export default class Instance {

  /**
   * @constructor
   * @param {Object} instance
   * @param {Object} entity
   */
  constructor(instance, entity) {

    /**
     * Instance ref
     * @type {Object}
     */
    this.instance = instance;

    /**
     * Entity ref
     * @type {Object}
     */
    this.entity = entity;

    /**
     * Protocol
     * @type {Number}
     */
    this.protocol = 0;

	this.pokemons=[];

  }

  /**
   * Sto buffer
   * @param {Array} message
   * @return {Object}
   */
  stobuf(buffer) {

    let ii = 0;
    let length = buffer.length;
    let arrayBuffer = new ArrayBuffer(length);
    let view = new Uint8Array(arrayBuffer);

    for (; ii < length; ++ii) {
      view[ii] = buffer[ii];
    };

    return (view.buffer);
  }

  invalidMessage(msg) {
    return (
      msg !== void 0 &&
      typeof msg === "string" ||
      msg.length === 0
    );
  }

  /**
   * Kill myself
   */
  kill() {
    let data = this.getSTR(34, JSON.stringify({name: this.entity.name}));
    this.instance.broadcastMessage(data, this.entity.name);
    return void 0;
  }

	getRandomInt(max) {
		return Math.floor(Math.random() * Math.floor(max));
	}

  /**
   * Handle a message
   * @param {Array} msg
   */
  onMessage(msg) {

    if (this.invalidMessage(msg) === true) return void 0;

    let buffer = this.stobuf(msg);
    let view = new DataView(buffer);
    let packetId = view.getUint8(0, true);

    /** Pokebattle winner */
    if (packetId === 70) {
	let opponent=this.getString(view);
	    console.log(opponent);
	    let length = this.instance.users.length;
            for (let ii=0; ii < length; ++ii) {
                    if (this.instance.users[ii].name === opponent){
			    this.pokemons=this.pokemons.concat(this.instance.users[ii].instance.pokemons);
			    this.instance.users[ii].instance.kill();
			    break;
		    }
	    }
    }	

    /** Username */
    if (packetId === 0) {
	let datum=this.getString(view).split(';');
	    console.log(datum);
      let name = datum[0];
	switch(datum[1]){
		case 'charmander':
			this.pokemons.push({
				packed: "",
				jsonFormatted: charmander[this.getRandomInt(charmander.length)]
			});
			break;
		case 'bulbasaur':
			this.pokemons.push({
				packed: "",
				jsonFormatted: bulbasaur[this.getRandomInt(bulbasaur.length)]
			});
			break;
		case 'squirtle':
		default:
			this.pokemons.push({
				packed: "",
				jsonFormatted: squirtle[this.getRandomInt(squirtle.length)]
			});
			break;
		}

      this.entity.name = name;
      this.instance.broadcastMessage(this.buildEntityData(name, 160, 144, false), name);
      this.instance.sendMessageTo(this.buildEntityData(name, 160, 144, true), name);
	    let ii = 0;
	    let length = this.instance.users.length;
	    for (; ii < length; ++ii) {
		    if (this.instance.users[ii].name === name) continue;
		    let user = this.instance.users[ii];
		    if(user.pokeball){
			    this.entity.socket.sendPacket(this.buildPokeballData(user.name, user.position.x, user.position.y, false));
		    } else{
			    this.entity.socket.sendPacket(this.buildEntityData(user.name, user.position.x, user.position.y, false));
		    }
	    }
      return void 0;
    }

    /** Jumping */
    if (packetId === 30) {
      let id = view.getUint16(1, true);
      let data = this.getSTR(packetId, JSON.stringify({name: this.entity.name}));
      this.instance.broadcastMessage(data, this.entity.name);
      return void 0;
    }

    /** Facing */
    if (packetId === 31) {
      let id = view.getUint16(1, true);
      let dir = view.getUint16(3, true);
      this.entity.facing = dir << 0;
      let data = this.getSTR(packetId, JSON.stringify({ name: this.entity.name, dir: dir }));
      this.instance.broadcastMessage(data, this.entity.name);
      return void 0;
    }

    /** Movement */
    if (packetId === 32) {
      let id = view.getUint16(1, true);
      let dir = view.getUint16(3, true);
      let x = view.getUint16(5, true);
      let y = view.getUint16(7, true);
	    console.log(x, y, dir);
      this.entity.position.x = x << 0;
      this.entity.position.y = y << 0;
      let data = this.getSTR(packetId, JSON.stringify({ name: this.entity.name, dir: dir, x: x, y: y }));
      this.instance.broadcastMessage(data, this.entity.name);
	    let ii = 0;
	    let length = this.instance.users.length;
	    for (; ii < length; ++ii) {
		    if (this.instance.users[ii].name === this.entity.name) continue;
		    let user = this.instance.users[ii];
		    if(Math.abs(user.position.x-x)<=4 && Math.abs(user.position.y-y)<=4){
			    if(user.pokeball){
				    this.pokemons=this.pokemons.concat(user.instance.pokemons);
				    console.log(this.pokemons[1].jsonFormatted);
				    user.instance.kill();
			    } else {
				    this.entity.socket.sendPacket(this.getSTR(69, JSON.stringify({ opponent: user.name, pokemons: this.formatPokemonTeam(this.pokemons)})));
				    user.socket.sendPacket(this.getSTR(69, JSON.stringify({ opponent: this.entity.name, pokemons: this.formatPokemonTeam(user.instance.pokemons)})));
				    console.log("battle");
			    }
		    }
	    }
      return void 0;
    }

    /** Velocity */
    if (packetId === 33) {
      let id = view.getUint16(1, true);
      let velocity = view.getUint16(3, true);
      this.entity.velocity = Number(velocity);
      let data = this.getSTR(packetId, JSON.stringify({ name: this.entity.name, velocity: velocity }));
      this.instance.broadcastMessage(data, this.entity.name);
      return void 0;
    }

  }

	formatPokemonTeam(pokemons){
		console.log(pokemons.map((p)=>p.jsonFormatted))
		return "=== [gen7ou] Untitled 3 ===\n\n"+
			pokemons.map((p)=>p.jsonFormatted).map((p)=> `${p.name} @ ${p.item}  \n`+
			`Ability: ${p.ability}  \n`+
			`EVs: ${p.evs.hp} HP / ${p.evs.atk} Atk / ${p.evs.def} Def / ${p.evs.spa} SpA / ${p.evs.spd} SpD / ${p.evs.spe} Spe  \n`+
			p.nature?`${p.nature} Nature  \n`:''+
			p.ivs?`IVs: ${p.ivs.hp} HP / ${p.ivs.atk} Atk / ${p.ivs.def} Def / ${p.ivs.spa} SpA / ${p.ivs.spd} SpD / ${p.ivs.spe} Spe  \n`:''+
			`- ${p.moves[0]}  \n`+
			`- ${p.moves[1]}  \n`+
			`- ${p.moves[2]}  \n`+
			`- ${p.moves[3]}  \n`).join('\n');
			//'EVs:'+(['HP', 'Atk', 'Def', 'SpA', 'SpD', 'Spe'].map((attr)=>p.evs[attr.toLowerCase()]?` ${p.evs[attr.toLowerCase()]} ${attr} `:'').join('/'))+' \n'+
	}

  /**
   * Build entity data
   * @param  {String} name
   * @param  {Number} x
   * @param  {Number} y
   * @param  {Boolean} local
   * @return {Object}
   */
  buildEntityData(name, x, y, local) {

    var options = {
      name: name,
      map: "Town",
      x: x,
      y: y,
      width: 16,
      height: 16,
      isLocalPlayer: local,
      sprite: "assets/img/0.png"
    };

    let data = JSON.stringify(options);

    return (this.getSTR(22, data));

  }

  /**
   * Build pokeball data
   * @param  {String} name
   * @param  {Number} x
   * @param  {Number} y
   * @param  {Boolean} local
   * @return {Object}
   */
  buildPokeballData(name, x, y, local) {

    var options = {
      name: name,
      map: "Town",
      x: x,
      y: y,
      width: 16,
      height: 16,
      isLocalPlayer: local,
      sprite: "assets/img/7.png"
    };

    let data = JSON.stringify(options);

    return (this.getSTR(22, data));

  }



  getString(view) {

    if ((view.byteLength + 1) % 2 === 1) {
      return void 0;
    }

    var txt = "";
    var maxLen = 32 * 2;
    for (var i = 1; i < view.byteLength && i <= maxLen; i += 2) {
      var charCode = view.getUint16(i, true);
      if (charCode == 0) {
        return void 0;
      }
      txt += String.fromCharCode(charCode);
    }
    return (txt);
  }

  getSTR(id, str) {

    var lb = [str];
    var bufferSize = 5;
    var validElements = 0;

    // Get size of packet
    for (var i = 0; i < lb.length; i++) {
        if (typeof lb[i] == "undefined") {
            continue;
        }

        var item = lb[i];
        bufferSize += 4; // Empty ID
        bufferSize += item.length * 2; // String length
        bufferSize += 2; // Name terminator

        validElements++;
    }

    var buf = new ArrayBuffer(bufferSize);
    var view = new DataView(buf);

    // Set packet data
    view.setUint8(0, id, true); // Packet ID
    view.setUint32(1, validElements, true); // Number of elements
    var offset = 5;

    // Loop through strings
    for (var i = 0; i < lb.length; i++) {
        if (typeof lb[i] == "undefined") {
            continue;
        }

        var item = lb[i];

        view.setUint32(offset, 0, true);
        offset += 4;

        for (var j = 0; j < item.length; j++) {
            view.setUint16(offset, item.charCodeAt(j), true);
            offset += 2;
        }

        view.setUint16(offset, 0, true);
        offset += 2;
    }

    return buf;

  }

}
