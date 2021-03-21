class Shape {
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

  rotate(center, angle) {
    //refrence, how i did it before with the subdivided mesh
    /*
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
    */
    
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
  }
}