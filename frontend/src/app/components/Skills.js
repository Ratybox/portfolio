'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { skillsData } from './skillsData';

// Individual skill item
const SkillItem = ({ skill, index }) => {
  return (
    <motion.div
      className="skill-item"
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ 
        duration: 0.3, 
        delay: index * 0.03,
        ease: "easeOut"
      }}
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.15 }
      }}
    >
      <div className="skill-logo">
        <Image 
          src={skill.logo} 
          alt={skill.name} 
          width={40} 
          height={40}
          style={{ objectFit: 'contain' }}
        />
      </div>
      <span className="skill-label">{skill.name}</span>
    </motion.div>
  );
};

// Category card
const CategoryCard = ({ category, skills, index }) => {
  return (
    <motion.div 
      className="category-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      <div className="category-header">
        <h3 className="category-name">{category}</h3>
        <div className="category-line"></div>
      </div>
      <div className="skills-list">
        {skills.map((skill, skillIndex) => (
          <SkillItem 
            key={skill.name} 
            skill={skill} 
            index={skillIndex}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default function Skills() {
  return (
    <>
      <a id="skills"></a>
      <section className="section" id="skills_section">
        <div className="content">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="section-label">What I Work With</span>
            <h2 className="section_title">Skills & Technologies</h2>
          </motion.div>
          
          <div className="skills-wrapper">
            {skillsData.map((categoryData, index) => (
              <CategoryCard
                key={categoryData.category}
                category={categoryData.category}
                skills={categoryData.skills}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
