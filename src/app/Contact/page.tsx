'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGithub, faLinkedin, faInstagram, faFacebook, faDiscord
} from '@fortawesome/free-brands-svg-icons';
import React from 'react';
import './flipcard.css';

const Contact = () => {
  return (
    <div className="w-full flex items-center justify-center p-4">
      <div className="flip-container group w-full max-w-[90vw] sm:max-w-[500px] md:max-w-[600px] h-auto sm:h-[350px] sm:mt-[8%] mt-10">
        <div className="flipper group-hover:rotate-y-180 transition-transform duration-500">
          {/* 上半部：圖片 */}
          <div
            className="front bg-cover bg-center rounded-t-xl md:rounded-xl"
            style={{
                backgroundImage: "url('/Contact_card.jpg')",
                height: '350px',
            }}
          >
          </div>

          {/* 下半部：資訊 */}
          <div className="back bg-white rounded-b-xl md:rounded-xl px-4 py-6 text-black font-sans">
            <h1 className="text-xl sm:text-2xl font-bold mb-2">Nekocat</h1>
            <p className="text-sm sm:text-base border-b-2 border-black pb-3 w-full sm:w-[60%] mb-2">Web Developer & AI Explorer</p>
            <div className="space-y-1 text-xs sm:text-sm">
              <p><span className="font-bold">Email:</span> <a className="underline" href="mailto:linyian0422@gmail.com">linyian0422@gmail.com</a></p>
              <p><span className="font-bold">GitHub:</span> <a className="underline" href="https://github.com/Catneko-0422">@Catneko-0422</a></p>
              <p><span className="font-bold">LinkedIn:</span> <a className="underline" href="https://www.linkedin.com/in/your-profile">your-profile</a></p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <a className="icon-box" href="https://github.com/Catneko-0422" target="_blank"><FontAwesomeIcon icon={faGithub} /></a>
              <a className="icon-box" href="https://www.linkedin.com/in/your-profile" target="_blank"><FontAwesomeIcon icon={faLinkedin} /></a>
              <a className="icon-box" href="https://www.instagram.com/neko._cat422/" target="_blank"><FontAwesomeIcon icon={faInstagram} /></a>
              <a className="icon-box" href="https://www.facebook.com/neko.cat.863674/" target="_blank"><FontAwesomeIcon icon={faFacebook} /></a>
              <a className="icon-box" href="#" target="_blank"><FontAwesomeIcon icon={faDiscord} /></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;