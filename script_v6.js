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


    IA(pong){
        console.log(this.y);
        console.log(pong.y);
        if(this.y+(this.height/2) < pong.y ){
            console.log('1')
            this.speedY = 4.5
        }
        else if(this.y+(this.height/2) > pong.y){
            console.log('2')
            this.speedY = -4.5
        }
        else if(this.y < pong.y && pong.y < this.y + this.height){
            this.speedY = 0
        }
        this.newPos()
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
    
    HotNightCrash = (myObstacle, myGamePiece) => {
        let crash = new Collision()

        if (crash.update(this, myObstacle)  ){
            this.speedX = this.speedX*(-1)
        }
        if (crash.update(this, myGamePiece) ){
            console.log("crash true " + myGamePiece.height);

            if(this.y >= myGamePiece.y && this.y+this.height <= myGamePiece.y + myGamePiece.height ){
                console.log("paddleY<ball<paddleY+height (middle)");
                let dif = this.y - myGamePiece.y //25
                // 0-20  20-40  40-60 60-80 80-100
                if(dif/50  <= 0.20){
                    console.log('0.0-20');
                    this.speedX = this.speedX*(-1)
                    this.speedY = -5.5
                }
                else if(dif/50  > 0.20 && dif/50 <= 0.40){
                    console.log('0.20-40');
                    this.speedX = this.speedX*(-1)
                    this.speedY = -5
                }
                else if(dif/50  > 0.40 && dif/50 <= 0.60){
                    console.log('0.40-60');
                    this.speedX = this.speedX*(-1)
                    this.speedY = this.speedY*(-1)
                }
                else if(dif/50  > 0.60 && dif/50 < 0.80){
                    console.log('0.60-80');
                    this.speedX = this.speedX*(-1)
                    this.speedY = 5
                }
                else{
                    console.log('>>>>0.80');
                    this.speedX = this.speedX*(-1)
                    this.speedY = 5.5    
                }
            }
            else if(this.y < myGamePiece.y && this.y + this.height > myGamePiece.y){
                console.log("ball<paddleY+height (canto superior)");
                this.speedX = this.speedX*(-1)
                this.speedY = -6
            }            
            else if( this.y > myGamePiece.y && (this.y+this.height) > (myGamePiece.y+myGamePiece.height)  ){
                console.log("ball<paddleY+height (canto inferior)");
                this.speedX = this.speedX*(-1)
                this.speedY = 6
            }

        }
    }
    wallCollision = (wallTop, wallBottom, wallLeft, wallRight) => {
        let col1 = new Collision()
        if (col1.update(this, wallTop) || col1.update(this, wallBottom) ){
            this.speedY = this.speedY*(-1)
        }
        if(col1.update(this, wallRight) || col1.update(this, wallLeft)){
            this.x = 250
            this.y = 150
            this.speedY = 0
        }

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
    let myGamePiece = new Paddle(10, 50, "blue", 0, gamearea.canvas.height/2-25);
    let myObstacle = new Paddle(10, 50, "orange", gamearea.canvas.width-10, 150-25);
    let wallTop = new Wall(gamearea.canvas.width, 2, "white",0, 0) //"wallTop"
    let wallLeft = new Wall(2, gamearea.canvas.height, "white",0, 0) //"wallLeft"
    let wallBottom = new Wall(gamearea.canvas.width, 2, "white",0, gamearea.canvas.height-1) // "wallBottom"
    let wallRight = new Wall(2, gamearea.canvas.height, "white",gamearea.canvas.width-1, 0) // "wallRight"
    let myScore = new Text("aa")
    let pong = new Ball(10, 10, "green",250, 150);

    setInterval( () => {
        gamearea.clear();
        myGamePiece.newPos() ; myObstacle.IA(pong)
        pong.newPos()
        pong.HotNightCrash(myObstacle, myGamePiece); pong.wallCollision(wallTop, wallBottom, wallLeft, wallRight)

        myGamePiece.controls()
        wallTop.update();wallBottom.update();wallLeft.update();wallRight.update();
        myGamePiece.update(); pong.update();  myObstacle.update(); myScore.update()
    }
    , 20);

}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
