// Simple, reusable slider for each .slider[data-slider]
document.addEventListener('DOMContentLoaded', () => {
    const sliders = document.querySelectorAll('[data-slider]');
  
    sliders.forEach(initSlider);
  
    function initSlider(slider) {
      const track = slider.querySelector('.slides');
      const imgs = Array.from(track.querySelectorAll('img'));
      const prev = slider.querySelector('.prev');
      const next = slider.querySelector('.next');
      const dotsWrap = slider.querySelector('.dots');
      const total = imgs.length;
      let index = 0;
      let startX = 0;
      let currentX = 0;
      let dragging = false;
  
      // Build dots
      imgs.forEach((_, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', `Go to slide ${i + 1}`);
        b.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(b);
      });
  
      function update() {
        track.style.translate = `-${index * 100}% 0`;
        dotsWrap.querySelectorAll('button').forEach((b, i) => {
          b.setAttribute('aria-current', i === index ? 'true' : 'false');
        });
      }
  
      function goTo(i) {
        index = (i + total) % total;
        update();
      }
  
      prev.addEventListener('click', () => goTo(index - 1));
      next.addEventListener('click', () => goTo(index + 1));
  
      // Basic drag / swipe
      track.addEventListener('pointerdown', (e) => {
        dragging = true;
        startX = e.clientX;
        currentX = startX;
        track.setPointerCapture(e.pointerId);
        track.style.transition = 'none';
      });
  
      track.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        currentX = e.clientX;
        const dx = currentX - startX;
        track.style.translate = `calc(${-index * 100}% + ${dx}px) 0`;
      });
  
      const endDrag = (e) => {
        if (!dragging) return;
        dragging = false;
        track.releasePointerCapture?.(e.pointerId);
        track.style.transition = ''; // restore
        const dx = currentX - startX;
  
        // swipe threshold
        if (dx > 60) goTo(index - 1);
        else if (dx < -60) goTo(index + 1);
        else update();
      };
  
      track.addEventListener('pointerup', endDrag);
      track.addEventListener('pointercancel', endDrag);
      track.addEventListener('pointerleave', endDrag);
  
      // Optional auto-play (uncomment if you want)
      // setInterval(() => goTo(index + 1), 5000);
  
      update();
    }
  });
  