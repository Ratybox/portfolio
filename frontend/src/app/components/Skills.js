'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSwipeable } from 'react-swipeable';

export default function Skills() {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [skills, setSkills] = useState({ skills_categories: [] });
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const handlers = useSwipeable({
    onSwipedLeft: () => setActiveIndex(prev => 
      Math.min(prev + 1, skills.skills_categories.length - 1)
    ),
    onSwipedRight: () => setActiveIndex(prev => 
      Math.max(prev - 1, 0)
    ),
    trackMouse: true
  });

  const scrollToCategory = (index) => {
    const element = document.getElementById(`category-${index}`);
    element?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start'
    });
  };

  useEffect(() => {
    // Charger les compétences depuis le fichier JSON
    const fetchSkills = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/resources/jsons/skills.json');
        const data = await response.json();
        setSkills(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des compétences:", error);
        setIsLoading(false);
      }
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 930);
    };

    fetchSkills();
    handleResize(); // Initialiser l'état mobile/desktop
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    scrollToCategory(activeIndex);
  }, [activeIndex]);

  useEffect(() => {
    const wrapper = document.querySelector('.categories_wrapper');
    if (!wrapper) return;

    const handleScroll = () => {
      const scrollLeft = wrapper.scrollLeft;
      const maxScroll = wrapper.scrollWidth - wrapper.clientWidth;
      const progress = maxScroll > 0 ? scrollLeft / maxScroll : 0;
      const newIndex = Math.round(progress * (skills.skills_categories.length - 1));
      
      setActiveIndex(Math.min(newIndex, skills.skills_categories.length - 1));
    };

    wrapper.addEventListener('scroll', handleScroll);
    return () => wrapper.removeEventListener('scroll', handleScroll);
  }, [skills.skills_categories.length, isLoading]);

  const renderDesktopView = () => (
    <div className="box">
      <div className="menu">
        <div 
          className="selector" 
          style={{ 
            height: `calc(100% / ${skills.skills_categories.length})`,
            top: `${(100 / skills.skills_categories.length) * selectedCategory}%` 
          }} 
        />
        {skills.skills_categories.map((category, index) => (
          <div 
            key={index} 
            className={`category ${selectedCategory === index ? 'active' : ''}`}
            onClick={() => setSelectedCategory(index)}
          >
            {category.name}
          </div>
        ))}
      </div>
      <div className="box_content">
        {skills.skills_categories.map((category, index) => (
          <div 
            key={index} 
            className="skills_list" 
            style={{ display: selectedCategory === index ? 'grid' : 'none' }}
          >
            {category.skills.map((skill, skillIndex) => (
              <a 
                key={skillIndex} 
                className="skill" 
                href={skill.link} 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label={skill.name}
              >
                <Image 
                  src={skill.logo} 
                  alt={skill.name.toLowerCase()} 
                  width={65} 
                  height={65} 
                />
                <span>{skill.name}</span>
              </a>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  const renderMobileView = () => (
    <div {...handlers} className="categories_wrapper">
      {skills.skills_categories.map((category, index) => (
        <div 
          key={index} 
          id={`category-${index}`}
          className="category_container"
        >
          <div className="category_title">{category.name}</div>
          <div className="box_content">
            <div className="skills_list">
              {category.skills.map((skill, skillIndex) => (
                <a 
                  key={skillIndex} 
                  className="skill" 
                  href={skill.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label={skill.name}
                >
                  <Image 
                    src={skill.logo} 
                    alt={skill.name.toLowerCase()} 
                    width={65} 
                    height={65} 
                  />
                  <span>{skill.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      ))}
      <div className="nav_dots">
        {skills.skills_categories.map((category, index) => (
          <div 
            key={index}
            className={`nav_dot ${activeIndex === index ? 'active' : ''}`}
            onClick={() => setActiveIndex(index)}
            aria-label={category.name}
          />
        ))}
      </div>
    </div>
  );

  return (
    <>
      <a id="skills"></a>
      <section className="section" id="skills_section">
        <div className="content leaning">
          <h2 className="section_title">Skills</h2>
          <div className="skills_content">
            {isLoading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
              </div>
            ) : (
              isMobile ? renderMobileView() : renderDesktopView()
            )}
          </div>
        </div>
      </section>
      <div className="section_end skills_end"></div>
    </>
  );
}
