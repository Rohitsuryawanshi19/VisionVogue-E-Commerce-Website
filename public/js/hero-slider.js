// ===================== Hero Image Slider =====================
document.addEventListener('DOMContentLoaded', () => {
  const slider = document.getElementById('heroSlider');
  if (!slider) return;

  const slides = Array.from(slider.querySelectorAll('.hero-slide'));
  const dots = Array.from(slider.querySelectorAll('.hero-dot'));
  const prevBtn = slider.querySelector('.hero-arrow.prev');
  const nextBtn = slider.querySelector('.hero-arrow.next');

  let current = 0;
  let timer = null;
  const INTERVAL = 4000;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAutoplay() {
    stopAutoplay();
    timer = setInterval(next, INTERVAL);
  }
  function stopAutoplay() {
    if (timer) clearInterval(timer);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); startAutoplay(); });
  });
  nextBtn?.addEventListener('click', () => { next(); startAutoplay(); });
  prevBtn?.addEventListener('click', () => { prev(); startAutoplay(); });

  slider.addEventListener('mouseenter', stopAutoplay);
  slider.addEventListener('mouseleave', startAutoplay);

  startAutoplay();
});
