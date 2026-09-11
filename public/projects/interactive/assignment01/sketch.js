let r,g,b;
let x,y,speed;

function setup() {
    createCanvas(400, 400);
    x = 200;
    y = random(100,300);
    speed = 2;
    r= random(200);
    g= random(200);
    b= random(200);
}
let trigOffsetx = 35;
let eyeOffsetx = 10

let finOffsetx = 15;

function draw() {
    background(100,180,232,80); //fade
    strokeWeight(1);
    //fish
    stroke(r,g,b);
    triangle(x,y+finOffsetx, x,y-finOffsetx, x+finOffsetx,y)
    fill(r+70,g+70,b+100);
    triangle(x-trigOffsetx,y-10, 
            x-trigOffsetx,y+10, x,y)
    
    ellipse(x, y, 50, 20);
    
    fill('white');
    ellipse(x+eyeOffsetx,y-2, 5,5);
    
    fill(r,g,b);
    ellipse(x-(eyeOffsetx/2),y, 5, 3);

    
    
    //turn around
    if (x+70 > 390){
        speed*=-1;
        trigOffsetx*=-1;
        eyeOffsetx*=-1;
        finOffsetx*=-1;
    }
    if (x-70 < 0){
        speed*=-1;
        trigOffsetx*=-1;
        eyeOffsetx*=-1;
        finOffsetx*=-1;
    }
    
    //move
    x+=speed;

    
    //ripples in water
    if(x%3 ==0){
        strokeWeight(random(5));
        stroke(random(200,255));
        noFill();
        size= random(80)
        ellipse(mouseX, mouseY, size, size);
    }

  


}