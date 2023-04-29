var img;

function setup() {
    createCanvas(windowWidth, windowHeight);
    img = createImg('https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228');
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
    if (mouseIsPressed) {
        fill(0);
    } else {
        fill(255);
    }
    ellipse(mouseX,mouseY,80,80);
    for (let i = 0; i < 10; i++) {
        arc(50 + i * 2, 55 + i * 5, 70 + 10 * i, 70, PI, PI + HALF_PI);
        arc(50 + i * 2, 250 + i * 5, 200 + 10 * i, 200, PI, TWO_PI);
      }
    // Image(img, 0, 0, windowWidth, windowHeight);
}