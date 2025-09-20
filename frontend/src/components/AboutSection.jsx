import React, { useEffect, useRef, useState } from 'react';
import { Target, Users, BarChart, Lightbulb, Sparkles } from 'lucide-react';
import { personalInfo } from '../data/mock';

const AboutSection = () => {
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

  const highlights = [
    {
      icon: <Target className="w-8 h-8 text-blue-600" />,
      title: "Product Vision",
      description: "12+ years shaping product requirements and aligning teams to strategic goals",
      gradient: "from-blue-500 to-blue-700"
    },
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: "Team Leadership", 
      description: "6+ years in QA leadership with proven success in cross-functional collaboration",
      gradient: "from-blue-600 to-blue-800"
    },
    {
      icon: <BarChart className="w-8 h-8 text-blue-600" />,
      title: "Data-Driven Results",
      description: "Delivered 25% improvement in feature adoption through AI-powered insights",
      gradient: "from-blue-700 to-blue-900"
    },
    {
      icon: <Lightbulb className="w-8 h-8 text-blue-600" />,
      title: "Agile Excellence",
      description: "CSPO® certified with expertise in stakeholder engagement and process optimization",
      gradient: "from-blue-800 to-blue-900"
    }
  ];

  return (
    <section ref={sectionRef} id="about" className="py-24 bg-gradient-to-b from-white to-blue-50/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-blue-100/30 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-r from-blue-100/20 to-transparent rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Premium Section Header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center space-x-2 bg-blue-100 px-6 py-3 rounded-full mb-6">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span className="text-blue-800 font-semibold">About Me</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-blue-900 mb-8">
            Career <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Journey</span>
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-600 to-blue-800 mx-auto rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Career Vision */}
          <div className={`space-y-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <div className="glass-card-white rounded-3xl p-10 shadow-2xl hover:scale-105 transition-all duration-500">
              <h3 className="text-3xl font-black text-blue-900 mb-6 flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                  <Target className="w-6 h-6 text-white" />
                </div>
                Career Vision
              </h3>
              <p className="text-lg text-blue-800 leading-relaxed mb-6">
                {personalInfo.careerVision}
              </p>
              
              <div className="glass-card rounded-2xl p-8 border-l-4 border-blue-600 hover:scale-105 transition-all duration-300">
                <p className="text-blue-800 italic font-bold text-lg">
                  "Believer in minimalist, outcome-driven delivery and solving the right problems simply and effectively."
                </p>
              </div>
            </div>

            {/* Premium Key Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: '12+', label: 'Years Experience', icon: '🏆' },
                { value: '6+', label: 'Years Leadership', icon: '👥' },
                { value: '6+', label: 'Certifications', icon: '🎓' }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className="glass-card-white p-8 rounded-3xl text-center shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-110"
                >
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-3xl font-black text-blue-900">{stat.value}</div>
                  <div className="text-sm text-blue-600 font-semibold">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Premium Highlights Grid */}
          <div className={`grid gap-6 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            {highlights.map((highlight, index) => (
              <div 
                key={index}
                className="group relative bg-white/80 backdrop-blur-md p-8 rounded-3xl hover:bg-white transition-all duration-500 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 border border-blue-100/50 overflow-hidden"
              >
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-r ${highlight.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`}></div>
                
                <div className="relative z-10 flex items-start space-x-6">
                  <div className={`flex-shrink-0 p-4 bg-gradient-to-br ${highlight.gradient} rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110`}>
                    {React.cloneElement(highlight.icon, { className: "w-8 h-8 text-white" })}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold text-blue-900 mb-3 group-hover:text-blue-700 transition-colors">
                      {highlight.title}
                    </h4>
                    <p className="text-blue-700 leading-relaxed font-medium">
                      {highlight.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Premium Domain Expertise */}
        <div className={`mt-24 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-10 shadow-2xl border border-blue-100/50">
            <h3 className="text-3xl font-bold text-blue-900 mb-8 text-center flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-blue-600 mr-3" />
              Domain Expertise
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {['B2B SaaS', 'Investment Banking', 'Insurance', 'Product Analytics', 'Agile Delivery', 'Process Optimization'].map((domain, index) => (
                <span 
                  key={index}
                  className="px-6 py-3 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 rounded-full font-semibold hover:from-blue-200 hover:to-blue-300 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg border border-blue-200/50"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  {domain}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;