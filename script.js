let fase = 0;
let segundaChance = false;

const msg = document.getElementById("mensagem");
const naoBtn = document.getElementById("naoBtn");
const simBtn = document.getElementById("simBtn");
const textoBox = document.getElementById("textoContainer");
const fraseInput = document.getElementById("fraseInput");
const confirmarTexto = document.getElementById("confirmarTexto");
const erroTexto = document.getElementById("erroTexto");

// FRASES DAS PROVAS
const frasesSecretas = [
  "Eu realmente quero, meu príncipe!",
  "Eu te amo e quero ver o presente!",
  "Tá bom, eu admito, você venceu! ❤️"
];

const mensagens = [
  "Calma aí 😂 responde o outro botão primeiro!", // fase 0
  "Tem certeza que não quer ver? 👀",              // fase 1
  "Sério isso??? 😳",                              // fase 2
  "Última chance, hein 😤",                        // usada após vírus
  "Digite exatamente a frase abaixo 👇"            // fase da prova
];

// =======================
// OVERLAY DA TELA PRETA
// =======================
const overlay = document.createElement("div");
overlay.id = "virusOverlay";
overlay.style = `
  display: none;
  opacity: 0;
  transition: opacity .5s ease-in-out;
  background: black;
  color: white;
  z-index: 99999;
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  justify-content: center;
  align-items: center;
  text-align: center;
`;
overlay.innerHTML = `<p id="virusText" style="font-size:2em;"></p>`;
document.body.appendChild(overlay);


// =======================
// FUNÇÃO DO VÍRUS
// =======================
function iniciarTelaPretaVirus(callback = null) {
  overlay.style.display = "flex";
  setTimeout(() => overlay.style.opacity = "1", 10);

  let count = 5;
  const virusText = document.getElementById("virusText");
  virusText.textContent = `Injetando vírus em ${count}...`;

  const timer = setInterval(() => {
    if (count > 0) {
      count--;
      virusText.textContent = `Injetando vírus em ${count}...`;
    } else {
      clearInterval(timer);
      virusText.innerHTML = `
        Brincadeira kkkkkk 😂<br><br>
        APERTA <strong>SIM</strong> LOGO, CASSETA 😡
      `;

      setTimeout(() => {
        overlay.style.opacity = "0";
        setTimeout(() => {
          overlay.style.display = "none";

          if (callback) callback();
        }, 500);
      }, 1500);
    }
  }, 700);
}


// =======================
// FASE DE PROVA
// =======================
function iniciarFaseDeProva() {
  textoBox.classList.remove("hidden");

  const frase = frasesSecretas[Math.min(Math.floor(fase / 6), frasesSecretas.length - 1)];

  msg.innerHTML = `
    ${mensagens[4]}
    <p><strong>"${frase}"</strong></p>
    <p>Então prova 😏</p>
    <p>Escreve exatamente:</p>
    <p><strong>"${frase}"</strong></p>
  `;

  fraseInput.value = "";
}


// =======================
// BOTÃO SIM
// =======================
simBtn.onclick = () => {

  // Dois primeiros SIM → vai direto para presente.html
  if (fase === 0 || fase === 1) {
    window.location.href = "presente.html";
    return;
  }

  // Depois do vírus → vai para a prova
  if (fase === 2) {
    fase = 3;
    iniciarFaseDeProva();
    return;
  }

  // Fase da prova → só termina depois da frase
  if (fase >= 3 && !segundaChance) {
    msg.textContent = "Precisa escrever a frase primeiro 😏";
    return;
  }

  // Segunda chance → SIM abre o presente
  if (segundaChance) {
    window.location.href = "presente.html";
  }
};


// =======================
// BOTÃO NÃO
// =======================
naoBtn.onclick = () => {

  // NÃO fugindo do sim → começa o vírus
  if (fase === 0) {
    fase = 1;
    msg.textContent = mensagens[1];
    return;
  }

  if (fase === 1) {
    fase = 2;
    msg.textContent = mensagens[2];
    return;
  }

  // Após fase 2 → vírus + "Última chance"
  if (fase === 2) {
    iniciarTelaPretaVirus(() => {
      msg.textContent = mensagens[3];
    });
    return;
  }

  // Se clicar NÃO depois da "última chance": vírus de novo
  if (fase === 3 && !segundaChance) {
    iniciarTelaPretaVirus(() => {
      msg.textContent = mensagens[3];
    });
    return;
  }

  // Segunda chance: NÃO foge do mouse (JS do mouse controla)
};


// =======================
// CONFIRMAÇÃO DA FRASE CORRETA
// =======================
confirmarTexto.onclick = () => {
  const frase = frasesSecretas[Math.min(Math.floor(fase / 6), frasesSecretas.length - 1)];

  if (fraseInput.value.trim() === frase) {
    erroTexto.textContent = "";
    msg.textContent = "Hmmmm ok 😏 vou te dar uma nova chance...";

    segundaChance = true;

    setTimeout(() => {
      textoBox.classList.add("hidden");
      msg.textContent = "Agora escolhe direitinho 😌";
    }, 1200);

  } else {
    erroTexto.textContent = "Tem que ser exatamente igual 😒";
  }
};


// =======================
// BOTÃO NÃO FOGE DO MOUSE (segunda chance)
// =======================
document.addEventListener("mousemove", (e) => {
  if (!segundaChance) return;

  const btn = naoBtn.getBoundingClientRect();
  const mouseX = e.clientX;
  const mouseY = e.clientY;

  const btnCenterX = btn.left + btn.width / 2;
  const btnCenterY = btn.top + btn.height / 2;

  const distX = Math.abs(mouseX - btnCenterX);
  const distY = Math.abs(mouseY - btnCenterY);

  // Se o mouse estiver perto
  if (distX < 120 && distY < 120) {

    // Limites da tela
    const novaLeft = Math.max(0, Math.min(window.innerWidth - btn.width - 10, Math.random() * window.innerWidth));
    const novaTop = Math.max(0, Math.min(window.innerHeight - btn.height - 10, Math.random() * window.innerHeight));

    naoBtn.style.position = "absolute";
    naoBtn.style.left = `${novaLeft}px`;
    naoBtn.style.top = `${novaTop}px`;
  }
});
