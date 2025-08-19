import React, { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faGithub,
    faFacebook,
    faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { motion, useReducedMotion } from "framer-motion";

/* ========== 小工具：隨機字 ========== */
const getRandomChar = () => {
    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=";
    return chars[Math.floor(Math.random() * chars.length)];
};

/* ========== Home 主元件 ========== */
const ProfileHeader: React.FC = () => {
    // 網站標題動畫用
    const target = "Nekocat.cc";
    const [letters, setLetters] = useState<string[]>(Array(target.length).fill(""));

    const titles = useMemo(
        () => ["NYUST student", "AI explorer", "Fullstack developer", "Techno-otaku"],
        []
    );

    const [loopNum, setLoopNum] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [displayText, setDisplayText] = useState("");
    const [typingSpeed] = useState(150);

    const prefersReducedMotion = useReducedMotion();

    // 打字機動畫效果
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
    }, [displayText, isDeleting, loopNum, typingSpeed, titles]);

    // 網站標題解碼動畫
    useEffect(() => {
        if (prefersReducedMotion) {
            setLetters(target.split(""));
            return;
        }

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
    }, [prefersReducedMotion, target]);

    return (
        <div className="w-full flex flex-col items-center text-foreground">
            <div className="w-full h-[30vh]">
                <img
                    src="/background.gif"
                    alt="Animated background"
                    className="w-full h-full object-cover"
                    loading="eager"
                />
            </div>

            <div className="w-full max-w-6xl px-4 -mt-[30px] flex flex-col lg:flex-row items-center lg:items-start justify-start gap-8">
                <motion.div
                    className="-mt-8 lg:-mt-8 flex justify-center lg:justify-start"
                    initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                    whileInView={prefersReducedMotion ? {} : { opacity: 1, scale: 1, filter: "blur(0px)" }}
                    transition={{ duration: 0.8 }}
                >
                    <img
                        src="/profile.jpg"
                        alt="Profile photo"
                        className="w-36 h-36 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 border-8 border-gray-200 dark:border-[#222229] rounded-full shadow-lg"
                        loading="lazy"
                    />
                </motion.div>

                <div className="text-center lg:text-left flex flex-col items-center lg:items-start lg:mt-[35px]">
                    <motion.h2
                        className="text-xl sm:text-2xl md:text-3xl font-bold mb-2"
                        initial={prefersReducedMotion ? false : { opacity: 0, x: -20 }}
                        animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
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
                        initial={prefersReducedMotion ? false : { opacity: 0 }}
                        animate={prefersReducedMotion ? {} : { opacity: 1 }}
                        transition={{ delay: 1, duration: 0.3 }}
                    >
                        {letters.map((char, index) => (
                            <motion.span
                                key={index}
                                initial={prefersReducedMotion ? false : { opacity: 0, y: -10 }}
                                animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                {char}
                            </motion.span>
                        ))}
                        <span className="animate-pulse text-gray-600 dark:text-[#BABABA]">|</span>
                    </motion.h1>

                    <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-[#BABABA] leading-relaxed max-w-2xl">
                        A student from <span className="text-green-400">NYUST</span> who
                        loves <span className="text-pink-400">AI</span> and{" "}
                        <span className="text-yellow-400">programming</span>.<br />I am
                        familiar with both <span className="text-yellow-300">hardware</span>{" "}
                        and <span className="text-blue-300">software</span>, exploring
                        various technologies.
                        <br />
                        stay curious, <span className="text-pink-400">always learning</span>.
                    </p>

                    <div className="w-full mt-10 flex justify-center lg:justify-start">
                        <div className="flex gap-8 text-4xl">
                            <a
                                href="https://blog.nekocat.cc"
                                className="transition-transform duration-200 hover:scale-125 text-gray-600 dark:text-[#BABABA] hover:text-black dark:hover:text-white"
                                aria-label="Blog"
                            >
                                <FontAwesomeIcon icon={faBookOpen} />
                            </a>
                            <a
                                href="https://www.facebook.com/neko.cat.863674/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="transition-transform duration-200 hover:scale-125 text-gray-600 dark:text-[#BABABA] hover:text-blue-400"
                                aria-label="Facebook"
                            >
                                <FontAwesomeIcon icon={faFacebook} />
                            </a>
                            <a
                                href="https://www.instagram.com/neko._cat422/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="transition-transform duration-200 hover:scale-125 text-gray-600 dark:text-[#BABABA] hover:text-pink-400"
                                aria-label="Instagram"
                            >
                                <FontAwesomeIcon icon={faInstagram} />
                            </a>
                            <a
                                href="https://github.com/Catneko-0422"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="transition-transform duration-200 hover:scale-125 text-gray-600 dark:text-[#BABABA] hover:text-black dark:hover:text-white"
                                aria-label="GitHub"
                            >
                                <FontAwesomeIcon icon={faGithub} />
                            </a>
                            <a
                                href="mailto:linyian0422@gmail.com"
                                className="transition-transform duration-200 hover:scale-125 text-gray-600 dark:text-[#BABABA] hover:text-green-400"
                                aria-label="Email"
                            >
                                <FontAwesomeIcon icon={faEnvelope} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfileHeader;