
console.log(neataptic)
var Neat    = neataptic.Neat;
var Methods = neataptic.methods;
var Config  = neataptic.config;
var Architect = neataptic.architect;
/** Construct the genetic algorithm */

let hidden=10



function initNeat(INPUT,OUTPUT,USE_TRAINED_POP){

  if(!USE_TRAINED_POP) {
    var input = new neataptic.Layer.Dense(INPUT);
    var hidden1 = new neataptic.Layer.Dense(INPUT-2);
    var hidden2 = new neataptic.Layer.Dense(INPUT-4);
    var output = new neataptic.Layer.Dense(OUTPUT);
    // 4 layer
    // input.connect(hidden1);
    // hidden1.connect(hidden2);
    // hidden2.connect(output);
    //3 layer
    input.connect(hidden1);
    hidden1.connect(output);


    neat = new Neat(
      INPUT,
      OUTPUT,
      null,
      {
        mutation: Methods.mutation.ALL,
        popsize: numberOfAgents,
        elitism: numberOfAgents-2,
        fitnessPopulation:false,
        //mutationRate: 1,
        network: Architect.Construct([input, hidden1, output])
      }
    );
  }
  else{
    neat = new Neat(
      INPUT,
      OUTPUT,
      null,
      {
        mutation: Methods.mutation.ALL,
        popsize: numberOfAgents,
        elitism: numberOfAgents-4,
        fitnessPopulation:false,
      }
    )

    let populationArr =JSON.parse(localStorage.getItem('networks'))
    neat.import(populationArr)
    console.log('loaded saved networks')
  }

  return neat
}

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


function buildNeuralNets(type,loadSaved){

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
  if (type==5) INPUT=8+5

  //can move in 4 directions, make conversation, 
  const OUTPUT=5
  // insult or complement any agent
  //const OUTPUT=6+2*numberOfAgents

  let n= initNeat(INPUT,OUTPUT,loadSaved)
//  console.log(n)
  return n
}

function customFitnessFunction(){
  //debugger;
  networks.population.forEach((genome,index)=>{
    //console.log(genome.nodes.length)
      //genome.score = agentList[index].popularity-agentList[index].loneliness//-(genome.nodes.length/2)
      genome.score = 50-agentList[index].loneliness//-(genome.nodes.length/2)
  })

  // Sort the population by score
  networks.sort();
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