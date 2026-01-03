'use client';
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from 'framer-motion';

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [projects, setProjects] = useState({
    openSource: [],
    clientProjects: [],
    research: []
  });
  const [loading, setLoading] = useState(true);

  const filters = [
    { key: 'all', label: 'All Projects', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"></rect>
        <rect x="14" y="3" width="7" height="7"></rect>
        <rect x="14" y="14" width="7" height="7"></rect>
        <rect x="3" y="14" width="7" height="7"></rect>
      </svg>
    )},
    { key: 'openSource', label: 'Open Source', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
      </svg>
    )},
    { key: 'clientProjects', label: 'Client Work', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
      </svg>
    )},
    { key: 'research', label: 'Research', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
      </svg>
    )}
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await fetch('/resources/jsons/projects.json');
        const data = await res.json();
        
        setProjects({
          openSource: data.openSource || [],
          clientProjects: data.clientProjects || [],
          research: data.research || []
        });
        setLoading(false);
      } catch (error) {
        console.error('Error loading projects:', error);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const getFilteredProjects = () => {
    if (activeFilter === 'all') {
      return [
        ...projects.openSource.map(p => ({ ...p, category: 'openSource' })),
        ...projects.clientProjects.map(p => ({ ...p, category: 'clientProjects' })),
        ...projects.research.map(p => ({ ...p, category: 'research' }))
      ];
    }
    return projects[activeFilter]?.map(p => ({ ...p, category: activeFilter })) || [];
  };

  const getProjectCount = (filterKey) => {
    if (filterKey === 'all') {
      return projects.openSource.length + projects.clientProjects.length + projects.research.length;
    }
    return projects[filterKey]?.length || 0;
  };

  const getCategoryLabel = (category) => {
    switch(category) {
      case 'openSource': return 'Open Source';
      case 'clientProjects': return 'Client';
      case 'research': return 'Research';
      default: return '';
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'openSource': return 'var(--green)';
      case 'clientProjects': return 'var(--pink-accent)';
      case 'research': return 'var(--purple-accent)';
      default: return 'var(--green)';
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.05
      }
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  const item = {
    hidden: { y: 40, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    exit: {
      y: -20,
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const filteredProjects = getFilteredProjects();

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

          {/* Filter Tabs */}
          <motion.div 
            className="project_filters"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {filters.map((filter) => {
              const count = getProjectCount(filter.key);
              const isDisabled = count === 0 && filter.key !== 'all';
              
              return (
                <motion.button
                  key={filter.key}
                  className={`filter_tab ${activeFilter === filter.key ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}
                  onClick={() => !isDisabled && setActiveFilter(filter.key)}
                  whileHover={!isDisabled ? { y: -2 } : {}}
                  whileTap={!isDisabled ? { scale: 0.98 } : {}}
                  disabled={isDisabled}
                >
                  <span className="filter_icon">{filter.icon}</span>
                  <span className="filter_label">{filter.label}</span>
                  <span className="filter_count">{count}</span>
                </motion.button>
              );
            })}
          </motion.div>

          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeFilter}
                className="projects_content"
                variants={container}
                initial="hidden"
                animate="show"
                exit="exit"
              >
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project, index) => {
                    const isInverted = index % 2 !== 0;
                    return (
                      <motion.div 
                        key={`${project.category}-${index}`}
                        className={`project ${isInverted ? 'inverted' : ''}`}
                        variants={item}
                        layout
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
                              quality={100}
                              priority={index < 2}
                              sizes="(max-width: 768px) 100vw, 600px"
                            />
                          </motion.a>
                        </div>
                        <div className="project_text">
                          <div className="type">
                            {activeFilter === 'all' && (
                              <>
                                <span 
                                  className="category_badge"
                                  style={{ color: getCategoryColor(project.category) }}
                                >
                                  {getCategoryLabel(project.category)}
                                </span>
                                <span>•</span>
                              </>
                            )}
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
                          
                          {/* Research-specific metadata */}
                          {project.category === 'research' && project.authors && (
                            <div className="research_meta">
                              <div className="meta_item">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                  <circle cx="9" cy="7" r="4"></circle>
                                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                                <span className="meta_label">Co-authors:</span>
                                <span className="meta_value">{project.authors}</span>
                              </div>
                              {project.institution && (
                                <div className="meta_item">
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                                    <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                                  </svg>
                                  <span className="meta_label">Institution:</span>
                                  <span className="meta_value">{project.institution}</span>
                                </div>
                              )}
                              {project.supervisors && (
                                <div className="meta_item">
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="8" r="5"></circle>
                                    <path d="M20 21a8 8 0 1 0-16 0"></path>
                                  </svg>
                                  <span className="meta_label">Supervisors:</span>
                                  <span className="meta_value">{project.supervisors}</span>
                                </div>
                              )}
                            </div>
                          )}
                          
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
                  <motion.div 
                    className="no-projects"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="no-projects-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                        <polyline points="13 2 13 9 20 9"></polyline>
                      </svg>
                    </div>
                    <p>No projects in this category yet</p>
                    <span>Check back soon for updates!</span>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>
      <div className="section_end projects_end"></div>
    </>
  );
}
