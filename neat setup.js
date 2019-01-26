
console.log(neataptic)
var Neat    = neataptic.Neat;
var Methods = neataptic.methods;
var Config  = neataptic.config;
var Architect = neataptic.architect;
/** Construct the genetic algorithm */

let hidden=10



function initNeat(INPUT,OUTPUT,FITNESS_FUNCTION){
  var input = new neataptic.Layer.Dense(INPUT);
  var hidden1 = new neataptic.Layer.Dense(8);
  var hidden2 = new neataptic.Layer.Dense(6);
  var output = new neataptic.Layer.Dense(OUTPUT);
  // connect however you want
  input.connect(hidden1);
  hidden1.connect(hidden2);
  hidden2.connect(output);

  neat = new Neat(
    INPUT,
    OUTPUT,
    FITNESS_FUNCTION,
    {
      mutation: Methods.mutation.FFW,
      popsize: numberOfAgents,
      elitism: 7,
      fitnessPopulation:false,
      //mutationRate: 1,
      network: Architect.Construct([input, hidden1, hidden2, output])
    }
  );
  return neat
  if(USE_TRAINED_POP) neat.population = population;
}

/** hooks up neural nets to new agents */
// function startEvaluation(){
//   players = [];
//   highestScore = 0;

//   for(var genome in neat.population){
//     genome = neat.population[genome];
//     new Player(genome);
//   }
// }

/** End the evaluation of the current generation */
function endEvaluation(){
  console.log('Generation:', neat.generation);

  neat.sort();
  var newPopulation = [];

  // Elitism
  for(var i = 0; i < neat.elitism; i++){
    newPopulation.push(neat.population[i]);
  }

  // Breed the next individuals
  for(var i = 0; i < neat.popsize - neat.elitism; i++){
    newPopulation.push(neat.getOffspring());
  }

  // Replace the old population with the new population
  neat.population = newPopulation;
  neat.mutate();

  neat.generation++;
}


function buildNeuralNets(type){

  let INPUT
  //idea 1
  //can see all surrounding agents, 
  //hear conversation from any surrounding agents, 
  //hear complement from any surrounding agent to any agent, 
  //hear insult from any surrounding agent to any agent,
  //knows like and trust array?? 
  //const INPUT=8*numberOfAgents*2+2*numberOfAgents*numberOfAgents+2*numberOfAgents
  //idea 2
  //can see all surrounding agents, 
  //know if a surrounding agent complements someone I like (trust?), 
  //know if a surrounding agent complements someone I dislike (distrust?), 
  //know if a surrounding agent insults someone I like (trust?), 
  //know if a surrounding agent insults someone I dislike (distrust?), 
  //knows like and trust array
  //const INPUT=8*numberOfAgents+4*numberOfAgents+2*numberOfAgents
  
  //idea 3
  //can see all surrounding agents, 
  //knows like and trust array
  if (type==3) INPUT=8*numberOfAgents+2*numberOfAgents
  if (type==4) INPUT=8

  //const INPUT=2

  //can move in 4 directions, make conversation, 
  const OUTPUT=5
  // insult or complement any agent
  //const OUTPUT=6+2*numberOfAgents

  // const FITNESS_FUNCTION= function(net){
  //  let agent = networks.population.indexOf(net)
  //  console.log(agent)
  //    net.score= agentList[agent].popularity;
  //    console.log(net)
  //    return net.score
  // };

  let n= initNeat(INPUT,OUTPUT,null)
  console.log(n)
  return n
}

function customFitnessFunction(){
  //debugger;
  networks.population.forEach((genome,index)=>{
    //console.log(genome.nodes.length)
      //genome.score = agentList[index].popularity-agentList[index].loneliness//-(genome.nodes.length/2)
      genome.score = 50-agentList[index].loneliness//-(genome.nodes.length/2)
  })

  //   genome.score -= genome.nodes.length * SCORE_RADIUS / 10;
  // // Draw the best genome


  // Sort the population by score
  networks.sort();
//  console.log(networks)

  // Init new pop
  var newPopulation = [];

  // Elitism
  for(var i = 0; i < neat.elitism; i++){
    newPopulation.push(networks.population[i]);
  }

  // Breed the next individuals
  for(var i = 0; i < networks.popsize - networks.elitism; i++){
    newPopulation.push(networks.getOffspring());
  }

  // Replace the old population with the new population
  networks.population = newPopulation;
  networks.mutate();

  networks.generation++;
}

function outputToMove(output){
  let max = Math.max(...output)
  let move = output.indexOf(max)
  return move;
}