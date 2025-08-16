export function startGame(onGameOver, onScore){
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  let birdY = canvas.height/2, gravity = 0.5, lift = -9, velocity = 0;
  let pipes = [], score = 0, frame = 0;
  let playing = true;
  const gap = 140;
  const pipeWidth = 60;
  const birdX = 80;
  const birdR = 14;

  function flap(){
    if (playing) velocity = lift;
  }
  document.addEventListener('keydown', (e) => { if(e.code==='Space') flap(); });
  canvas.addEventListener('pointerdown', () => flap());

  function spawnPipe(){
    const minTop = 50;
    const maxTop = canvas.height - gap - 100;
    const top = Math.random() * (maxTop - minTop) + minTop;
    pipes.push({ x: canvas.width, top, passed:false });
  }

  function drawBackground(){
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#70c5ce");
    gradient.addColorStop(1, "#a6e0e9");
    ctx.fillStyle = gradient;
    ctx.fillRect(0,0,canvas.width,canvas.height);
  }

  function drawGround() {
    // ground base
    ctx.fillStyle = "#ded895";
    ctx.fillRect(0, canvas.height-40, canvas.width, 40);
    // ground stripes
    ctx.fillStyle = "#b9b27b";
    for(let i = -frame % 20; i < canvas.width; i+=20) {
        ctx.fillRect(i, canvas.height-40, 10, 40);
    }
  }


  function drawBird(){
    const birdHeight = birdR * 2 - Math.min(Math.abs(velocity), 10) / 2;
    const birdWidth = birdR * 2 + Math.min(Math.abs(velocity), 10) / 4;

    ctx.fillStyle = "#ffd400";
    ctx.beginPath();
    ctx.ellipse(birdX, birdY, birdWidth / 2, birdHeight / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    // eye
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(birdX+6, birdY-4, 2.5, 0, Math.PI*2);
    ctx.fill();
  }

  function drawPipes(){
    ctx.fillStyle = "#1faa59";
    const capHeight = 20;
    for (const p of pipes){
      // top pipe
      ctx.fillRect(p.x, 0, pipeWidth, p.top);
      ctx.fillRect(p.x - 5, p.top - capHeight, pipeWidth + 10, capHeight);
      // bottom pipe
      const bottomY = p.top + gap;
      ctx.fillRect(p.x, bottomY, pipeWidth, canvas.height - bottomY - 40);
      ctx.fillRect(p.x - 5, bottomY, pipeWidth + 10, capHeight);
    }
  }

  function update(){
    frame++;
    if (frame % 90 === 0) spawnPipe();

    // move pipes
    for (const p of pipes){
      p.x -= 2.8;
      // scoring
      if (!p.passed && p.x + pipeWidth < birdX){
        p.passed = true;
        score++;
        if (onScore) onScore(score);
      }
    }
    // clean off-screen
    if (pipes.length && pipes[0].x < -pipeWidth) pipes.shift();

    // physics
    velocity += gravity;
    birdY += velocity;
    if (birdY > canvas.height - 40 - birdR) {
        birdY = canvas.height - 40 - birdR;
        velocity = 0;
    }


    // collision
    if (birdY - birdR < 0){
      playing = false;
    }
    // ground collision is special
    if (birdY + birdR > canvas.height - 40) {
        playing = false;
    }
    for (const p of pipes){
      const collideX = birdX + birdR > p.x && birdX - birdR < p.x + pipeWidth;
      const collideY = birdY - birdR < p.top || birdY + birdR > p.top + gap;
      if (collideX && collideY) playing = false;
    }
  }

  function drawScore(){
    ctx.fillStyle = "white";
    ctx.font = "bold 48px Poppins, sans-serif";
    ctx.textAlign = "center";
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    ctx.strokeText(String(score), canvas.width/2, 60);
    ctx.fillText(String(score), canvas.width/2, 60);
  }

  function loop(){
    drawBackground();
    drawPipes();
    drawGround();
    drawBird();
    drawScore();

    if(playing) {
      update();
      requestAnimationFrame(loop);
    } else {
      onGameOver(score);
    }
  }

  spawnPipe();
  loop();
}
