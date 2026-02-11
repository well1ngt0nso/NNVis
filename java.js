


// roda quando o DOM estiver pronto (porque usamos "defer" no <script>)
document.addEventListener('DOMContentLoaded', () => {
//const entradasInp = document.getElementById('input');
//const saidasInp   = document.getElementById('output');
const camadasInp  = document.getElementById('layer');
const wrapper     = document.getElementById('layers-wrapper');
const btnGerar    = document.getElementById('btn-gerar');

/* ─────────────────────────
 Atualiza campos de camada
 ───────────────────────── */
camadasInp.addEventListener('input', () => {
const qtd = parseInt(camadasInp.value, 10) || 0;
renderizarCamposCamada(qtd);
});

/* ─────────────────────────
N° entrada mínima
 ───────────────────────── */

camadasInp.addEventListener('input', () => {
const valor = camadasInp.value.trim();
const qtd = parseInt(valor, 10);

if (valor === "" || isNaN(qtd) || qtd < 1) {
camadasInp.setCustomValidity("O mínimo de camadas 1");
camadasInp.reportValidity();
camadasInp.value = "";  // 🔥 aqui é onde o valor some!
} else {
camadasInp.setCustomValidity("");
}
});

/* ─────────────────────────
N° saídas mínimas
 ───────────────────────── 
saidasInp.addEventListener('input', () => {
const valor = saidasInp.value.trim();
const qtd = parseInt(valor, 10);

if (valor === "" || isNaN(qtd) || qtd < 1) {
saidasInp.setCustomValidity("O mínimo de saídas é 1");
saidasInp.reportValidity();
saidasInp.value = "";  // 🔥 aqui é onde o valor some!
} else {
entradasInp.setCustomValidity("");
}
}); */

function renderizarCamposCamada(qtd) {
wrapper.innerHTML = '';                       // limpa SÓ o sub‑contêiner

for (let i = 1; i <= qtd; i++) {
  const inp = document.createElement('input');
  inp.type  = 'number';
  inp.classList.add('parametros', 'layer-field');
  inp.name  = `neurons_layer_${i}`;
  inp.placeholder = `Neurônios camada ${i}`;
  inp.min = 1;
  wrapper.appendChild(inp);
}
}

/* ─────────────────────────
 Botão "Gerar"
 ───────────────────────── */
btnGerar.addEventListener('click', () => {
/* ───────────
 1. Coletar dados
 ─────────── */
//const entradas = parseInt(entradasInp.value, 10) || 0;
//const saidas   = parseInt(saidasInp.value,   10) || 0;
const camadas  = parseInt(camadasInp.value,  10) || 0;

// obtém quantos neurônios há em cada camada oculta
const neuroniosOcultas = Array.from(wrapper.querySelectorAll('.layer-field'))
.map(inp => parseInt(inp.value, 10) || 0);

// vetor completo [input, hidden1, hidden2, ..., output]
const estrutura = [ neuroniosOcultas[0], ...neuroniosOcultas, neuroniosOcultas[neuroniosOcultas.length -1] ];
//const estrutura = [entradas, entradas, ...neuroniosOcultas, saidas,saidas];

/* ───────────
 2. Desenhar
 ─────────── */
desenharRede(estrutura);
});
});

function desenharRede(estrutura) {
const wrapper = document.getElementById('network-wrapper');
wrapper.innerHTML = '';
const ids = [];
const ids_bias = [];
var r = 20;
var lineDi = 20;

const colunas = estrutura.length; //nnumero de camadas 
const maxNeuro = Math.max(...estrutura); // maior nº de neurônios
const linhasGrade = 1 + maxNeuro; // 1 (bias) + visíveis 

/* ─── dimensões do SVG ─── */
const wSVG = 800;
const hSVG = 100 + (maxNeuro + 1) *  (2*r)  + (maxNeuro + 2)*lineDi  ; //Neuro + bias * diametro + a mesma quantidade + 1 para espaço * valor
const MwSVG = 1100;
const MhSVG = hSVG/2;

/* ─── cria SVG ─── */
const svgNS = 'http://www.w3.org/2000/svg';
const svg = document.createElementNS(svgNS, 'svg');
svg.setAttribute('width', wSVG);
svg.setAttribute('height', hSVG);
svg.style.border = '1px solid #ccc';
wrapper.appendChild(svg);



function generateCircle(cx, cy, r, con){
      // 1) Cria o elemento
const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

// 2) Dá um id (pode gerar automático se quiser)
const id = `el-${ids.length}`;     // gera automático 
circle.setAttribute("id", id);

// 3) Atributos visuais — valores dentro do tamanho do SVG
circle.setAttribute("cx", cx); // centro X
circle.setAttribute("cy", cy); // centro Y
circle.setAttribute("r", r);   // raio
circle.setAttribute("fill", "none");
circle.setAttribute("stroke", con );       // contorno para ficar evidente
circle.setAttribute("stroke-width", 1);

// 4) Adiciona ao SVG
svg.appendChild(circle);

// 5) Guarda o id
ids.push(id);

} 


function generateSquare(cx, cy) {
const square = document.createElementNS("http://www.w3.org/2000/svg", "rect");

const id = `el-${ids.length}`;
square.setAttribute("id", id);

const size = 40; // Tamanho do lado do quadrado

// Para centralizar o quadrado no ponto (cx, cy)
square.setAttribute("x", cx - size / 2);
square.setAttribute("y", cy - size / 2);
square.setAttribute("width", size);
square.setAttribute("height", size);
square.setAttribute("rx", 10);
square.setAttribute("ry", 10);
square.setAttribute("fill", "none");
square.setAttribute("stroke", "black");
square.setAttribute("stroke-width", 1);

svg.appendChild(square);
ids.push(id);
}


//gerando neuronios

var initx = 100; // Onde incia a primeira camada 
for(let j = 0; j < colunas ; j++){  
var d = 2*r +   lineDi ;
var inity = MhSVG - ((estrutura[j] -1)/2 ) * d;

for(let i = 0; i < estrutura[j]; i++){

console.log("Estrutura");
console.log(estrutura);

if((j != 0) && j != (colunas -1)){
  generateCircle(initx,inity, 20, "black");
    
}else{
   generateSquare(initx,inity);

}

inity += d; // onde inica primeira linha
}
initx += 100; //Distancia a cada camada
}





//gerando bias

let sum = 0;

for (let j = 0; j < colunas-2; j++) {
const el = document.getElementById(ids[sum]);

if (!el) continue;

let x1, y1;

if (j === 0 && el.tagName === "rect") {
  // Primeira camada: quadrado (entrada)
  x1 = parseFloat(el.getAttribute('x')) + 20; // centro X
  y1 = parseFloat(el.getAttribute('y')) + 20; // centro Y
} else if (el.tagName === "circle") {
  // Camadas ocultas ou saída: círculo
  x1 = parseFloat(el.getAttribute('cx'));
  y1 = parseFloat(el.getAttribute('cy'));
} else {
  continue; // ignora se não for o tipo esperado
}

// Gera bias acima do primeiro neurônio da camada
const offset = 2 * r + lineDi;
generateCircle(x1, y1 - offset, 10, "red");

// Acumula número de neurônios até essa camada
sum += estrutura[j];   
}


// Função para criar o marcador, com refX = largura do marcador (10)
function createArrowMarker() {
  const defs = document.createElementNS(svgNS, 'defs');
  const marker = document.createElementNS(svgNS, 'marker');
  marker.setAttribute('id', 'arrowhead');
  marker.setAttribute('markerWidth', 10);
  marker.setAttribute('markerHeight', 10);
  marker.setAttribute('refX', 10);  // importante!
  marker.setAttribute('refY', 5);
  marker.setAttribute('orient', 'auto');
  marker.setAttribute('markerUnits', 'strokeWidth');
  const path = document.createElementNS(svgNS, 'path');
  path.setAttribute('d', 'M0,0 L10,5 L0,10 Z');
  path.setAttribute('fill', 'black');
  marker.appendChild(path);
  defs.appendChild(marker);
  svg.appendChild(defs);
}




// Função simples que você quer:
function generateArrow(x1, y1, x2, y2, r = 20) {
  createArrowMarker();
  const line = document.createElementNS(svgNS, 'line');
  x1 += r;
  x2 -= r;
  line.setAttribute('x1', x1);
  line.setAttribute('y1', y1);
  line.setAttribute('x2', x2);
  line.setAttribute('y2', y2);
  line.setAttribute('stroke', 'black');
  line.setAttribute('stroke-width', 1);
  line.setAttribute('marker-end', 'url(#arrowhead)');
  svg.appendChild(line);
}



let sum1 = 0;

for (let j = 0; j < colunas - 1; j++) {
  const camadaAtual = estrutura[j];
  const proximaCamada = estrutura[j + 1];
  const ultimaLigacao = (j === colunas - 2); // estamos na penúltima camada

  for (let i = 0; i < camadaAtual; i++) {
    const idOrigem = ids[sum1 + i];
    const elOrigem = document.getElementById(idOrigem);
    if (!elOrigem) continue;

    let x1, y1;
    if (elOrigem.tagName === "rect") {
      x1 = parseFloat(elOrigem.getAttribute("x")) + 20;
      y1 = parseFloat(elOrigem.getAttribute("y")) + 20;
    } else if (elOrigem.tagName === "circle") {
      x1 = parseFloat(elOrigem.getAttribute("cx"));
      y1 = parseFloat(elOrigem.getAttribute("cy"));
    } else {
      continue;
    }

    const offsetDestino = sum1 + camadaAtual; // início da próxima camada

    if (ultimaLigacao) {
      // Ligação 1:1
      if (i < proximaCamada) {
        const idDestino = ids[offsetDestino + i];
        const elDestino = document.getElementById(idDestino);
        if (!elDestino) continue;

        let x2, y2;
        if (elDestino.tagName === "circle") {
          x2 = parseFloat(elDestino.getAttribute("cx"));
          y2 = parseFloat(elDestino.getAttribute("cy"));
        } else if (elDestino.tagName === "rect") {
          x2 = parseFloat(elDestino.getAttribute("x")) + 20;
          y2 = parseFloat(elDestino.getAttribute("y")) + 20;
        } else {
          continue;
        }

        generateArrow(x1, y1, x2, y2, 20);
      }

    } else {
      // Ligação todos para todos
      for (let k = 0; k < proximaCamada; k++) {
        const idDestino = ids[offsetDestino + k];
        const elDestino = document.getElementById(idDestino);
        if (!elDestino) continue;

        let x2, y2;
        if (elDestino.tagName === "circle") {
          x2 = parseFloat(elDestino.getAttribute("cx"));
          y2 = parseFloat(elDestino.getAttribute("cy"));
        } else if (elDestino.tagName === "rect") {
          x2 = parseFloat(elDestino.getAttribute("x")) + 20;
          y2 = parseFloat(elDestino.getAttribute("y")) + 20;
        } else {
          continue;
        }

        generateArrow(x1, y1, x2, y2, 20);
      }
    }
  }

  sum1 += camadaAtual; // avança para a próxima camada no array de IDs
}


/*
//gerando setas 

for (let j = 0; j < colunas-1; j++) {
const el = document.getElementById(ids[sum]);

if (!el) continue;

let x1, y1;

if (j === 0 && el.tagName === "rect") {
  // Primeira camada: quadrado (entrada)
  x1 = parseFloat(el.getAttribute('x')) + 20; // centro X
  y1 = parseFloat(el.getAttribute('y')) + 20; // centro Y
} else if (el.tagName === "circle") {
  // Camadas ocultas ou saída: círculo
  x1 = parseFloat(el.getAttribute('cx'));
  y1 = parseFloat(el.getAttribute('cy'));
} else {
  continue; // ignora se não for o tipo esperado
}

// Gera bias acima do primeiro neurônio da camada
const offset = 2 * r + lineDi;
generateCircle(x1, y1 - offset, 10, "red");

// Acumula número de neurônios até essa camada
sum += estrutura[j];   
}

*/


}