const TCPI = 4; // pi equals 4 in taxicab

// angle conversions are used for the tc trigo functions. angles in euclid and tc are the same, this just changes the unit.
// euclid to taxicab (angle)
function ettc(a) {
  return a / PI * TCPI
}

// taxicab to euclid (angle)
function tcte(a) {
  return a / TCPI * PI
}

//modulus operator that actually works with negative values
function trueMod(x, m) {
  return x = (x % m + m) % m
}

// taxicab sine function creates a triangle shape.
// 1 period is 0..8 (2*TCPI)
function tcsin(a) {
  a = trueMod(a / 2 + 1, 4) - 1;
  if (a < 1)
    return a
  return 2 - a
}

function tccos(a) {
  return tcsin(a + 2);
}

function tcatan2(x, y) {
  if (x === 0 && y === 0) //safety check
    return 0;
  let r = abs(x) + abs(y)
  if (y >= 0 && x >= 0) //quad 1
    return 2 * y / r
  if (y >= 0) // quad 2
    return 2 * (1 - x / r)
  if (x < 0) //quad 3
    return 2 * (2 - y / r)
  else // quad 4
    return 2 * (3 + x / r)
}

function tcdistp(p1, p2) { return tcdist(p1.x, p1.y, p2.x, p2.y) }

function tcdist(x1, y1, x2, y2) {
  return abs(x1 - x2) + abs(y1 - y2)
}

function tclength(x, y) {
  return abs(x) + abs(y)
}

function tcrotate(p,center,angle) {
  //convert a point into polar, add the angle, then change back into cartesian
  let a = tcatan2(p.x - center.x, p.y - center.y) + angle;
  let r = tcdist(center.x, center.y, p.x, p.y);
  return {
    x: tccos(a) * r + center.x,
    y: tcsin(a) * r + center.y,
    u: p.u,
    v: p.v
  }
}