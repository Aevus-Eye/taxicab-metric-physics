function trianglearea(a,b,c) {
  return abs(((b.x-a.x)*(c.y-a.y)-(c.x-a.x)*(b.y-a.y))/2);
}