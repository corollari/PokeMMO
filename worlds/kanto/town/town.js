return (function() {

  "use strict";

  var MAP = {
    entities: [],
    settings: {
      music: "new-bark-town"
    }
  };

  var x = 0;
  var y = 0;
  var xx = 272;
  var yy = 68;

  while (x < xx) {
    MAP.entities.push(
      {
        x: x,
        y: y,
        type: "tree"
      }
    );
    x += 16;
    if (x === xx && y < yy) {
      x = 0;
      y += 16;
    }
  };

  var x = 0;
  var y = 96;
  var xx = 80;
  var yy = 96 * 2;

  while (x < xx) {
    MAP.entities.push(
      {
        x: x,
        y: y,
        type: "tree"
      }
    );
    x += 16;
    if (x === xx && y < yy) {
      x = 0;
      y += 16;
    }
  };

  MAP.entities.push({
    x: -112, y: -112,
    type: "ping"
  });

  /*MAP.entities.push({
    x: 144, y: 40,
    type: "cloud",
    opacity: .75,
    scale: .1
  });*/

  MAP.entities.push(
    {
      x: 176,
      y: 104,
      type: "tree",
      collisionBox: [
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 1, 1, 0
      ]
    }
  );

  MAP.entities.push({
    x: 160 + 16, y: 128,
    type: "sign",
    onCollide: {
      /*JavaScript: function(entity) {
        if (entity.facing === 2) {
          entity.jump();
        }
      },*/
      EngelScript: `
        if (trigger.facing == 2) {
          @ this.jump();
          @ this.jump();
          @ this.fadeOut(1, false);
          @ this.fadeIn(1);
          @ trigger.fadeOut(1, false);
          @ trigger.fadeIn(1);
          trigger.jump();
          @ trigger.move(0);
          @ trigger.move(0);
          @ trigger.move(2);
          @ trigger.move(2);
          @ trigger.move(2);
          @ trigger.move(1);
          @ trigger.move(1);
          @ trigger.move(1);
          trigger.jump();
          @ trigger.move(3);
          @ trigger.move(3);
          @ trigger.move(3);
          @ trigger.move(0);
          @ trigger.move(0);
          @ trigger.move(2);
          @ trigger.move(2);
        }
      `
    }
  });

  MAP.entities.push({
    x: 160, y: 128,
    type: "sign",
    onCollide: {
      EngelScript: `
        if (trigger.facing == 2) {
          if (FLAGS.GOT_STARTER_PKMN == false) {
            FLAGS.GOT_STARTER_PKMN = true;
            trigger.jump();
          }
        }
      `
    }
  });

  MAP.entities.push({
    x: 160, y: 176,
    type: "sign",
    onCollide: {
      EngelScript: `
        if (trigger.facing == 2) {
          if (FLAGS.GOT_STARTER_PKMN == false) {
            kernel.notify(trigger, "You didnt got your starter pokemon yet!");
          } {
            kernel.notify(trigger, "You successfully received your starter pkmn!", 2 * 2, FLAGS.GOT_STARTER_PKMN);
          }
        }
        if (trigger.facing == 1) {
          FLAGS.COUNTER += 1;
        }
        if (trigger.facing == 0) {
          FLAGS.COUNTER -= 1;
        }
      `
    }
  });

  MAP.entities.push({
    x: 144, y: 120,
    type: "campfire"
  });

  MAP.entities.push({
    x: 112, y: 144,
    type: "table"
  });

  MAP.entities.push({
    x: 168, y: 96,
    type: "lantern"
  });

  MAP.entities.push({
    x: 200, y: 160,
    type: "lantern"
  });

  MAP.entities.push({
    x: 104, y: 136,
    type: "lantern"
  });

  MAP.entities.push({
    x: 112, y: 168,
    type: "charizard"
  });

  MAP.entities.push({
    x: 112 + 16, y: 136,
    type: "raindrop"
  });

  MAP.entities.push({
    x: 112 + 20, y: 136,
    type: "raindrop"
  });

  MAP.entities.push({
    x: 168, y: 144,
    type: "building1"
  });

  MAP.entities.push({
    x: 92 + 4, y: 120 - 8,
    type: "flower"
  });

  MAP.entities.push({
    x: 104, y: 120 - 8,
    type: "flower"
  });

  MAP.entities.push({
    x: 112, y: 120 - 8,
    type: "flower"
  });

  MAP.entities.push({
    x: 120, y: 120 - 8,
    type: "flower"
  });

  MAP.entities.push({
    x: 128, y: 120 - 8,
    type: "flower"
  });

  MAP.entities.push({
    x: 96, y: 120,
    type: "flower"
  });

  MAP.entities.push({
    x: 104, y: 120,
    type: "flower"
  });


  MAP.entities.push({
    x: 168, y: 144,
    type: "building1"
  });

  MAP.entities.push({
    x: 92 + 4, y: 120 - 8,
    type: "flower"
  });

  MAP.entities.push({
    x: 104, y: 120 - 8,
    type: "flower"
  });

  MAP.entities.push({
    x: 112, y: 120 - 8,
    type: "flower"
  });

  MAP.entities.push({
    x: 120, y: 120 - 8,
    type: "flower"
  });

  MAP.entities.push({
    x: 128, y: 120 - 8,
    type: "flower"
  });

  MAP.entities.push({
    x: 96, y: 120,
    type: "flower"
  });

  MAP.entities.push({
    x: 104, y: 120,
    type: "flower"
  });

  MAP.entities.push({
    x: 112, y: 120,
    type: "flower"
  });

  MAP.entities.push({
    x: 120, y: 120,
    type: "flower"
  });

  MAP.entities.push({
    x: 128, y: 120,
    type: "flower"
  });

  MAP.entities.push({
    x: 96, y: 120 + 8,
    type: "flower"
  });

  MAP.entities.push({
    x: 104, y: 120 + 8,
    type: "flower"
  });

  MAP.entities.push({
    x: 112, y: 120 + 8,
    type: "flower"
  });

  MAP.entities.push({
    x: 120, y: 120 + 8,
    type: "flower"
  });

  MAP.entities.push({
    x: 128, y: 120 + 8,
    type: "flower"
  });
/*
  MAP.entities.push({
    x: 92 + 4, y: 120 + 56 - 8,
    type: "grass"
  });

  MAP.entities.push({
    x: 104, y: 120 + 56 - 8,
    type: "grass"
  });

  MAP.entities.push({
    x: 112, y: 120 + 56 - 8,
    type: "grass"
  });

  MAP.entities.push({
    x: 120, y: 120 + 56 - 8,
    type: "grass"
  });

  MAP.entities.push({
    x: 128, y: 120 + 56 - 8,
    type: "grass"
  });

  MAP.entities.push({
    x: 96, y: 120 + 56,
    type: "grass"
  });

  MAP.entities.push({
    x: 104, y: 120 + 56,
    type: "grass"
  });

  MAP.entities.push({
    x: 112, y: 120 + 56,
    type: "grass"
  });

  MAP.entities.push({
    x: 120, y: 120 + 56,
    type: "grass"
  });

  MAP.entities.push({
    x: 128, y: 120 + 56,
    type: "grass"
  });

  MAP.entities.push({
    x: 96, y: 120 + 56 + 8,
    type: "grass"
  });

  MAP.entities.push({
    x: 104, y: 120 + 56 + 8,
    type: "grass"
  });

  MAP.entities.push({
    x: 112, y: 120 + 56 + 8,
    type: "grass"
  });

  MAP.entities.push({
    x: 120, y: 120 + 56 + 8,
    type: "grass"
  });

  MAP.entities.push({
    x: 128, y: 120 + 56 + 8,
    type: "grass"
  });
*/

  MAP.entities.push({
    x: 200+4, y: 240+4,
    type: "raindrop"
  });

  MAP.entities.push({
    x: 204, y: 248,
    type: "raindrop"
  });

  MAP.entities.push({
    x: 152-32, y: 216,
    type: "arbol"
  });

  MAP.entities.push({
    x: 168-8, y: 216,
    type: "arbol2"
  });

  MAP.entities.push({
    x: 184, y: 216,
    type: "arbol3"
  });

  MAP.entities.push({
    x: 304, y: 184,
    type: "arbol_pequeno"
  });

  MAP.entities.push({
    x: 232, y: 216,
    type: "concha"
  });

  MAP.entities.push({
    x: 232+8, y: 200,
    type: "escalera_nieve"
  });

  MAP.entities.push({
    x: 232+8*2, y: 216,
    type: "hierbajo"
  });


  MAP.entities.push({
    x: 232+8*3, y: 216,
    type: "hierbajo2"
  });

  MAP.entities.push({
    x: 232+8*4, y: 216,
    type: "hierbajo_nieve"
  });

  MAP.entities.push({
    x: 232+8*5, y: 216,
    type: "hierbajo_nieve2"
  });

  MAP.entities.push({
    x: 232+8*6, y: 216,
    type: "hierbajo_nieve3"
  });

  MAP.entities.push({
    x: 232+8*7, y: 216,
    type: "hierbajo_playa"
  });

  MAP.entities.push({
    x: 232+8*8, y: 216,
    type: "nieve"
  });

  MAP.entities.push({
    x: 232+8*9, y: 216,
    type: "roca_mar"
  });

  MAP.entities.push({
    x: 232+8*10, y: 216,
    type: "roca_nieve"
  });

  MAP.entities.push({
    x: 232+8*13, y: 216,
    type: "valla1"
  });

  MAP.entities.push({
    x: 232+8*14, y: 216,
    type: "valla7"
  });

  MAP.entities.push({
    x: 232+8*15, y: 216,
    type: "valla_ciudad3"
  });

  MAP.entities.push({
    x: 232+8*16, y: 216,
    type: "valla6"
  });

  MAP.entities.push({
    x: 232+8*17, y: 216,
    type: "valla_nieve2"
  });

  MAP.entities.push({
    x: 232+8*18, y: 216,
    type: "valla_ciudad5"
  });

  MAP.entities.push({
    x: 232+8*19, y: 216,
    type: "valla_nieve1"
  });

  MAP.entities.push({
    x: 232+8*20, y: 216,
    type: "valla_ciudad1"
  });

  MAP.entities.push({
    x: 232+8*21, y: 216,
    type: "valla4"
  });

  MAP.entities.push({
    x: 232+8*22, y: 216,
    type: "valla_nieve6"
  });

  MAP.entities.push({
    x: 232+8*23, y: 216,
    type: "valla_ciudad2"
  });

  MAP.entities.push({
    x: 232+8*24, y: 216,
    type: "valla5"
  });

  MAP.entities.push({
    x: 232+8*25, y: 216,
    type: "valla_ciudad7"
  });

  MAP.entities.push({
    x: 232+8*26, y: 216,
    type: "valla_nieve5"
  });

  MAP.entities.push({
    x: 232+8*27, y: 216,
    type: "valla_nieve3"
  });

  MAP.entities.push({
    x: 232+8*28, y: 216,
    type: "valla3"
  });

  MAP.entities.push({
    x: 232+8*29, y: 216,
    type: "valla_ciudad4"
  });

  MAP.entities.push({
    x: 232+8*30, y: 216,
    type: "valla_nieve4"
  });

  MAP.entities.push({
    x: 232+8*31, y: 216,
    type: "valla2"
  });

  MAP.entities.push({
    x: 232+8*32, y: 216,
    type: "valla_ciudad6"
  });

  MAP.entities.push({
    x: 232+8*33, y: 216,
    type: "valla_nieve7"
  });

  MAP.entities.push({
    x: 200, y: 240,
    type: "water1"
  });

  MAP.entities.push({
    x: 216, y: 240,
    type: "water1"
  });

  MAP.entities.push({
    x: 232, y: 240,
    type: "water1"
  });

  MAP.entities.push({
    x: 248, y: 240,
    type: "water1"
  });

  MAP.entities.push({
    x: 264, y: 240,
    type: "water1"
  });

  MAP.entities.push({
    x: 200, y: 256,
    type: "water1"
  });

  MAP.entities.push({
    x: 216, y: 256,
    type: "water1"
  });

  MAP.entities.push({
    x: 232, y: 256,
    type: "water1",
    noise: "sea",
    noiseRadius: 72
  });

  MAP.entities.push({
    x: 248, y: 256,
    type: "water1"
  });

  MAP.entities.push({
    x: 264, y: 256,
    type: "water1"
  });

  MAP.entities.push({
    x: 200, y: 272,
    type: "water1"
  });

  MAP.entities.push({
    x: 216, y: 272,
    type: "water1"
  });

  MAP.entities.push({
    x: 232, y: 272,
    type: "water1"
  });

  MAP.entities.push({
    x: 248, y: 272,
    type: "water1"
  });

  MAP.entities.push({
    x: 264, y: 272,
    type: "water1"
  });

  return (MAP);

})();
