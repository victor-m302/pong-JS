
class myGameArea{

    constructor(){
        this.start()
    }


    canvas =  document.createElement("canvas")


    start = () => {
        this.canvas.setAttribute("id", "canvasGame")
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    }
    
    clear = () => {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

}

class ComponentP{
    constructor(width, height, color, x, y) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y; 

    }


    update = () => {
        this.context = document.getElementById('canvasGame').getContext("2d")
        this.context.fillStyle = "red";
        this.context.fillRect(this.x, this.y, this.width, this.height);      
    }

}

function startGame(){
    let gamearea = new myGameArea()
    let myGamePiece = new ComponentP(30, 30, "red", 10, 120);
    setInterval( () => {
        gamearea.clear();
        myGamePiece.x += 1;
        myGamePiece.update();
    }
    , 200);

}





