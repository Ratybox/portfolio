'use client';

import Image from "next/image";
import { motion, useScroll } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

function ParticleBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Configuration améliorée des particules
    const particles = [];
    const particleCount = 150; // Augmentation du nombre de particules
    const connectionDistance = 150; // Distance de connexion augmentée
    
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5; // Vitesse réduite pour un mouvement plus fluide
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 1.5 + 0.5; // Taille variable des particules
        this.baseRadius = this.radius;
      }
      
      update() {
        this.x += this.vx;
        this.y += this.vy;
        
        // Effet de rebond en douceur
        if (this.x < 0 || this.x > canvas.width) {
          this.vx = -this.vx * 0.95;
        }
        if (this.y < 0 || this.y > canvas.height) {
          this.vy = -this.vy * 0.95;
        }
      }
    }

    // Initialisation des particules
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let animationFrameId;
    function animate() {
      ctx.fillStyle = 'rgba(10, 10, 20, 0.2)'; // Fond plus sombre avec effet de traînée
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        
        // Dessin des particules avec un effet de lueur
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.radius * 2
        );
        gradient.addColorStop(0, 'rgba(100, 149, 237, 0.3)'); // Bleu cornflower
        gradient.addColorStop(1, 'rgba(100, 149, 237, 0)');
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius * 2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });
      
      // Connexions entre particules avec effet de dégradé
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < connectionDistance) {
            const opacity = (1 - distance / connectionDistance) * 0.15;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(100, 149, 237, ${opacity})`; // Bleu cornflower avec opacité variable
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });
      
      animationFrameId = requestAnimationFrame(animate);
    }
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <canvas
      id="particle-canvas"
      className="fixed top-0 left-0 w-full h-full -z-10"
    />
  );
}

function Section({ title, content, index }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-[150vh] p-12 bg-white/5 backdrop-blur-lg rounded-lg shadow-lg relative mb-32"
    >
      <figure className="progress fixed left-10 top-1/2 -translate-y-1/2">
        <svg width="75" height="75" viewBox="0 0 100 100">
          <circle 
            cx="50" 
            cy="50" 
            r="30" 
            pathLength="1" 
            className="stroke-gray-200 dark:stroke-gray-700 fill-none stroke-[8px]" 
          />
          <motion.circle
            cx="50"
            cy="50"
            r="30"
            pathLength="1"
            className="stroke-blue-500 dark:stroke-blue-400 fill-none stroke-[8px]"
            style={{ pathLength: scrollYProgress }}
          />
        </svg>
      </figure>
      
      <div className="sticky top-10">
        <BlockMath>{`\\Large{${title}}`}</BlockMath>
      </div>

      <div className="mt-24 space-y-32">
        {content}
      </div>
    </motion.section>
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sections = [
    {
      title: "\\mathcal{A}cademic \\space \\mathcal{B}ackground",
      content: [
        <div key="education" className="space-y-16">
          <BlockMath>{`\\begin{align*}
            \\textbf{MSc Data Science} &\\rightarrow \\text{USTO} \\\\
            \\text{Year} &: 2020-2022
          \\end{align*}`}</BlockMath>

          <BlockMath>{`\\begin{align*}
            \\textbf{Focus Areas} &\\rightarrow \\text{Primary Subjects} \\\\
            &\\begin{cases}
              \\text{Advanced Machine Learning} \\\\
              \\text{Deep Learning Architecture} \\\\
              \\text{Statistical Analysis} \\\\
              \\text{Big Data Processing}
            \\end{cases}
          \\end{align*}`}</BlockMath>

          <BlockMath>{`\\begin{align*}
            \\textbf{Research Topics} &\\rightarrow \\text{Specializations} \\\\
            &\\begin{cases}
              \\text{Neural Networks} \\\\
              \\text{Computer Vision} \\\\
              \\text{Natural Language Processing}
            \\end{cases}
          \\end{align*}`}</BlockMath>
        </div>
      ]
    },
    {
      title: "\\mathcal{P}rofessional \\space \\mathcal{E}xperience",
      content: [
        <div key="experience" className="space-y-16">
          <BlockMath>{`\\begin{align*}
            \\textbf{Backend Developer} &\\rightarrow \\text{B2B Startup} \\\\
            \\text{Duration} &: 2021-2023
          \\end{align*}`}</BlockMath>

          <BlockMath>{`\\begin{align*}
            \\textbf{Key Projects} &\\rightarrow \\text{Achievements} \\\\
            &\\begin{cases}
              \\text{ML Pipeline Development} \\\\
              \\text{API Architecture Design} \\\\
              \\text{Data Infrastructure}
            \\end{cases}
          \\end{align*}`}</BlockMath>

          <BlockMath>{`\\begin{align*}
            \\textbf{Technologies} &\\rightarrow \\text{Stack} \\\\
            &\\begin{cases}
              \\text{Python & FastAPI} \\\\
              \\text{PostgreSQL} \\\\
              \\text{Docker & Kubernetes}
            \\end{cases}
          \\end{align*}`}</BlockMath>
        </div>
      ]
    },
    // ... autres sections similaires
  ];

  return (
    <>
      {mounted && <ParticleBackground />}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="min-h-screen bg-transparent p-8"
      >
        <main className="max-w-4xl mx-auto pl-20">
          <motion.div
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl font-bold mb-4">
              <InlineMath>{`\\mathcal{R}adhi \\space \\mathcal{B}adache`}</InlineMath>
            </h1>
            <h2 className="text-2xl text-gray-600 dark:text-gray-400">
              <InlineMath>{`\\text{Data Scientist} \\space \\cdot \\space \\text{ML Engineer}`}</InlineMath>
            </h2>
          </motion.div>

          <div className="space-y-32">
            {sections.map((section, index) => (
              <Section
                key={index}
                title={section.title}
                content={section.content}
                index={index}
              />
            ))}
          </div>
        </main>
      </motion.div>
    </>
  );
}
