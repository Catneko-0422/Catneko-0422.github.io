'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGithub, faLinkedin, faInstagram, faFacebook, faDiscord
} from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faCopy, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import './flipcard.css';

const socialLinks = [
  { icon: faGithub, href: 'https://github.com/Catneko-0422', label: 'GitHub', external: true },
  { icon: faLinkedin, href: '', label: 'LinkedIn', disabled: true },
  { icon: faInstagram, href: 'https://www.instagram.com/neko._cat422/', label: 'Instagram', external: true },
  { icon: faFacebook, href: 'https://www.facebook.com/neko.cat.863674/', label: 'Facebook', external: true },
  { icon: faDiscord, href: '', label: 'Discord', disabled: true },
];

const Contact = () => {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText('linyian0422@gmail.com');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.open('mailto:linyian0422@gmail.com');
    }
  };

  return (
    <div className="w-full flex items-center justify-center p-4">
      <div className="flip-container group mt-8 sm:mt-16">
        <div className="flipper">
          {/* Front: Image + Info */}
          <div className="front flex flex-col">
            <div className="relative flex-1 overflow-hidden rounded-t-3xl">
              <img
                src="/Contact_card.jpg"
                alt="Contact card"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
            <div className="px-6 py-4 bg-white/10 dark:bg-white/5 backdrop-blur-2xl border-t border-white/10 rounded-b-3xl">
              <h2 className="text-2xl font-bold text-foreground mb-1">Contact Me</h2>
              <p className="text-foreground/50 text-sm">Hover to flip</p>
            </div>
          </div>

          {/* Back: Info */}
          <div className="back bg-white/10 dark:bg-white/5 backdrop-blur-2xl border border-white/10 dark:border-white/5 flex flex-col">
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-purple-500/30">
                  NC
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Nekocat</h1>
                  <p className="text-sm text-foreground/50">Web Developer & AI Explorer</p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="px-6 py-4 border-b border-white/10">
              <p className="text-xs text-foreground/40 uppercase tracking-wider mb-2">Email</p>
              <button
                onClick={copyEmail}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all duration-200 group/btn text-left"
              >
                <FontAwesomeIcon icon={faEnvelope} className="text-purple-400" />
                <span className="text-sm text-foreground/80 flex-1 truncate">linyian0422@gmail.com</span>
                <FontAwesomeIcon
                  icon={copied ? faCheck : faCopy}
                  className={`text-xs transition-colors ${copied ? 'text-green-400' : 'text-foreground/30 group-hover/btn:text-foreground/60'}`}
                />
              </button>
            </div>

            {/* Social Links */}
            <div className="px-6 py-4 flex-1">
              <p className="text-xs text-foreground/40 uppercase tracking-wider mb-3">Social</p>
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((link) => (
                  link.disabled ? (
                    <div
                      key={link.label}
                      className="social-btn disabled"
                      title="Coming Soon"
                    >
                      <FontAwesomeIcon icon={link.icon} />
                    </div>
                  ) : (
                    <a
                      key={link.label}
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      className="social-btn"
                      aria-label={link.label}
                    >
                      <FontAwesomeIcon icon={link.icon} />
                    </a>
                  )
                ))}
              </div>
            </div>

            {/* Footer hint */}
            <div className="px-6 pb-4">
              <p className="text-xs text-foreground/30 text-center">Hover to flip back</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
