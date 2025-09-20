import React, { useState } from 'react';
import { ExternalLink, Github, TrendingUp, Filter } from 'lucide-react';
import { projects } from '../data/mock';

const ProjectsSection = () => {
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'Product Management', 'QA Leadership'];

  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(project => project.category === filter);

  return (
    <section id="projects" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            Featured Projects
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Showcase of product management and QA leadership initiatives across B2B SaaS, Banking, and Insurance domains
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <div className="flex items-center space-x-2 text-slate-600 mb-4">
            <Filter size={18} />
            <span>Filter by:</span>
          </div>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                filter === category
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
            >
              {/* Project Image */}
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center space-x-2 text-white">
                      <TrendingUp size={16} />
                      <span className="text-sm font-medium">{project.impact}</span>
                    </div>
                  </div>
                </div>
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    project.category === 'Product Management' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {project.category}
                  </span>
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-slate-600 mb-4 leading-relaxed">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Impact Metric */}
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <div className="flex items-center space-x-2 text-blue-800">
                    <TrendingUp size={16} />
                    <span className="font-semibold">Key Impact:</span>
                  </div>
                  <p className="text-blue-700 font-medium mt-1">{project.impact}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <button
                    onClick={() => alert('Demo link will be implemented with backend')}
                    className="flex items-center space-x-2 flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <ExternalLink size={16} />
                    <span>View Details</span>
                  </button>
                  
                  <button
                    onClick={() => alert('GitHub link will be implemented with backend')}
                    className="flex items-center space-x-2 border-2 border-slate-300 text-slate-700 py-3 px-4 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-colors"
                  >
                    <Github size={16} />
                    <span>Code</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Results Summary */}
        <div className="mt-16 bg-white p-8 rounded-xl shadow-md">
          <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">
            Cumulative Impact Across Projects
          </h3>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-blue-600">25%</div>
              <div className="text-slate-600">Feature Adoption Improvement</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-green-600">40%</div>
              <div className="text-slate-600">Efficiency Gain</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-purple-600">15%</div>
              <div className="text-slate-600">Defect Reduction</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-orange-600">95%</div>
              <div className="text-slate-600">Test Coverage</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;