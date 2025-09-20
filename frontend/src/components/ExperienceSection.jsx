import React from 'react';
import { Calendar, MapPin, CheckCircle, Building } from 'lucide-react';
import { experience } from '../data/mock';

const ExperienceSection = () => {
  return (
    <section id="experience" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            Professional Experience
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Progressive career journey from QA engineering to product ownership across leading technology companies
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-blue-200 transform md:-translate-x-1/2"></div>

          {experience.map((job, index) => (
            <div key={job.id} className="relative mb-16 last:mb-0">
              {/* Timeline Dot */}
              <div className="absolute left-6 md:left-1/2 w-4 h-4 bg-blue-600 rounded-full transform md:-translate-x-1/2 md:-translate-y-1/2 md:top-8 top-6 border-4 border-white shadow-lg"></div>

              {/* Content Card */}
              <div className={`ml-16 md:ml-0 md:w-5/12 ${
                index % 2 === 0 ? 'md:ml-auto md:pl-8' : 'md:mr-auto md:pr-8'
              }`}>
                <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  {/* Company and Position */}
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="flex-shrink-0 p-3 bg-blue-100 rounded-lg">
                      <Building className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-slate-800 mb-2">
                        {job.position}
                      </h3>
                      <h4 className="text-xl font-semibold text-blue-600 mb-3">
                        {job.company}
                      </h4>
                      
                      {/* Duration and Location */}
                      <div className="flex flex-wrap gap-4 text-slate-600">
                        <div className="flex items-center space-x-2">
                          <Calendar size={16} />
                          <span className="font-medium">{job.duration}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin size={16} />
                          <span>{job.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Key Highlights */}
                  <div className="space-y-3">
                    <h5 className="font-semibold text-slate-800 mb-4">Key Achievements:</h5>
                    {job.highlights.map((highlight, highlightIndex) => (
                      <div key={highlightIndex} className="flex items-start space-x-3 group">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                        <p className="text-slate-700 leading-relaxed group-hover:text-slate-800 transition-colors">
                          {highlight}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Experience Level Indicator */}
                  <div className="mt-6 pt-6 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Experience Level</span>
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < (index === 0 ? 5 : index === 1 ? 4 : 3) 
                                ? 'bg-blue-600' 
                                : 'bg-slate-300'
                            }`}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Career Summary */}
        <div className="mt-20 bg-white p-8 rounded-xl shadow-md">
          <h3 className="text-2xl font-bold text-slate-800 mb-8 text-center">
            Career Progression Highlights
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Building className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-slate-800">3+</div>
              <div className="text-slate-600">Companies</div>
              <div className="text-sm text-slate-500">From startups to enterprise</div>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-slate-800">10+</div>
              <div className="text-slate-600">Feature Teams</div>
              <div className="text-sm text-slate-500">Global database migration</div>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-slate-800">12+</div>
              <div className="text-slate-600">Years</div>
              <div className="text-sm text-slate-500">Progressive career growth</div>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                <MapPin className="w-8 h-8 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-slate-800">3</div>
              <div className="text-slate-600">Domains</div>
              <div className="text-sm text-slate-500">SaaS, Banking, Insurance</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;