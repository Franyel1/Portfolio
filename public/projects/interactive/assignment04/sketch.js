

let arrow; 
let upIMG, downIMG, leftIMG, rightIMG;

let robots = [];
let arrows = []

function preload(){
    upIMG = loadImage('images/arrow_up.png');
    downIMG = loadImage('images/arrow_down.png');
    leftIMG = loadImage('images/arrow_left.png');
    rightIMG = loadImage('images/arrow_right.png');
}

function setup() {
    createCanvas(800,600);

    for (let i=1; i<8; i++){
        for (let j=1; j<8; j++){
            let tempArrow = new Arrow(i*90, j*75);   
            arrows.push(tempArrow);
        }
    }
}

function draw(){
    background(200);

    if (frameCount % 120 == 0){
        let r = new Robot(-50, height/2, "right");
        robots.push(r);
    }

    for (let i= 0; i<robots.length ; i++){
        robots[i].display();
        robots[i].move();
    }

    for (let i= 0; i<arrows.length ; i++){
        arrows[i].display();
    }

}

class Robot{
    constructor(x, y, direction){
        this.rh = random(255);
        this.gh = random(255);
        this.bh = random(255);

        this.rb = random(255);
        this.gb = random(255);
        this.bb = random(255);

        this.hSize = random(25,50) +1;
        this.offset = random(5,10);
        this.bSize = this.hSize + this.offset;

        this.eyeType = random([1,2]);

        this.xSpeed = 0;
        this.ySpeed = 0;
        this.direction = direction;

        if (this.direction == "up"){
            this.ySpeed =-1;
        } else if (this.direction == "down"){
            this.ySpeed = 1;
        } else if (this.direction == "right"){
            this.xSpeed = 1;
        } else if (this.direction == "left"){
            this.xSpeed = -1;
        }

        this.thrusterAlpha = 255;
        this.tSpeed = 3;

        this.x = x;
        this.y = y - this.hSize - this.bSize + 50; 

        this.hitX = this.x +this.bSize/2;

        this.hitY = this.y + this.hSize + this.bSize/2;
    }
    display(){
        //draw head
        noStroke();

        fill(this.rh, this.gh, this.bh);
        rect(this.x, this.y, this.hSize, this.hSize);
        //draw eyes
        if (this.eyeType == 1){ 
            fill(255);
            rect(this.x + (this.hSize/100) * 15, this.y+ (this.hSize/100) * 15, (this.hSize/100) * 10, (this.hSize/100) * 20);
            rect(this.x + this.hSize - (this.hSize/100) * 25, this.y+ (this.hSize/100) * 15, (this.hSize/100) * 10, (this.hSize/100) * 20);
        }else{
            fill(255);
            rect(this.x + (this.hSize/100) * 10, this.y+ (this.hSize/100) * 10, (this.hSize/100) * 80, (this.hSize/100) * 20);
        }

        //draw body
        fill(this.rb, this.gb, this.bb);
        rect(this.x- (this.bSize-this.hSize)/2 , this.y+this.hSize, this.bSize, this.bSize); 

        //draw thruster
        if (this.direction == "down"){
            fill(255,255,0, this.thrusterAlpha);
            push();
            translate(this.x+ (this.bSize)/2 - this.offset/2, this.y);
            rotate(radians(180));
            arc(0,0, this.bSize/1.5,this.bSize/1.5, 0, PI); 
            pop();
        }


        if (this.direction == "up"){ 
            fill(255,255,0, this.thrusterAlpha);
            arc(this.x+ (this.bSize)/2 - this.offset/2, this.y+this.bSize+this.hSize, this.bSize/1.5,this.bSize/1.5, 0, PI);
        }

        if (this.direction == "right"){
            fill(255,255,0, this.thrusterAlpha);
            push();
            translate(this.x - this.offset/2, this.y +this.hSize + this.bSize/2); 
            rotate(radians(90)); 
            arc(0,0, this.bSize/1.5,this.bSize/1.5, 0, PI); 
            pop();
        }

        if (this.direction == "left"){
            fill(255,255,0, this.thrusterAlpha);
            push();
            translate(this.x +this.hSize+ this.offset/2, this.y +this.hSize + this.bSize/2); 
            rotate(radians(270)); 
            arc(0,0, this.bSize/1.5,this.bSize/1.5, 0, PI); 
            pop();
        }

        if (this.thrusterAlpha >= 255){
            this.tSpeed *= -1;
        }
        if (this.thrusterAlpha <= 120){ 
            this.tSpeed *= -1; 
        }
        this.thrusterAlpha += this.tSpeed;
    }
    move(){
        if (this.direction == "up"){
            this.ySpeed =-1;
            this.xSpeed =0;
        } else if (this.direction == "down"){
            this.ySpeed = 1;
            this.xSpeed =0;
        } else if (this.direction == "right"){
            this.xSpeed = 1;
            this.ySpeed =0;
        } else if (this.direction == "left"){
            this.xSpeed = -1;
            this.ySpeed =0;
        }



        // if (this.hitX >= width/2 && this.hitX <= width/2+50 && this.hitY>=height/2 && this.hitY<=height/2+50){
        //     this.direction = arrow.direction;
        //     console.log(this.direction);
        // }

        for (let i = 0; i< arrows.length ; i++){
            if (this.hitX >= arrows[i].x + 10 && this.hitX <= arrows[i].x + 40 && this.hitY>=arrows[i].y +10 && this.hitY<=arrows[i].y +40){
                this.direction = arrows[i].direction;
            }
        } 

        

        this.x += this.xSpeed;
        this.y += this.ySpeed;

        this.hitX = this.x +this.bSize/2;
        this.hitY = this.y + this.hSize + this.bSize/2;
    }
}

class Arrow{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.direction = 'up';
        this.wasPressed = false;
    }

    display(){

        //draw
        if (this.direction == 'up'){
            image(upIMG, this.x, this.y);
        } else if (this.direction == 'left'){
            image(leftIMG, this.x, this.y);
        } else if (this.direction == 'down'){
            image(downIMG, this.x, this.y);
        } else if (this.direction == 'right'){
            image(rightIMG, this.x, this.y);
        }

        //change
        if (mouseIsPressed && !this.wasPressed && this.checkClick()){
            if (this.direction == 'up'){
                this.direction = 'right';
            } else if (this.direction == 'right'){
                this.direction = 'down';
            } else if (this.direction == 'down'){
                this.direction = 'left';
            } else if (this.direction == 'left'){
                this.direction = 'up';
            }
        }

        //update
        this.wasPressed = mouseIsPressed;
    }

    checkClick(){
        if (mouseX >= this.x && mouseX <= this.x + 50 && mouseY >= this.y && mouseY <= this.y +50){
            return true;
        }
        return false;
    } 
}