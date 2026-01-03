"use client";

import { useEffect, useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from 'framer-motion';

// Importation des composants
import Header from './components/Header';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Contact from './components/Contact';
import MLBackground from './components/MLBackground';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulation du chargement
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Variants pour les animations
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } }
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 12 
      } 
    }
  };

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            id="loading_screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>
      
      <div id="safari_warning">
        <p>
          You are using Safari. This website is not optimized for this browser.
          Please use another browser like Chrome or Firefox.
        </p>
      </div>
      <div id="lcp"><p>LCP</p></div>
      
      <Header />
      
      {/* Global ML Background - covers entire site */}
      <MLBackground />

      <motion.div 
        id="content"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <main id="main">
          <a id="home"></a>
          <motion.section 
            className="section" 
            id="home_section"
            variants={contentVariants}
          >
            <div className="content">
              <motion.span className="hi" variants={itemVariants}>Hi, my name is</motion.span>
              <motion.span className="name" variants={itemVariants}>Radhi Badache.</motion.span>
              <motion.span className="title" variants={itemVariants}>Backend Developer & AI Student.</motion.span>
              <motion.p className="bio" variants={itemVariants}>
                I'm a Backend Developer and AI Student passionate about building intelligent systems. 
                I specialize in backend development with AI integrations, crafting efficient solutions that leverage the power of artificial intelligence. 
                I'm actively exploring new opportunities where technology meets innovation.
              </motion.p>
              <motion.div className="home_button" variants={itemVariants}>
                <motion.a 
                  className="button" 
                  href="#about"
                  whileHover={{ y: -3 }}
                  whileTap={{ y: 1 }}
                >
                  <p>Get Started</p>
                  <svg className="button_arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17.69 17.39"><g>
                    <path className="path_1" d="M8.9 12.4 L8.9 12.4"/>
                    <path className="path_2" d="M16.2 5 8.9 12.4 1.5 5"/>
                  </g></svg>
                </motion.a>
              </motion.div>
            </div>
          </motion.section>

          <About />
          <Projects />
          <Skills />
          <Experience />
          <Contact />

          <motion.footer 
            className="section" 
            id="footer_section"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <div className="content">
              <div className="footer_content">
                <motion.a 
                  className="footer_licence" 
                  href="https://github.com/Ratybox/Portfolio/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  <span>© 2025 Radhi Badache</span>
                  <Image src="/resources/svgs/license.svg" alt="license" width={16} height={16} />
                  <span>MIT license</span>
                </motion.a>
                <motion.a 
                  className="github-link" 
                  href="https://github.com/Ratybox/portfolio" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  <span>View Source</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19.05 20.31"><g><path d="M7.26 16.34c-4.11 1.23-4.11-2.06-5.76-2.47M13 18.81V15.62a2.78 2.78 0 0 0-.77-2.15c2.59-.28 5.3-1.26 5.3-5.76a4.46 4.46 0 0 0-1.23-3.08 4.18 4.18 0 0 0-.08-3.11s-1-.29-3.22 1.22a11 11 0 0 0-5.76 0C5 1.23 4 1.52 4 1.52A4.18 4.18 0 0 0 4 4.63 4.48 4.48 0 0 0 2.73 7.74c0 4.46 2.72 5.44 5.31 5.76a2.8 2.8 0 0 0-.78 2.12v3.19"/></g></svg>
                </motion.a>
              </div>
              <div className="footer_content">
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  Built with <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer">Next.js</a>. 
                  Thank you for visiting!
                </motion.p>
              </div>
            </div>
          </motion.footer>
        </main>
      </motion.div>
    </>
  );
}
