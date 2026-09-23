/**
 * SHRIYA.S - PORTFOLIO INTERACTION & ANIMATION ENGINE
 * Shriya Sharma Portfolio
 */

// Immediate scroll restoration fix before DOM is fully parsed
if (typeof history !== 'undefined' && 'scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
if (typeof window !== 'undefined') {
  window.scrollTo(0, 0);
}

document.addEventListener('DOMContentLoaded', () => {
  // Enforce manual scroll restoration
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  // Register GSAP plugins if available
  if (typeof gsap !== 'undefined') {
    gsap.config({ nullTargetWarn: false });
    if (typeof CustomEase !== 'undefined') {
      CustomEase.create('pagein', '0.25, 0.1, 0.1, 0.95');
      CustomEase.create('moveEase', '0.5, 0, 0.2, 1');
      CustomEase.create('scaleEase', '0.4, 0, 0.2, 0.95');
      CustomEase.create('relaxed', 'M0,0 C0.7,0 0.3,1 1,1');
      CustomEase.create('relaxed2', 'M0,0 C0.7,0 0.3,1 1,1');
      CustomEase.create('relaxed3', 'M0,0 C0.7,0 0.3,1 1,1');
    }
  }

  // --- LENIS SMOOTH SCROLL ---
  let lenis = null;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    });

    // Reset scroll position in Lenis immediately
    lenis.scrollTo(0, { immediate: true });

    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  }

  // --- UNIVERSAL SCROLL-TO-TOP HELPER ---
  function forceScrollToTop(immediate = true) {
    if (lenis) {
      if (immediate) {
        lenis.scrollTo(0, { immediate: true });
      } else {
        lenis.scrollTo(0, {
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      }
    }
    if (immediate) {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Ensure scroll is at 0 immediately
  forceScrollToTop(true);

  // --- UNIVERSAL LOGO CLICK (SCROLL TO TOP / START FROM TOP) ---
  document.querySelectorAll('.nav_brand').forEach((brand) => {
    brand.addEventListener('click', (e) => {
      const brandHref = (brand.getAttribute('href') || '').split('#')[0].replace(/^\.\//, '');
      const currentFile = window.location.pathname.split('/').pop() || 'index.html';

      if (
        brandHref === currentFile ||
        ((brandHref === 'index.html' || brandHref === '') &&
          (currentFile === '' || currentFile === 'index.html'))
      ) {
        e.preventDefault();
        forceScrollToTop(false);
      }
    });
  });

  // Global window event listeners ensuring top scroll on load / bfcache
  window.addEventListener('load', () => forceScrollToTop(true));
  window.addEventListener('pageshow', () => forceScrollToTop(true));
  window.addEventListener('beforeunload', () => window.scrollTo(0, 0));

  // --- PRELOADER & INTRO TIMELINE ---
  const loaderWrapper = document.querySelector('.page-loader-wrapper');
  const loaderWrappers = document.querySelectorAll('.preload-img-wrapper');
  const loaderImages = document.querySelectorAll('.preload-img-wrapper img');
  const loaderTags = document.querySelectorAll('.preload-card-tag');
  const progressBar = document.getElementById('loaderProgressBar');
  const counterEl = document.querySelector('[data-counter="true"]');
  const mainWrapper = document.querySelector('.main-wrapper');
  const pageContainer = document.querySelector('.page-wrapper');
  const navAbsolute = document.querySelector('.nav_absolute');
  const heroText = document.querySelector('.hero-heading-text');

  if (loaderWrapper && loaderWrappers.length > 0) {
    if (lenis) lenis.stop();
    forceScrollToTop(true);

    let isCompleted = false;
    const completeLoader = () => {
      if (isCompleted) return;
      isCompleted = true;

      // Force top position before revealing page
      forceScrollToTop(true);

      if (loaderWrapper) {
        loaderWrapper.style.transition = 'opacity 0.5s ease';
        loaderWrapper.style.opacity = '0';
        setTimeout(() => {
          loaderWrapper.style.display = 'none';
        }, 500);
      }
      if (pageContainer && typeof gsap !== 'undefined') gsap.set(pageContainer, { clearProps: 'all' });
      if (mainWrapper && typeof gsap !== 'undefined') gsap.set(mainWrapper, { clearProps: 'all' });

      if (lenis) {
        lenis.start();
        forceScrollToTop(true);
      }

      initPageAnimations();

      // Double-enforce scroll at top and calibrate ScrollTrigger
      requestAnimationFrame(() => {
        forceScrollToTop(true);
        if (typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.refresh();
        }
      });
    };

    // Safety fallback timeout (3.4s maximum wait)
    setTimeout(completeLoader, 3400);

    if (typeof gsap !== 'undefined') {
      const rotations = [-5.5, 5, -2.5, 4.5, -1];
      gsap.set(loaderWrappers, { scale: 0, opacity: 0 });
      gsap.set(loaderImages, { scale: 1.5, opacity: 0 });
      if (loaderTags.length > 0) gsap.set(loaderTags, { y: -8, opacity: 0 });
      gsap.set(mainWrapper, { scale: 1.05, transformOrigin: '50% 0%' });
      if (navAbsolute) gsap.set(navAbsolute, { opacity: 0 });

      const counterObj = { value: 0 };
      const tl = gsap.timeline({
        defaults: { duration: 0.8, ease: 'power3.out' },
        onComplete: completeLoader
      });

      tl.to(loaderWrappers, {
        scale: 1,
        opacity: 1,
        rotation: (i) => rotations[i % rotations.length],
        stagger: 0.26,
        ease: 'back.out(1.12)',
      });

      tl.to(loaderImages, {
        scale: 1,
        opacity: 1,
        stagger: 0.26,
        ease: 'power3.out',
      }, '<');

      if (loaderTags.length > 0) {
        tl.to(loaderTags, {
          y: 0,
          opacity: 1,
          stagger: 0.26,
          duration: 0.45,
          ease: 'power2.out',
        }, '<+=0.1');
      }

      tl.to(counterObj, {
        value: 100,
        duration: 1.8,
        ease: 'power2.inOut',
        onUpdate: () => {
          const val = Math.round(counterObj.value);
          if (counterEl) {
            counterEl.textContent = `${val}%`;
          }
          if (progressBar) {
            progressBar.style.width = `${val}%`;
          }
        }
      }, '<');

      // Refined exit transition
      tl.to(loaderWrappers, {
        scale: 0.94,
        opacity: 0,
        stagger: 0.04,
        duration: 0.45,
        ease: 'power2.in',
      }, '+=0.15');

      tl.add(() => {
        forceScrollToTop(true);
      }, '-=0.35');

      tl.to(loaderWrapper, {
        opacity: 0,
        duration: 0.55,
        ease: 'power2.inOut',
      }, '-=0.25');

      tl.to(mainWrapper, {
        scale: 1,
        duration: 1,
        ease: 'power2.out',
      }, '-=0.4');

      if (navAbsolute) {
        tl.to(navAbsolute, {
          opacity: 1,
          duration: 0.4,
          ease: 'power2.out',
        }, '-=0.35');
      }

      if (heroText) {
        if (window.innerWidth > 991) {
          tl.fromTo(
            heroText,
            { xPercent: -50, yPercent: -35, opacity: 0 },
            {
              xPercent: -50,
              yPercent: -50,
              opacity: 1,
              duration: 0.8,
              ease: 'power2.out',
            },
            '-=0.5'
          );
        } else {
          tl.fromTo(
            heroText,
            { y: 15, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: 'power2.out',
              clearProps: 'transform',
            },
            '-=0.5'
          );
        }
      }
    } else {
      completeLoader();
    }
  } else {
    forceScrollToTop(true);
    initPageAnimations();
    requestAnimationFrame(() => {
      forceScrollToTop(true);
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    });
  }

  // --- INITIALIZE ALL PAGE ANIMATIONS ---
  function initPageAnimations() {
    initDynamicCursor();
    initSplitWordReveals();
    initLoadAnimateLines();
    initMagneticButtons();
    initProjectVideoHovers();
    initPreviewFollower();
    initTestimonialsSlider();
    initServicesSticky();
    initHeroAboutParallax();
    initAanpakCards();
    initFooterParallax();
    initPhotoSequenceHover();
    initNavigationDrawer();
    initMenuColorChanger();
    initLiveTimer();
    initContactForm();
    initVisibilityChangeTitle();
    initTextLinkUnderlines();
    initReelCarousel();

    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  }

  // --- TAB VISIBILITY CHANGE TITLE ---
  function initVisibilityChangeTitle() {
    const originalTitle = document.title;
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        document.title = 'Fancy a coffee? ☕';
      } else {
        document.title = originalTitle;
      }
    });
  }

  // --- LIVE AMSTERDAM DIGITAL CLOCK ---
  function initLiveTimer() {
    const timerEls = document.querySelectorAll('.timer');
    if (!timerEls.length) return;

    function updateTime() {
      const timeStr = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(new Date());

      timerEls.forEach((el) => (el.textContent = timeStr));
    }

    updateTime();
    setInterval(updateTime, 1000);
  }

  // --- DYNAMIC TEXT CURSOR ---
  function initDynamicCursor() {
    const cursor = document.querySelector('[data-cursor]');
    const cursorText = document.querySelector('[data-cursor-text-target]');
    if (!cursor || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    let mouseX = 0, mouseY = 0;
    let hasMoved = false;

    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.25, ease: 'power3.out' });
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.25, ease: 'power3.out' });

    function updateCursor() {
      const hoverItem = document.elementFromPoint(mouseX, mouseY)?.closest('[data-cursor-hover]');
      const rect = cursor.getBoundingClientRect();
      const isHovering = !!hoverItem;
      const isEdge = rect.right >= window.innerWidth - 10;

      cursor.setAttribute('data-cursor', isHovering ? (isEdge ? 'active-edge' : 'active') : '');

      if (hoverItem && cursorText) {
        const text = hoverItem.getAttribute('data-cursor-text') || 'View';
        cursorText.textContent = text;
      }
    }

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!hasMoved) {
        gsap.set(cursor, { x: mouseX, y: mouseY });
        hasMoved = true;
      }
      xTo(mouseX);
      yTo(mouseY);
      requestAnimationFrame(updateCursor);
    });

    window.addEventListener('scroll', () => {
      if (hasMoved) requestAnimationFrame(updateCursor);
    }, { passive: true });
  }

  // --- SPLIT TEXT & WORD REVEALS ---
  function initSplitWordReveals() {
    const wordRevealEls = document.querySelectorAll('[data-word-reveal="true"]');
    wordRevealEls.forEach((el) => {
      if (el.dataset.splitDone) return;
      el.dataset.splitDone = 'true';

      function wrapTextNodes(node) {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent;
          if (!text.trim()) return;
          const words = text.split(/(\s+)/);
          const frag = document.createDocumentFragment();
          words.forEach((w) => {
            if (/^\s+$/.test(w)) {
              frag.appendChild(document.createTextNode(w));
            } else if (w.length > 0) {
              const wrap = document.createElement('span');
              wrap.className = 'word-wrap';
              wrap.style.cssText = 'overflow:hidden; display:inline-block; vertical-align:bottom;';
              const inner = document.createElement('span');
              inner.className = 'split-word';
              inner.style.cssText = 'display:inline-block; transform:translateY(105%); will-change:transform;';
              inner.textContent = w;
              wrap.appendChild(inner);
              frag.appendChild(wrap);
            }
          });
          node.parentNode.replaceChild(frag, node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          Array.from(node.childNodes).forEach(wrapTextNodes);
        }
      }

      Array.from(el.childNodes).forEach(wrapTextNodes);

      const splitWords = el.querySelectorAll('.split-word');
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 88%',
          once: true,
          onEnter: () => {
            gsap.to(splitWords, {
              y: '0%',
              duration: 0.65,
              stagger: 0.012,
              ease: 'power3.out',
            });
          }
        });
      } else {
        gsap.to(splitWords, { y: '0%', duration: 0.65, stagger: 0.012, ease: 'power3.out' });
      }
    });
  }

  function initLoadAnimateLines() {
    const loadEls = document.querySelectorAll('[data-load-animate="true"]');
    loadEls.forEach((el) => {
      if (el.dataset.splitDone) return;
      el.dataset.splitDone = 'true';

      const words = el.innerText.split(' ');
      el.innerHTML = words
        .map((w) => `<span class="word-wrap" style="overflow:hidden; display:inline-block; vertical-align:bottom;"><span class="split-word" style="display:inline-block; transform:translateY(105%); will-change:transform;">${w}&nbsp;</span></span>`)
        .join('');

      const splitWords = el.querySelectorAll('.split-word');
      gsap.to(splitWords, {
        y: '0%',
        duration: 0.8,
        delay: 0.2,
        stagger: 0.02,
        ease: 'power4.out',
      });
    });
  }

  // --- MAGNETIC BUTTONS ---
  function initMagneticButtons() {
    if (window.innerWidth <= 992) return;
    const buttons = document.querySelectorAll('.get-in-touch-button');

    buttons.forEach((button) => {
      const inner = button.querySelector('.get-in-touch-button-link');
      const reach = 40;
      const innerReach = 15;

      button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const offsetX = e.clientX - rect.left - rect.width / 2;
        const offsetY = e.clientY - rect.top - rect.height / 2;

        gsap.to(button, {
          x: (offsetX / rect.width) * reach,
          y: (offsetY / rect.height) * reach,
          duration: 0.2,
          ease: 'power1.out',
        });

        if (inner) {
          gsap.to(inner, {
            x: (offsetX / rect.width) * innerReach,
            y: (offsetY / rect.height) * innerReach,
            duration: 0.3,
            ease: 'power2.out',
          });
        }
      });

      button.addEventListener('mouseleave', () => {
        gsap.to(button, {
          x: 0,
          y: 0,
          duration: 0.8,
          ease: 'elastic.out(1.1, 0.45)',
        });
        if (inner) {
          gsap.to(inner, {
            x: 0,
            y: 0,
            duration: 0.8,
            ease: 'elastic.out(1.15, 0.4)',
          });
        }
      });
    });
  }

  // --- HERO BUTTON HOVER WITH SLIDING INNER ACCENT PILL ---
  document.querySelectorAll('[button="hover"]').forEach((button) => {
    const inner = button.querySelector('.inner-hover-color');
    const textLink = button.querySelector('.get-in-touch-button-link');

    if (inner) {
      gsap.set(inner, { y: '100%' });

      button.addEventListener('mouseenter', () => {
        gsap.killTweensOf(inner);
        if (textLink) gsap.killTweensOf(textLink);

        const curY = gsap.getProperty(inner, 'y');
        if (curY === '-100%' || curY === -inner.offsetHeight) {
          gsap.set(inner, { y: '100%' });
        }

        const tl = gsap.timeline({ defaults: { overwrite: 'auto' } });
        tl.to(inner, { y: '0%', duration: 0.35, ease: 'power2.out' });
        if (textLink) tl.to(textLink, { color: '#ffffff', duration: 0.2, ease: 'power2.out' }, 0);
      });

      button.addEventListener('mouseleave', () => {
        gsap.killTweensOf(inner);
        if (textLink) gsap.killTweensOf(textLink);

        const tl = gsap.timeline({
          defaults: { overwrite: 'auto' },
          onComplete: () => {
            gsap.set(inner, { y: '100%' });
          },
        });
        tl.to(inner, { y: '-100%', duration: 0.35, ease: 'power2.inOut' });
        if (textLink) tl.to(textLink, { color: '#121212', duration: 0.25, ease: 'power2.out' }, 0.05);
      });
    }
  });

  // --- UNIFIED INTERACTIVE PILL BUTTON HOVER ENGINE ---
  document.querySelectorAll('[mainbutton="hover"], [secundarybutton="hover"]').forEach((button) => {
    const inner = button.querySelector('.inner-hover-color');
    const circle = button.querySelector('.button-circle');
    const star = button.querySelector('.main-button-star-svg');
    const isDarkVariant = button.classList.contains('w-variant-a8c88042-9262-59ed-8e1d-ffe36bb3bdc4');

    if (inner) {
      gsap.set(inner, { y: '100%' });

      button.addEventListener('mouseenter', () => {
        const tl = gsap.timeline({ defaults: { overwrite: 'auto' } });
        tl.to(inner, { y: '0%', duration: 0.35, ease: 'power2.inOut' });

        if (!isDarkVariant) {
          tl.to(button, { color: '#ffffff', duration: 0.2, ease: 'power2.in' }, 0);
        }

        if (circle) {
          tl.to(circle, {
            x: 4,
            scale: 1.08,
            backgroundColor: '#ee4b2b',
            color: '#ffffff',
            boxShadow: '0 4px 14px rgba(238, 75, 43, 0.4)',
            duration: 0.25,
            ease: 'power2.out',
          }, 0);
        }

        if (star) {
          tl.to(star, { rotate: 45, duration: 0.3, ease: 'power2.out' }, 0);
        }
      });

      button.addEventListener('mouseleave', () => {
        const tl = gsap.timeline({
          defaults: { overwrite: 'auto' },
          onComplete: () => gsap.set(inner, { y: '100%' }),
        });
        tl.to(inner, { y: '-100%', duration: 0.35, ease: 'power2.inOut' });

        if (!isDarkVariant) {
          tl.to(button, { color: '', duration: 0.25, ease: 'power2.out' }, 0.05);
        }

        if (circle) {
          tl.to(circle, {
            x: 0,
            scale: 1,
            clearProps: 'all',
            duration: 0.25,
            ease: 'power2.out',
          }, 0);
        }

        if (star) {
          tl.to(star, {
            rotate: 0,
            clearProps: 'all',
            duration: 0.25,
            ease: 'power2.out',
          }, 0);
        }
      });
    }
  });

  // --- PROJECT CARDS VIDEO HOVER PREVIEW ---
  function initProjectVideoHovers() {
    const projectBlocks = document.querySelectorAll('.project-link-block');
    projectBlocks.forEach((block) => {
      const videoWrapper = block.querySelector('.video-embed');
      const video = videoWrapper?.querySelector('video');
      const opacityItem = block.querySelector('.project-opacity');
      const thumbnail = block.querySelector('.project-thumbnail-img');

      if (!videoWrapper) return;
      gsap.set(videoWrapper, { opacity: 0, scale: 0.92 });

      block.addEventListener('mouseenter', () => {
        if (video) {
          video.currentTime = 0;
          video.play().catch(() => {});
        }
        gsap.to(videoWrapper, { opacity: 1, scale: 1, duration: 0.35, ease: 'power3.out' });
        if (opacityItem) gsap.to(opacityItem, { opacity: 0.4, duration: 0.35 });
        if (thumbnail) gsap.to(thumbnail, { filter: 'blur(6px)', scale: 1.04, duration: 0.35 });
      });

      block.addEventListener('mouseleave', () => {
        gsap.to(videoWrapper, { opacity: 0, scale: 0.92, duration: 0.3, ease: 'power3.in' });
        if (video) video.pause();
        if (opacityItem) gsap.to(opacityItem, { opacity: 0, duration: 0.3 });
        if (thumbnail) gsap.to(thumbnail, { filter: 'blur(0px)', scale: 1, duration: 0.3 });
      });
    });
  }

  // --- PREVIEW FOLLOWER (WORK PAGE LIST) ---
  function initPreviewFollower() {
    const wrap = document.querySelector('[data-follower-wrap]');
    if (!wrap) return;

    const follower = wrap.querySelector('[data-follower-cursor]');
    const followerInner = wrap.querySelector('[data-follower-cursor-inner]');
    const items = wrap.querySelectorAll('[data-follower-item]');
    if (!follower || !followerInner || !items.length) return;

    let hasMoved = false;
    const xTo = gsap.quickTo(follower, 'x', { duration: 0.35, ease: 'power3.out' });
    const yTo = gsap.quickTo(follower, 'y', { duration: 0.35, ease: 'power3.out' });

    window.addEventListener('mousemove', (e) => {
      if (!hasMoved) {
        gsap.set(follower, { x: e.clientX, y: e.clientY });
        hasMoved = true;
      }
      xTo(e.clientX);
      yTo(e.clientY);
    });

    items.forEach((item, index) => {
      const row = item.querySelector('.project-link-row');
      const bgAnim = row?.querySelector('.project-bg-animatie');
      const heading = row?.querySelector('h2');
      const visual = item.querySelector('[data-follower-visual] img');

      if (row && bgAnim) {
        row.addEventListener('mouseenter', () => {
          gsap.to(bgAnim, { height: '100%', duration: 0.4, ease: 'power3.out' });
          gsap.to([row, heading], { color: '#ffffff', duration: 0.2 });

          if (visual) {
            followerInner.querySelectorAll('img').forEach((img) => img.remove());
            const clone = visual.cloneNode(true);
            followerInner.appendChild(clone);
            gsap.fromTo(clone, { scale: 1.15, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'power2.out' });
          }
        });

        row.addEventListener('mouseleave', () => {
          gsap.to(bgAnim, { height: '0%', duration: 0.4, ease: 'power3.out' });
          gsap.to([row, heading], { color: '', duration: 0.2 });
        });
      }
    });
  }

  // --- TESTIMONIALS SLIDER ---
  function initTestimonialsSlider() {
    const items = document.querySelectorAll('.testimonial-item-wrapper');
    if (!items.length) return;

    const counterEl = document.querySelector('.testimonial-item-count');
    const prevBtn = document.querySelector('.arrow-prev');
    const nextBtn = document.querySelector('.arrow-next');
    let currentIndex = 0;
    let autoPlayTimer = null;

    function formatNumber(n) {
      return (n + 1).toString().padStart(2, '0');
    }

    function showItem(index) {
      if (index === currentIndex) return;

      const currentItem = items[currentIndex];
      const nextItem = items[index];

      gsap.to(currentItem, {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.inOut',
        onComplete: () => gsap.set(currentItem, { display: 'none' }),
      });

      gsap.set(nextItem, { display: 'flex', opacity: 0 });
      gsap.to(nextItem, {
        opacity: 1,
        duration: 0.5,
        delay: 0.15,
        ease: 'power2.out',
      });

      currentIndex = index;
      if (counterEl) counterEl.textContent = formatNumber(currentIndex);
      startAutoPlay();
    }

    function startAutoPlay() {
      clearInterval(autoPlayTimer);
      autoPlayTimer = setInterval(() => {
        const next = (currentIndex + 1) % items.length;
        showItem(next);
      }, 12000);
    }

    items.forEach((item, i) => {
      if (i === 0) {
        gsap.set(item, { display: 'flex', opacity: 1 });
      } else {
        gsap.set(item, { display: 'none', opacity: 0 });
      }
    });

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        gsap.fromTo(nextBtn, { scale: 0.88 }, { scale: 1, duration: 0.3, ease: 'back.out(2.5)' });
        const next = (currentIndex + 1) % items.length;
        showItem(next);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        gsap.fromTo(prevBtn, { scale: 0.88 }, { scale: 1, duration: 0.3, ease: 'back.out(2.5)' });
        const prev = (currentIndex - 1 + items.length) % items.length;
        showItem(prev);
      });
    }

    startAutoPlay();
  }

  // --- PINNED STICKY SERVICES (ABOUT PAGE) ---
  function initServicesSticky() {
    const section = document.querySelector('.section_services-pin.desktop');
    if (!section || window.innerWidth <= 991 || typeof ScrollTrigger === 'undefined') return;

    const descItems = Array.from(section.querySelectorAll('.services-sticky-content'));
    const imgWrappers = Array.from(section.querySelectorAll('.service-img-wrapper'));
    const progressBars = Array.from(section.querySelectorAll('.services-progress'));
    const titles = Array.from(section.querySelectorAll('.active-dienst-wrapper h2'));

    if (!descItems.length || !imgWrappers.length) return;

    const stepTriggers = [0, 0.25, 0.5, 0.75];
    let activeIndex = -1;

    function setActiveStep(idx) {
      if (idx === activeIndex) return;
      activeIndex = idx;

      // Update descriptions
      descItems.forEach((item, i) => {
        if (i === idx) {
          item.classList.add('is-active');
        } else {
          item.classList.remove('is-active');
        }
      });

      // Update titles
      titles.forEach((title, i) => {
        if (i === idx) {
          title.classList.add('is-active');
        } else {
          title.classList.remove('is-active');
        }
      });

      // Update image stack
      imgWrappers.forEach((img, i) => {
        img.classList.remove('is-active', 'is-prev');
        if (i === idx) {
          img.classList.add('is-active');
        } else if (i < idx) {
          img.classList.add('is-prev');
        }
      });
    }

    // Set initial active step
    setActiveStep(0);

    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const prog = self.progress;
        let idx = 0;
        for (let i = stepTriggers.length - 1; i >= 0; i--) {
          if (prog >= stepTriggers[i]) {
            idx = i;
            break;
          }
        }

        setActiveStep(idx);

        // Update progress bars precisely
        progressBars.forEach((bar, i) => {
          const start = stepTriggers[i];
          const end = stepTriggers[i + 1] || 1;
          const stepProg = Math.max(0, Math.min(1, (prog - start) / (end - start)));
          bar.style.height = `${stepProg * 100}%`;
        });
      },
    });
  }

  // --- AANPAK CARDS GEOMETRIC CHOREOGRAPHY ---
  function initAanpakCards() {
    // Card 1
    document.querySelectorAll('.aanpak-card-wrapper.card1').forEach((card) => {
      const circleFull = card.querySelector('.animation-circle-full');
      const circle = card.querySelector('.animation-circle');
      if (!circleFull || !circle) return;

      const tl = gsap.timeline({ repeat: -1, yoyo: true, repeatDelay: 0.2 });
      tl.to(circleFull, { x: '1.25em', duration: 0.8, ease: 'power2.inOut' }, 0)
        .to(circle, { x: '-1.25em', duration: 0.8, ease: 'power2.inOut' }, 0);
    });

    // Card 2
    document.querySelectorAll('.aanpak-card-wrapper.card2').forEach((card) => {
      const circles = card.querySelectorAll('.animation-circle-full');
      const circle = card.querySelector('.animation-circle');
      if (!circle || circles.length < 2) return;

      const tl = gsap.timeline({ repeat: -1 });
      tl.to(circle, { x: '-1.25em', y: '1.25em', duration: 0.8, ease: 'power2.inOut' }, 0)
        .to(circles[1], { x: '1.25em', y: '-1.25em', duration: 0.8, ease: 'power2.inOut' }, 0)
        .to({}, { duration: 0.2 })
        .to(circle, { x: '0em', y: '0em', duration: 0.8, ease: 'power2.inOut' })
        .to(circles[1], { x: '0em', y: '0em', duration: 0.8, ease: 'power2.inOut' }, '<')
        .to({}, { duration: 0.2 });
    });

    // Card 3
    document.querySelectorAll('.aanpak-card-wrapper.card3').forEach((card) => {
      const circles = card.querySelectorAll('.animation-circle-full');
      const circle = card.querySelector('.animation-circle');
      if (!circle || circles.length < 3) return;

      const tl = gsap.timeline({ repeat: -1 });
      tl.to(circles[0], { x: '1.25em', y: '1.25em', duration: 0.8, ease: 'power2.inOut' }, 0)
        .to(circle, { x: '-1.25em', y: '-1.25em', duration: 0.8, ease: 'power2.inOut' }, 0)
        .to({}, { duration: 0.2 })
        .to(circles[0], { x: '0em', y: '0em', duration: 0.8, ease: 'power2.inOut' })
        .to(circle, { x: '0em', y: '0em', duration: 0.8, ease: 'power2.inOut' }, '<')
        .to({}, { duration: 0.2 });
    });
  }

  // --- HERO ABOUT PARALLAX ---
  function initHeroAboutParallax() {
    const heroImg = document.querySelector('.img-about-paralax-wrapper');
    const heroWrap = document.querySelector('.full-width-img-wrapper.about');
    if (!heroImg || !heroWrap || typeof ScrollTrigger === 'undefined') return;

    gsap.fromTo(
      heroImg,
      { yPercent: -8 },
      {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: heroWrap,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
        }
      }
    );
  }

  // --- FOOTER PARALLAX EFFECT ---
  function initFooterParallax() {
    const footerInner = document.querySelector('[data-footer-parallax-inner]');
    const footerSection = document.querySelector('[data-footer-parallax]');
    if (!footerInner || !footerSection || typeof ScrollTrigger === 'undefined') return;

    gsap.fromTo(
      footerInner,
      { yPercent: -30 },
      {
        yPercent: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: footerSection,
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: 0.2,
        }
      }
    );
  }

  // --- PHOTO SEQUENCE HOVER (PORTRAIT ANIMATION) ---
  function initPhotoSequenceHover() {
    const photoWrappers = document.querySelectorAll('.footer-img-wrapper');
    photoWrappers.forEach((wrap) => {
      const normalImg = wrap.querySelector('.footer-img-normal');
      const frames = Array.from(wrap.querySelectorAll('.footer-img-hover'));
      if (!normalImg || !frames.length) return;

      let interval = null;
      let cur = 0;

      function showFrame(idx) {
        frames.forEach((f, i) => (f.style.display = i === idx ? 'block' : 'none'));
      }

      function startSeq() {
        clearInterval(interval);
        normalImg.style.display = 'none';
        cur = 0;
        showFrame(cur);
        interval = setInterval(() => {
          cur++;
          if (cur >= frames.length) {
            clearInterval(interval);
          } else {
            showFrame(cur);
          }
        }, 80);
      }

      function stopSeq() {
        clearInterval(interval);
        frames.forEach((f) => (f.style.display = 'none'));
        normalImg.style.display = 'block';
      }

      // Attach to parent button or wrapper
      const trigger = wrap.closest('a') || wrap.closest('.section_footer');
      if (trigger) {
        trigger.addEventListener('mouseenter', startSeq);
        trigger.addEventListener('mouseleave', stopSeq);
      }
    });
  }

  // --- NAVIGATION DRAWER & SCROLL TRIGGER ---
  function initNavigationDrawer() {
    const menuButtons = document.querySelectorAll('.fixed-menu-button-wrapper');
    const menuTexts = document.querySelectorAll('.fixed-menu-button-text');
    const overlay = document.querySelector('.menu-overlay');
    const drawer = document.querySelector('.nav-fixed-menu');
    const navFixed = document.querySelector('.nav_fixed');
    let isOpen = false;

    // Show floating menu on scroll > 160px on desktop
    if (navFixed) {
      if (window.innerWidth <= 991) {
        gsap.set(navFixed, { display: 'block', opacity: 1 });
      } else {
        window.addEventListener('scroll', () => {
          if (window.scrollY > 160) {
            gsap.to(navFixed, { display: 'block', opacity: 1, duration: 0.3 });
          } else {
            gsap.to(navFixed, { opacity: 0, duration: 0.3, onComplete: () => gsap.set(navFixed, { display: 'none' }) });
          }
        });
      }
    }

    function toggleMenu() {
      isOpen = !isOpen;
      const star = document.querySelector('.fixed-menu-button-wrapper .star-svg');
      const links = drawer?.querySelectorAll('.nav-text-link');

      if (isOpen) {
        if (lenis) lenis.stop();
        menuTexts.forEach((t) => (t.textContent = 'Close'));
        if (overlay) gsap.set(overlay, { display: 'block' });
        if (overlay) gsap.to(overlay, { opacity: 1, duration: 0.5 });
        if (mainWrapper) gsap.to(mainWrapper, { x: window.innerWidth <= 479 ? '-100vw' : '-30em', duration: 0.6, ease: 'power3.inOut' });
        if (drawer) gsap.to(drawer, { x: '0%', duration: 0.6, ease: 'power3.inOut' });
        if (star) gsap.to(star, { rotate: -45, duration: 0.4 });
        if (links) {
          gsap.fromTo(links, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.06, duration: 0.6, delay: 0.2, ease: 'power3.out' });
        }
      } else {
        if (lenis) lenis.start();
        menuTexts.forEach((t) => (t.textContent = 'Menu'));
        if (overlay) gsap.to(overlay, { opacity: 0, duration: 0.5, onComplete: () => gsap.set(overlay, { display: 'none' }) });
        if (mainWrapper) gsap.to(mainWrapper, { x: '0%', duration: 0.6, ease: 'power3.inOut' });
        if (drawer) gsap.to(drawer, { x: '100%', duration: 0.6, ease: 'power3.inOut' });
        if (star) gsap.to(star, { rotate: 0, duration: 0.4 });
      }
    }

    menuButtons.forEach((btn) => btn.addEventListener('click', toggleMenu));
    if (overlay) overlay.addEventListener('click', () => { if (isOpen) toggleMenu(); });
    drawer?.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (isOpen) toggleMenu();
      });
    });
  }

  // --- DYNAMIC HEADER & MENU COLOR ADAPTATION ---
  function initMenuColorChanger() {
    if (typeof ScrollTrigger === 'undefined') return;

    const sections = document.querySelectorAll('[data-menu]');
    const menuBtn = document.querySelector('.fixed-menu-button-wrapper');
    const brandLogo = document.querySelector('.nav_brand');

    function updateColors(colorType) {
      const isWhite = colorType === 'white';
      if (menuBtn) {
        gsap.to(menuBtn, { color: isWhite ? '#ffffff' : '#121212', duration: 0.3, ease: 'power2.out' });
      }
      if (brandLogo) {
        gsap.to(brandLogo, { color: isWhite ? '#ffffff' : '#121212', duration: 0.3, ease: 'power2.out' });
      }
    }

    sections.forEach((section) => {
      if (getComputedStyle(section).display === 'none') return;
      const menuColor = section.getAttribute('data-menu');
      ScrollTrigger.create({
        trigger: section,
        start: 'top 80px',
        end: 'bottom 80px',
        onEnter: () => updateColors(menuColor),
        onEnterBack: () => updateColors(menuColor),
      });
    });

    // Determine initial color smoothly on load, refresh, or route return
    const evaluateActiveColor = () => {
      let activeColor = 'white';
      if (window.scrollY > 25) {
        sections.forEach((section) => {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 90 && rect.bottom >= 40) {
            activeColor = section.getAttribute('data-menu') || 'black';
          }
        });
      } else {
        const topSection = document.querySelector('[data-menu]');
        if (topSection) activeColor = topSection.getAttribute('data-menu') || 'white';
      }
      updateColors(activeColor);
    };

    evaluateActiveColor();
    window.addEventListener('scroll', () => {
      if (window.scrollY < 20) {
        evaluateActiveColor();
      }
    }, { passive: true });
    window.addEventListener('pageshow', evaluateActiveColor);
  }

  // --- CONTACT FORM INTERACTIVITY & ROBUST EMAIL SUBMISSION ---
  function initContactForm() {
    const form = document.querySelector('form#email-form');
    const submitBtn = document.querySelector('[data-form-submit="true"]');
    const submitBtnText = document.getElementById('submitBtnText');
    const successMsg = document.querySelector('.success-message');
    const errorMsg = document.querySelector('.error-message');
    const checkboxes = document.querySelectorAll('.checkbox_field');
    const budgetSlider = document.getElementById('Budget');
    const budgetBadge = document.getElementById('budgetValueBadge');
    const hiddenBudgetInput = document.getElementById('hiddenBudgetAmount');
    const hiddenServicesInput = document.getElementById('hiddenServicesInput');
    const formRedirectUrl = document.getElementById('formRedirectUrl');
    const sendAnotherBtn = document.getElementById('sendAnotherBtn');

    // Set dynamic return URL for native POST fallback
    if (formRedirectUrl) {
      formRedirectUrl.value = window.location.href.split('?')[0] + '?sent=true';
    }

    // Check if returning from a successful native submission
    if (window.location.search.includes('sent=true')) {
      if (form) form.style.display = 'none';
      if (successMsg) successMsg.style.display = 'block';
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, null, window.location.pathname);
      }
    }

    // Checkbox toggles
    checkboxes.forEach((field) => {
      const input = field.querySelector('input');
      field.addEventListener('click', () => {
        field.classList.toggle('is-active', input ? input.checked : false);
      });
    });

    // Budget range slider interaction
    const updateSliderTrack = () => {
      if (!budgetSlider || !budgetBadge) return;
      const min = parseFloat(budgetSlider.min) || 5000;
      const max = parseFloat(budgetSlider.max) || 30000;
      const val = parseFloat(budgetSlider.value) || 15000;
      const percent = ((val - min) / (max - min)) * 100;
      
      budgetSlider.style.background = `linear-gradient(to right, #ee4b2b 0%, #ee4b2b ${percent}%, #d9d9d9 ${percent}%, #d9d9d9 100%)`;
      const formatted = '₹' + Number(val).toLocaleString('en-IN') + ' INR';
      budgetBadge.textContent = formatted;
      if (hiddenBudgetInput) hiddenBudgetInput.value = formatted;
    };

    if (budgetSlider) {
      budgetSlider.addEventListener('input', updateSliderTrack);
      updateSliderTrack();
    }

    // "Send another message" reset button
    if (sendAnotherBtn && form && successMsg) {
      sendAnotherBtn.addEventListener('click', () => {
        form.reset();
        checkboxes.forEach((field) => {
          const input = field.querySelector('input');
          field.classList.toggle('is-active', input ? input.checked : false);
        });
        form.style.display = 'flex';
        successMsg.style.display = 'none';
        if (errorMsg) errorMsg.style.display = 'none';
        if (submitBtn) submitBtn.style.pointerEvents = 'auto';
        if (submitBtnText) submitBtnText.textContent = 'Send message';
        if (budgetSlider) {
          budgetSlider.value = 15000;
          updateSliderTrack();
        }
      });
    }

    // Form Submission
    if (form) {
      form.addEventListener('submit', async (e) => {
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }

        e.preventDefault();

        // Compile selected services
        const selectedServices = [];
        if (form.querySelector('#UI-UX-Design')?.checked) selectedServices.push('UI/UX Design');
        if (form.querySelector('#Graphic-Design')?.checked) selectedServices.push('Graphic Design');
        if (form.querySelector('#Vibe-Code')?.checked) selectedServices.push('Vibe Code');
        if (form.querySelector('#Product-Videos')?.checked) selectedServices.push('Product Videos');
        
        const servicesString = selectedServices.length > 0 ? selectedServices.join(', ') : 'None specified';
        if (hiddenServicesInput) hiddenServicesInput.value = servicesString;

        if (submitBtn) submitBtn.style.pointerEvents = 'none';
        if (submitBtnText) submitBtnText.textContent = 'Sending message...';
        if (errorMsg) errorMsg.style.display = 'none';

        // Check if running on file: protocol (where AJAX is blocked by FormSubmit)
        const isFileProtocol = window.location.protocol === 'file:';

        if (isFileProtocol) {
          // Direct native POST submission
          form.submit();
          return;
        }

        try {
          const formData = new FormData(form);
          formData.set('Services_Requested', servicesString);
          formData.set('Budget_Range', hiddenBudgetInput ? hiddenBudgetInput.value : '₹15,000 INR');

          const response = await fetch('https://formsubmit.co/ajax/shriyasharmachd@gmail.com', {
            method: 'POST',
            headers: {
              'Accept': 'application/json'
            },
            body: formData
          });

          const result = await response.json().catch(() => ({}));

          if (response.ok && (result.success === true || result.success === 'true')) {
            form.style.display = 'none';
            if (successMsg) successMsg.style.display = 'block';
          } else if (result.message && (result.message.includes('needs Activation') || result.message.includes('Activation'))) {
            // FormSubmit sent one-time activation email to Shriya
            form.style.display = 'none';
            if (successMsg) {
              successMsg.style.display = 'block';
              const activationNotice = document.getElementById('activationNotice');
              if (activationNotice) activationNotice.style.display = 'block';
            }
          } else if (result.message && result.message.includes('HTML files')) {
            // Fallback to native submission if AJAX rejected file protocol
            form.submit();
          } else {
            throw new Error(result.message || 'Submission failed');
          }
        } catch (err) {
          console.warn('AJAX submission failed, attempting native POST fallback:', err);
          // Automatic native POST fallback
          form.submit();
        }
      });
    }
  }

  // --- LINK HOVER UNDERLINE EFFECT ---
  function initTextLinkUnderlines() {
    document.querySelectorAll('[data-link-hover="true"]').forEach((el) => {
      if (el.classList.contains('w--current')) return;
      el.style.position = 'relative';
      el.style.display = 'inline-block';
    });
  }

  // --- AUTOMATIC REEL CAROUSEL & JEWELRY REEL TRIM ---
  function initReelCarousel() {
    // 1. Jewelry Video 3-Second Trim Handler (Skips first 3s permanently)
    const saltyVideos = document.querySelectorAll('.reel-video-salty, [data-start-time="3"]');
    saltyVideos.forEach((video) => {
      const startSec = 3.0;
      const enforceStartTime = () => {
        if (video.currentTime < startSec) {
          video.currentTime = startSec;
        }
      };
      video.addEventListener('loadedmetadata', enforceStartTime);
      video.addEventListener('play', enforceStartTime);
      video.addEventListener('timeupdate', enforceStartTime);
      video.addEventListener('seeking', enforceStartTime);
      if (video.readyState >= 1) {
        enforceStartTime();
      }
    });

    // 2. Reel Carousel Auto-Slider
    const carousels = document.querySelectorAll('[data-reel-carousel="true"]');
    carousels.forEach((carousel) => {
      if (carousel.dataset.carouselInitialized === 'true') return;
      carousel.dataset.carouselInitialized = 'true';

      const track = carousel.querySelector('.reel-carousel-track');
      const slides = Array.from(carousel.querySelectorAll('.reel-carousel-slide'));
      const indicators = Array.from(carousel.querySelectorAll('.reel-indicator-dot, .reel-indicator-bar, [data-indicator]'));
      if (!track || slides.length <= 1) return;

      let currentIndex = 0;
      const totalSlides = slides.length;
      const slideDuration = 3600; // 3.6s per reel
      let slideTimer = null;

      function updateCarousel(index) {
        currentIndex = (index + totalSlides) % totalSlides;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        // Update indicator states
        indicators.forEach((dot, i) => {
          if (i === currentIndex) {
            dot.classList.add('is-active');
          } else {
            dot.classList.remove('is-active');
          }
        });

        // Ensure current slide video is playing
        const currentVideo = slides[currentIndex].querySelector('video');
        if (currentVideo) {
          currentVideo.play().catch(() => {});
        }
      }

      function nextSlide() {
        updateCarousel(currentIndex + 1);
      }

      function startTimer() {
        stopTimer();
        slideTimer = setInterval(nextSlide, slideDuration);
      }

      function stopTimer() {
        if (slideTimer) {
          clearInterval(slideTimer);
          slideTimer = null;
        }
      }

      // Initialize first slide and start auto-rotation
      updateCarousel(0);
      startTimer();

      // Click on indicator dot to jump directly to slide
      indicators.forEach((dot, i) => {
        dot.style.cursor = 'pointer';
        dot.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          updateCarousel(i);
          startTimer();
        });
      });

      // Also ensure all videos in carousel are playing
      slides.forEach((slide) => {
        const vid = slide.querySelector('video');
        if (vid) {
          vid.play().catch(() => {});
        }
      });
    });
  }

  // Run immediately on DOM ready
  initReelCarousel();

  // Window load and resize handlers to ensure 100% stable ScrollTrigger coordinates
  window.addEventListener('load', () => {
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
    if (lenis) {
      lenis.resize();
    }
  });

  window.addEventListener('resize', () => {
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
    if (lenis) {
      lenis.resize();
    }
  });
});
