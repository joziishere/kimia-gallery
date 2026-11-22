(function () {
  var track = document.getElementById('reelTrack');
  if (!track) return;
  var reel = track.closest('.reel');
  var dotsWrap = document.querySelector('.reel-dots');
  var slides = Array.prototype.slice.call(track.children);
  var dots = Array.prototype.slice.call(document.querySelectorAll('.reel-dot'));
  var nowEl = document.getElementById('reelNow');
  var totalEl = document.getElementById('reelTotal');
  var prev = document.getElementById('reelPrev');
  var next = document.getElementById('reelNext');
  var langBtn = document.getElementById('langBtn');
  var current = 0;
  var FA = '۰۱۲۳۴۵۶۷۸۹';

  function pad(n) {
    var s = ('0' + n).slice(-2);
    if (document.documentElement.lang === 'fa') {
      s = s.replace(/\d/g, function (d) { return FA[d]; });
    }
    return s;
  }

  function render() {
    slides.forEach(function (slide, i) {
      slide.classList.toggle('is-active', i === current);
    });
    dots.forEach(function (dot, i) {
      var on = i === current;
      dot.classList.toggle('is-active', on);
      if (on) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
    if (nowEl) nowEl.textContent = pad(current + 1);
    if (totalEl) totalEl.textContent = pad(slides.length);
  }

  function slideCenter(i) {
    return slides[i].offsetLeft + slides[i].offsetWidth / 2;
  }

  function goTo(i) {
    current = (i + slides.length) % slides.length;
    track.scrollTo({
      left: slideCenter(current) - track.clientWidth / 2,
      behavior: 'smooth'
    });
    render();
  }

  function nearestIndex() {
    var mid = track.scrollLeft + track.clientWidth / 2;
    var best = 0;
    var bestDist = Infinity;
    slides.forEach(function (slide, i) {
      var d = Math.abs(slideCenter(i) - mid);
      if (d < bestDist) { bestDist = d; best = i; }
    });
    return best;
  }

  var settle;
  track.addEventListener('scroll', function () {
    clearTimeout(settle);
    settle = setTimeout(function () {
      var i = nearestIndex();
      if (i !== current) {
        current = i;
        render();
      }
    }, 90);
  }, { passive: true });

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      track.scrollTo({
        left: slideCenter(current) - track.clientWidth / 2,
        behavior: 'instant'
      });
    }, 120);
  });

  track.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(current - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1); }
  });

  prev.addEventListener('click', function () { goTo(current - 1); });
  next.addEventListener('click', function () { goTo(current + 1); });
  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () { goTo(i); });
  });
  if (langBtn) langBtn.addEventListener('click', function () { setTimeout(render, 0); });

  render();

  if (slides.length < 2) return;

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        reel.classList.toggle('is-running', entry.isIntersecting);
      });
    }, { threshold: .55 }).observe(reel);
  } else {
    reel.classList.add('is-running');
  }

  dotsWrap.addEventListener('animationend', function (e) {
    if (e.animationName !== 'reel-progress') return;
    if (!e.target.classList.contains('is-active')) return;
    goTo(current + 1);
  });

  document.addEventListener('visibilitychange', function () {
    reel.classList.toggle('is-paused', document.hidden);
  });
})();
