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
        let myleft = firstObj.x;
        let myright = firstObj.x + (firstObj.width);
        let mytop = firstObj.y;
        let mybottom = firstObj.y + (firstObj.height);
        let otherleft = secondObj.x;
        let otherright = secondObj.x + (secondObj.width);
        let othertop = secondObj.y;
        let otherbottom = secondObj.y + (secondObj.height);
        //console.log(mytop +" "+ othertop ) //50
        //var crash = true;
        firstObj.crash = this.rectIntersect(myleft, mytop, firstObj.width, firstObj.height,
            otherleft, othertop, secondObj.width, secondObj.height)
        return firstObj.crash;
    }

    tilt = (firstObj, secondObj) => {
        let myleft = firstObj.x; //a1
        let myright = firstObj.x + (firstObj.width); //b1
        let mytop = firstObj.y; //d1
        let mybottom = firstObj.y + (firstObj.height); //c1
        let otherleft = secondObj.x;
        let otherright = secondObj.x + (secondObj.width);
        let othertop = secondObj.y;
        let otherbottom = secondObj.y + (secondObj.height);
        if ((mybottom < othertop) || (mytop > otherbottom) ||
            (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
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
    moveup = (speed) => {
        this.speedY -= speed;
    }
    movedown = (speed) => {
        this.speedY += speed;
    }
    moveleft = (speed) => {
        this.speedX -= speed;
    }
    moveright = (speed) => {
        this.speedX += speed;
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
        if (myGameArea.keys && myGameArea.keys[37]) {this.moveup(5) }
        if (myGameArea.keys && myGameArea.keys[39]) {this.movedown(5) }

    }

}

class Wall extends Paddle{
    constructor(width, height, color, x, y){
        super(width, height, color, x, y)
    }
}

class Ball extends Paddle{
    constructor(width, height, color, x, y){
        super(width, height, color, x, y)
        this.speedX = 4
        this.speedY = 0
        this.crash = false
    }
    setCrash() {
        this.crash = true;
    }


    newPos = () => {
        //this.x += this.temp;
        this.x += this.speedX
        this.y += this.speedY
    }

    stopMove () {
        this.speedX = 0
        this.speedY = 0
    }

    changeMove(sX,sY){
        if(this.speedX == (-sX) && this.speedY == (-sY)){
            this.speedX = sX;
            this.speedY = sY
        }
        else if(this.speedX == (-sX) && this.speedY == sY){
            this.speedX = sX
            this.speedY = -sY
        }
        else if(this.speedX == sX && this.speedY == (-sY)){
            this.speedX = -sX
            this.speedY = sY
        }
        else{
            this.speedX = -sX
            this.speedY = -sY
        }

    }
/*
-  - => + +
-  + => + -
+  - => - +
+  + => - -


*/

    reverseMove (speed) {
        if(this.temp == (-speed) )
            this.temp = speed;
        else{
            this.temp = -speed;
        }
        return this.temp
    }
    
    HotNightCrash = (myObstacle, myGamePiece, wall) => {
        let crash = new Collision()
        const colisao = this.y

        if (crash.update(this, myObstacle)  ){
            this.changeMove(4,0)
        }
        if (crash.update(this, myGamePiece) ){
            console.log("crash true " + myGamePiece.height);//ball.y = 150,  mygamepiece.y=130, h=50
            //ball 250 150
            //paddle 0 130  height=50  y=130   y2 = 130+50
            if(this.y >= myGamePiece.y && this.y+this.height <= myGamePiece.y + myGamePiece.height ){
                console.log("paddleY<ball<paddleY+height (middle)");
                //this.reverseMove(this.temp)
                this.changeMove(4,0)
            }
            else if(this.y < myGamePiece.y && this.y + this.height > myGamePiece.y){
                console.log("ball<paddleY+height (canto superior)");
                this.speedY = 6
                this.changeMove(4,6)
            }            
            else if( this.y > myGamePiece.y && (this.y+this.height) > (myGamePiece.y+myGamePiece.height)  ){
                console.log("ball<paddleY+height (canto inferior)");
                //this.reverseMove(this.temp)
            }

        }
        //if(wall)
    }

}

class Text {
    constructor(text){
        this.ctx = document.getElementById('canvasGame').getContext("2d")
        this.ctx.font = "30px Arial";
        this.ctx.textAlign = "center";
        this.update()
    }
    update = () => {
        this.ctx.fillStyle = "red";
        this.ctx.fillText("word", 130, 30);
    }

}

function startGame(){
    let gamearea = new myGameArea()
    let myGamePiece = new Paddle(10, 50, "blue", 0, gamearea.canvas.height/2-20);
    let myObstacle = new Paddle(10, 50, "orange", gamearea.canvas.width-10, 150-20);
    let wall = {
        0 : new Wall(gamearea.canvas.width, 2, "white",0, 0), //"wallTop"
        1 : new Wall(2, gamearea.canvas.height, "white",0, 0), //"wallLeft"
        2 : new Wall(gamearea.canvas.width, 2, "white",0, gamearea.canvas.height-1), // "wallBottom"
        3 : new Wall(2, gamearea.canvas.height, "white",gamearea.canvas.width-1, 0) // "wallRight"
    }

    let myScore = new Text("aa")
    let pong = new Ball(10, 10, "green",250, 150);

    setInterval( () => {
        gamearea.clear();
        myGamePiece.newPos()
        pong.newPos()
        pong.HotNightCrash(myObstacle, myGamePiece)
        myGamePiece.controls()
        for(let i=0;i<4;i++){ wall[i.toString()].update() }
        myGamePiece.update();
        pong.update()
        myObstacle.update();
        myScore.update()

        
    }
    , 50);

}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          


/*

A -------------B
  |           |
  |     2     |
  |           |
  |           |
C -------------D

A ------B
  |    |
  | 1  |
  |    |
  |    |
C ------D


point(x,y,width,height){
    let a1= new Point(x,y);
    let b1= new Point(x+width,y)
    let c1= new Point(x,y+height);
    let d1= new Point(x+width,y+height);

    let a2= new Point(x,y);
    let b2= new Point(x+width,y)
    let c2= new Point(x,y+height);
    let d2= new Point(x+width,y+height);        
    if( c2<d2 && c2>b1 && a2<b2 ){
        
    }
*/