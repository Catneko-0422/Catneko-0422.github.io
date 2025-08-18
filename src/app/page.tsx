"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faFacebook,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faBookOpen } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { faWindowMaximize } from "@fortawesome/free-solid-svg-icons";

const getRandomChar = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=";
  return chars[Math.floor(Math.random() * chars.length)];
};

const Home: React.FC = () => {
  const target = "Nekocat.cc";
  const [letters, setLetters] = useState<string[]>(
    Array(target.length).fill(""),
  );
  const [showWidgetMenu, setShowWidgetMenu] = useState(false);

  const titles = [
    "NYUST student",
    "AI explorer",
    "Fullstack developer",
    "Techno-otaku",
  ];

  const tools = [
    { name: "計算機", url: "https://www.desmos.com/scientific", color: "blue" },
    { name: "備忘錄", url: "https://keep.google.com/", color: "yellow" },
    { name: "行事曆", url: "https://calendar.google.com/", color: "green" },
  ];
  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [typingSpeed, setTypingSpeed] = useState(150);

  // 打字機效果 useEffect
  useEffect(() => {
    const current = titles[loopNum % titles.length];

    const handleTyping = () => {
      const updatedText = isDeleting
        ? current.substring(0, displayText.length - 1)
        : current.substring(0, displayText.length + 1);

      setDisplayText(updatedText);

      if (!isDeleting && updatedText === current) {
        setTimeout(() => setIsDeleting(true), 1000);
      } else if (isDeleting && updatedText === "") {
        setIsDeleting(false);
        setLoopNum((prev) => prev + 1);
      }
    };

    const typingTimeout = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(typingTimeout);
  }, [displayText, isDeleting, loopNum]);

  // 解碼動畫 useEffect
  useEffect(() => {
    const scrambleAll = () => {
      const scrambled = target.split("").map(() => getRandomChar());
      setLetters(scrambled);
    };

    const decodeLetter = async (index: number, correctChar: string) => {
      for (let i = 0; i < 5; i++) {
        await new Promise((resolve) => setTimeout(resolve, 50));
        setLetters((prev) => {
          const next = [...prev];
          next[index] = getRandomChar();
          return next;
        });
      }
      setLetters((prev) => {
        const next = [...prev];
        next[index] = correctChar;
        return next;
      });
    };

    const runDecode = async () => {
      for (let i = 0; i < target.length; i++) {
        await decodeLetter(i, target[i]);
      }
    };

    const triggerCycle = async () => {
      scrambleAll();
      await new Promise((resolve) => setTimeout(resolve, 10));
      await runDecode();
    };

    triggerCycle();

    const interval = setInterval(() => {
      triggerCycle();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex flex-col items-center text-foreground">
      <div className="w-full h-[30vh]">
        <img
          src="/background.gif"
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="w-full max-w-6xl px-4 -mt-30 flex flex-col lg:flex-row items-center lg:items-start justify-start gap-8">
        <motion.div
          className="mt-8 lg:mt-0 flex justify-center lg:justify-start"
          initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.8 }}
        >
          <img
            src="/profile.jpg"
            alt="Profile"
            className="w-36 h-36 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 border-8 border-gray-200 dark:border-[#222229] rounded-full shadow-lg"
          />
        </motion.div>

        <div className="text-center lg:text-left flex flex-col items-center lg:items-start lg:mt-35">
          <motion.h2
            className="text-xl sm:text-2xl md:text-3xl font-bold mb-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Hello~ I'm a{" "}
            <span className="text-purple-400">
              {displayText}
              <span className="animate-pulse">|</span>
            </span>
          </motion.h2>

          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-blue-700 dark:text-[#98BAD2] mb-4 font-mono tracking-wider"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.3 }}
          >
            {letters.map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {char}
              </motion.span>
            ))}
            <span className="animate-pulse text-gray-600 dark:text-[#BABABA]">
              |
            </span>
          </motion.h1>

          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-[#BABABA] leading-relaxed max-w-2xl">
            A student from <span className="text-green-400">NYUST</span> who
            loves <span className="text-pink-400">AI</span> and{" "}
            <span className="text-yellow-400">programming</span>.<br />I am
            familiar with both <span className="text-yellow-300">hardware</span>{" "}
            and <span className="text-blue-300">software</span>, exploring
            various technologies.
            <br />
            stay curious, <span className="text-pink-400">always learning</span>
            .
          </p>

          <div className="w-full mt-10 flex justify-center lg:justify-start">
            <div className="flex gap-8 text-4xl">
              <a
                href="https://blog.nekocat.cc"
                className="transition-transform duration-200 hover:scale-125 text-gray-600 dark:text-[#BABABA] hover:text-black dark:hover:text-white"
              >
                <FontAwesomeIcon icon={faBookOpen} />
              </a>
              <a
                href="https://www.facebook.com/neko.cat.863674/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform duration-200 hover:scale-125 text-gray-600 dark:text-[#BABABA] hover:text-blue-400"
              >
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a
                href="https://www.instagram.com/neko._cat422/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform duration-200 hover:scale-125 text-gray-600 dark:text-[#BABABA] hover:text-pink-400"
              >
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a
                href="https://github.com/Catneko-0422"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform duration-200 hover:scale-125 text-gray-600 dark:text-[#BABABA] hover:text-black dark:hover:text-white"
              >
                <FontAwesomeIcon icon={faGithub} />
              </a>
              <a
                href="mailto:linyian0422@gmail.com"
                className="transition-transform duration-200 hover:scale-125 text-gray-600 dark:text-[#BABABA] hover:text-green-400"
              >
                <FontAwesomeIcon icon={faEnvelope} />
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* 右下角小工具浮動按鈕 */}
      <div
        style={{
          position: "fixed",
          right: "32px",
          bottom: "32px",
          zIndex: 50,
        }}
      >
        <motion.button
          onClick={() => setShowWidgetMenu((prev) => !prev)}
          className="dark:bg-[#222229] dark:text-black"
          style={{
            background: "#fff",
            borderRadius: "50%",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            width: "45px",
            height: "45px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            cursor: "pointer",
          }}
          aria-label="小工具選單"
          animate={showWidgetMenu ? { y: 0 } : { y: [0, -4, 0, 4, 0] }}
          transition={showWidgetMenu ? {} : { repeat: Infinity, duration: 2 }}
          whileHover={{
            scale: 1.08,
            boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
          }}
        >
          <FontAwesomeIcon icon={faWindowMaximize} />
        </motion.button>
        {showWidgetMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "absolute",
              bottom: "72px",
              right: 0,
              background: "var(--menu-bg, #fff)",
              borderRadius: "12px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
              padding: "16px",
              minWidth: "180px",
              color: "var(--menu-text, #222)",
            }}
            className="dark:bg-[#222229] dark:text-[#BABABA] bg-white text-gray-800"
          >
            <div style={{ fontWeight: "bold", marginBottom: "8px" }}>小工具選單</div>
            {tools.map((tool, idx) => (
              <motion.a
                key={tool.name}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "block", marginBottom: idx < tools.length - 1 ? "8px" : "0" }}
                className={
                  `transition-colors duration-200 text-gray-700 dark:text-[#BABABA] ` +
                  (tool.color === "blue"
                    ? "hover:text-blue-500 dark:hover:text-blue-300"
                    : tool.color === "yellow"
                      ? "hover:text-yellow-500 dark:hover:text-yellow-300"
                      : "hover:text-green-500 dark:hover:text-green-300")
                }
                whileHover={{
                  scale: 1.08,
                  y: -2,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                }}
                animate={{
                  y: [0, -4, 0, 4, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                }}
              >
                {tool.name}
              </motion.a>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
};

export default Home;

