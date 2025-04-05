'use client'; // 如果你是用 App Router，要加這行！

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function About() {
    return (
        <motion.div
            className="text-center p-8"
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
                className="mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
            >
                <Section title="技能">
                    <li>程式語言：JavaScript, TypeScript, Python, C++</li>
                    <li>前端技術：React, Next.js, TailwindCSS, HTML, CSS</li>
                    <li>後端技術：Node.js, Express, Flask</li>
                    <li>資料庫：MongoDB, MySQL</li>
                    <li>版本控制：Git, GitHub</li>
                </Section>

                <Section title="學歷">
                    <li>2020 ~ 2023：市立木柵高級工業職業學校 電機科</li>
                    <li>2023 ~ 現在：國立雲林科技大學 資訊管理學系 人工智慧計優專班</li>
                </Section>

                <Section title="比賽">
                    <li>113年全國高級中等學校技藝競賽 工科賽 工業配線金手第七名</li>
                    <li>國立雲林科技大學 資訊工程系 校內團隊程式競賽佳作</li>
                </Section>

                <Section title="證照">
                    <li>室內配線丙級證照</li>
                    <li>自來水配管丙級證照</li>
                    <li>工業電子丙級證照</li>
                    <li>工業配縣乙丙級證照</li>
                </Section>
            </motion.div>
        </motion.div>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <motion.div
            className="mt-6"
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
        >
            <h3 className="text-lg font-semibold text-blue-600">{title}</h3>
            <ul className="text-left ml-8 text-gray-600">{children}</ul>
        </motion.div>
    );
}
