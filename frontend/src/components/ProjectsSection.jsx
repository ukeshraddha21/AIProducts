import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink, Github, TrendingUp, Filter, Sparkles, Zap } from 'lucide-react';
import { projects } from '../data/mock';

const ProjectsSection = () => {
  const [filter, setFilter] = useState('All');
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const categories = ['All', 'Product Management', 'QA Leadership'];

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

  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(project => project.category === filter);

  return (
    <section ref={sectionRef} id="projects" className="py-24 bg-gradient-to-b from-blue-50/30 to-white relative overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-l from-blue-100/30 to-transparent rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Premium Section Header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center space-x-2 bg-blue-100 px-6 py-3 rounded-full mb-6">
            <Zap className="w-5 h-5 text-blue-600" />
            <span className="text-blue-800 font-semibold">Portfolio</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-blue-900 mb-8">
            Featured <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Projects</span>
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-600 to-blue-800 mx-auto rounded-full mb-8"></div>
          <p className="text-xl text-blue-700 max-w-4xl mx-auto leading-relaxed font-medium">
            Showcase of product management and QA leadership initiatives across B2B SaaS, Banking, and Insurance domains
          </p>
        </div>

        {/* Premium Filter Buttons */}
        <div className={`flex flex-wrap justify-center gap-4 mb-16 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex items-center space-x-3 text-blue-700 mb-4 glass-card-white px-8 py-4 rounded-full shadow-xl">
            <Filter size={20} />
            <span className="font-bold">Filter by category:</span>
          </div>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-8 py-4 rounded-full font-bold transition-all duration-500 transform hover:scale-110 shadow-xl hover:shadow-2xl ${
                filter === category
                  ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-blue-500/25'
                  : 'glass-card-white text-blue-700 hover:text-blue-900'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Premium Projects Grid */}
        <div className="grid md:grid-cols-2 gap-10">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className={`group glass-project-card rounded-3xl overflow-hidden shadow-2xl hover:shadow-blue-500/20 transition-all duration-700 transform hover:-translate-y-6 hover:scale-105 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}
              style={{animationDelay: `${index * 0.2}s`}}
            >
              {/* Premium Project Image */}
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {/* Premium Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center space-x-3 text-white">
                      <TrendingUp size={20} />
                      <span className="font-bold text-lg">{project.impact}</span>
                    </div>
                  </div>
                </div>
                
                {/* Premium Category Badge */}
                <div className="absolute top-6 left-6">
                  <span className={`px-4 py-2 rounded-full text-sm font-bold backdrop-blur-md border ${
                    project.category === 'Product Management' 
                      ? 'bg-blue-100/90 text-blue-800 border-blue-200/50' 
                      : 'bg-green-100/90 text-green-800 border-green-200/50'
                  }`}>
                    {project.category}
                  </span>
                </div>

                {/* Premium Sparkle Effect */}
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
                </div>
              </div>

              {/* Premium Project Content */}
              <div className="p-8">
                <h3 className="text-2xl font-black text-blue-900 mb-4 group-hover:text-blue-700 transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-blue-700 mb-6 leading-relaxed font-medium">
                  {project.description}
                </p>

                {/* Premium Technologies */}
                <div className="flex flex-wrap gap-3 mb-8">
                  {project.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 rounded-full text-sm font-semibold border border-blue-200/50 hover:from-blue-100 hover:to-blue-200 transition-all duration-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Premium Impact Metric */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-2xl mb-8 border border-blue-200/50">
                  <div className="flex items-center space-x-3 text-blue-800 mb-2">
                    <TrendingUp size={20} />
                    <span className="font-bold text-lg">Key Impact:</span>
                  </div>
                  <p className="text-blue-900 font-bold text-xl">{project.impact}</p>
                </div>

                {/* Premium Action Buttons */}
                <div className="flex space-x-4">
                  <button
                    onClick={() => alert('Demo link will be implemented with backend')}
                    className="flex items-center space-x-3 flex-1 bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4 px-6 rounded-2xl hover:from-blue-700 hover:to-blue-900 transition-all duration-300 font-bold shadow-lg hover:shadow-blue-500/25 transform hover:scale-105"
                  >
                    <ExternalLink size={18} />
                    <span>View Details</span>
                  </button>
                  
                  <button
                    onClick={() => alert('GitHub link will be implemented with backend')}
                    className="flex items-center space-x-3 bg-white/90 backdrop-blur-md border-2 border-blue-200 text-blue-700 py-4 px-6 rounded-2xl hover:border-blue-600 hover:text-blue-900 hover:bg-blue-50 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Github size={18} />
                    <span>Code</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Premium Results Summary */}
        <div className={`mt-20 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-10 rounded-3xl shadow-2xl text-white overflow-hidden relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
            
            <div className="relative z-10">
              <h3 className="text-3xl font-black text-center mb-12 flex items-center justify-center">
                <Sparkles className="w-8 h-8 mr-3" />
                Cumulative Impact Across Projects
              </h3>
              <div className="grid md:grid-cols-4 gap-8 text-center">
                {[
                  { value: '25%', label: 'Feature Adoption Improvement', icon: '📈' },
                  { value: '40%', label: 'Efficiency Gain', icon: '⚡' },
                  { value: '15%', label: 'Defect Reduction', icon: '🎯' },
                  { value: '95%', label: 'Test Coverage', icon: '✅' }
                ].map((stat, index) => (
                  <div 
                    key={index}
                    className="bg-white/10 backdrop-blur-md p-6 rounded-2xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105 border border-white/20"
                  >
                    <div className="text-4xl mb-3">{stat.icon}</div>
                    <div className="text-4xl font-black mb-2">{stat.value}</div>
                    <div className="text-blue-100 font-semibold">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;