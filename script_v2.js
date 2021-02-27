class myGameArea{

    constructor(){
        this.start()
    }

    canvas =  document.createElement("canvas")
    start = () => {
        this.canvas.setAttribute("id", "canvasGame")
        this.canvas.width = 500;
        this.canvas.height = 300;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    }
    
    clear = () => {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

}
class Collision {

    constructor(){}

    rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2) {
        // Check x and y for overlap
        if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2){
            return false;
        }
        return true;
    }
    
    update(firstObj, secondObj){
        var myleft = firstObj.x;
        var myright = firstObj.x + (firstObj.width);
        var mytop = firstObj.y;
        var mybottom = firstObj.y + (firstObj.height);
        var otherleft = secondObj.x;
        var otherright = secondObj.x + (secondObj.width);
        var othertop = secondObj.y;
        var otherbottom = secondObj.y + (secondObj.height);
        //var crash = true;
        firstObj.crash = this.rectIntersect(myleft, mytop, firstObj.width, firstObj.height,
            otherleft, othertop, secondObj.width, secondObj.height)
        return firstObj.crash;
    }

}
class Paddle{
    constructor(width, height, color, x, y) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.speedX=0;
        this.speedY=0;
        this.color = color
        this.crash = false
        this.temp = 1
    }
    update = () => {
        this.context = document.getElementById('canvasGame').getContext("2d")
        this.context.fillStyle = this.color;
        this.context.fillRect(this.x, this.y, this.width, this.height);      
    }

    newPos = () => {
        this.x += this.speedX;
        this.y += this.speedY;
    }
    stopMovement () {
        this.speedX = 0;
        this.speedY = 0;
    }
    setCrash() {
        this.crash = true;
    }

    moveup = () => {
        this.speedY -= 1;
    }
    movedown = () => {
        this.speedY += 1;
    }
    moveleft = () => {
        this.speedX -= 1;
    }
    moveright = () => {
        this.speedX += 1;
    }

    controls = () => {

        window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = true;
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = false;
        })
        this.stopMovement () 

        //if (myGameArea.keys && myGameArea.keys[38]) {this.speedX = -5; } //37
        //if (myGameArea.keys && myGameArea.keys[40]) {this.speedX = 5; } //39
        if (myGameArea.keys && myGameArea.keys[37]) {this.speedY = -5; }
        if (myGameArea.keys && myGameArea.keys[39]) {this.speedY = 5; }

    }

}



class Ball extends Paddle{
    constructor(width, height, color, x, y){
        super(width, height, color, x, y)
        //this.gravity = 0.5;
        //this.gravitySpeed = 0.6;
        //this.bounce = 1;
    }

    newPos = () => {
        this.x += this.temp;
    }

    stopMove () {
        this.temp = 0;
    }
    reverseMove () {
        if(this.temp == (-1) )
            this.temp = 1;
        else{
            this.temp = -1;
        }
    }

}

class Text {
    constructor(){
    }
    update = () => {
        this.ctx = document.getElementById('canvasGame').getContext("2d")
        this.ctx.font = "30px Arial";
        this.ctx.fillStyle = "red";
        this.ctx.textAlign = "center";
        this.ctx.fillText("text1", 130, 30);
    }

}


function startGame(){
    let gamearea = new myGameArea()
    let myGamePiece = new Paddle(10, 50, "blue", 10, 130);
    let myObstacle = new Paddle(10, 50, "orange",490, 130);
    let myScore = new Text()
    let pong = new Ball(10, 10, "green",250, 150);
    let crash = new Collision()
    //let myGamePiece2 = new Paddle(2, 2, "red", 223, 100);
    setInterval( () => {
        gamearea.clear();
        myGamePiece.newPos()
        pong.newPos()
        if (crash.update(pong, myObstacle) ){
            console.log("crash true");
            //pong.stopMove()
            pong.reverseMove()
        }
        if (crash.update(pong, myGamePiece) ){
            console.log("crash true");
            pong.reverseMove()
        }
        myGamePiece.controls()
        myGamePiece.update();
        myObstacle.update();
        pong.update()
        myScore.update()
    }
    , 20);

}



