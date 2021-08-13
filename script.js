"use strict";

const cPi = Math.PI;
let GameSpeed = 60;

let lastRenderTime = 0;
let startedgame = false;

let scale_divider,scale,ctx,ratio;
let can = document.getElementById("canvas");
ctx = can.getContext("2d");
ctx.strokeStyle = "black";
ctx.lineWidth = 10;

ratio = 1;
can.width = 6*window.innerHeight/9;
can.height = (6*window.innerHeight/9)*ratio;

setcanvas(8);

const PLAYERS = [];

const COLORS = [
"#FF6633", "#FFB399", "#FF33FF", "#FFFF99", "#00B3E6", 
"#E6B333", "#3366E6", "#999966", "#99FF99", "#B34D4D",
"#80B300", "#809900", "#E6B3B3", "#6680B3", "#66991A", 
"#FF99E6", "#CCFF1A", "#FF1A66", "#E6331A", "#33FFCC",
"#66994D", "#B366CC", "#4D8000", "#B33300", "#CC80CC", 
"#66664D", "#991AFF", "#E666FF", "#4DB3FF", "#1AB399",
"#E666B3", "#33991A", "#CC9999", "#B3B31A", "#00E680", 
"#4D8066", "#809980", "#E6FF80", "#1AFF33", "#999933",
"#FF3380", "#CCCC00", "#66E64D", "#4D80CC", "#9900B3", 
"#E64D66", "#4DB380", "#FF4D4D", "#99E6E6", "#6666FF"];

let Playerturn = 0;
let wincondition = 4;

let mouseX = scale_divider/2;
let CurrentPlayerdisplay = document.getElementById("CurrentPlayer");
CurrentPlayerdisplay.value = "";
let Playerlistdisplay = document.getElementById("PlayerList");
// piece (ein block)

class block {

    constructor(x,parent){
        this.x = x;
        this.y = 0;
        this.yvel = 1;
        this.parent = parent;
        
    }

    update = function(){
        if(this.yvel !== 0){
        this.y += this.yvel;

        if( this.y+1 > (scale_divider*ratio)-1){
            this.yvel = 0;
            nextplayer();
        }else{
        PLAYERS.forEach(v=>{
            if(v.BLOCKS.some(v=>{ return v.x === this.x && v.y === (this.y+1) && v.yvel === 0 })){
                this.yvel = 0;
                nextplayer();
            }
        })}
        
        }

    }
    
    render = function(color){
        
        
        ctx.fillStyle= color;
        ctx.fillRect(scale*this.x,scale*this.y,scale , scale);
        if(Playerturn === this.parent.index){
            ctx.globalAlpha = 0.5
            ctx.strokeRect(scale*this.x,scale*this.y,scale , scale);
            ctx.globalAlpha = 0.8;
        }
        
        

    }
    
        
    
        
}

// player 

class player{

    constructor(name,index){

        this.x = 0;
        this.name = name;
        this.index = index;
        this.BLOCKS = [];
        this.GRID = [[]];
        this.color = COLORS[randomrange(0, COLORS.length)];
        
    }

    update = function(){
        this.BLOCKS.forEach(v=>{v.update();})

        if(Playerturn === this.index){

            CurrentPlayerdisplay.value = this.name;
            this.x = mouseX;
            if(this.x > scale_divider-1 || this.x < 0){this.x = scale_divider/2}


        }

        
    }

    render = function(){

        this.BLOCKS.forEach(v=>{v.render(this.color);})
        if(Playerturn === this.index){
        ctx.fillStyle= this.color;
        ctx.fillRect(scale*this.x,0,scale , scale);
        ctx.lineWidth = 5;

        ctx.globalAlpha = 0.5
        ctx.strokeRect(scale*this.x,0,scale , scale);
        ctx.globalAlpha = 0.8;

        }
    }

    spawnblock = function(x){
        const newblock = new block(x,this);
        this.BLOCKS.push(newblock);
    }

    makegrid = function(){
        this.GRID = Array(scale_divider*ratio).fill().map(() => Array(scale_divider));
        this.BLOCKS.forEach((v)=>{this.GRID[v.y][v.x] = true;})
        this.checkwin();  
    }

    checkwin = function(){
        this.GRID.forEach((array,y)=>{
            array.forEach((value,x)=>{
                if(value === true){
                    
                    for(let i = 1; i<wincondition; i++){
                        if(y+i-1 < (scale_divider*ratio)-1){
                        if(this.GRID[y+i][x] !== true){break;}
                        // this.GRID[y+i][x] = false;
                        if(i === wincondition-1 ){winner(this)}
                    }}

                    for(let i = 1; i<wincondition; i++){
                        if(x+i-1 < scale_divider-1){
                        if(this.GRID[y][x+i] !== true){break;}
                        // this.GRID[y][x+i] = false;
                        if(i === wincondition-1 ){winner(this)}
                    }}

                    for(let i = 1; i<wincondition; i++){
                        if(x+i-1 < scale_divider-1 && y+i-1 < (scale_divider*ratio)-1){
                        if(this.GRID[y+i][x+i] !== true){break;}
                        if(i === wincondition-1 ){winner(this)}
                    }}

                    for(let i = 1; i<wincondition; i++){
                        if(x+i-1 > -1 && y+i-1 < (scale_divider*ratio)-1){
                        if(this.GRID[y+i][x-i] !== true){break;}
                        if(i === wincondition-1 ){winner(this)}
                    }}


                }
            
        })  })

    }

    dropblock = function(){
        if(Playerturn === this.index){
            this.spawnblock(this.x);
            nextplayer();
    } }



}




//start game

function startgame(){
    if(PLAYERS.length > 0){
        window.requestAnimationFrame(main); 
        document.getElementById("settings").style.display = "none";
        startedgame = true;
    }else{
        alert('You need at least one player !');
    }
}

//loop loop
function main(currentTime){
window.requestAnimationFrame(main);
const secondsSinceLastRender = (currentTime- lastRenderTime)/1000
if (secondsSinceLastRender < 1 / GameSpeed) {return}
lastRenderTime = currentTime;  
render();
update();
}


//update
function update(){
    PLAYERS.forEach(v=>{v.update();})
    

}


//render
function render(){
    ctx.clearRect(0,0,can.width,can.height)
    PLAYERS.forEach(v=>{v.render();})   


}

// spawn player

function spawnplayer(name){
    const newplayer = new player(name,PLAYERS.length);
    PLAYERS.push(newplayer);

    
    let playerforlist = document.createElement('div');
    playerforlist.innerHTML = name;
    Playerlistdisplay.appendChild(playerforlist);
}

// next player

function nextplayer(increment = 0.5){
    Playerturn+= increment;
    if (Playerturn > PLAYERS.length-0.5){Playerturn = 0}
    PLAYERS.forEach(v=>{v.makegrid()});
}

// buttton spawnn player

function addplayer(self){
    let input = self.parentElement.firstElementChild;
    if(input.value.length > 0){
    spawnplayer(input.value); 
    input.value = "Player "+ (PLAYERS.length+1) ;}
}

// button win con

function setwincon(self){
let newwincon = parseInt(self.parentElement.firstElementChild.value);
if(newwincon > 1 && newwincon < scale_divider ){
    wincondition = newwincon;
}else{
    if(newwincon > scale_divider){
        alert("The win condition has to be under "+ scale_divider)
    }else{
        alert("The win condition has to be above 1")
    }
    }
}


// canvas size

function setcanvasbtn(self){
    let newscale = parseInt(self.parentElement.firstElementChild.value);
    if(newscale > wincondition){
        setcanvas(newscale);
    }else{alert("The board size has to be above "+ wincondition)}
    }

function setcanvas(newscale){

    scale_divider = newscale;
    scale = can.width/scale_divider;


}

// winner winner chicken dinner

function winner(winner){
    Playerturn = winner.index;
    render();
    GameSpeed = 0;
    ctx.font = "30px Arial";
    ctx.fillStyle = "grey";
    ctx.fillText( "The player "+winner.name+ " has won !", scale, scale*scale_divider/2*ratio);
}

// random 

function randomrange(min, max) { 
    return Math.floor(Math.random() * (max - min + 1) + min)
}


onmousemove = function(e){
    var rect = canvas.getBoundingClientRect();
    mouseX = Math.floor((e.clientX- rect.left) /scale );
}

onclick = function(e){
    if(mouseX < scale_divider && mouseX >= 0 && startedgame){
        PLAYERS.forEach(v=>{v.dropblock()});
    }

}