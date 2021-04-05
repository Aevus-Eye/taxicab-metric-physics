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
let rotatedShape;
let font;
let frame=-1;
/*
let engine;
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies;
var decomp = require ( 'poly-decomp' );*/

function preload() {
  img = loadImage('assets/20210206_152619.jpg');
  font = loadFont('assets/RobotoMono-Regular.ttf');
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
  //buttons[buttons.length-1].mousePressed(()=>{throw "abort"})
  textureMode(NORMAL);
  textFont(font);
  //sliders=Array(5).map(x=>createSlider(0,1));
  //print(sliders),{"x":560,"y":197.63018730000002,"u":0.9,"v":0}
  //sliders.map((x,i)=>x.position(0,i*30));
  
  /*let text=subdivide(
      {
        x: -700,
        y: -132.346827,
        u: 0,
        v: 0
    			},
      {
        x: 700,
        y: +234.2943,
        u: 1,
        v: 0
    			}
    		,10)
  //print(text)
  copyToClipboard(JSON.stringify( text))
  //copyToClipboard("test")
  */
  
  
  
  /*
  // create an engine
  engine = Engine.create();
  
  // create a renderer
  var render = Render.create({
    element: document.body,
    engine: engine
  });
  
  // create two boxes and a ground
  var boxA = Bodies.rectangle(0, 150, 80, 80);
  var boxC = Bodies.rectangle(0, 0, 80, 80);
  var boxB = Bodies.rectangle(50, 50, 80, 80);
  var ground = Bodies.rectangle(0, 200, 400, 60, { isStatic: true });
  
  // add all of the bodies to the world
  World.add(engine.world, [boxA, boxB, boxC, ground]);
  
  // run the engine
  Engine.run(engine);
  
  // run the renderer
  //Render.run(render);
  */
}

function draw() {
  //if(sliders[4].value()>0.5)return ;
  frame++;
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
        y: 50,
        u: 0.5,
        v: 1
			},
      {
        x: 30,
        y: -25,
        u: 1,
        v: 0
			},
      {
        x: -30,
        y: -25,
        u: 0,
        v: 0
			}
		],
		//manhattan circle
		[{
        x: 0,
        y: -50,
        u: 0,
        v: 0
			},
      {
        x: 50,
        y: 0,
        u: 1,
        v: 0
			},
      {
        x: 0,
        y: 50,
        u: 1,
        v: 1
			},
      {
        x: -50,
        y: 0,
        u: 0,
        v: 1
			}
		],
		//right triangle
		[{
        x: 0,
        y: 0,
        u: 0,
        v: 0
			},
      {
        x: 0,
        y: 50,
        u: 0,
        v: 1
			},
      {
        x: 50,
        y: 0,
        u: 1,
        v: 0
			}
		],
		// AA line
		[
      {
        x: -50,
        y: 0,
        u: 0,
        v: 0
		  },
      {
        x: 50,
        y: 0,
        u: 1,
        v: 0
		  }
		],
		// non AA line
		[
      {
        x: -54.1582,
        y: 8.6728,
        u: 0,
        v: 0
		  },
      {
        x: 40.193,
        y: -21.9472,
        u: 1,
        v: 0
		  }
		],
		// long non AA line
      //[{"x":-700,"y":-132.346827,"u":0,"v":0},{"x":-560,"y":-95.68271429999999,"u":0.1,"v":0},{"x":-420,"y":-59.0186016,"u":0.2,"v":0},{"x":-280,"y":-22.354488899999993,"u":0.3,"v":0},{"x":-140,"y":14.309623799999997,"u":0.4,"v":0},{"x":0,"y":50.9737365,"u":0.5,"v":0},{"x":140,"y":87.6378492,"u":0.6,"v":0},{"x":279.9999999999999,"y":124.30196190000001,"u":0.7,"v":0},{"x":420,"y":160.96607459999998,"u":0.8,"v":0},{"x":560,"y":197.63018730000002,"u":0.9,"v":0},{"x":10000,"y":10000,"u":0.9,"v":0}]
      [{"x":-100,"y":30,"u":0,"v":0},{"x":100,"y":-45,"u":1,"v":0}]
	]
	
  let square=new Shape(rotatedShape??shape[floor(sliders[3].value() * shape.length)]); //,img
  //print(square)
  square.rotate({
      x: sliders[0].value() * 100 - 50,
      y: sliders[1].value() * 100 - 50
    }, sliders[2].value() * 8);
  square.draw();
  
  let[centroid,area]=square.calculateCentroidAndArea();
  stroke(100,200,20);
  circle(centroid.x,centroid.y,4)
  writeText(width/-2,height/2-10,parseFloat(area.toPrecision(4)));


let storeNow = sliders[4].value() > 0.9;
//print(storeNow,storeLast)
if (storeNow && !storeLast) {
  //rotatedShape = square.v;
  //sliders[2].value(0);
    let ns = Bodies.fromVertices(0,0,verticesToBox2d(square.v));
  
    // add all of the bodies to the world
    World.add(engine.world, [ns]);
}
storeLast = storeNow;

  /*
  let original = shape[floor(sliders[3].value() * shape.length)]
  let subdivamount = 70;
  shape = subdivshape(original, subdivamount);
  //shape=[]
  //for (let i=0;i<50;i++)
  //	shape.push({x:width/2+cos(i/50*2*PI)*50,y:height/2+sin(i/50*2*PI)*50})
  drawRotated(rotatedShape ?? shape, {
    x: sliders[0].value() * 100 - 50,
    y: sliders[1].value() * 100 - 50
  }, sliders[2].value() * 8, original);
*/
  //renderBox2d();
}

function writeText(x,y,text_){
  push()
  textSize(20)
  stroke(255)
  fill(0, 255, 100)
  //text(a.toFixed(3),0,0)
  text(text_,x,y)
  pop()
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

function verticesToBox2d(v) {
  let n = Array(v.length);
  for (var i = 0; i < v.length; i++) {
    n[i] = [v[i].x,v[i].y];
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