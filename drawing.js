let storeLast = false;

function drawTcCircle(x, y, r) {
  noFill()
  beginShape()
  vertex(x + r, y)
  vertex(x, y - r)
  vertex(x - r, y)
  vertex(x, y + r)
  endShape(CLOSE);
  push()
  stroke(255, 0, 0)
  circle(x, y, 4);
  pop()
}


/*function drawRotatedColoredSquare(v, center, angle) {

  let nv = v.map(p => {
    //convert a point into polar, add the angle, then change back into cartesian
    let a = tcatan2(center.x - p.x, center.y - p.y) + angle;
    let r = tcdist(center.x, center.y, p.x, p.y);
    return {
      x: tccos(a) * r + center.x,
      y: tcsin(a) * r + center.y,
      c: color(((p.x - width / 2) / 100 + 0.5) * 255,
        ((p.y - height / 2) / 100 + 0.5) * 255, 0)
    }
  });

  stroke(0)
  let r = 150;
  line(center.x - r, center.y,
    center.x + r, center.y)
  line(center.x, center.y - r,
    center.x, center.y + r)
  line(center.x - tccos(angle) * r,
    center.y - tcsin(angle) * r,
    center.x + tccos(angle) * r,
    center.y + tcsin(angle) * r)
  angle += TCPI / 2;
  line(center.x - tccos(angle) * r,
    center.y - tcsin(angle) * r,
    center.x + tccos(angle) * r,
    center.y + tcsin(angle) * r)

  for (let i = 0; i < nv.length; i++) {
    stroke(nv[i].c)
    let ni = (i + 1) % nv.length
    line(nv[i].x, nv[i].y, nv[ni].x, nv[ni].y)
  }
  stroke(255)
  circle(center.x, center.y, 3);
}*/

function drawRotated(v, center, angle, original) {
  //splitRotLineSeg(original[0],original[1],center,angle)
  let nv = v.map(p=>tcrotate(p,center,angle));

  let storeNow = sliders[4].value() > 0.9;
  if (storeNow && !storeLast) {
    rotatedShape = nv;
    sliders[2].value(0);
  }
  storeLast = storeNow;

  //calculate area
  /*let ti = earcut(spreadcoords(nv));
  let a = 0;
  for (let i = 0; i < ti.length; i += 3)
    a += trianglearea(nv[ti[i]], nv[ti[i + 1]], nv[ti[i + 2]]);
  textSize(20)
  stroke(255)
  fill(0, 255, 100)
  //text(a.toFixed(3),0,0)
  text(a.toFixed(2).padStart(8, '0'), -width / 2, height / 2)
  noFill()*/
  //calculate length
  /*
  let len = nv.reduce((prev, cur) => { let l = tcdistp(prev, cur); return { d: (prev.d || 0) + l, ...cur } }, nv[nv.length - 1]).d;

  textSize(20)
  stroke(255)
  fill(0, 255, 100)
  //text(a.toFixed(3),0,0)
  text(len.toFixed(2).padStart(8, '0'), -width / 2, height / 2)
  noFill()*/

  stroke(0)
  let r = 150;
  line(center.x - r, center.y,
    center.x + r, center.y)
  line(center.x, center.y - r,
    center.x, center.y + r)
  line(center.x - tccos(angle) * r,
    center.y - tcsin(angle) * r,
    center.x + tccos(angle) * r,
    center.y + tcsin(angle) * r)
  angle += TCPI / 2;
  line(center.x - tccos(angle) * r,
    center.y - tcsin(angle) * r,
    center.x + tccos(angle) * r,
    center.y + tcsin(angle) * r)
  angle -= 2;

  //print(sliders[2].value())
  strokeWeight(2)
  stroke(0, 0, 255)
  arc(center.x, center.y, 20, 20, 0, tcte(angle));
  strokeWeight(1)
  stroke(0)
  beginShape()
  for (let p of v)
    vertex(p.x, p.y);
  endShape(CLOSE);

  /*push();
  stroke(255)
  texture(img)
  beginShape(TRIANGLES)
  let tris = earcut(spreadcoords(nv));
  for (let i = 0; i < tris.length; i+=3) {
    let p = nv[tris[i]];
    vertex(p.x, p.y, 0, p.u, p.v);
    p = nv[tris[i + 1]];
    vertex(p.x, p.y, 0, p.u, p.v);
    p = nv[tris[i + 2]];
    vertex(p.x, p.y, 0, p.u, p.v);
  }
  endShape(CLOSE);
  circle(center.x, center.y, 3);
  noFill()
  pop()*/

  strokeWeight(2)
  stroke(255)
  beginShape()
  for (let p of nv)
    vertex(p.x, p.y);
  endShape(CLOSE);
  strokeWeight(1)


  let li = floor(nv.length / original.length * (original.length - 1))
  for (let i = 0; i < original.length; i++) {
    let index = floor(nv.length / original.length * i);
    stroke(255, 0, 0)
    circle(nv[index].x, nv[index].y, 3);
    stroke(30, 30, 200)
    line(nv[index].x, nv[index].y, nv[li].x, nv[li].y);
    li = index;


    //stroke(0, 255, 0, 30)
    //drawTcCircle(center.x, center.y, tcdistp(nv[index], center))
  }
  
  drawRotated2(original,center,angle)
}

//vertecies, center, angle
function drawRotated2(v,c,a){
  let ps=splitRotLineSeg(v[0],v[1],c,a).map(p=>lerpp(v[0],v[1],p));
  ps=[v[0],...ps,v[1]]
  stroke(250,250,20);
  for (let i = 0; i < ps.length; i++) {
    circle(ps[i].x,ps[i].y,3);
  }
  let nv = ps.map(p => tcrotate(p,c,a));
  stroke(20,250,250);
  for (let i = 0; i < ps.length; i++) {
    circle(nv[i].x, nv[i].y,3);
  }
}

//splits a line segment, so that it can easyle be rotated. 
function splitRotLineSeg(p1,p2,c,a){
  return [...new Set([0,-a,2,2-a].flatMap(x=>{
    let res=doLineSegmentLineIntersection(p1,p2,c,x);
    return res.intersect?[res.t]:[];
  }))].sort();
  /*textSize(20)
  stroke(255)
  fill(0, 255, 100)
  //text(a.toFixed(3),0,0)
  text(ps.reduce((prev,cur)=>prev+cur.toFixed(2)+", ","l:"+ps.length+"  "), -width / 2, height / 2)
  noFill()
  //print(ps)*/
}

function drawAngle(p, angle, r = 20) {
  push()
  stroke(20, 200, 200)
  line(p.x, p.y, p.x + tccos(angle) * r, p.y + tcsin(angle) * r);
  pop()
}