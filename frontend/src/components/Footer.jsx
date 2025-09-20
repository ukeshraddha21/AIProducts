import React from 'react';
import { Heart, ArrowUp } from 'lucide-react';
import { personalInfo } from '../data/mock';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-800 text-white py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">{personalInfo.name}</h3>
            <p className="text-slate-300 leading-relaxed">
              {personalInfo.title} passionate about building exceptional products and leading agile transformations.
            </p>
            <div className="text-slate-400">
              <p>{personalInfo.location}</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <div className="space-y-2">
              {[
                { name: 'About Me', href: '#about' },
                { name: 'Projects', href: '#projects' },
                { name: 'Skills', href: '#skills' },
                { name: 'Experience', href: '#experience' },
                { name: 'Contact', href: '#contact' }
              ].map((link, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const element = document.querySelector(link.href);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="block text-slate-300 hover:text-white transition-colors"
                >
                  {link.name}
                </button>
              ))}
            </div>
          </div>

          {/* Professional Focus */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Professional Focus</h4>
            <div className="space-y-2 text-slate-300">
              <p>• Product Ownership</p>
              <p>• Agile Transformation</p>
              <p>• QA Leadership</p>
              <p>• Stakeholder Engagement</p>
              <p>• Data-Driven Decisions</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-2 text-slate-400">
              <span>© {currentYear} {personalInfo.name}. Built with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>and dedication to excellence.</span>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-6">
              <a
                href={`mailto:${personalInfo.email}`}
                className="text-slate-400 hover:text-white transition-colors"
              >
                Email
              </a>
              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="absolute bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl"
        aria-label="Back to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </footer>
  );
};

export default Footer;