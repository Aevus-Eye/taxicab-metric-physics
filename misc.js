function trianglearea(a,b,c) {
  return abs(signedTriArea(a,b,c));
}

function signedTriArea(a,b,c){
  return ((b.x-a.x)*(c.y-a.y)-(c.x-a.x)*(b.y-a.y))/2
}

function triCentroid(a,b,c){
  return {x:(a.x+b.x+c.x)/3,y:(a.y+b.y+c.y)/3};
}

function copyToClipboard(text) {
  document.getElementById("cpdump").innerText=text;
}

function distp(p1,p2){
  return sqrt((p1.x-p2.x)**2+(p1.y-p2.y)**2)
}

function invLerp(a,b,x){
  return (x - a) / (b - a)
}

function lerpp(a,b,t){
  return {
    x:lerp(a.x,b.x,t),
    y:lerp(a.y,b.y,t),
    u:lerp(a.u||0,b.u||0,t),
    v:lerp(a.v||0,b.v||0,t)
  }
}