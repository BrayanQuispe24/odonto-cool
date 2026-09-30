import { useEffect } from 'react';

export const useScrollReveal = () => {
  useEffect(() => {
    let ticking = false;

    const updateTransforms = () => {
      const windowHeight = window.innerHeight;

      // Query elements dynamically to capture filtered or dynamic elements
      const elements = document.querySelectorAll<HTMLElement>(
        '.reveal, .reveal-left, .reveal-right, .reveal-3d'
      );

      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const elHeight = rect.height || 100;

        // Entry progress: 0 when rect.top is at windowHeight, 1 when rect.top is at windowHeight * 0.50
        const entryProgress = Math.min(
          Math.max((windowHeight - rect.top) / (windowHeight * 0.50), 0),
          1
        );

        // Exit progress: 0 when rect.bottom is at windowHeight * 0.20, 1 when rect.bottom is at -elHeight * 0.3
        const exitThreshold = windowHeight * 0.20;
        const exitProgress = rect.bottom < exitThreshold
          ? Math.min(Math.max((exitThreshold - rect.bottom) / (exitThreshold + elHeight * 0.3), 0), 1)
          : 0;

        if (entryProgress < 1) {
          // Entering from bottom of viewport (3D appearance on scroll down)
          const isLeft = el.classList.contains('reveal-left');
          const isRight = el.classList.contains('reveal-right');

          const opacity = Math.pow(entryProgress, 1.2);
          const translateY = (1 - entryProgress) * 45;
          const scale = 0.90 + entryProgress * 0.10;
          const rotateX = (1 - entryProgress) * -14;
          const rotateY = isLeft ? (1 - entryProgress) * -16 : isRight ? (1 - entryProgress) * 16 : 0;

          el.style.opacity = opacity.toFixed(2);
          el.style.transform = `perspective(1000px) translateY(${translateY.toFixed(1)}px) scale(${scale.toFixed(3)}) rotateX(${rotateX.toFixed(1)}deg) rotateY(${rotateY.toFixed(1)}deg)`;
          el.style.willChange = 'opacity, transform';
          el.classList.remove('scrolled-past');
        } else if (exitProgress > 0) {
          // Exiting past top of viewport (3D disappearance on scroll down / appearance on scroll up)
          const opacity = Math.max(1 - exitProgress * 1.3, 0);
          const translateY = exitProgress * -50;
          const scale = 1 - exitProgress * 0.12;
          const rotateX = exitProgress * 18;

          el.style.opacity = opacity.toFixed(2);
          el.style.transform = `perspective(1000px) translateY(${translateY.toFixed(1)}px) scale(${scale.toFixed(3)}) rotateX(${rotateX.toFixed(1)}deg)`;
          el.style.willChange = 'opacity, transform';
          el.classList.add('scrolled-past');
        } else {
          // Fully inside focal viewport
          el.style.opacity = '1';
          el.style.transform = 'perspective(1000px) translate(0px, 0px) scale(1) rotateX(0deg) rotateY(0deg)';
          el.style.willChange = 'auto';
          el.classList.add('active');
          el.classList.remove('scrolled-past');
        }
      });
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateTransforms();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    // Execute immediately on mount
    updateTransforms();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);
};

