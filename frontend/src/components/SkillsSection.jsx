import React, { useState } from 'react';
import { ChevronRight, Star, Award } from 'lucide-react';
import { skills, certifications } from '../data/mock';

const SkillsSection = () => {
  const [hoveredSkill, setHoveredSkill] = useState(null);

  const getLevelColor = (level) => {
    switch (level) {
      case 'Expert': return 'bg-green-500';
      case 'Advanced': return 'bg-blue-500';
      case 'Intermediate': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getLevelWidth = (level) => {
    switch (level) {
      case 'Expert': return 'w-full';
      case 'Advanced': return 'w-4/5';
      case 'Intermediate': return 'w-3/5';
      default: return 'w-2/5';
    }
  };

  return (
    <section id="skills" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            Skills & Expertise
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Comprehensive skill set spanning product ownership, agile methodologies, and technical tools
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {skills.map((category, categoryIndex) => (
            <div key={categoryIndex} className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                <ChevronRight className="w-6 h-6 text-blue-600 mr-2" />
                {category.category}
              </h3>
              
              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <div
                    key={skillIndex}
                    className="group bg-slate-50 p-4 rounded-lg hover:bg-blue-50 transition-all duration-300 cursor-pointer transform hover:scale-105"
                    onMouseEnter={() => setHoveredSkill(`${categoryIndex}-${skillIndex}`)}
                    onMouseLeave={() => setHoveredSkill(null)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{skill.icon}</span>
                        <h4 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                          {skill.name}
                        </h4>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        skill.level === 'Expert' ? 'bg-green-100 text-green-800' :
                        skill.level === 'Advanced' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {skill.level}
                      </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${getLevelColor(skill.level)} ${
                          hoveredSkill === `${categoryIndex}-${skillIndex}` ? getLevelWidth(skill.level) : 'w-0'
                        }`}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Certifications Section */}
        <div className="bg-slate-50 p-8 rounded-2xl">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-800 mb-4 flex items-center justify-center">
              <Award className="w-8 h-8 text-blue-600 mr-3" />
              Certifications & Credentials
            </h3>
            <p className="text-slate-600">Professional certifications demonstrating expertise in product ownership and agile methodologies</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert) => (
              <div
                key={cert.id}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
              >
                <div className="text-center mb-4">
                  <div className="text-4xl mb-3">{cert.badge}</div>
                  <h4 className="font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {cert.name}
                  </h4>
                  <p className="text-blue-600 font-medium text-sm">{cert.issuer}</p>
                  <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium mt-2">
                    {cert.date}
                  </span>
                </div>
                
                <p className="text-slate-600 text-sm leading-relaxed">
                  {cert.description}
                </p>

                {/* Special highlight for AI certifications */}
                {(cert.name.includes('AI') || cert.name.includes('AI-')) && (
                  <div className="mt-4 flex items-center justify-center">
                    <span className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium flex items-center">
                      <Star size={12} className="mr-1" />
                      AI Micro-credential
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Skills Summary */}
        <div className="mt-16 text-center">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-blue-600">16+</div>
              <div className="text-slate-600">Technical Skills</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-green-600">5</div>
              <div className="text-slate-600">Professional Certifications</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-purple-600">2</div>
              <div className="text-slate-600">AI Micro-credentials</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-orange-600">4</div>
              <div className="text-slate-600">Skill Categories</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;