Object.assign(document.body.style, {
  margin: '0',
  overflow: 'hidden',
});

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 100;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 100;
  draw();
});

let choice = [];

let rr = 0;
let speed = 0.1;
let acc = 0;
const draw = () => {
  const { width, height } = canvas;
  const r = Math.min(width, height) * 0.4;
  const c = choice.length;
  ctx.clearRect(0, 0, width, height);
  for (let i = 0; i < c; ++i) {
    ctx.fillStyle = `hsl(${i / c}turn 100% 50%)`;
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, r, i / c * 2 * Math.PI + rr, (i + 1) / c * 2 * Math.PI + rr);
    ctx.lineTo(width / 2, height / 2);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#000';
  ctx.lineWidth = r / 200;
  ctx.font = `${r / 5}px monospace`;
  for (let i = 0; i < c; ++i) {
    const mes = ctx.measureText(choice[i]);
    ctx.fillText(
      choice[i],
      width / 2 + Math.cos((i + 0.5) / c * 2 * Math.PI + rr) * r * 0.7 + (mes.actualBoundingBoxLeft - mes.actualBoundingBoxRight) / 2,
      height / 2 + Math.sin((i + 0.5) / c * 2 * Math.PI + rr) * r * 0.7 + (mes.actualBoundingBoxAscent - mes.actualBoundingBoxDescent) / 2,
    );
    ctx.strokeText(
      choice[i],
      width / 2 + Math.cos((i + 0.5) / c * 2 * Math.PI + rr) * r * 0.7 + (mes.actualBoundingBoxLeft - mes.actualBoundingBoxRight) / 2,
      height / 2 + Math.sin((i + 0.5) / c * 2 * Math.PI + rr) * r * 0.7 + (mes.actualBoundingBoxAscent - mes.actualBoundingBoxDescent) / 2,
    );
  }
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.moveTo(width / 2 + r * 0.5, height / 2 + r * 0.5);
  ctx.lineTo(width / 2 + r * 1.05, height / 2 + r);
  ctx.lineTo(width / 2 + r, height / 2 + r * 1.05);
  ctx.closePath();
  ctx.fill();
};

const id = setInterval(() => {
  draw();
  rr += speed;
  speed += acc;
  if (speed < 0) {
    speed = 0;
    clearInterval(id);
    const resultw = document.createElement('div');
    const result = document.createElement('span');
    const idx = Math.floor((((0.125 - rr / (2 * Math.PI)) % 1 + 1) % 1) * choice.length);
    Object.assign(resultw.style, {
      position: 'fixed',
      left: '0',
      top: '0',
      right: '0',
      bottom: '0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      perspective: '100vmin',
      perspectiveOrigin: 'center',
    });
    Object.assign(result.style, {
      fontSize: '30vmin',
      transformOrigin: 'bottom',
      transform: 'rotateX(90deg)',
      background: 'linear-gradient(45deg, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)',
      backgroundClip: 'text',
      color: 'transparent',
      textStroke: '1vmin #fff',
      fontWeight: 'bold',
      fontFamily: 'monospace',
      webkitTextStroke: '1vmin #fff',
    });
    result.innerText = choice[idx];
    document.body.appendChild(resultw);
    resultw.appendChild(result);
    let t = 90;
    const id0 = setInterval(() => {
      t -= 0.2;
      resultw.style.backgroundColor = `rgba(0,0,0,${Math.min((90 - t) / 90, 0.5)})`;
      if (t > 0) {
        result.style.transform = `rotateX(${t}deg)`;
      } else {
        result.style.transform = 'rotateX(0deg)';
        clearInterval(id0);
      }
    }, 0);
  }
}, 0);

canvas.addEventListener('click', () => {
  acc = -0.0001;
});

const parts = document.createElement('div');
document.body.append(parts);
Object.assign(parts.style, {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  height: '100px',
});

const update = () => {
  choice.length = 0;
  for (const input of document.querySelectorAll('input[data-part]')) {
    const partname = input.dataset.part;
    const s = Number(input.value);
    if (0 <= s && s <= 10)
      for (let i = 0; i < Number(input.value); ++i) {
        choice.push(partname);
      }
  }
};
const part = (name, d) => {
  const r = document.createElement('label');
  const c = document.createElement('input');
  c.type = 'number';
  c.value = d;
  c.min = 0;
  c.max = 10;
  c.style.width = 'min(calc(100% - 5em), 10em)';
  c.dataset.part = name;
  r.innerText = `${name}: `;
  r.style.textAlign = 'center';
  r.appendChild(c);
  c.addEventListener('input', update);
  return r;
};
parts.append(
  part('1st', 2),
  part('2nd', 1),
  part('3rd', 1),
  part('4th', 0),
  part('5th', 0),
  part('6th', 0),
);
update();
