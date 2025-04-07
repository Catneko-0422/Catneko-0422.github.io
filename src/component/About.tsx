'use client'; // 如果你是用 App Router，要加這行！

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function About() {
    return (
        <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <motion.div
                className="my-8 flex justify-center items-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 100 }}
            >
                <Image
                    src="/profile.jpg"
                    alt="我的頭貼"
                    width={150}
                    height={150}
                    className="rounded-full shadow-lg"
                />
            </motion.div>

            <motion.h2
                className="text-xl font-bold text-pink-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                Catneko-0422(貓咪)
            </motion.h2>

            <motion.p
                className="text-gray-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                什麼都學 什麼都不會ㄏㄏ
            </motion.p>

            <motion.div
                className="mt-8 max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
            >
                <Section title="技能">
                    <li className="text-center">硬體技術：STM32, ESP32, Raspberry Pi, Arduino, PLC, 電力控制</li>
                    <li className="text-center">程式語言：JavaScript, TypeScript, Python, C++</li>
                    <li className="text-center">前端技術：React, Next.js, TailwindCSS, HTML, CSS</li>
                    <li className="text-center">後端技術：Node.js, Express, Flask</li>
                    <li className="text-center">資料庫：SQLite, MySQL</li>
                    <li className="text-center">版本控制：Git, GitHub</li>
                </Section>

                <Section title="學歷">
                    <li className="text-center">2020 ~ 2023：市立木柵高級工業職業學校 電機科</li>
                    <li className="text-center">2023 ~ 現在：國立雲林科技大學 資訊管理學系 人工智慧計優專班</li>
                </Section>

                <Section title="比賽">
                    <li className="text-center">113年全國高級中等學校技藝競賽 工科賽 工業配線金手第七名</li>
                    <li className="text-center">國立雲林科技大學 資訊工程系 校內團隊程式競賽佳作</li>
                </Section>

                <Section title="證照">
                    <li className="text-center">室內配線丙級證照</li>
                    <li className="text-center">自來水配管丙級證照</li>
                    <li className="text-center">工業電子丙級證照</li>
                    <li className="text-center">工業配縣乙丙級證照</li>
                </Section>
            </motion.div>
        </motion.div>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <motion.div
            className="mt-6 text-center"
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
        >
            <h3 className="text-lg font-semibold text-blue-600">{title}</h3>
            <ul className="text-gray-600 space-y-2">{children}</ul>
        </motion.div>
    );
}
