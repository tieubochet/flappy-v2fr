
export function startGame(onGameOver, onScore){
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  let birdY = canvas.height/2, gravity = 0.6, lift = -9.5, velocity = 0;
  let pipes = [], score = 0, frame = 0;
  let playing = true;
  const gap = 130;
  const pipeWidth = 54;
  const birdX = 70;
  const birdR = 12;

  function flap(){ velocity = lift; }
  document.addEventListener('keydown', (e) => { if(e.code==='Space') flap(); });
  canvas.addEventListener('pointerdown', () => flap());

  function spawnPipe(){
    const minTop = 40;
    const maxTop = canvas.height - gap - 100;
    const top = Math.random() * (maxTop - minTop) + minTop;
    pipes.push({ x: canvas.width + pipeWidth, top, passed:false });
  }

  function drawBackground(){
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    // ground
    ctx.fillStyle = "#ded895";
    ctx.fillRect(0, canvas.height-40, canvas.width, 40);
  }

  function drawBird(){
    ctx.fillStyle = "#ffd400";
    ctx.beginPath();
    ctx.arc(birdX, birdY, birdR, 0, Math.PI*2);
    ctx.fill();
    // eye
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(birdX+4, birdY-4, 2, 0, Math.PI*2);
    ctx.fill();
  }

  function drawPipes(){
    ctx.fillStyle = "#1faa59";
    for (const p of pipes){
      ctx.fillRect(p.x, 0, pipeWidth, p.top);
      ctx.fillRect(p.x, p.top + gap, pipeWidth, canvas.height - (p.top + gap) - 40);
    }
  }

  function update(){
    frame++;
    if (frame % 95 === 0) spawnPipe();

    // move pipes
    for (const p of pipes){
      p.x -= 2.4;
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

    // collision
    if (birdY + birdR > canvas.height-40 || birdY - birdR < 0){
      playing = false;
    }
    for (const p of pipes){
      const collideX = birdX + birdR > p.x && birdX - birdR < p.x + pipeWidth;
      const collideY = birdY - birdR < p.top || birdY + birdR > p.top + gap;
      if (collideX && collideY) playing = false;
    }
  }

  function drawScore(){
    ctx.fillStyle = "#000";
    ctx.font = "24px system-ui, sans-serif";
    ctx.fillText(String(score), 12, 32);
  }

  function loop(){
    drawBackground();
    update();
    drawPipes();
    drawBird();
    drawScore();
    if (playing) requestAnimationFrame(loop);
    else onGameOver(score);
  }

  loop();
}
