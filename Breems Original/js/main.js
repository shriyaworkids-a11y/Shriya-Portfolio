/**
 * BREEMS - PORTFOLIO INTERACTION & ANIMATION ENGINE
 * 100% Matching Bram van Vugt (Breems)
 */

document.addEventListener('DOMContentLoaded', () => {
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

  // --- PRELOADER & INTRO TIMELINE ---
  const loaderWrapper = document.querySelector('.page-loader-wrapper');
  const loaderWrappers = document.querySelectorAll('.preload-img-wrapper');
  const loaderImages = document.querySelectorAll('.preload-img-wrapper img');
  const counterEl = document.querySelector('[data-counter="true"]');
  const mainWrapper = document.querySelector('.main-wrapper');
  const pageContainer = document.querySelector('.page-wrapper');
  const navAbsolute = document.querySelector('.nav_absolute');
  const heroText = document.querySelector('.hero-heading-text');

  if (loaderWrapper && loaderWrappers.length > 0) {
    if (lenis) lenis.stop();

    const rotations = [7, -7, 4, -4];
    gsap.set(loaderWrappers, { scale: 0 });
    gsap.set(loaderImages, { scale: 2, opacity: 0 });
    gsap.set(mainWrapper, { scale: 1.05, transformOrigin: '50% 0%' });
    if (navAbsolute) gsap.set(navAbsolute, { opacity: 0 });

    const counterObj = { value: 0 };
    const tl = gsap.timeline({
      defaults: { duration: 0.8, ease: 'power3.out' },
      onComplete: () => {
        gsap.set(loaderWrapper, { display: 'none' });
        if (pageContainer) gsap.set(pageContainer, { clearProps: 'all' });
        if (mainWrapper) gsap.set(mainWrapper, { clearProps: 'all' });
        if (lenis) lenis.start();
        initPageAnimations();
      }
    });

    tl.to(loaderWrappers, {
      scale: 1,
      rotation: (i) => rotations[i % rotations.length],
      stagger: 0.35,
    });

    tl.to(loaderImages, {
      scale: 1,
      opacity: 1,
      stagger: 0.35,
    }, '<');

    tl.to(counterObj, {
      value: 100,
      duration: 1.6,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (counterEl) {
          counterEl.textContent = `${Math.round(counterObj.value)}%`;
        }
      }
    }, '<');

    tl.to(loaderWrapper, {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.inOut',
    }, '-=0.3');

    tl.to(mainWrapper, {
      scale: 1,
      duration: 1,
      ease: 'power2.out',
    }, '-=0.5');

    if (navAbsolute) {
      tl.to(navAbsolute, {
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out',
      }, '-=0.4');
    }

    if (heroText) {
      tl.fromTo(heroText, { y: '60%', opacity: 0 }, {
        y: '0%',
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
      }, '-=0.6');
    }
  } else {
    initPageAnimations();
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
      const timeStr = new Intl.DateTimeFormat('nl-NL', {
        timeZone: 'Europe/Amsterdam',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
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

  // --- MAIN BUTTON HOVER WITH SLIDING INNER PILL ---
  document.querySelectorAll('[mainbutton="hover"]').forEach((button) => {
    const inner = button.querySelector('.inner-hover-color');
    const circle = button.querySelector('.button-circle');
    const star = button.querySelector('.main-button-star-svg');

    if (inner && circle) {
      gsap.set(inner, { y: '100%' });

      button.addEventListener('mouseenter', () => {
        const tl = gsap.timeline({ defaults: { overwrite: 'auto' } });
        tl.to(inner, { y: '0%', duration: 0.4, ease: 'power2.inOut' })
          .to(circle, { scale: 0.4, duration: 0.2, ease: 'power2.in' }, 0)
          .to(button, { color: '#ffffff', duration: 0.2, ease: 'power2.in' }, 0);
        if (star) tl.to(star, { scale: 3, duration: 0.2, ease: 'power2.in' }, 0);
      });

      button.addEventListener('mouseleave', () => {
        const tl = gsap.timeline({
          defaults: { overwrite: 'auto' },
          onComplete: () => gsap.set(inner, { y: '100%' }),
        });
        tl.to(inner, { y: '-100%', duration: 0.4, ease: 'power2.inOut' })
          .to(circle, { scale: 1, duration: 0.25, ease: 'power2.out' }, 0)
          .to(button, { color: '', duration: 0.25, ease: 'power2.out' }, 0.1);
        if (star) tl.to(star, { scale: 0, duration: 0.25, ease: 'power2.out' }, 0);
      });
    }
  });

  // Secondary Button Hover
  document.querySelectorAll('[secundarybutton="hover"]').forEach((button) => {
    const inner = button.querySelector('.inner-hover-color');
    const star = button.querySelector('.main-button-star-svg');

    if (inner) {
      gsap.set(inner, { y: '101%' });

      button.addEventListener('mouseenter', () => {
        gsap.to(inner, { y: '0%', duration: 0.35, ease: 'power2.inOut' });
        gsap.to(button, { color: '#ffffff', duration: 0.2, ease: 'power2.in' });
        if (star) gsap.to(star, { scale: 0.8, duration: 0.2, ease: 'power2.in' });
      });

      button.addEventListener('mouseleave', () => {
        gsap.to(inner, {
          y: '-101%',
          duration: 0.35,
          ease: 'power2.inOut',
          onComplete: () => gsap.set(inner, { y: '101%' }),
        });
        gsap.to(button, { color: '', duration: 0.2, ease: 'power2.out' });
        if (star) gsap.to(star, { scale: 1, duration: 0.2, ease: 'power2.out' });
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
        const next = (currentIndex + 1) % items.length;
        showItem(next);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
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
  }

  // --- DYNAMIC HEADER & MENU COLOR ADAPTATION ---
  function initMenuColorChanger() {
    if (typeof ScrollTrigger === 'undefined') return;

    const sections = document.querySelectorAll('[data-menu]');
    const menuBtn = document.querySelector('.fixed-menu-button-wrapper');
    const brandLogo = document.querySelector('.nav_brand');

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

    function updateColors(colorType) {
      const isWhite = colorType === 'white';
      if (menuBtn) {
        gsap.to(menuBtn, { color: isWhite ? '#ffffff' : '#121212', duration: 0.25 });
      }
      if (brandLogo && window.scrollY > 50) {
        gsap.to(brandLogo, { color: isWhite ? '#ffffff' : '#121212', duration: 0.25 });
      }
    }
  }

  // --- CONTACT FORM INTERACTIVITY ---
  function initContactForm() {
    const checkboxes = document.querySelectorAll('.checkbox_field');
    checkboxes.forEach((field) => {
      const input = field.querySelector('input');
      field.addEventListener('click', () => {
        field.classList.toggle('is-active', input ? input.checked : false);
      });
    });

    const form = document.querySelector('form#email-form');
    const submitBtn = document.querySelector('[data-form-submit="true"]');
    const successMsg = document.querySelector('.success-message');

    if (form && submitBtn) {
      submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (form.checkValidity()) {
          form.style.display = 'none';
          if (successMsg) successMsg.style.display = 'block';
        } else {
          form.reportValidity();
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
