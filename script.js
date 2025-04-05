document.addEventListener('DOMContentLoaded', () => {

  // --- Configurações ---
  const COUNTDOWN_END_DATE = new Date('2025-12-31T23:59:59'); // !! IMPORTANTE: Defina a data final REAL da sua promoção !!

  // --- Elementos do DOM ---
  const countdownTimerElement = document.getElementById('countdown-timer');
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const faqItems = document.querySelectorAll('.faq-item');
  const currentYearElement = document.getElementById('current-year');
  const internalLinks = document.querySelectorAll('a[href^="#"]');

  // --- Funções ---

  /**
   * Inicia ou atualiza o contador regressivo.
   */
  function updateCountdown() {
    if (!countdownTimerElement) return;

    const now = new Date().getTime();
    const timeRemaining = COUNTDOWN_END_DATE - now;

    if (timeRemaining <= 0) {
      countdownTimerElement.innerHTML = "Oferta Encerrada!";
      // Opcional: esconder a seção inteira ou mudar o texto
      // document.querySelector('.countdown-section')?.classList.add('hidden');
      return;
    }

    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    // Formato: 02d 10h 05m 30s (ou ajuste conforme preferir)
     countdownTimerElement.innerHTML = `
       ${days > 0 ? `${String(days).padStart(2, '0')}d ` : ''}
       ${String(hours).padStart(2, '0')}h
       ${String(minutes).padStart(2, '0')}m
       ${String(seconds).padStart(2, '0')}s
     `;

    // Atualiza a cada segundo
    setTimeout(updateCountdown, 1000);
  }

  /**
   * Controla a abertura e fechamento do menu de navegação mobile.
   */
  function toggleNavMenu() {
    if (!navMenu || !navToggle) return;

    const isActive = navMenu.classList.toggle('is-active');
    navToggle.setAttribute('aria-expanded', isActive);
    navToggle.setAttribute('aria-label', isActive ? 'Fechar menu' : 'Abrir menu');

    // Opcional: Travar scroll do body quando menu estiver aberto
    // document.body.style.overflow = isActive ? 'hidden' : '';
  }

  /**
   * Controla a expansão e colapso dos itens do FAQ.
   * @param {Event} event - O evento de clique.
   */
  function toggleFaqItem(event) {
    const button = event.currentTarget;
    const answer = document.getElementById(button.getAttribute('aria-controls'));
    if (!answer) return;

    const isExpanded = button.getAttribute('aria-expanded') === 'true';

    // Fecha todos os outros itens (opcional - acordeão)
    // faqItems.forEach(item => {
    //   const otherButton = item.querySelector('.faq-question');
    //   const otherAnswer = item.querySelector('.faq-answer');
    //   if (otherButton !== button && otherButton.getAttribute('aria-expanded') === 'true') {
    //     otherButton.setAttribute('aria-expanded', 'false');
    //     otherAnswer.setAttribute('hidden', '');
    //      // Resetar max-height para animação
    //     otherAnswer.style.maxHeight = null;
    //   }
    // });

    // Abre ou fecha o item atual
    button.setAttribute('aria-expanded', !isExpanded);
    if (!isExpanded) {
      answer.removeAttribute('hidden');
      // Define max-height para a altura real do conteúdo para animar
      answer.style.maxHeight = answer.scrollHeight + 'px';
       // Adiciona padding de volta após a animação de abertura (se necessário)
      // setTimeout(() => {
      //    if (button.getAttribute('aria-expanded') === 'true') { // Verifica se ainda está aberto
      //        answer.style.paddingTop = 'var(--spacing-md)';
      //        answer.style.paddingBottom = 'var(--spacing-md)';
      //    }
      // }, 500); // Tempo da transição CSS
    } else {
       // Remove padding antes de animar o fechamento
      // answer.style.paddingTop = '0';
      // answer.style.paddingBottom = '0';
      answer.style.maxHeight = null; // Anima para 0
       // Esconde após a animação
        answer.addEventListener('transitionend', () => {
             if (button.getAttribute('aria-expanded') === 'false') { // Garante que só esconde se ainda estiver fechado
                 answer.setAttribute('hidden', '');
             }
        }, { once: true }); // Remove o listener após executar uma vez
    }
  }

  /**
   * Atualiza o ano no rodapé.
   */
  function updateCopyrightYear() {
    if (currentYearElement) {
      currentYearElement.textContent = new Date().getFullYear();
    }
  }

   /**
   * Adiciona smooth scrolling para links internos.
   * @param {Event} event - O evento de clique.
   */
   function smoothScroll(event) {
       const link = event.currentTarget;
       const targetId = link.getAttribute('href');

       // Verifica se é um link interno válido
       if (targetId.startsWith('#') && targetId.length > 1) {
           const targetElement = document.getElementById(targetId.substring(1));

           if (targetElement) {
               event.preventDefault(); // Previne o salto padrão

               // Fecha o menu mobile se estiver aberto antes de rolar
               if (navMenu && navMenu.classList.contains('is-active')) {
                   toggleNavMenu();
               }

               const headerOffset = document.querySelector('.site-header')?.offsetHeight || 0;
               const elementPosition = targetElement.getBoundingClientRect().top;
               const offsetPosition = elementPosition + window.pageYOffset - headerOffset - 20; // 20px extra de espaço

               window.scrollTo({
                   top: offsetPosition,
                   behavior: "smooth"
               });

               // Opcional: Focar no elemento alvo após a rolagem para acessibilidade
               // setTimeout(() => {
               //     targetElement.focus({ preventScroll: true }); // preventScroll evita outro salto
               //     // Adiciona/remove tabindex se necessário para elementos não focáveis por padrão
               //     if (targetElement.getAttribute('tabindex') === null) {
               //          targetElement.setAttribute('tabindex', '-1');
               //          targetElement.addEventListener('blur', () => targetElement.removeAttribute('tabindex'), { once: true });
               //     }
               // }, 1000); // Ajuste o tempo conforme a duração do scroll
           }
       }
   }


  // --- Inicialização e Event Listeners ---

  // Inicia o contador
  updateCountdown();

  // Atualiza o ano do copyright
  updateCopyrightYear();

  // Menu Hamburger
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', toggleNavMenu);
  }

  // FAQ Accordion
  faqItems.forEach(item => {
    const button = item.querySelector('.faq-question');
    if (button) {
      button.addEventListener('click', toggleFaqItem);
    }
  });

   // Smooth Scroll
    internalLinks.forEach(link => {
        link.addEventListener('click', smoothScroll);
    });

});
