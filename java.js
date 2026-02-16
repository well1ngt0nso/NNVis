// roda quando o DOM estiver pronto (porque usamos "defer" no <script>)
document.addEventListener('DOMContentLoaded', () => {

    const camadasInp = document.getElementById('layer');
    const wrapper = document.getElementById('layers-wrapper');
    const btnGerar = document.getElementById('btn-gerar');


    /* ─────────────────────────
     Atualiza campos de camada
     ───────────────────────── */
    camadasInp.addEventListener('input', () => {
        const qtd = parseInt(camadasInp.value, 10) || 0;
        if(qtd < 11){
            renderizarCamposCamada(qtd);
        }else{
               renderizarCamposCamada(0);
        }

    });

    /* ─────────────────────────
    N° entrada mínima e máxima
     ───────────────────────── */

    camadasInp.addEventListener('input', () => {
        const valor = camadasInp.value.trim();
        const qtd = parseInt(valor, 10);

        if (valor === "" || isNaN(qtd) || qtd < 1) {
            camadasInp.setCustomValidity("O mínimo de camadas 1");
            camadasInp.reportValidity();
            camadasInp.value = ""; 
        } else if (qtd > 10){
            camadasInp.setCustomValidity("O máximo de camadas é 10");
            camadasInp.reportValidity();
            camadasInp.value = ""; 
            
            
        }else {
             camadasInp.setCustomValidity(""); // limpa erro
        camadasInp.reportValidity();
        camadasInp.value = qtd;
         
        }
    });




    function renderizarCamposCamada(qtd) {
        wrapper.innerHTML = ''; // limpa SÓ o sub‑contêiner

        for (let i = 1; i <= qtd; i++) {
            const inp = document.createElement('input');
            inp.type = 'number';
            inp.classList.add('parametros', 'layer-field');
            inp.name = `neurons_layer_${i}`;
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
        const camadas = parseInt(camadasInp.value, 10) || 0;

        // obtém quantos neurônios há em cada camada oculta
        const neuroniosOcultas = Array.from(wrapper.querySelectorAll('.layer-field'))
            .map(inp => parseInt(inp.value, 10) || 0);

        // vetor completo [input, hidden1, hidden2, ..., output]
        const estrutura = [neuroniosOcultas[0], ...neuroniosOcultas, neuroniosOcultas[neuroniosOcultas.length - 1]];
        //const estrutura = [entradas, entradas, ...neuroniosOcultas, saidas,saidas];
        
      
        /* ───────────
         2. Desenhar
         ─────────── */
        desenharRede(estrutura);
    });
});

function desenharRede(estrutura) {
    const gerar = document.getElementById('generate');

    const ids = []; //neurônios
    const ids_bias = []; 
    const ids_func = [];
    const ids_line = []; // limhas/setas
    const ids_square = [];
    const ids_legend = [];


    var r = 20;
    var lineDi = 20; // Distãncia entre linhas

    const colunas = estrutura.length; //nnumero de camadas 
    const maxNeuro = Math.max(...estrutura); // maior nº de neurônios
    const linhasGrade = 1 + maxNeuro; // 1 (bias) + visíveis 
    

    /* ─── dimensões do SVG ─── */
    const wrapper = document.getElementById('network-wrapper');
    wrapper.innerHTML = '';

    const wSVG = (wrapper.offsetWidth - 212) * 0.9; // Cálcula a largula com base em 90% da largura da div da rede - caixa dados 
    const hSVG = 100 + (maxNeuro + 1) * (2 * r) + (maxNeuro + 2) * lineDi; //Neuro + bias * diametro + a mesma quantidade + 1 para espaço * valor
    const MwSVG = 1100;
    const MhSVG = hSVG / 2;
    

    // dimensão div pai
    gerar.style.height = (hSVG + 200) + "px";


    /* ─── cria SVG ─── */
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    //console.log(svg);

    svg.setAttribute('width', wSVG);
    svg.setAttribute('height', hSVG);

    svg.style.border = '1px solid #ccc';
    wrapper.appendChild(svg);
    

  
   


    // ===========  FUNC CÍRCULOS ===========

    function generateCircle(cx, cy, r, con, point) {
        // 1) Cria o elemento
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

        // 2) Dá um id (pode gerar automático se quiser)
        const id = `ec-${point.length}`; // gera automático 
        circle.setAttribute("id", id);

        // 3) Atributos visuais — valores dentro do tamanho do SVG
        circle.setAttribute("cx", cx); // centro X
        circle.setAttribute("cy", cy); // centro Y
        circle.setAttribute("r", r); // raio
        circle.setAttribute("fill", "none");
        circle.setAttribute("stroke", con); // contorno para ficar evidente
        circle.setAttribute("stroke-width", 1);

        // 4) Adiciona ao SVG
        svg.appendChild(circle);

        // 5) Guarda o id
        point.push(id);

    }

    // =========== FUNC QUADRADOS =============

    function generateSquare(cx, cy, point) {
        const square = document.createElementNS("http://www.w3.org/2000/svg", "rect");

        const id = `eq-${point.length}`;
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
        point.push(id);
    }

    // =========== FUNC POLYGONOS=============

    function generatePolygon(cx, cy, point) {
        const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");

        const id = `ep-${point.length}`;
        polygon.setAttribute("id", id);

        const size = 40; // tamanho do quadrado
        const half = size / 2;

        // Pontos do quadrado (x1,y1 x2,y2 ...)
        const points = [
            [cx - half, cy - half], // canto superior esquerdo
            [cx + half, cy - 9], // canto superior direito
            [cx + half, cy + half], // canto inferior direito
            [cx - half, cy + half] // canto inferior esquerdo
        ];

        // Transformando em string "x1,y1 x2,y2 x3,y3 x4,y4"
        const pointsStr = points.map(p => p.join(",")).join(" ");
        polygon.setAttribute("points", pointsStr);

        polygon.setAttribute("fill", "none");
        polygon.setAttribute("stroke", "green");
        polygon.setAttribute("stroke-width", 1);

        svg.appendChild(polygon);
        point.push(id);
    }



    //gerar legenda
    generateSquare(wSVG - 400 , hSVG - 29, ids_legend);
    const square_legend = document.getElementById(ids_legend[0]);
    square_legend.setAttribute('id', "ele_0");
    ids_legend[0] = "ele_0";

    generateCircle(wSVG - 300, hSVG - 29, 20, "black", ids_legend);
    const circle_legend = document.getElementById(ids_legend[1]);
    circle_legend.setAttribute('id', "ele_1");
    ids_legend[1] = "ele_1";

    generatePolygon(wSVG -200, hSVG - 29, ids_legend);
    const polygon_legend = document.getElementById(ids_legend[2]);
    polygon_legend.setAttribute('id', "ele_2");
    ids_legend[2] = "ele_2";

    generateCircle(wSVG - 100 , hSVG - 29, 20, "red", ids_legend);
    const bias_legend = document.getElementById(ids_legend[3]);
    bias_legend.setAttribute('id', "ele_3");
    ids_legend[0] = "ele_3";



    //generateCircle(); 


    //GERADOR DE NEURÔRIOS

    var initx = 100; // Onde incia a primeira camada 
    for (let j = 0; j < colunas; j++) {
        var d = 2 * r + lineDi;
        var inity = MhSVG - ((estrutura[j] - 1) / 2) * d;

        for (let i = 0; i < estrutura[j]; i++) {

            //console.log("Estrutura");
            //console.log(estrutura);

            if ((j != 0) && j != (colunas - 1)) {
                generateCircle(initx, inity, 20, "black", ids);

            } else {
                generateSquare(initx, inity, ids_square);

            }

            inity += d; // onde inica primeira linha
        }
        initx += 200; //Distancia a cada camada
    }


    //GERADOR DE FUNC ACT

    var initx = 400; // Onde incia a primeira camada 
    for (let j = 1; j < (colunas - 1); j++) {

        var inity = MhSVG - ((estrutura[j] - 1) / 2) * d;
        for (let i = 0; i < estrutura[j]; i++) { //varre o array de camadas "5 6 3 4 "(com base no tol de camadas (colunas) = "4")

            //console.log("Estrutura");
            //console.log(estrutura);

            if ((j != 0) && j != (colunas - 1)) {
                generatePolygon(initx, inity, ids_func);

            } else {


            }

            inity += d; // onde inica primeira linha
        }
        initx += 200; //Distancia a cada camada
    }




    //gerando bias

    let sum = 0;
    //console.log(ids.length);
    //console.log(ids[0])
    console.log(ids_square.length)

    let x11, y11;

    // Gera bias acima do primeiro neurônio da camada
    const offset = 2 * r + lineDi;

    eq = document.getElementById(ids_square[sum]);

    if (eq.tagName === "rect") {
        // Primeira camada: quadrado (entrada)
        x11 = parseFloat(eq.getAttribute('x')) + 20; // centro X
        y11 = parseFloat(eq.getAttribute('y')) + 20; // centro Y
        generateCircle(x11, y11 - offset, 10, "red", ids_bias);
    }

    for (let j = 1; j < colunas - 2; j++) {
        const el = document.getElementById(ids[sum]);

        if (!el) continue;

        let x1, y1;

        if (el.tagName === "circle") {
            // Camadas ocultas ou saída: círculo
            x1 = parseFloat(el.getAttribute('cx'));
            y1 = parseFloat(el.getAttribute('cy'));
        } else {
            continue; // ignora se não for o tipo esperado
        }

        generateCircle(x1, y1 - offset, 10, "red", ids_bias);

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
        marker.setAttribute('refX', 10); // importante!
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



    createArrowMarker();
    // Função para gerar linha:
    function generateArrow(x1, y1, x2, y2, r = 20) {
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


    // ========== GERAÇÃO DE LINHAS DA ENTRADA -> NEURÔNIO ============  100%
    //console.log(estrutura[0]);
    for(let i = 0; i < estrutura[0]; i++){
        // Primeira camada: quadrado (entrada)

        const idOrigem = ids_square[i];
        const eqOrigem = document.getElementById(idOrigem);
        if (!eqOrigem) continue;
        //console.log(eqOrigem);
        //console.log("existe eqOrigem");


        const x1 = parseFloat(eqOrigem.getAttribute('x')) + 20; // centro X
        const y1 = parseFloat(eqOrigem.getAttribute('y')) + 20; // centro Y



        const idDest = ids[i];
        const ecDest = document.getElementById(idDest);
        if (!ecDest) continue;
        //console.log("existe ecDest");
        //console.log(ecDest);

        const x2 = parseFloat(ecDest.getAttribute('cx')); // centro X
        const y2 = parseFloat(ecDest.getAttribute('cy')); // centro Y
        //console.log(x2);
        //console.log(x1);

        generateArrow(x1, y1, x2, y2, r = 20)

    }


    // ========== GERAÇÃO DE LINHAS NEURÔNIO/FUNC ATC ============      100%
    let cont = 0;
    for (let i = 0; i < ids.length; i++) { //COMEÇA DA DO PRIMEIRO NEURONIO APOS Os neuronios primeira camada

        //console.log("Estrutura teste ");
        //console.log(estrutura);
        const idOrigem = ids[i];
        const elOrigem = document.getElementById(idOrigem);
        if (!elOrigem) continue;

        const idDest = ids_func[i];
        const elDest = document.getElementById(idDest);
        if (!elDest) continue;

        let x1, y1;
        x1 = parseFloat(elOrigem.getAttribute("cx"));
        y1 = parseFloat(elOrigem.getAttribute("cy"));

        let x2, y2;
        x2 = x1 + 100;
        y2 = y1;

        generateArrow(x1, y1, x2, y2, r = 20)
        //console.log("aqui")
        //console.log(ids.length);

        cont++;
    }



    // ========== GERAÇÃO DE LINHAS FUNC/NEURÔNIO ===========  80%
    let cont1 = estrutura[1];
    let cont2 = 0;
    for (let i = 1; i < colunas - 1; i++) { // camadas  ok 


        for (let j = 0; j < estrutura[i]; j++) { //neuronio da cadamada anterior   ok  
            let elOrin = document.getElementById(ids_func[j + cont2]);
            let p = elOrin.points.getItem(0);
            if (!elOrin) continue;

            let x1, y1;
            x1 = parseFloat(p.x + 20);
            y1 = parseFloat(p.y + 20);

            for (let k = 0; k < estrutura[i + 1]; k++) { //neuronios da camada seguinte
                const elDet = document.getElementById(ids[cont1 + k]);
                if (!elDet) continue;



                let x2, y2;
                x2 = parseFloat(elDet.getAttribute("cx"));
                y2 = parseFloat(elDet.getAttribute("cy"));

                generateArrow(x1, y1, x2, y2, r = 20)
                //console.log("aqui")
                //console.log(ids.length);



            }


        }
        cont2 += estrutura[i];
        cont1 += estrutura[i + 1];

    }

    // ========== GERAÇÃO DE LINHAS DA ENTRADA -> NEURÔNIO ============  100%
    
    for(i = 0; i < estrutura[colunas-1]; i++){
        const init = ids_func.length - estrutura[colunas -1];
        console.log(init);
        console.log(ids_func);
        console.log(ids_func[init + i])
        let eporigem = document.getElementById(ids_func[init + i]);
        let p = eporigem.points.getItem(0);

        if(!eporigem) continue;
        
        let x1, y1;
        x1 = parseFloat(p.x + 40);
        y1 = parseFloat(p.y + 20);

        console.log(x1);
        console.log(y1);
        

        const init2 = ids_square.length - estrutura[colunas -1];
                console.log(init2);
        const eqDest = document.getElementById(ids_square[init2 + i]);
        console.log(eqDest)
        if(!eqDest) continue;
        console.log("aqui")
        const x2 = parseFloat(eqDest.getAttribute('x'));
        const y2 = parseFloat(eqDest.getAttribute('y')) + 20;
       
        generateArrow(x1, y1, x2, y2, r = 0);
        


        

    }



// seu SVG já criado e adicionado ao DOM
svgPanZoom(svg, {
    zoomEnabled: true,
    controlIconsEnabled: false,
    fit: false,
    center: false,
    minZoom: 0.5,
    maxZoom: 3
});

}


