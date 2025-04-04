'use client';
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from 'framer-motion';

export default function Projects() {
  const [filter, setFilter] = useState("Default");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const fixedCategories = ["Default", "Web", "School", "AI"];
  const projectRefs = useRef([]);

  useEffect(() => {
    // Charger les projets
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await fetch('/resources/jsons/projects.json');
        const data = await res.json();
        
        // Extraire les projets principaux
        setProjects(data.main || []);
        setLoading(false);
      } catch (error) {
        console.error('Error loading projects:', error);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    // Observer pour l'animation au scroll
    const createObservers = () => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );

      projectRefs.current.forEach((ref) => {
        if (ref && ref.current) {
          observer.observe(ref.current);
        }
      });

      return observer;
    };

    const observer = createObservers();
    return () => {
      if (observer) {
        projectRefs.current.forEach((ref) => {
          if (ref && ref.current) {
            observer.unobserve(ref.current);
          }
        });
      }
    };
  }, [projects]);

  const getFilteredProjects = () => {
    if (filter === "Default") {
      return projects;
    }
    
    const filterLower = filter.toLowerCase();
    return projects.filter(project => 
      project.categories.some(cat => cat.toLowerCase() === filterLower)
    );
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 70, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 90,
        damping: 15
      }
    }
  };

  const categoryVariants = {
    inactive: { opacity: 0.6, scale: 0.95 },
    active: { 
      opacity: 1, 
      scale: 1,
      color: "var(--green)", 
      transition: { duration: 0.3 } 
    },
    hover: { scale: 1.05, transition: { duration: 0.2 } }
  };

  return (
    <>
      <a id="projects"></a>
      <section className="section" id="projects_section">
        <div className="content">
          <motion.h2 
            className="section_title"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
          >
            Some Things I've Built
          </motion.h2>
          
          <motion.div 
            className="projects_filters"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {fixedCategories.map((category, index) => (
              <motion.button
                key={index}
                className={`filter ${filter === category ? 'active' : ''}`}
                onClick={() => setFilter(category)}
                variants={categoryVariants}
                initial="inactive"
                animate={filter === category ? "active" : "inactive"}
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>

          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          ) : (
            <motion.div 
              className="projects_content"
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
            >
              {getFilteredProjects().length > 0 ? (
                getFilteredProjects().map((project, index) => {
                  const isInverted = index % 2 !== 0;
                  return (
                    <motion.div 
                      key={index} 
                      className={`project ${isInverted ? 'inverted' : ''}`}
                      variants={item}
                    >
                      <div className="project_view">
                        <motion.a 
                          href={project.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Image
                              src={project.image}
                              alt={project.title}
                              width={600}
                              height={340}
                              quality={100} /* Qualité maximale */
                              priority={index < 2} /* Charge en priorité les premières images */
                              sizes="(max-width: 768px) 100vw, 600px"
                          />
                        </motion.a>
                      </div>
                      <div className="project_text">
                        <div className="type">
                          <span>{project.date}</span>
                          <span>•</span>
                          <span>{project.type}</span>
                        </div>
                        <div className="project_title_row">
                          <motion.a 
                            className="project_title" 
                            href={project.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            whileHover={{ color: "var(--green)", x: isInverted ? -5 : 5 }}
                          >
                            {project.title}
                          </motion.a>
                          
                          {project.github && (
                            <motion.a 
                              href={project.github} 
                              className="project_github_link"
                              target="_blank"
                              rel="noopener noreferrer"
                              whileHover={{ y: -3 }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <title>GitHub</title>
                                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                              </svg>
                            </motion.a>
                          )}
                        </div>
                        <div className="text">
                          <p>{project.description}</p>
                        </div>
                        <div className="tags">
                          {project.technologies.map((tech, tagIndex) => (
                            <motion.span 
                              key={tagIndex}
                              whileHover={{ y: -3, color: "var(--green)" }}
                            >
                              {tech}
                            </motion.span>
                          ))}
                        </div>

                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <motion.p 
                  className="no-projects"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  No projects found with the selected filter.
                </motion.p>
              )}
            </motion.div>
          )}
        </div>
      </section>
      <div className="section_end projects_end"></div>
    </>
  );
} 