import React, { useState, useEffect } from 'react';
import { Menu, X, Download, Sparkles } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Projects", href: "#projects" },
    { name: "Skills", href: "#skills" },
    { name: "Experience", href: "#experience" },
    { name: "Contact", href: "#contact" }
  ];

  const handleDownloadResume = async () => {
    try {
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${BACKEND_URL}/api/resume/download`);
      
      if (!response.ok) {
        throw new Error('Failed to download resume');
      }
      
      // Create blob from response
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Shraddha_Uke_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Error downloading resume:', error);
      alert('Failed to download resume. Please try again.');
    }
  };

  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'glass-nav shadow-2xl' 
        : 'glass-nav'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Premium Logo/Name */}
          <div className="flex-shrink-0">
            <button 
              onClick={() => scrollToSection('#home')}
              className="group flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-black text-blue-900 group-hover:text-blue-700 transition-colors">
                Shraddha Uke
              </span>
            </button>
          </div>

          {/* Premium Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="relative px-4 py-2 text-blue-700 hover:text-blue-900 font-semibold transition-all duration-300 group rounded-lg hover:bg-blue-50"
              >
                {item.name}
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-800 transition-all duration-300 group-hover:w-full group-hover:left-0 rounded-full"></span>
              </button>
            ))}
          </nav>

          {/* Premium Resume Download & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleDownloadResume}
              className="hidden sm:flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-900 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25 font-semibold"
            >
              <Download size={18} />
              <span>Resume</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-3 rounded-xl text-blue-700 hover:text-blue-900 hover:bg-blue-50 transition-all duration-300"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Premium Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-blue-100 py-6 bg-white/95 backdrop-blur-lg rounded-b-2xl mt-2 mx-2 shadow-xl">
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="text-blue-700 hover:text-blue-900 font-semibold py-3 px-4 text-left rounded-lg hover:bg-blue-50 transition-all duration-300"
                >
                  {item.name}
                </button>
              ))}
              <button
                onClick={handleDownloadResume}
                className="flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-4 rounded-xl hover:from-blue-700 hover:to-blue-900 transition-all duration-300 w-full mt-4 font-semibold"
              >
                <Download size={18} />
                <span>Download Resume</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;