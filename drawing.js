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

function drawRotated(v, center, angle, realvertexcount) {
  //print(angle)
  let nv = v.map(p => {
    //convert a point into polar, add the angle, then change back into cartesian
    let a = tcatan2(p.x - center.x, p.y - center.y) + angle;
    let r = tcdist(center.x, center.y, p.x, p.y);
    return {
      x: tccos(a) * r + center.x,
      y: tcsin(a) * r + center.y,
      u: p.u,
      v: p.v
    }
  });

  let storeNow = sliders[4].value() > 0.9;
  if (storeNow && !storeLast) {
    rotatedShape = nv;
    sliders[2].value(0);
  }
  storeLast = storeNow;

  let ti = earcut(spreadcoords(nv));
  let a = 0;
  for (let i = 0; i < ti.length; i += 3)
    a += trianglearea(nv[ti[i]], nv[ti[i + 1]], nv[ti[i + 2]]);
  textSize(20)
  stroke(255)
  fill(0, 255, 100)
  //text(a.toFixed(3),0,0)
  text(a.toFixed(2).padStart(8, '0'), -width / 2, height / 2)
  noFill()

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


  for (let i = 0; i < realvertexcount; i++) {
    let index = floor(nv.length / realvertexcount * i);
    stroke(255, 0, 0)
    circle(nv[index].x, nv[index].y, 3);
    //stroke(0, 255, 0, 30)
    //drawTcCircle(center.x, center.y, tcdistp(nv[index], center))
  }
}