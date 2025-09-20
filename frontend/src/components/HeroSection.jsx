import React, { useEffect, useState } from 'react';
import { ArrowRight, MapPin, Mail, Linkedin, Sparkles, TrendingUp } from 'lucide-react';
import { personalInfo } from '../data/mock';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-blue-300/20 rounded-full blur-2xl animate-float"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-r from-blue-300/15 to-blue-200/15 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-r from-blue-500/10 to-blue-400/10 rounded-full blur-2xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(72,123,226,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(72,123,226,0.1)_1px,transparent_1px)] bg-[size:100px_100px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          {/* Main Content */}
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Premium Glassmorphism Badge */}
            <div className="inline-flex items-center space-x-2 glass-hero-card px-8 py-4 rounded-full mb-8 animate-glow">
              <Sparkles className="w-6 h-6 text-yellow-300" />
              <span className="text-white font-semibold text-lg">Certified Product Owner</span>
              <TrendingUp className="w-6 h-6 text-green-300" />
            </div>

            {/* Main Heading */}
            <div className="mb-8">
              <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tight">
                <span className="bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
                  {personalInfo.name}
                </span>
              </h1>
              <h2 className="text-2xl md:text-4xl font-bold text-blue-100 mb-8 leading-relaxed">
                {personalInfo.title}
              </h2>
              
              {/* Premium Glassmorphism Contact Info */}
              <div className="flex flex-wrap justify-center items-center gap-6 text-blue-100 mb-10">
                <div className="flex items-center space-x-3 glass-hero-card px-6 py-3 rounded-2xl hover:scale-105 transition-all duration-300">
                  <MapPin size={20} className="text-blue-200" />
                  <span className="font-semibold">{personalInfo.location}</span>
                </div>
                <div className="flex items-center space-x-3 glass-hero-card px-6 py-3 rounded-2xl hover:scale-105 transition-all duration-300">
                  <Mail size={20} className="text-blue-200" />
                  <span className="font-semibold">{personalInfo.email}</span>
                </div>
                <a 
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 glass-hero-card px-6 py-3 rounded-2xl hover:scale-110 transition-all duration-300 transform"
                >
                  <Linkedin size={20} className="text-blue-200" />
                  <span className="font-semibold">LinkedIn</span>
                </a>
              </div>
            </div>

            {/* Premium Glassmorphism Summary */}
            <div className="mb-12">
              <div className="glass-hero-card rounded-3xl p-10 max-w-5xl mx-auto hover:scale-105 transition-all duration-500">
                <p className="text-xl md:text-2xl text-white leading-relaxed font-light">
                  {personalInfo.summary}
                </p>
              </div>
            </div>

            {/* Premium CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button
                onClick={scrollToProjects}
                className="group relative bg-gradient-to-r from-white to-blue-50 text-blue-900 px-10 py-5 rounded-2xl hover:from-blue-50 hover:to-white transition-all duration-500 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25 font-bold text-lg"
              >
                <div className="flex items-center space-x-3">
                  <span>Explore My Work</span>
                  <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform duration-300" />
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/20 to-blue-300/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              
              <button
                onClick={scrollToContact}
                className="group border-2 border-white/30 text-white px-10 py-5 rounded-2xl hover:border-white hover:bg-white/10 transition-all duration-500 transform hover:scale-105 backdrop-blur-md font-bold text-lg"
              >
                <div className="flex items-center space-x-3">
                  <span>Let's Connect</span>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </button>
            </div>

            {/* Premium Glassmorphism Achievement Stats */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { number: '12+', label: 'Years Experience', icon: '🏆' },
                { number: '6+', label: 'Certifications', icon: '🎓' },
                { number: '25%', label: 'Feature Adoption', icon: '📈' },
                { number: '40%', label: 'Efficiency Gain', icon: '⚡' }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className="glass-hero-card rounded-2xl p-8 text-center hover:scale-110 transition-all duration-500 transform"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="text-4xl mb-3">{stat.icon}</div>
                  <div className="text-3xl font-black text-white mb-2">{stat.number}</div>
                  <div className="text-blue-100 text-sm font-semibold">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Animated Scroll Indicator */}
          <div className="mt-20 animate-bounce">
            <div className="w-8 h-12 border-2 border-white/40 rounded-full mx-auto relative">
              <div className="w-2 h-4 bg-white/60 rounded-full absolute top-3 left-1/2 transform -translate-x-1/2 animate-pulse"></div>
            </div>
            <p className="text-white/60 text-sm mt-4 font-medium">Scroll to explore</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;