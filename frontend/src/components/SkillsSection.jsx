import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Star, Award, Sparkles, Zap, Crown } from 'lucide-react';
import { skills, certifications } from '../data/mock';

const SkillsSection = () => {
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const getLevelColor = (level) => {
    switch (level) {
      case 'Expert': return 'from-green-500 to-green-600';
      case 'Advanced': return 'from-blue-500 to-blue-600';
      case 'Intermediate': return 'from-yellow-500 to-yellow-600';
      default: return 'from-gray-400 to-gray-500';
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
    <section ref={sectionRef} id="skills" className="py-24 bg-gradient-to-b from-white to-blue-50/30 relative overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-blue-200/20 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-r from-blue-100/30 to-transparent rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Premium Section Header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center space-x-2 bg-blue-100 px-6 py-3 rounded-full mb-6">
            <Crown className="w-5 h-5 text-blue-600" />
            <span className="text-blue-800 font-semibold">Expertise</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-blue-900 mb-8">
            Skills & <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Mastery</span>
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-600 to-blue-800 mx-auto rounded-full mb-8"></div>
          <p className="text-xl text-blue-700 max-w-4xl mx-auto leading-relaxed font-medium">
            Comprehensive skill set spanning product ownership, agile methodologies, and technical tools
          </p>
        </div>

        {/* Premium Skills Grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-24">
          {skills.map((category, categoryIndex) => (
            <div 
              key={categoryIndex} 
              className={`space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{animationDelay: `${categoryIndex * 0.2}s`}}
            >
              <div className="glass-card-white rounded-3xl p-10 shadow-2xl hover:shadow-blue-500/20 hover:scale-105 transition-all duration-500">
                <h3 className="text-4xl font-black text-blue-900 mb-10 flex items-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl flex items-center justify-center mr-5 shadow-xl">
                    <ChevronRight className="w-7 h-7 text-white" />
                  </div>
                  {category.category}
                </h3>
                
                <div className="space-y-6">
                  {category.skills.map((skill, skillIndex) => (
                    <div
                      key={skillIndex}
                      className="group glass-skill-card p-8 rounded-3xl hover:scale-110 transition-all duration-500 cursor-pointer transform shadow-xl hover:shadow-2xl hover:shadow-blue-500/20"
                      onMouseEnter={() => setHoveredSkill(`${categoryIndex}-${skillIndex}`)}
                      onMouseLeave={() => setHoveredSkill(null)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="text-4xl p-4 glass-card rounded-2xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                            {skill.icon}
                          </div>
                          <h4 className="font-bold text-xl text-blue-900 group-hover:text-blue-700 transition-colors">
                            {skill.name}
                          </h4>
                        </div>
                        <span className={`px-6 py-3 rounded-2xl text-sm font-bold shadow-lg glass-card hover:scale-110 transition-all duration-300 cursor-pointer ${
                          skill.level === 'Expert' ? 'text-green-800' :
                          skill.level === 'Advanced' ? 'text-blue-800' :
                          'text-yellow-800'
                        }`}>
                          {skill.level}
                        </span>
                      </div>
                      
                      {/* Premium Progress Bar */}
                      <div className="relative">
                        <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                          <div 
                            className={`h-3 rounded-full transition-all duration-1000 bg-gradient-to-r ${getLevelColor(skill.level)} ${
                              hoveredSkill === `${categoryIndex}-${skillIndex}` ? getLevelWidth(skill.level) : 'w-0'
                            } shadow-lg`}
                          ></div>
                        </div>
                        {hoveredSkill === `${categoryIndex}-${skillIndex}` && (
                          <div className="absolute right-0 top-5 bg-blue-900 text-white px-3 py-1 rounded-lg text-sm font-bold shadow-lg">
                            {skill.level}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Premium Certifications Section */}
        <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-12 rounded-3xl shadow-2xl relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
            
            <div className="relative z-10">
              <div className="text-center mb-16">
                <h3 className="text-4xl font-black text-white mb-6 flex items-center justify-center">
                  <Award className="w-10 h-10 text-yellow-300 mr-4" />
                  Certifications & Credentials
                </h3>
                <p className="text-blue-100 text-lg font-medium max-w-3xl mx-auto">
                  Professional certifications demonstrating expertise in product ownership and agile methodologies
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {certifications.map((cert, index) => (
                  <div
                    key={cert.id}
                    className="bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group border border-white/20 hover:border-white/40 hover:bg-white/15"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <div className="text-center mb-6">
                      <div className="text-5xl mb-4">{cert.badge}</div>
                      <h4 className="font-black text-xl text-white mb-3 group-hover:text-blue-100 transition-colors">
                        {cert.name}
                      </h4>
                      <p className="text-blue-200 font-bold text-sm">{cert.issuer}</p>
                      <span className="inline-block bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-bold mt-3 border border-white/30">
                        {cert.date}
                      </span>
                    </div>
                    
                    <p className="text-blue-100 text-sm leading-relaxed mb-6 font-medium">
                      {cert.description}
                    </p>

                    {/* Special highlight for AI certifications */}
                    {(cert.name.includes('AI-PO') || cert.name.includes('AI-SM')) && (
                      <div className="flex items-center justify-center">
                        <span className="bg-gradient-to-r from-yellow-300 to-yellow-400 text-yellow-900 px-4 py-2 rounded-full text-xs font-black flex items-center shadow-lg">
                          <Star size={14} className="mr-2" />
                          AI Micro-credential
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Premium Skills Summary */}
        <div className={`mt-20 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-10 shadow-2xl border border-blue-100/50">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              {[
                { value: '16+', label: 'Technical Skills', icon: '🛠️', color: 'from-blue-600 to-blue-800' },
                { value: '6', label: 'Professional Certifications', icon: '🏆', color: 'from-green-600 to-green-800' },
                { value: '2', label: 'AI Micro-credentials', icon: '🤖', color: 'from-purple-600 to-purple-800' },
                { value: '4', label: 'Skill Categories', icon: '📚', color: 'from-orange-600 to-orange-800' }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className="group space-y-4 p-6 rounded-2xl hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="text-5xl">{stat.icon}</div>
                  <div className={`text-4xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}
                  </div>
                  <div className="text-blue-700 font-bold">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;