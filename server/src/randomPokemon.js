const exec = require('child_process').exec;

export default function getRandomPokemons(num) {
	return new Promise((resolve, reject) => {
		let pokemons=[]
		for(let i=0; i<(num/6+1); i++){
			exec('~/projects/Pokemon-Showdown/pokemon-showdown generate-team gen7ou', (error, stdout, stderr) => {
				 exec('echo "'+stdout+'" | ~/projects/Pokemon-Showdown/pokemon-showdown unpack-team', (error2, stdout2, stderr2) => {
					 let packedPokemons = stdout.split(']');
					 let jsonPokemons= JSON.parse(stdout2);
					 for(let j=0; j<6; j++){
						 pokemons.push({
							 packed: packedPokemons[j],
							 jsonFormatted: jsonPokemons[j]
						 });
					 }
					 if(pokemons.length>=num){
						 resolve(pokemons);
					 }
				 });
			});
		}
	});
}
