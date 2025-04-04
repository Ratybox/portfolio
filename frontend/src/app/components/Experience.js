'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export default function Experience() {
  const [jobs, setJobs] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const jobRefs = useRef([]);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/resources/jsons/experience.json');
        const data = await response.json();
        setJobs(data.experience);
        jobRefs.current = data.experience.map(() => ({ current: null }));
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des expériences:", error);
        setIsLoading(false);
      }
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 780);
    };

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      
      jobRefs.current.forEach((ref, index) => {
        if (ref?.current) {
          const rect = ref.current.getBoundingClientRect();
          
          // Élément est visible si au moins 20% est dans la fenêtre
          const isVisible = rect.top < windowHeight * 0.8 && rect.bottom > 0;
          
          if (isVisible) {
            ref.current.style.opacity = '1';
            ref.current.style.transform = 'translateY(0)';
          }
        }
      });
    };

    fetchExperience();
    handleResize();

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    
    // Observer initial pour les éléments déjà visibles
    setTimeout(handleScroll, 300);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const renderJobCard = (job, index) => {
    const isInverted = index % 2 !== 0;
    
    if (isMobile) {
      return (
        <div 
          key={index}
          ref={el => jobRefs.current[index] = { current: el }}
          className="in_animation job" 
          style={{ 
            backgroundImage: `url(${job.image})`,
            opacity: 0,
            transform: 'translateY(20px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease'
          }}
        >
          <div className="job_text">
            <div className="type">
              <span>{job.type}</span>
              <span>•</span>
              <span>{job.date}</span>
            </div>
            <a className="job_title" href={job.link} target="_blank" rel="noopener noreferrer">
              {job.title}
            </a>
            <div className="text">
              <p>{job.description}</p>
            </div>
            <div className="tags">
              {job.tags.map((tag, tagIndex) => (
                <a key={tagIndex} href={tag.url} target="_blank" rel="noopener noreferrer">
                  {tag.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div 
        key={index}
        ref={el => jobRefs.current[index] = { current: el }}
        className={`in_animation job ${isInverted ? 'inverted' : ''}`}
        style={{ 
          opacity: 0,
          transform: 'translateY(20px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease'
        }}
      >
        <div className="job_text">
          <div className="type">
            <span>{job.date}</span>
            <span>•</span>
            <span>{job.type}</span>
          </div>
          <a className="job_title" href={job.link} target="_blank" rel="noopener noreferrer">
            {job.title}
          </a>
          <div className="text">
            <p>{job.description}</p>
          </div>
          <div className="tags">
            {job.tags.map((tag, tagIndex) => (
              <a key={tagIndex} href={tag.url} target="_blank" rel="noopener noreferrer">
                {tag.name}
              </a>
            ))}
          </div>
        </div>
        <div className="job_view">
          <a href={job.link} target="_blank" rel="noopener noreferrer">
            <Image 
              src={job.image} 
              alt={`${job.title.toLowerCase()} image`} 
              width={1000} 
              height={600} 
              quality={90}
            />
          </a>
        </div>
      </div>
    );
  };

  return (
    <>
      <a id="experience"></a>
      <section className="section" id="experience_section">
        <div className="content leaning">
          <h2 className="section_title">Experience</h2>
          <div className="experience_content">
            {isLoading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
              </div>
            ) : (
              jobs.map((job, index) => renderJobCard(job, index))
            )}
          </div>
        </div>
      </section>
      <div className="section_end experience_end"></div>
    </>
  );
}
