'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function Contact() {
  const [showCopied, setShowCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('radhibadache@gmail.com');
    setShowCopied(true);
  };

  useEffect(() => {
    if (showCopied) {
      const timer = setTimeout(() => setShowCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showCopied]);

  return (
    <>
      <a id="contact"></a>
      <section className="section" id="contact_section">
        <div className="content leaning">
          <h2 className="section_title">Feel free to connect with me!</h2>
          <div className="contact_content">
            <div className="social_line">
              <a className="social_link" href="https://www.linkedin.com/in/radhi-badache-83b3b6141/" target="_blank" rel="noopener noreferrer">
                <Image src="/resources/svgs/contact/Linkedin.svg" alt="LinkedIn" width={28} height={28} />
                <div className="social_text">
                  <span>Linkedin</span>
                </div>
              </a>
            </div>
            <div className="social_line">
              <a className="social_link" href="https://github.com/Ratybox" target="_blank" rel="noopener noreferrer">
                <Image src="/resources/svgs/contact/GitHub.svg" alt="GitHub" width={28} height={28} />
                <div className="social_text">
                  <span>GitHub</span>
                </div>
              </a>
            </div>
          </div>
          <div className="email-display">
            <span className="email-label">Contact me directly on mail :</span>
            <div className="email-wrapper">
              <span className="email-address">radhibadache@gmail.com</span>
              <motion.button 
                onClick={handleCopyEmail} 
                className="copy-button"
                aria-label={showCopied ? "Email copied!" : "Copy to clipboard"}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <AnimatePresence mode="wait">
                  {showCopied ? (
                    <motion.div
                      key="copied"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    >
                      <Image
                        src="/resources/svgs/copied.svg"
                        alt="Copied"
                        width={20}
                        height={20}
                        className="copy-icon"
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="copy"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    >
                      <Image
                        src="/resources/svgs/copy-icon.svg"
                        alt="Copy"
                        width={20}
                        height={20}
                        className="copy-icon"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <AnimatePresence>
                  {showCopied && (
                    <motion.span
                      className="copied-tooltip"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: -40 }}
                      exit={{ opacity: 0, y: -60 }}
                      transition={{ duration: 0.3 }}
                    >
                      Copied!
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

