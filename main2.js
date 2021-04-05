//checkout this https://www.codeproject.com/Articles/1029858/Making-a-D-Physics-Engine-The-Math

/* todo: 
  try a euclidean circle
  every shape has to be triangulated before getting rotated. then, every time the rotational center changes, 4 cuts are made. when the rot center changes, the previous cuts are saved, and the new cuts are overlayed. this way you end up with.
  a mode where a euclidean shape gets transmutated into a manhattan one and vice versa. needs: the shape, the point of the person looking at the shape
  maybe rename tcfunction.js to tcmath.jh
  maybe add a math.js
  
  realizations/facts:
  when rotating, length changes. no matter whith what metric you measure distance.
  when rotating, area stays the same.
  
*/
let sliders = [];
let buttons = [];
let img;
let shapes=[];
let font;
let frame=-1;

function preload() {
  img = loadImage('assets/20210206_152619.jpg');
  font = loadFont('assets/RobotoMono-Regular.ttf');
}

function setup() {
  let size = min(windowWidth, windowHeight);
  createCanvas(size, size, WEBGL);
  background(100);
  for (let i = 0; i < 5; i++) {
    sliders.push(createSlider(0, 0.9999, 0, 0));
    sliders[i].size(230, 30)
    sliders[i].position(size / 2 - 50, size + i * 30);
    buttons.push(createButton("center"))
    buttons[i].position(size / 2 - 115, size + 6 + i * 30);
    buttons[i].mousePressed(() => sliders[i].value(0.5));
    if(i<3)
      sliders[i].value(0.5);
  }
  textureMode(NORMAL);
  textFont(font);
  
  //print(cvec())
  let square=new Shape([cvec(-50,-50),cvec(50,-50),cvec(50,50),cvec(-50,50)]);
  shapes.push(square);
}

function draw() {
  frame++;
  background(50);
  noFill();
  
  shapes[0].rotate(
  sliders[4].value()>0.5?  shapes[0].centerOfMass:
    cvec(
      sliders[0].value() * 100 - 50,
      sliders[1].value() * 100 - 50
    ), 
    (sliders[2].value()-0.5) * 0.2);
  
  shapes[0].draw(3);
  writeText(-width/2,height/2,shapes[0].area.toFixed(2))
}

function writeText(x,y,text_){
  push()
  textSize(20)
  stroke(255)
  fill(0, 255, 100)
  text(text_,x,y)
  pop()
}
