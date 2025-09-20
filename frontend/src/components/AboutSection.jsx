import React from 'react';
import { Target, Users, BarChart, Lightbulb } from 'lucide-react';
import { personalInfo } from '../data/mock';

const AboutSection = () => {
  const highlights = [
    {
      icon: <Target className="w-8 h-8 text-blue-600" />,
      title: "Product Vision",
      description: "12+ years shaping product requirements and aligning teams to strategic goals"
    },
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: "Team Leadership", 
      description: "6+ years in QA leadership with proven success in cross-functional collaboration"
    },
    {
      icon: <BarChart className="w-8 h-8 text-blue-600" />,
      title: "Data-Driven Results",
      description: "Delivered 25% improvement in feature adoption through AI-powered insights"
    },
    {
      icon: <Lightbulb className="w-8 h-8 text-blue-600" />,
      title: "Agile Excellence",
      description: "CSPO® certified with expertise in stakeholder engagement and process optimization"
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            About Me
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Career Vision */}
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-slate-800 mb-6">
              Career Vision
            </h3>
            <p className="text-lg text-slate-700 leading-relaxed">
              {personalInfo.careerVision}
            </p>
            
            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
              <p className="text-slate-700 italic">
                "Believer in minimalist, outcome-driven delivery and solving the right problems simply and effectively."
              </p>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">12+</div>
                <div className="text-sm text-slate-600">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">6+</div>
                <div className="text-sm text-slate-600">Years Leadership</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">5+</div>
                <div className="text-sm text-slate-600">Certifications</div>
              </div>
            </div>
          </div>

          {/* Highlights Grid */}
          <div className="grid gap-6">
            {highlights.map((highlight, index) => (
              <div 
                key={index}
                className="group bg-slate-50 p-6 rounded-lg hover:bg-blue-50 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 p-3 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                    {highlight.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-slate-800 mb-2">
                      {highlight.title}
                    </h4>
                    <p className="text-slate-600 leading-relaxed">
                      {highlight.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Domain Expertise */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-slate-800 mb-8 text-center">
            Domain Expertise
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {['B2B SaaS', 'Investment Banking', 'Insurance', 'Product Analytics', 'Agile Delivery', 'Process Optimization'].map((domain, index) => (
              <span 
                key={index}
                className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-medium hover:bg-blue-200 transition-colors"
              >
                {domain}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;