const userControl=false, trackedAgent=0
const numberOfAgents=8,gridDimensions=7
const inputType=5,generationLength=50

let wall="-".repeat(gridDimensions*2+2)

let grid

function makeGrid(){
	grid=[]
	for (let y=0;y<gridDimensions;y++){
		let row= new Array(gridDimensions).fill(-1);
		grid.push(row)
	}
}
makeGrid();

function forceValIntoRange(val){
	return parseFloat(parseFloat(val).toPrecision(3));
}

function noNeighbors(xPos,yPos){
	let surroundingDirections=[[1,-1],[1,0],[1,1],
							   [0,-1],		[0,1],
							   [-1,-1],[-1,0],[-1,1]];
	let x,y
	let neighbors=false
	surroundingDirections.forEach((direction,index)=>{
		y=(yPos-direction[0])%(gridDimensions);
		x=(xPos+direction[1])%(gridDimensions);
		if (y==-1) y=gridDimensions-1;
		if (x==-1) x=gridDimensions-1;

		if (grid[y][x]>-1) neighbors=true
	})
	return !neighbors
}


class Agent{
	constructor(id){
		this.id=id;
		this.output=[
			()=>this.move("up"),
			()=>this.move("down"),
			()=>this.move("left"),
			()=>this.move("right"),
			()=>this.makeConversation(),
		]
		this.resetAgent();
		//fix:
		//do after all agents are created
		this.getSurroundings();
	}

	resetAgent(){
		let x=Math.round(Math.random()*(gridDimensions-1));
		let y=Math.round(Math.random()*(gridDimensions-1));
		
		while (!(grid[y][x]==-1 && noNeighbors(x,y))){
	 		x=Math.round(Math.random()*(gridDimensions-1));
			y=Math.round(Math.random()*(gridDimensions-1));
		}
		grid[y][x]=this.id;
		this.x=x;
		this.y=y;
		//this.trustArray=Array(numberOfAgents).fill(0.1);
		this.likeArray=Array(numberOfAgents).fill(0);
		this.interestArray=Array(numberOfAgents).fill(.8/numberOfAgents);
		this.popularity=50;
		this.lastMove="";
		this.loneliness=0;
		this.memory=Array(5).fill(0);
	}
	updateMemory(score){
		this.memory.shift()
		this.memory.push(score)
		//console.log(this.id,this.memory)
	}

	generateInput(type){

		//idea 3
		//can see all surrounding agents, 
		//knows like and trust array
		//if (type==3) INPUT=8*numberOfAgents+2*numberOfAgents
		if (type==3){	
			let input=[];
			for (let a=0; a<numberOfAgents;a++){
				if (a!=this.id){
					//8 directions
					this.surroundings.forEach(space=>{
						//if (agentList[a]){
							if (space==agentList[a].id) input.push(1);
							else input.push(0);
						//}
					});

					//like and trust array
					input.push(this.likeArray[a]);
					input.push(this.trustArray[a]);
				}
			}
			return input;
		}
		//8 directions only
		if (type==4){	
			let input=[];
			//8 directions
			this.surroundings.forEach(space=>{
					if (space!=-1) input.push(1);
					else input.push(0);
			});
			return input;
		}
		if (type==5){	
			let input=[];
			//8 directions+5 memory neurons
			this.surroundings.forEach(space=>{
					if (space!=-1) input.push(1);
					else input.push(0);
			});
			input.concat(this.memory)
			return input;
		}
	}

	computePopularity(){
		let popularity=0;
		agentList.forEach(agent=>{
			if (agent.id!=this.id){
				popularity+=agent.likeArray[this.id];
			}
		})	
			//console.log('popularity',popularity)
			//console.log('Math.exp(-popularity)',Math.exp(-popularity))
			this.popularity=100/(1+Math.exp(-popularity));
	}


	getSurroundings(){
		let surroundingDirections=[[1,-1],[1,0],[1,1],
								   [0,-1],		[0,1],
								   [-1,-1],[-1,0],[-1,1]];
		this.surroundings=[];
		let x,y
		surroundingDirections.forEach((direction,index)=>{
			y=(this.y-direction[0])%(gridDimensions);
			x=(this.x+direction[1])%(gridDimensions);
			if (y==-1) y=gridDimensions-1;
			if (x==-1) x=gridDimensions-1;

			this.surroundings.push(grid[y][x])
		})
	}

	insultOther(personBeingInsulted){
		console.log('insult')
		this.surroundings.forEach(personInSpace=>{
			if (personInSpace!=-1){
				// -if a insults b, 
				// 	if b is present, b like and trust of a both decrease by .5, 
				if (personInSpace==personBeingInsulted){
					agentList[personBeingInsulted].likeArray[this.id]=
						forceValIntoRange(agentList[personBeingInsulted].likeArray[this.id]-.5)
					//agentList[personBeingInsulted].trustArray[this.id]=
					//	forceValIntoRange(agentList[personBeingInsulted].trustArray[this.id]-.5)
				}
				else{
					let trustOfInsulter=agentList[personInSpace].trustArray[this.id];
					// 	for all other p in s
					// 	p like of b decreases by .2*p trust of a
					agentList[personInSpace].likeArray[personBeingInsulted]=
						forceValIntoRange(agentList[personInSpace].likeArray[personBeingInsulted]
						-agentList[personInSpace].likeArray[personBeingInsulted]*trustOfInsulter*.2)
					// p trust of a= (p trust of a - p trust of b)
					//agentList[personInSpace].trustArray[this.id]=
					//	forceValIntoRange(agentList[personInSpace].trustArray[this.id]-
					//	agentList[personInSpace].trustArray[personBeingInsulted])
				}

			}
		});
		this.lastMove="Agent "+this.id+" insulted Agent "+personBeingInsulted
	}

	complementOther(personBeingComplemented){
				console.log('complement')

		this.surroundings.forEach(personInSpace=>{
			if (personInSpace!=-1){
					// -if a complements b, 
					// 	if b is in s, b like of a increases by .2, b trust of a increase by .1
				if (personInSpace==personBeingComplemented){
					agentList[personBeingComplemented].likeArray[this.id]=
						forceValIntoRange(agentList[personBeingComplemented].likeArray[this.id]+.2)
					//agentList[personBeingComplemented].trustArray[this.id]=
					//	forceValIntoRange(agentList[personBeingComplemented].trustArray[this.id]+.1)
				}
				else{
					let trustOfComplementer=agentList[personInSpace].trustArray[this.id];
					// 	for all other p in s
					// 	p like of b increase by .1*p trust of a
					agentList[personInSpace].likeArray[personBeingComplemented]=
						forceValIntoRange(agentList[personInSpace].likeArray[personBeingComplemented]+
						agentList[personInSpace].likeArray[personBeingComplemented]*trustOfComplementer*.1)
					//change in trust of a is  proportional to trust of b
					//agentList[personInSpace].trustArray[this.id]=
					//	forceValIntoRange(agentList[personInSpace].trustArray[this.id]+
					//	agentList[personInSpace].trustArray[personBeingComplemented]*.2)
				}
			}
		});
		this.lastMove="Agent "+this.id+" complemented Agent "+personBeingComplemented
	}

	makeConversation(){
		//console.log('converse')
		this.surroundings.forEach(personInSpace=>{
			if (personInSpace!=-1){
				agentList[personInSpace].likeArray[this.id]=
				forceValIntoRange(agentList[personInSpace].likeArray[this.id]+agentList[personInSpace].interestArray[this.id]);
			//	agentList[personInSpace].trustArray[this.id]=
			//	forceValIntoRange(agentList[personInSpace].trustArray[this.id]+agentList[personInSpace].interestArray[this.id]/2);
				
				agentList[personInSpace].interestArray[this.id]*=.9;
			}
		})
		this.lastMove="Agent "+this.id+" akwardly attempted to make conversation."
	}

	move(direction){
		let currentX=this.x;
		let currentY=this.y;

		if (direction=="up")this.y=(this.y-1)%(gridDimensions);
		if (direction=="down")this.y=(this.y+1)%(gridDimensions);
		if (direction=="left")this.x=(this.x-1)%(gridDimensions);
		if (direction=="right")this.x=(this.x+1)%(gridDimensions);

		if (this.y==-1)this.y=gridDimensions-1
		if (this.x==-1)this.x=gridDimensions-1

		if (grid[this.y][this.x]!=-1){
			this.x=currentX;
			this.y=currentY;
		}
		else{
			grid[currentY][currentX]=-1;			
			grid[this.y][this.x]=this.id;
		}
		// 	this.lastMove="Agent "+this.id+" worked up the nerve to walk 1 space "+directionArray[direction];
		this.lastMove= "Agent "+this.id+" moved "+ direction 
	}
	getLoneliness(){
		let changeInloneliness=1
		this.surroundings.forEach(space=>{
			//console.log(this.id,space)
			if (space!=-1) changeInloneliness-=1;
		})
		this.loneliness+=changeInloneliness
		this.updateMemory(-changeInloneliness);
		//console.log('agent',this.id,'loneliness',this.loneliness)
	}

	update(thinkAndThenAct){
		thinkAndThenAct();
		this.getSurroundings();
		this.getLoneliness()
		this.computePopularity();
	}
}



if (userControl==true){
	document.addEventListener('keydown',function(e){
		event.preventDefault()

		if (e.key=='ArrowLeft')agentList[0].move("left");
		if (e.key=='ArrowRight')agentList[0].move("right");
		if (e.key=='ArrowUp')agentList[0].move("up");
		if (e.key=='ArrowDown')agentList[0].move("down");
		if (e.key=='z')agentList[0].makeConversation();
		//if (e.key=='x')agentList[0].complementOther(Math.floor(Math.random()*(numberOfAgents-1)));
		//if (e.key=='c')agentList[0].insultOther(Math.floor(Math.random()*(numberOfAgents-1)));

		stepSim();
	});
}


let agentList=[];

for (let i=0; i<numberOfAgents; i++){
	agent= new Agent(i);
	agentList.push(agent);
}


let iteration=0,generation=0;

function stepSim(){
	iteration+=1;
	agentList.forEach((agent,agentIndex)=>{
		agent.update(
			function(){
				// if (agent.id==0 && userControl==true){
				// 	//control agent 0
				// 	//return;
				// }
				//console.log(Math.random(),agentIndex)
				//if(Math.random()<.5){
					let input = agent.generateInput(inputType);
					let output = networks.population[agentIndex].activate(input);
					let move = outputToMove(output);
					if (move==-1) move = 4; //if no output due to all 0 input, make conversation
					let dodo = agent.output[move];
					//let rand= Math.random()
					//if(rand<.5)
					dodo();
				//}
			}
		);
	})

	if (skipToGeneration){
		if (skipToGeneration==generation) {
			play(400);
		}
	}
	else{
		renderView(iteration);
	}
	document.getElementById('generations').innerText=" generation: "+generation

	if (iteration==generationLength) {
		generation++
		iteration=0
		customFitnessFunction();
		logAverage();
		makeGrid();
		resetAgents();
		if (!skipToGeneration) {
			let svg=document.querySelector('.draw')
			svg.parentNode.replaceChild(svg.cloneNode(false), svg);
			drawGraph(networks.population[0].graph(400,400), '.draw');
		}
	}
}

function logAverage(){
	let avg=0
	agentList.forEach(agent=>{avg+=agent.loneliness})
	console.log('average: '+avg/numberOfAgents)
}

function resetAgents(){
	agentList.forEach(agent=>{agent.resetAgent();})
}

let networks
function start(action){
	//initialize
	renderView(iteration);
	iteration+=1;
	if (action=='new') networks = buildNeuralNets(inputType)
	if (action=='load') {
    	networks = buildNeuralNets(inputType,true)
		generation=localStorage.getItem('generation');
	}
		console.log('networks:',networks)
	drawGraph(networks.population[0].graph(500,500), '.draw');
}

function save(){
 	localStorage.setItem('networks',JSON.stringify(networks.export()))
	localStorage.setItem('generation', generation);
}



let loop
function play(speed,skip){
	if (!skip) skipToGeneration = undefined;
	if (loop) clearInterval(loop);
	loop = setInterval(stepSim,speed);
}

function pause(){
	clearInterval(loop);
}

let skipToGeneration
function skip(numberOfGenerations){
	let svg=document.querySelector('.draw')
	svg.parentNode.replaceChild(svg.cloneNode(false), svg);
	skipToGeneration = generation+numberOfGenerations
	play(0,true);
}