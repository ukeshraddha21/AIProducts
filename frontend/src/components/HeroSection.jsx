import React from 'react';
import { ArrowRight, MapPin, Mail, Linkedin } from 'lucide-react';
import { personalInfo } from '../data/mock';

const HeroSection = () => {
  const scrollToProjects = () => {
    const element = document.querySelector('#projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Heading */}
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold text-slate-800 mb-4">
              {personalInfo.name}
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-blue-600 mb-6">
              {personalInfo.title}
            </h2>
            
            {/* Location and Contact */}
            <div className="flex flex-wrap justify-center items-center gap-6 text-slate-600 mb-8">
              <div className="flex items-center space-x-2">
                <MapPin size={18} />
                <span>{personalInfo.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail size={18} />
                <span>{personalInfo.email}</span>
              </div>
              <a 
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 hover:text-blue-600 transition-colors"
              >
                <Linkedin size={18} />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Summary */}
          <div className="mb-12">
            <p className="text-xl md:text-2xl text-slate-700 leading-relaxed font-light">
              {personalInfo.summary}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={scrollToProjects}
              className="group flex items-center space-x-2 bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span className="font-semibold">View My Work</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button
              onClick={scrollToContact}
              className="flex items-center space-x-2 border-2 border-slate-300 text-slate-700 px-8 py-4 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
            >
              <span className="font-semibold">Get In Touch</span>
            </button>
          </div>

          {/* Scroll Indicator */}
          <div className="mt-16 animate-bounce">
            <div className="w-6 h-10 border-2 border-slate-400 rounded-full mx-auto relative">
              <div className="w-1 h-3 bg-slate-400 rounded-full absolute top-2 left-1/2 transform -translate-x-1/2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;