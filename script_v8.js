class myGameArea {
    constructor() {
        this.start()
    }
    canvas = document.createElement("canvas")
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

    constructor() { }

    crashIntersect(firstObj, secondObj) {
        let myleft = firstObj.x;
        let myright = firstObj.x + (firstObj.width);
        let mytop = firstObj.y;
        let mybottom = firstObj.y + (firstObj.height);
        let otherleft = secondObj.x;
        let otherright = secondObj.x + (secondObj.width);
        let othertop = secondObj.y;
        let otherbottom = secondObj.y + (secondObj.height);

        // Check x and y for overlap
        if (otherleft > firstObj.width + myleft ||
            myleft > secondObj.width + otherleft ||
            othertop > firstObj.height + mytop ||
            mytop > secondObj.height + othertop) {
            return false;
        }
        return true;
    }

    crashSensor = (myGamePiece, pong) => {
        if (this.crashIntersect(pong, myGamePiece)) {
            console.log("this true " + myGamePiece.height);

            if (pong.y >= myGamePiece.y && pong.y + pong.height <= myGamePiece.y + myGamePiece.height) {
                console.log("paddleY<ball<paddleY+height (middle)");
                let dif = pong.y - myGamePiece.y //25
                // 0-20  20-40  40-60 60-80 80-100
                if (dif / 50 <= 0.20) {
                    console.log('0.0-20');
                    pong.speedX = pong.speedX * (-1)
                    pong.speedY = -4.7
                }
                else if (dif / 50 > 0.20 && dif / 50 <= 0.40) {
                    console.log('0.20-40');
                    pong.speedX = pong.speedX * (-1)
                    pong.speedY = -4.3
                }
                else if (dif / 50 > 0.40 && dif / 50 <= 0.60) {
                    console.log('0.40-60');
                    pong.speedX = pong.speedX * (-1)
                }
                else if (dif / 50 > 0.60 && dif / 50 < 0.80) {
                    console.log('0.60-80');
                    pong.speedX = pong.speedX * (-1)
                    pong.speedY = 4.3
                }
                else {
                    console.log('>>>>0.80');
                    pong.speedX = pong.speedX * (-1)
                    pong.speedY = 4.7
                }
            }
            else if (pong.y < myGamePiece.y && pong.y + pong.height > myGamePiece.y) {
                console.log("ball<paddleY+height (canto superior)");
                pong.speedX = pong.speedX * (-1)
                pong.speedY = -5
            }
            else if (pong.y > myGamePiece.y && (pong.y + pong.height) > (myGamePiece.y + myGamePiece.height)) {
                console.log("ball<paddleY+height (canto inferior)");
                pong.speedX = pong.speedX * (-1)
                pong.speedY = 5
            }

        }
    }

    gameOver = (pong,myGameObstacle, myGamePiece) => {
        pong.x = 250; pong.y = 150
        myGamePiece.reset(); myGameObstacle.reset()
        pong.stopMovement()     
    }

    wallCollision = (myScore,myGameObstacle, myGamePiece, pong, wallTop, wallBottom, wallLeft, wallRight) => {
        if (this.crashIntersect(pong, wallTop) || this.crashIntersect(pong, wallBottom)) {
            pong.speedY = pong.speedY * (-1)
        }
        if (this.crashIntersect(pong, wallLeft)) { //endgame
            this.gameOver(pong,myGameObstacle, myGamePiece)
            myScore.setScore2()
            setTimeout( ()=> {pong.speedX = 4}, 2000)   //console.log("ponto do dir");
        }
        if (this.crashIntersect(pong, wallRight) ) { 
            this.gameOver(pong,myGameObstacle, myGamePiece)
            myScore.setScore1()
            setTimeout( ()=> {pong.speedX = -4}, 2000)   //console.log("ponto do esq");
        }
        if (this.crashIntersect(myGameObstacle, wallTop) ) {   myGameObstacle.y = 0    }

        if(this.crashIntersect(myGameObstacle, wallBottom)){   myGameObstacle.y = 250  }

        if (this.crashIntersect(myGamePiece, wallTop) ) {   myGamePiece.y = 0    }

        if(this.crashIntersect(myGamePiece, wallBottom)){   myGamePiece.y = 250  }
        
    }
}

class Paddle {
    constructor(width, height, color, x, y) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.speedX = 0;
        this.speedY = 0;
        this.color = color
        this.v = [x,y]
    }
    update = () => {
        this.context = document.getElementById('canvasGame').getContext("2d")
        this.context.fillStyle = this.color;
        this.context.fillRect(this.x, this.y, this.width, this.height);
    }

    reset(){
        this.x = this.v[0]
        this.y = this.v[1]
    }

    newPos = () => {
        this.x += this.speedX;
        this.y += this.speedY;
    }
    stopMovement() {
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
        this.stopMovement()

        //if (myGameArea.keys && myGameArea.keys[38]) {this.speedX = -5; } //37
        //if (myGameArea.keys && myGameArea.keys[40]) {this.speedX = 5; } //39
        if (myGameArea.keys && myGameArea.keys[37]) { this.moveup(5)   }
        if (myGameArea.keys && myGameArea.keys[39]) { this.movedown(5) }

    }


    IA(pong) {
        if (this.y < pong.y && pong.y < this.y + this.height) {
            this.speedY = 0
            console.log("oo");
        }
        else if (this.y + (this.height / 2) < pong.y) {
            this.speedY = 3 + (Math.random()*1)
            console.log("pq");
        }
        else if (this.y + (this.height / 2) > pong.y) {
            this.speedY = -3 - (Math.random()*1)
            console.log("cd");
        }

        this.newPos()
    }

}

class Wall extends Paddle {
    constructor(width, height, color, x, y) {
        super(width, height, color, x, y)
    }
}

class Ball extends Paddle {
    constructor(width, height, color, x, y) {
        super(width, height, color, x, y)
        this.speedX = 4
        this.speedY = 0
        this.crash = false
    }


}

class Text {
    constructor(text) {
        this.word = "aa"
        this.scorePlayer = 0
        this.scoreNPC = 0
    }

    setScore1(){
        this.scorePlayer += 1
    }
    setScore2(){
        this.scoreNPC += 1
    }

    update = () => {
        this.ctx = document.getElementById('canvasGame').getContext("2d")
        this.ctx.font = "30px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillStyle = "red";
        //let word = "word"
        this.ctx.fillText(this.scorePlayer + "      " + this.scoreNPC , 250, 50);
    }

}

function startGame() {
    let gamearea = new myGameArea()
    let myGamePiece = new Paddle(10, 50, "#278AB0", 0, gamearea.canvas.height / 2 - 25);
    let myObstacle = new Paddle(10, 50, "#1C4670", gamearea.canvas.width - 10, 150 - 25);
    let pong = new Ball(10, 10, "#1DC690", 250, 150);
    let wallTop = new Wall(gamearea.canvas.width, 2, "white", 0, 0) //"wallTop"
    let wallLeft = new Wall(2, gamearea.canvas.height, "white", 0, 0) //"wallLeft"
    let wallBottom = new Wall(gamearea.canvas.width, 2, "white", 0, gamearea.canvas.height - 1) // "wallBottom"
    let wallRight = new Wall(2, gamearea.canvas.height, "white", gamearea.canvas.width - 1, 0) // "wallRight"
    let crash = new Collision()
    let crash2 = new Collision()
    let myScore = new Text()

    setInterval(() => {
        gamearea.clear();
        myGamePiece.newPos(); myObstacle.IA(pong)
        pong.newPos()
        //myScore.text = "aa"
        crash.crashSensor(myGamePiece,pong); crash2.crashSensor(myObstacle,pong); 
        crash.wallCollision(myScore, myObstacle, myGamePiece, pong, wallTop, wallBottom, wallLeft, wallRight)
        myGamePiece.controls() ;
        wallTop.update(); wallBottom.update(); wallLeft.update(); wallRight.update();
        myGamePiece.update(); pong.update(); myObstacle.update(); myScore.update()
    }
        , 20);

}

