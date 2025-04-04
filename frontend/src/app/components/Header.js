'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerSmall, setHeaderSmall] = useState(false);
  const [headerHide, setHeaderHide] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      
      // Pour le header small
      if (currentScroll > 50) {
        setHeaderSmall(true);
      } else {
        setHeaderSmall(false);
      }
      
      // Pour le header hide
      if (currentScroll > 100 && currentScroll > lastScroll) {
        setHeaderHide(true);
      } else {
        setHeaderHide(false);
      }
      
      setLastScroll(currentScroll);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScroll]);

  const closeMenu = () => setMenuOpen(false);

  // Animation variants
  const headerVariants = {
    visible: { y: 0, opacity: 1 },
    hidden: { y: -80, opacity: 0 }
  };

  const logoVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.4 } },
    hover: { scale: 1.1, rotate: 10, transition: { type: "spring", stiffness: 400 } }
  };

  const navItemVariants = {
    initial: { opacity: 0, y: -20 },
    animate: (i) => ({ 
      opacity: 1, 
      y: 0, 
      transition: { 
        delay: i * 0.1,
        duration: 0.4, 
        ease: "easeOut"  
      } 
    }),
    hover: { y: -3, transition: { type: "spring", stiffness: 400 } }
  };

  const mobileMenuVariants = {
    closed: { x: "100%" },
    open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } }
  };

  return (
    <>
      <div id="header_div">
        <motion.header 
          id="header" 
          className={`${headerSmall ? 'small' : ''} ${headerHide ? 'hide' : ''}`}
          variants={headerVariants}
          animate={headerHide ? "hidden" : "visible"}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <nav className="nav">
            <div className="logo">
              <motion.a 
                href="/"
                variants={logoVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
              >
                <Image src="/resources/svgs/favicon.png" alt="logo" width={45} height={45} />
              </motion.a>
            </div>
            <div className="menu">
              <ol>
                {['Home', 'About', 'Projects', 'Skills', 'Experience'].map((item, i) => (
                  <motion.li 
                    key={item.toLowerCase()} 
                    className={item.toLowerCase()}
                    custom={i}
                    variants={navItemVariants}
                    initial="initial"
                    animate="animate"
                    whileHover="hover"
                  >
                    <a className="not_button" href={`#${item.toLowerCase()}`}>{item}</a>
                  </motion.li>
                ))}
                <motion.li 
                  className="contact"
                  custom={5}
                  variants={navItemVariants}
                  initial="initial"
                  animate="animate"
                >
                  <motion.a 
                    className="button" 
                    href="#contact"
                    whileHover={{ y: -4 }}
                    whileTap={{ y: 0 }}
                  >
                    <p>Contact</p>
                    <svg className="button_arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17.69 17.39"><g>
                      <path className="path_1" d="M8.9 12.4 L8.9 12.4"/>
                      <path className="path_2" d="M16.2 5 8.9 12.4 1.5 5"/></g>
                    </svg>
                  </motion.a>
                </motion.li>
              </ol>
            </div>
            <motion.svg 
              className="menu_icon" 
              viewBox="0 0 140 100" 
              xmlns="http://www.w3.org/2000/svg" 
              onClick={() => setMenuOpen(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <line x1="10" y1="10" x2="130" y2="10"/>
              <line x1="30" y1="50" x2="130" y2="50"/>
              <line x1="50" y1="90" x2="130" y2="90"/>
            </motion.svg>
          </nav>
        </motion.header>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            className="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="menu-backdrop" 
              onClick={closeMenu}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
            />
            <motion.div 
              className="menu-container"
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="menu-header">
                <motion.div 
                  className="close-button"
                  onClick={closeMenu}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.div>
              </div>
              <nav className="mobile-nav">
                <ol>
                  {['Home', 'About', 'Projects', 'Skills', 'Experience'].map((item, i) => (
                    <motion.li 
                      key={item.toLowerCase()}
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.1, duration: 0.4 }}
                    >
                      <a 
                        href={`#${item.toLowerCase()}`}
                        onClick={closeMenu}
                        className="mobile-nav-item"
                      >
                        <span className="nav-text">{item}</span>
                      </a>
                    </motion.li>
                  ))}
                  <motion.li
                    key="contact"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                  >
                    <motion.a
                      href="#contact"
                      onClick={closeMenu}
                      className="button"
                      whileHover={{ y: -4 }}
                      whileTap={{ y: 0 }}
                    >
                      <p>Contact</p>
                      <svg className="button_arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17.69 17.39"><g>
                        <path className="path_1" d="M8.9 12.4 L8.9 12.4"/>
                        <path className="path_2" d="M16.2 5 8.9 12.4 1.5 5"/></g>
                      </svg>
                    </motion.a>
                  </motion.li>
                </ol>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
