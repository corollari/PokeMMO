
function selectPoke(pokemon){
	let starterPokemon=pokemon;
	document.querySelector("#loading").style.display="flex";
	document.querySelector("#pokemonPicker").style.display="none";

	const socket = new WebSocket('ws://localhost:5003');

	/* Connection opened
	socket.addEventListener('open', function (event) {
	    socket.send('Hello Server!');
	});
	*/

	// Listen for messages
	socket.addEventListener('message', function (event) {

		let msg=JSON.parse(event.data);
		if(msg.type=="updateWaitingPlayers"){
			document.querySelector("#users").textContent=msg.waitingPlayers;
		} else if(msg.type=="enterGame"){
			window.location.replace(msg.game+"?starter="+starterPokemon);
		}

	});
}
