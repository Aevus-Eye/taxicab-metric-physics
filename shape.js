/*
class Shape_old {
  //todo: rework how you store v,e, and tri. they need to all be interlinked in order to make efficient algorythms. currently they are not linked very well, which makes it that i have to search for certain links in algorythms, which makes them slow.

  //v; vertecies: array of 2d points
  //e; edges; array of start and end indices for v
  ////t; tris; triangles: array of indices into v
  constructor(v, e, tex, col) {
    this.v = v; //[{x,y,u,v}, ...]
    this.e = e; //[s,e, ...]
    //this.t=t; //[a,b,c, ...]
    this.tex = tex;
    this.col = col;
  }

  //note: this is a bad algorythm.
  createTris() {
    let tris = [];

    let vl = this.v.length;
    let el = this.e.length / 2;

    //todo: this connected array can be cached. no need to rebuild every frame. same with tries. 
    let connected = Array(vl * vl).fill(false);
    for (var i = 0; i < el; i++) {
      connected[this.e[i * 2] + this.e[i * 2 + 1] * vl] = true;
      connected[this.e[i * 2 + 1] + this.e[i * 2] * vl] = true;
    }
    //print(connected)


    // go through all vertices
    for (var v1 = 0; v1 < vl - 2; v1++) {
      let ia1 = v1 * vl;
      //search for connected ones
      for (var v2 = v1 + 1; v2 < vl - 1; v2++) {
        if (connected[ia1 + v2]) {
          //search for a 3rd point, that is connected to both v2 and v1
          let ia2 = v2 * vl;
          for (var v3 = v2 + 1; v3 < vl; v3++) {
            if (connected[ia2 + v3] && connected[ia1 + v3]) {
              tris.push(v1, v2, v3);
            }
          }
        }
      }
    }
    //print(tris)
    return tris;
  }

//what this does:
//  go through all edges and see where a split needs to be created
//  go through all splits of 1 edge and create the new split vertecies, then connect all of the new vertecies to the oposite vertex of the current triangle (there are either 0 current triangles, if the shape is just a line, 1 tri if the current edge is at the edge of the shape, or 2 tris, if the edge is inside the shape).
  
  splitForRotate(center, angle) {
    //print('start')
    //print("e",this.e,"v",this.v)
    //go through all edges and get the split points
    let el = this.e.length;
    for (let ei = 0; ei < el; ei += 2) {
      let p1 = this.v[this.e[ei]];
      let p2 = this.v[this.e[ei + 1]];
      let splits = splitRotLineSeg(p1, p2, center, angle);
      //if(frame===100)
      //  print("100 splits",splits)
      //check if the current edge needs to be split
      if (splits.length > 0) {
        //get the vertecies that compleete a triangle with the current edge
        let ov = this.getOpositeVertex(this.e[ei], this.e[ei + 1])
        if (frame === 120)
          print('split by con', this.e[ei], this.e[ei + 1], "oposit", ov, "e", this.e, 'v', this.v)
        //safet check, if the current shape has n volume/is a line
        if (ov.length === 1 || ov.length === 2) {
          //add all the new vertecies to the shape, and connect the newly made edges
          for (let si = 0; si < splits.length; si++) {
            this.v.push(lerpp(p1, p2, splits[si]));
            for (let ovi of ov) {
              this.e.push(ovi, this.v.length - 1)
            }
          }
          //redo the connection of the edge that got split up.
          let sl = splits.length;
          let vl = this.v.length;
          let endvi = this.e[ei + 1];
          this.e[ei + 1] = vl - sl
          for (let si = 0; si < sl - 1; si++) {
            this.e.push(vl - sl + si, vl - sl + si + 1)
          }
          this.e.push(vl - 1, endvi)
        }
        else {
          print("split for rotate", splits)
          throw ov.length + " opposites found"
        }
      }
    }
  }

  //takes the indices to the first 2 vertecies, then the function returns the index to the vertecies that compleete this triangle. can return either 0,1, or 2 indices.
  getOpositeVertex(v1, v2) {
    //print(`v1 ${v1}, v2:${v2}, vl:${this.v.length}`,this.e);
    let ind = [];
    for (var vi = 0; vi < this.v.length; vi++) {
      for (var ei = 0; ei < this.e.length; ei += 2) {
        if (!((this.e[ei] === v1 && this.e[ei + 1] === vi) || (this.e[ei] === vi && this.e[ei + 1] === v1)))
          continue;

        for (var ej = 0; ej < this.e.length; ej += 2)
        {
          if ((this.e[ej] === vi && this.e[ej + 1] === v2) || (this.e[ej] === v2 && this.e[ej + 1] === vi)) {
            ind.push(vi);
          }

        }
      }
    }
    if (frame === 100)
      print('oposite', frame, v1, v2, ind,  this.e, this.v)
    if (ind.length === 0) {
      print(`oposit_length_0 v1 ${v1}, v2 ${v2}, vl ${this.v.length}`, this.e, this.v)
      throw "no oposite tri"
    }
    return ind;
  }

  drawRotated(center, angle) {
    this.splitForRotate(center, angle);
    this.v = this.v.map(p => tcrotate(p, center, angle));
    this.draw();
  }

  draw() {
    if (!this.tex) {
      stroke(this.col ?? 255)
      strokeWeight(1);
      let el = this.e.length;
      for (var i = 0; i < el; i += 2) {
        let v1 = this.v[this.e[i]];
        let v2 = this.v[this.e[i + 1]];
        line(v1.x, v1.y, v2.x, v2.y);
      }
    } else {
      let tris = this.createTris();
      let trisl = tris.length;

      texture(this.tex)
      beginShape(TRIANGLES)
      for (var i = 0; i < trisl; i++) {
        let v = this.v[tris[i]];
        vertex(v.x, v.y, 0, v.u, v.v);
      }
      endShape(CLOSE);
    }
    stroke(255, 0, 0)
    for (var i = 0; i < this.v.length; i++) {
      circle(this.v[i].x, this.v[i].y, 3)
    }
  }
}
*/






//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------






class Shape {
  constructor(v, col) {
    this.v = v; //[{x,y,u,v}, ...]
    this.col = col ?? 255;
    this.centerOfMass;
    this.area;
    this.calculateCentroidAndArea();

    this.lastRotCenterAttempt=cvec(0,0); // only for debug visualizations, useless otherwise.
    this.lastRotCenter = cvec(0,0);
    this.lastRotAngle = 0;
    this.lastV= this.v.map(x => x.clone());

    this.vel = cvec(0, 0)
    this.angVel = 0;
  }

  rotate(center, angle) {
    this.lastRotCenterAttempt=center;
    if (angle === 0)
      return;
    // dont split the shape if the rotation center is the same.
    let samecenter=tcdistp(center,this.lastRotCenter)<=0.15;
    if(/*!center.equals(this.lastRotCenter)*/!samecenter) {
      this.lastV = this.v.map(x => x.clone());
      this.lastRotAngle=0;
    }
    let v=this.lastV;
    angle=this.lastRotAngle+=angle;

    let nv = []
    let last = v[v.length - 1];
    for (var p of v) {
      let s = splitRotLineSeg(last, p, center, angle).map(t => lerpp(last, p, t));
      nv.push(...s, p);
      last = p
    }
    //print(this.v,nv)

    this.lastRotCenter = center;
    //print("before",this.v,"after", nv)
    this.v = nv.map(p => tcrotate(p, center, angle))//.filter((e,i,a)=>tcdistp(e,a[(i+1)%a.length])>0.2)
    //print(this.v)
    this.calculateCentroidAndArea();
  }

  applyForce(p, dir, amount) {
    throw "not yet implemented"
    let dif = this.centerOfMass.copy().sub(p).tcnormalize()
    dif.dot()
  }

  //debug level either 0,1,2,3. 
  draw(debugLevel = 0) {
    strokeWeight(1);
    //draw the rotation lines
    if (debugLevel >= 3 /* && this.lastRotCenter !== undefined*/) {
      stroke(0)
      let r = 150;
      let angle = this.lastRotAngle;
      let c = this.lastRotCenterAttempt;
      line(c.x - r, c.y,
        c.x + r, c.y)
      line(c.x, c.y - r,
        c.x, c.y + r)
      line(c.x - tccos(angle) * r,
        c.y - tcsin(angle) * r,
        c.x + tccos(angle) * r,
        c.y + tcsin(angle) * r)
      angle += TCPI / 2;
      line(c.x - tccos(angle) * r,
        c.y - tcsin(angle) * r,
        c.x + tccos(angle) * r,
        c.y + tcsin(angle) * r)
      //angle -= 2;
    }

    //draw the actual polygon
    stroke(this.col)
    beginShape();
    //print(this.v)
    for (let p of this.v) {
      vertex(p.x, p.y);
    }
    endShape(CLOSE);

    //draw the vertecies with extra red circles
    if (debugLevel >= 1) {
      stroke(255, 0, 0)
      for (let i = 0; i < this.v.length; i++) {
        circle(this.v[i].x, this.v[i].y, 3)
      }
    }

    //draw center of mass
    if (debugLevel >= 2) {
      stroke(105, 130, 260)
      circle(this.centerOfMass.x, this.centerOfMass.y, 2.5)
      //draw center of rotation dot
      if (this.lastRotCenter !== undefined) {
        stroke(25, 230, 160)
        circle(this.lastRotCenter.x, this.lastRotCenter.y, 4)
      }
    }
  }

  calculateCentroidAndArea() {
    let area = 0;
    let centroid = cvec(0, 0);
    let fixed = this.v[this.v.length - 1]
    for (let i = 0; i < this.v.length - 2; i++) {
      let a = signedTriArea(this.v[i], this.v[i + 1], fixed);
      let c = triCentroid(this.v[i], this.v[i + 1], fixed);
      //centroid.add()
      centroid.x += c.x * a;
      centroid.y += c.y * a;
      area += a;
    }

    this.centerOfMass = cvec(centroid.x, centroid.y).div(area);
    this.area = abs(area)
  }
  
  calculateCentroidAndArea2(){
    
     let area = 0;
     let centroid = cvec(0, 0);
     let fixed = this.v[this.v.length - 1]
     for (let i = 0; i < this.v.length - 2; i++) {
       let a = signedTriArea(this.v[i], this.v[i + 1], fixed);
       let c = triCentroid(this.v[i], this.v[i + 1], fixed);
       //centroid.add()
       centroid.x += c.x * a;
       centroid.y += c.y * a;
       area += a;
     }
    
     this.centerOfMass = cvec(centroid.x, centroid.y).div(area);
     this.area = abs(area)
  }
}