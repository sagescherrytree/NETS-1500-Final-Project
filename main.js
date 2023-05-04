
const clientId = "3b96d98dc3b545cbbbe2a9420ff4f6c9";
const clientSecret = "568b521ce3f949b7ac4236ad7ff49d5c";
const container = document.querySelector(".container");
const searchForm = document.getElementById("search-form");

async function getAccessToken() {
  const result = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
        'Content-Type' : 'application/x-www-form-urlencoded', 
    },
    body: 'grant_type=client_credentials&client_id=' + clientId + '&client_secret=' + clientSecret
  });

  const data = await result.json();
  return data.access_token;
};

async function getTrackId(trackName, artist, token) {
  const result = await fetch(`https://api.spotify.com/v1/search?q=${trackName}${artist}&type=track&limit=1&offset=0`, {
  method: 'GET',
  headers: { 
    'Content-Type' : "application/json",
    'Authorization' : `Bearer ${token}`
  }
});

  const data = await result.json();
  return data.tracks.items[0].id;
};

let img;

// Create shader
let worleyNoise;
let shaderTest;
let sinewave;
let greyscale;
let chromatic;

let blurH;
let blurV;
let bloom;

let layer1;
let layer2;
let layer3;

let pass1;
let pass2;
let bloomPass;

// let shaderLayer;

function preload() {
  worleyNoise = loadShader('base.vert', 'worley.frag');
  shaderTest = loadShader('shaderTest.vert', 'shaderTest.frag');
  sinewave = loadShader('base.vert', 'sinewave.frag');
  greyscale = loadShader('base.vert', 'greyscale.frag');
  chromatic = loadShader('base.vert', 'chromatic.frag');

  blurH = loadShader('base.vert', 'blur.frag');
  blurV = loadShader('base.vert', 'blur.frag');
  bloom = loadShader('base.vert', 'bloom.frag');

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
  layer3 = createGraphics(windowWidth, windowHeight, WEBGL);

  pass1 = createGraphics(windowWidth, windowHeight, WEBGL);
  pass2 = createGraphics(windowWidth, windowHeight, WEBGL);
  bloomPass = createGraphics(windowWidth, windowHeight, WEBGL);

  pass1.noStroke();
  pass2.noStroke();
  bloomPass.noStroke();
}

async function getAlbumArt(trackName, artist) {
  const token = await getAccessToken(); 
  const trackId = await getTrackId(trackName, artist, token);
  
  const result = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
    method: 'GET',
    headers: { 
      'Authorization' : `Bearer ${token}`
    }
  });

  const data = await result.json();
  // console.log(data.album.images[0].url)
  return data.album.images[0].url;

}

async function getTrackAudioFeatures(trackName, artist) {
  const token = await getAccessToken(); 
  const trackId = await getTrackId(trackName, artist, token);

  const result = await fetch(`https://api.spotify.com/v1/audio-features/${trackId}`, {
    method: 'GET',
    headers: { 
      'Authorization' : `Bearer ${token}`
    }
  });

  const data = await result.json();
  const trackAudioFeatures = {
    danceability: data.danceability,
    valence: data.valence,
    speechiness: data.speechiness
  }
  // console.log(trackAudioFeatures);
  return trackAudioFeatures;
}

var albumArtUrl = '';
var trackAudioFeatures = {};


searchForm.addEventListener("submit", async e => {
  e.preventDefault();
  let trackName = document.getElementById("track").value;
  let artist = document.getElementById("artist").value;
  albumArtUrl = await getAlbumArt(trackName, artist);
  trackAudioFeatures = await getTrackAudioFeatures(trackName, artist);
  container.classList.add("slide-left");

  var prevArt = document.getElementById('art');
  if (prevArt != null) {
    prevArt.parentNode.removeChild(prevArt);
  }

  var img = document.createElement("img");
  img.src = albumArtUrl;
  img.id = "art";
  document.getElementById("generated-art").appendChild(img);  

});
  
function draw() {
  // Test greyscale
  layer1.shader(chromatic);

  chromatic.setUniform("tex0", img);

  layer1.rect(0,0,windowWidth, windowHeight);

  // Test sinewave
  layer2.shader(sinewave);

  sinewave.setUniform("tex0", layer1);
  sinewave.setUniform("time", frameCount * 0.01);

  let freq = map(mouseX, 0, width, 0, 10.0);
  let amp = map(mouseY, 0, height, 0, 0.25);

  sinewave.setUniform("frequency", freq);
  sinewave.setUniform("amplitude", amp);

  layer2.rect(0,0,windowWidth, windowHeight);

  layer3.shader(worleyNoise);

  worleyNoise.setUniform("resolution", [windowWidth, windowHeight]);
  worleyNoise.setUniform("tex0", layer2);
  worleyNoise.setUniform("time", frameCount * 0.01);

  layer3.rect(0,0,windowWidth, windowHeight);

  pass1.shader(blurH);

  blurH.setUniform('tex0', layer3);
  blurH.setUniform('texelSize', [1.0/windowWidth, 1.0/windowHeight]);
  blurH.setUniform('direction', [1.0, 0.5]);

  pass1.rect(0,0,windowWidth, windowHeight);

  pass2.shader(blurV);

  blurV.setUniform('tex0', pass1);
  blurV.setUniform('texelSize', [1.0/windowWidth, 1.0/windowHeight]);
  blurV.setUniform('direction', [3.0, 4.0]);

  pass2.rect(0,0,windowWidth, windowHeight);

  bloomPass.shader(bloom);

  bloom.setUniform('tex0', layer2);
  bloom.setUniform('tex1', pass2);

  bloom.setUniform('mouseX', mouseX/windowWidth);

  bloomPass.rect(0,0,windowWidth, windowHeight);

  image(bloomPass, -240, -300);

  shaderTest.setUniform("iResolution", [width, height]);
  shaderTest.setUniform("iFrame", frameCount);
  shaderTest.setUniform("iMouse", [mouseX, map(mouseY, 0, height, height, 0)]);

  // shader(shaderTest);
  // rect(0, 0, windowWidth, windowHeight);

  // rect(0, 0, windowWidth, windowHeight);

  // worleyNoise.setUniform("u_Texture", img);
  // worleyNoise.setUniform("u_Time", millis() / 1000.0);
  // worleyNoise.setUniform("u_Dimensions", [windowWidth, windowHeight]);
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}
