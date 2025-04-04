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
                Hi! My name is Radhi Badache, I develop web applications and
                software solutions. I enjoy combining technology with creative
                problem-solving to build efficient and elegant applications.
                I've worked on various projects including websites,
                applications, and more...{" "}
                <i>
                  (see the{" "}
                  <a className="link" href="#projects">
                    project
                  </a>{" "}
                  part of the site)
                </i>
                .
              </motion.p>
              <motion.p className="p_1" variants={itemVariants}>
                With a strong background in computer science and software
                engineering, I've developed expertise in modern web technologies
                and frameworks. My focus is on building accessible, inclusive
                products and digital experiences for the web.
              </motion.p>
              <motion.p className="p_1" variants={itemVariants}>
                Besides my technical work, I'm passionate about continuous
                learning and staying updated with the latest trends in
                technology. I'm always looking for new challenges and
                opportunities to grow.
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
                  width={300}
                  height={300}
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
