//import {earcut} from "earcut.js"

/* todo: 
  try a euclidean circle
  every shape has to be triangulated before getting rotated. then, every time the rotational center changes, 4 cuts are made. when the rot center changes, the previous cuts are saved, and the new cuts are overlayed. this way you end up with.
*/
let sliders = [];
let buttons = [];
let img;
let rotatedShape;
let font;

function preload() {
  img = loadImage('assets/20210206_152619.jpg');
  font=loadFont('assets/RobotoMono-Regular.ttf');
}

function setup() {
  //print("earcut", earcut([0, 0, 1, 1, 0, 1, ]))

  let size = min(windowWidth, windowHeight);
  createCanvas(size, size, WEBGL);
  print(size)
  background(100);
  for (let i = 0; i < 5; i++) {
    sliders.push(createSlider(0, 0.9999, 0, 0));
    sliders[i].size(230, 30)
    sliders[i].position(size / 2 - 50, size + i * 30);
    buttons.push(createButton("center"))
    buttons[i].position(size / 2 - 115, size + 6 + i * 30);
    buttons[i].mousePressed(() => sliders[i].value(0.5));
  }
  textureMode(NORMAL);
  textFont(font);
  //sliders=Array(5).map(x=>createSlider(0,1));
  //print(sliders)
  //sliders.map((x,i)=>x.position(0,i*30));
}

function draw() {
  background(50);
  noFill();
  //createRegular2NGon();
  let shape = [
		// square
		[{
        x: -50,
        y: -50,
        u: 0,
        v: 0
			},
      {
        x: 50,
        y: -50,
        u: 1,
        v: 0
			},
      {
        x: 50,
        y: 50,
        u: 1,
        v: 1
			},
      {
        x: -50,
        y: 50,
        u: 0,
        v: 1
			}
		],
		// triangle
		[{
        x: 0,
        y: 50,u:0.5,v:1
			},
      {
        x: 30,
        y: -25,u:1,v:0
			},
      {
        x: -30,
        y: -25,u:0,v:0
			}
		],
		//manhattan circle
		[{
        x: 0,
        y: -50,u:0,v:0
			},
      {
        x: 50,
        y: 0,u:1,v:0
			},
      {
        x: 0,
        y: 50,u:1,v:1
			},
      {
        x: -50,
        y: 0,u:0,v:1
			}
		],
		//right triangle
		[{
        x: 0,
        y: 0,u:0,v:0
			},
      {
        x: 0,
        y: 50,u:0,v:1
			},
      {
        x: 50,
        y: 0,u:1,v:0
			}
		]
	]
	let square=new Shape(shape[0],[0,1, 1,2, 2,3, 3,0, 1,3],img);
	//print(square)
	square.draw();
	/*
  let subdivamount = 70;
  shape = subdivshape(shape[floor(sliders[3].value() * 4)], subdivamount);
  //shape=[]
  //for (let i=0;i<50;i++)
  //	shape.push({x:width/2+cos(i/50*2*PI)*50,y:height/2+sin(i/50*2*PI)*50})
  drawRotated(rotatedShape??shape, {
    x: sliders[0].value() * 100 - 50,
    y: sliders[1].value() * 100 - 50
  }, sliders[2].value() * 8, shape.length / subdivamount);
  */
}



function createRegular2NGon() {
  stroke(0)
  let v = [];
  //only even regular n-gons exist in tc
  let x = width / 2,
    y = height / 2,
    r = width / 10 / 1.5,
    a = sliders[0].value() * 8,
    n = floor(sliders[1].value() * 20) * 2 + 2;
  for (let i = 0; i < n; i++) {
    //drawTcCircle(x,y,r);

    v.push({
      x,
      y
    })
    x += tccos(a) * r
    y += tcsin(a) * r
    a += 8 / n; //TCPI*(n-1)/n
  }

  if (v.length < 2)
    return;

  let cx = (v[0].x + v[floor(v.length / 2)].x) / 2,
    cy = (v[0].y + v[floor(v.length / 2)].y) / 2;

  v.map(p => {
    p.x = p.x - cx + width / 2;
    p.y = p.y - cy + height / 2;
  });

  for (let p of v) {
    drawTcCircle(p.x, p.y, r);
  }

  stroke(255)
  beginShape();
  for (let p of v) {
    vertex(p.x, p.y)
  }
  endShape(CLOSE);
}

function spreadcoords(v) {
  let n = Array(v.length * 2);
  for (var i = 0; i < v.length; i++) {
    n[i * 2] = v[i].x;
    n[i * 2 + 1] = v[i].y;
  }
  return n;
}



//endpoint not included
function subdivide(p1, p2, amount) {
  let res = Array(amount);
  for (let i = 0; i < amount; i++) {
    let ni = i / amount;
    res[i] = {
      x: lerp(p1.x, p2.x, ni),
      y: lerp(p1.y, p2.y, ni),
      u: lerp(p1.u || 0, p2.u || 0, ni),
      v: lerp(p1.v || 0, p2.v || 0, ni),
    };
  }
  return res;
}

function subdivshape(v, amount) {
  let res = [];
  for (let i = 0; i < v.length; i++)
    res = res.concat(subdivide(v[i], v[(i + 1) % v.length], amount));
  return res;
}