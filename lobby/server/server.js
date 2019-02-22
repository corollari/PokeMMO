const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 5003 });

const playersPerGame=3;

wss.on('connection', function connection(ws) {

	if(wss.clients.size==playersPerGame){
		broadcast(JSON.stringify({
			type: "enterGame",
			game:"/battle.html"
		}));
	} else {
		broadcast(JSON.stringify({
			type: "updateWaitingPlayers",
			waitingPlayers: wss.clients.size
		}));
	}

	ws.on('close', ()=>{
		broadcast(JSON.stringify({
                        type: "updateWaitingPlayers",
                        waitingPlayers: wss.clients.size
                }));
	});

});

function broadcast(message){
	wss.clients.forEach(function each(client) {
		if (client.readyState === WebSocket.OPEN) {
			client.send(message);
		}
	});
}
