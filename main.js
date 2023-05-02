
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


let img;

// Create shader
let worleyNoise;
let shaderTest;
let sinewave;
let greyscale;

let layer1;
let layer2;

// let shaderLayer;

function preload() {
  worleyNoise = loadShader('worley.vert', 'worley.frag');
  shaderTest = loadShader('shaderTest.vert', 'shaderTest.frag');
  sinewave = loadShader('sinewave.vert', 'sinewave.frag');
  greyscale = loadShader('greyscale.vert', 'greyscale.frag');
  // table = loadTable("colours.csv", "csv", "header");
  img = loadImage("experiments/Experiment_1.png");
}

function setup() {
  // createCanvas(windowWidth, windowHeight);
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();

  image(img, -270, -300, windowWidth, windowHeight);

  layer1 = createGraphics(windowWidth, windowHeight, WEBGL);
  layer2 = createGraphics(windowWidth, windowHeight, WEBGL);

}
  
function draw() {
  // Test greyscale
  layer1.shader(greyscale);

  greyscale.setUniform("tex0", img);
  layer1.rect(0,0,windowWidth, windowHeight);

  // Test sinewave
  layer2.shader(sinewave);

  sinewave.setUniform("tex0", layer1);
  sinewave.setUniform("time", frameCount * 0.01);

  let freq = map(mouseX, 0, width, 0, 10.0);
  let amp = map(mouseY, 0, height, 0, 0.25);

  sinewave.setUniform("frequency", freq);
  sinewave.setUniform("amplitude", amp);

  // rect gives us some geometry on the screen
  layer2.rect(0,0,windowWidth, windowHeight);

  image(layer2, -270, -300);

  shaderTest.setUniform("iResolution", [width, height]);
  shaderTest.setUniform("iFrame", frameCount);
  shaderTest.setUniform("iMouse", [mouseX, map(mouseY, 0, height, height, 0)]);

  // shader(shaderTest);
  // rect(0, 0, windowWidth, windowHeight);

  // Worley noise section

  shader(worleyNoise);

  worleyNoise.setUniform("iResolution", [width, height]);
  worleyNoise.setUniform("u_Time", frameCount);
  worleyNoise.setUniform("u_Texture", img);

  // rect(0, 0, windowWidth, windowHeight);

  // worleyNoise.setUniform("u_Texture", img);
  // worleyNoise.setUniform("u_Time", millis() / 1000.0);
  // worleyNoise.setUniform("u_Dimensions", [windowWidth, windowHeight]);
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}