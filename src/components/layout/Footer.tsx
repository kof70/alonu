/**
 * Footer Component
 * Footer complet avec liens de navigation et réseaux sociaux
 * Inspiré du footer-04.jsx du wireframe
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'Facebook',
      icon: FaFacebook,
      url: 'https://facebook.com/alonu',
      color: 'hover:text-blue-600',
    },
    {
      name: 'Twitter',
      icon: FaTwitter,
      url: 'https://twitter.com/alonu',
      color: 'hover:text-sky-500',
    },
    {
      name: 'Instagram',
      icon: FaInstagram,
      url: 'https://instagram.com/alonu',
      color: 'hover:text-pink-600',
    },
    {
      name: 'LinkedIn',
      icon: FaLinkedin,
      url: 'https://linkedin.com/company/alonu',
      color: 'hover:text-blue-700',
    },
    {
      name: 'YouTube',
      icon: FaYoutube,
      url: 'https://youtube.com/@alonu',
      color: 'hover:text-red-600',
    },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          {/* Brand Column */}
          <div className="text-center md:text-left max-w-md">
            <Link to="/" className="inline-flex items-center space-x-3 mb-4">
              <img 
                src="/favicon.png" 
                alt="Logo CRM" 
                className="h-10 w-auto"
              />
              <span className="text-2xl font-bold" style={{ color: '#006E4F' }}>
                ALONU
              </span>
            </Link>
            <p className="text-gray-400 text-sm mb-6">
              La plateforme qui connecte les artisans passionnés avec les clients à la recherche de
              savoir-faire authentique.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-start space-x-3 justify-center md:justify-start">
                <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5 text-primary" />
                <span>Lomé, Togo</span>
              </div>
              <div className="flex items-center space-x-3 justify-center md:justify-start">
                <Phone className="h-5 w-5 flex-shrink-0 text-primary" />
                <span>+228 90 15 47 45</span>
              </div>
              <div className="flex items-center space-x-3 justify-center md:justify-start">
                <Mail className="h-5 w-5 flex-shrink-0 text-primary" />
                <span>contactalonu@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Social Icons */}
          <div className="text-center md:text-right">
            <h3 className="text-lg font-semibold mb-4">Suivez-nous</h3>
            <div className="flex items-center space-x-4 justify-center md:justify-end">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-gray-400 ${social.color} transition-colors`}
                    aria-label={social.name}
                  >
                    <Icon className="h-6 w-6" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 bg-gray-900/50">
        <div className="container mx-auto px-4 py-4">
          <p className="text-sm text-gray-400 text-center">
            © {currentYear} ALONU. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;