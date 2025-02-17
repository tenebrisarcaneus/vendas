// Contador regressivo de 24h
function iniciarContador() {
  const dataFinal = new Date();
  dataFinal.setDate(dataFinal.getDate() + 1); // expira em 24h
  const contador = document.getElementById("contador");
  const interval = setInterval(() => {
    const agora = new Date().getTime();
    const tempoRestante = dataFinal - agora;
    const horas = Math.floor((tempoRestante % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((tempoRestante % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((tempoRestante % (1000 * 60)) / 1000);
    contador.innerHTML = `${horas}h ${minutos}m ${segundos}s`;
    if (tempoRestante < 0) {
      clearInterval(interval);
      contador.innerHTML = "Promoção Expirada!";
    }
  }, 1000);
}
iniciarContador();

// Toggle do menu hamburger em telas pequenas
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('active');
});