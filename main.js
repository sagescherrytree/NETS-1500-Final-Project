
const clientId = "3b96d98dc3b545cbbbe2a9420ff4f6c9";
const clientSecret = "568b521ce3f949b7ac4236ad7ff49d5c";
const searchInput = document.getElementById("search-form");

searchInput.addEventListener("submit", e => {
  const input = e.target.value;
  e.preventDefault();
  console.log(input);
});


async function getAccessToken() {

  const result = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
        'Content-Type' : 'application/x-www-form-urlencoded', 
    },
    body: 'grant_type=client_credentials&client_id=' + clientId + '&client_secret=' + clientSecret
  });

  const data = await result.json();
  console.log(data.access_token);
  return data.access_token;
};

async function getTrackId(trackName) {
  const token = await getAccessToken();  
  const result = await fetch(`https://api.spotify.com/v1/search?q=${trackName}&type=track&limit=1&offset=0`, {
  method: 'GET',
  headers: { 
    'Content-Type' : "application/json",
    'Authorization' : `Bearer ${token}`
  }
});

  const trackId = await result.json().id;
  return trackId;
};

const id = getTrackId("LOSER");


var img;
let minYchange = 0; //these two ranges determine line overlap and width
let maxYchange = 50;
let layers = 5;
let rotStripe = 0; //rotation of each stripe; try 10 or 90;
// try lines = true with high alph or lines = false with low alph (100)
let lines = true;
let alph = 255; //out of 255
let colRand = false; //true = random color; false = color from palette table
let filling = true;
let colorLines = false; //false for black lines
let sw = 1; //line width
let extraBlack = 0; //1 for some black line and white fills; 0 for neither; -2 for fewer colors;
let extraBlackAlph = 255; //out of 255 - used if extraBlack=1 & lines, filling, colorLines all true, low alph, high sw
let r, g, b;
let table;

function preload() {
    table = loadTable("colours.csv", "csv", "header");
  }

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    let canv = createCanvas(windowWidth-30, windowHeight-30);
  canv.mousePressed(setup);
  if (lines == true) {
    stroke(0, 0, 0, extraBlackAlph);
    strokeWeight(sw);
  } else {
    noStroke();
  }
  angleMode(DEGREES);
  let end = height / 2 + 400; //where lines stop
  let palette = floor(random(676));
  for (let i = 0; i < layers; i++) {
    let y1;
    if (i == 0) {
      y1 = -height / 2 - 300;
    } else {
      y1 = -height / 2 + (height / layers) * i;
    }
    //starting height for each layer
    let y2 = y1,
      y3 = y1,
      y4 = y1,
      y5 = y1,
      y6 = y1;
    let rotLayer = random(359); //layer rotation
    let rotThisStripe = 0;
    //keep going until all the lines are at the bottom
    while (
      (y1 < end) &
      (y2 < end) &
      (y3 < end) &
      (y4 < end) &
      (y5 < end) &
      (y6 < end) &
      (-maxYchange < minYchange)
    ) {
      y1 += random(minYchange, maxYchange);
      y2 += random(minYchange, maxYchange);
      y3 += random(minYchange, maxYchange);
      y4 += random(minYchange, maxYchange);
      y5 += random(minYchange, maxYchange);
      y6 += random(minYchange, maxYchange);
      if (colRand == true) {
        r = random(256);
        g = random(256);
        b = random(256);
      } else {
        let col = floor(random(5 + extraBlack));
        r = table.get(palette, col * 3);
        g = table.get(palette, col * 3 + 1);
        b = table.get(palette, col * 3 + 2);
      }
      if (filling == true) {
        fill(r, g, b, alph);
      } else {
        noFill();
      }
      if (colorLines == true) {
        stroke(r, g, b, alph);
      }
      push();
      translate(width / 2, height / 2);
      rotThisStripe += rotStripe; //rotating after each stripe
      rotate(rotThisStripe + rotLayer);
      let xStart = -width / 2;
      beginShape();
      curveVertex(xStart - 300, height / 2 + 500);
      curveVertex(xStart - 300, y1);
      curveVertex(xStart + (width / 5) * 1, y2);
      curveVertex(xStart + (width / 5) * 2, y3);
      curveVertex(xStart + (width / 5) * 3, y4);
      curveVertex(xStart + (width / 5) * 4, y5);
      curveVertex(width / 2 + 300, y6);
      curveVertex(width / 2 + 300, height / 2 + 500);
      endShape(CLOSE);
      pop();
    }
    colorMode(HSB,359,100,100,100);
  }
    // Image(img, 0, 0, windowWidth, windowHeight);
    // img.hide();
    // background(100);
}
  
function draw() {
  // Generative art ideas
    // Use colours from album covers and randomise transfomrmations?
    // Use different post processing shaders on them?
    // Maybe customisable transformations?
    // Add some fun post processing shaders (maybe worley noise/perlin noise)
    // line(15, 50, 300, 200);

    // if (mouseIsPressed) {
    //     fill(0);
    // } else {
    //     fill(255);
    // }
    // ellipse(mouseX,mouseY,80,80);
    // for (let i = 0; i < 10; i++) {
    //     arc(50 + i * 2, 55 + i * 5, 70 + 10 * i, 70, PI, PI + HALF_PI);
    //     arc(50 + i * 2, 250 + i * 5, 200 + 10 * i, 200, PI, TWO_PI);
    // } 
}
