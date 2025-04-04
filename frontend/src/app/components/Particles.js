'use client';
import { useEffect, useRef } from 'react';

export default function Particles() {
  const particlesContainerRef = useRef(null);

  useEffect(() => {
    // Ne s'exécute que côté client
    if (typeof window === 'undefined' || !window.particlesJS) {
      console.warn('particles.js not loaded or not available');
      return;
    }

    // Vérifie si l'élément DOM existe
    if (!particlesContainerRef.current) {
      return;
    }

    // Chargement du fichier de configuration particles.json
    try {
      window.particlesJS.load('particles', '/resources/jsons/particles.json', function() {
        console.log('particles.js loaded successfully');
      });
    } catch (error) {
      console.error('Error initializing particles.js:', error);
      
      // Si le chargement du fichier échoue, on initialise avec une configuration par défaut
      window.particlesJS('particles', {
        particles: {
          number: { value: 80 },
          color: { value: '#ffffff' },
          shape: { type: 'circle' },
          opacity: { value: 0.5 },
          size: { value: 3 },
          line_linked: {
            enable: true,
            distance: 150,
            color: '#1bbef5',
            opacity: 0.4,
            width: 1
          },
          move: {
            enable: true,
            speed: 4
          }
        },
        interactivity: {
          detect_on: 'canvas',
          events: {
            onhover: {
              enable: true,
              mode: 'grab'
            }
          }
        }
      });
    }

    // Nettoyage à la désinsertion du composant
    return () => {
      // Si particlesJS possède une méthode de nettoyage, l'utiliser ici
      if (window.pJSDom && window.pJSDom.length) {
        window.pJSDom.forEach(dom => {
          if (dom.pJS && dom.pJS.fn && dom.pJS.fn.vendors && dom.pJS.fn.vendors.destroypJS) {
            dom.pJS.fn.vendors.destroypJS();
          }
        });
        window.pJSDom = [];
      }
    };
  }, []);

  return <div id="particles" ref={particlesContainerRef}></div>;
} 