let view=document.getElementById("view")
let info=document.getElementById("info")
let surroundings=document.getElementById("surroundings")


function renderView(iteration){

	let gridView=wall+"\n";

	for (let y=0;y<gridDimensions;y++){
		for (let x=0;x<gridDimensions;x++){
		//	console.log(x,y)
			if (x==0)gridView+="|";

			if (grid[y][x]==-1) gridView+=" ";
			else gridView+=grid[y][x].toString();

			if (grid[y][x]<10) gridView+=" ";

			if (x==gridDimensions-1) gridView+="|\n"

		}
	}
	gridView+=wall;

	let agentInfo="";
	agentList.forEach(agent=>{
		//agent.update();
    agentInfo+="Agent "+agent.id+" likes: "+agent.likeArray
		//+"\ntrust: "+agent.trustArray
      +" last move: "+ agent.lastMove+"\n"+

      /*+"\npopularity: "+agent.popularity*/
		"loneliness: "+agent.loneliness+"\n"
		+"memory: "+agent.memory+"\n"
	});
	//console.clear();

	let agentTracker=agentList[trackedAgent].lastMove
	agentList[trackedAgent].lastMove='';
	let surr=agentList[trackedAgent].surroundings;
	surroundings.innerHTML=agentTracker+"\n"+surr[0]+surr[1]+surr[2]+"\n"+surr[3]+" "+surr[4]+"\n"+surr[5]+surr[6]+surr[7];

	view.innerHTML=gridView
	info.innerHTML="iteration: "+iteration+"\n"+agentInfo
	//console.log('nets',networks)

	//iteration+=1;
}
