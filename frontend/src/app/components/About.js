"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function About() {
  const [isVisible, setIsVisible] = useState(false);
  const aboutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (aboutRef.current) {
        const top = aboutRef.current.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (top < windowHeight * 0.75) {
          setIsVisible(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Vérifier une fois au chargement
    setTimeout(handleScroll, 500);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
        duration: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const imageVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    hover: {
      scale: 1.05,
      filter: "grayscale(0%)",
      transition: { duration: 0.3 },
    },
  };

  return (
    <>
      <a id="about"></a>
      <section className="section" id="about_section" ref={aboutRef}>
        <div className="content">
          <motion.h2
            className="section_title"
            initial={{ opacity: 0, y: -20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            About Me
          </motion.h2>

          <motion.div
            className="about_content"
            variants={containerVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
          >
            <motion.div className="text-container" variants={containerVariants}>
              <motion.p className="p_1" variants={itemVariants}>
                 I am a 3rd-year Data Science student. 
                My work involves designing backend infrastructure for SaaS applications using the Django REST Framework in Python:
              </motion.p>

              <motion.ul className="skills-list" variants={containerVariants}>
                <motion.li variants={itemVariants} key="admin-panel">
                  Creating a comprehensive admin panel with data collection and API logging
                </motion.li>
                <motion.li variants={itemVariants} key="deployment">
                  Deploying applications on VPS with Nginx or AWS cloud infrastructure
                </motion.li>
                <motion.li variants={itemVariants} key="ai-integration">
                  AI/LLM integration within backend systems
                </motion.li>
                <motion.li variants={itemVariants} key="api-design">
                  RESTful API design and implementation with Swagger documentation
                </motion.li>
                <motion.li variants={itemVariants} key="database-management">
                  Database management and optimization for efficient data retrieval and storage
                </motion.li>
                <motion.li variants={itemVariants} key="other-features">
                Creating real-time chat applications using Socket.IO.
                </motion.li>
              </motion.ul>

              <motion.p className="p_1" variants={itemVariants}>
                In addition to my technical work, I've some knowledge in frontend development.
                I also enjoy creating Machine Learning models
                for my university projects and have a keen interest in integrating AI models into web applications.
              </motion.p>
            </motion.div>

            <motion.div className="photo" variants={itemVariants}>
              <motion.div
                className="photo-wrapper"
                variants={imageVariants}
                whileHover="hover"
              >
                <Image
                  src="/resources/images/Photo.jpg"
                  alt="Radhi Badache"
                  width={500}
                  height={500}
                  priority
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      <div className="section_end about_end"></div>
    </>
  );
}
