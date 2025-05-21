'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const skills = [
  { label: '前端', value: 20, color: 'rgba(255, 100, 150, 0.9)' },       
  { label: '後端', value: 25, color: 'rgba(100, 255, 255, 0.9)' },       
  { label: 'AI/資料處理', value: 10, color: 'rgba(255, 255, 120, 0.9)' }, 
  { label: '硬體', value: 50, color: 'rgba(50, 255, 100, 0.9)' }         
];

const SkillRadar = () => (
  <div className="flex flex-col items-center gap-6">
    <div className="text-center text-lg font-semibold text-[#98BAD2]">技能分佈</div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
      {skills.map((skill, idx) => (
        <div key={idx} className="relative w-[180px] h-[180px] mx-auto sm:mx-0">
          <Pie
            data={{
              labels: [skill.label, '其他'],
              datasets: [
                {
                  label: skill.label,
                  data: [skill.value, 100 - skill.value],
                  backgroundColor: [skill.color, 'rgba(255, 255, 255, 0.05)'],
                  borderWidth: 0,
                  cutout: '80%'
                }
              ]
            }}
            options={{
              plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
              },
              responsive: true,
              maintainAspectRatio: false
            }}
          />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + idx * 0.1, duration: 0.6 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center"
          >
            <div className="text-white font-bold text-xl">{skill.value}%</div>
            <div className="text-gray-400 text-sm">{skill.label}</div>
          </motion.div>
        </div>
      ))}
    </div>
  </div>
);

const achievements = {
  '2023': [
    '市立木柵高工畢業 (電機科)',
    '全國技藝競賽 工業配線 金手獎第七名'
  ],
  '2024': [
    '雲林科技大學 資管系AI專班 就讀中',
    '校內團體程式競賽佳作'
  ]
};

const experiences = {
  '2023': ['全國技藝競賽 工業配線 金手獎第七名'],
  '2024': ['雲林科技大學 校內團體程式競賽佳作']
};

const certifications = [
  { name: '工業配線乙級', img: '/certs/wiring_b.png' },
  { name: '工業電子丙級', img: '/certs/electronics_c.png' },
  { name: '室內配線丙級', img: '/certs/indoor_c.png' },
  { name: '自來水配管丙級', img: '/certs/water_c.png' },
];

const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <motion.div
    className="relative bg-[#1f1f28] rounded-2xl shadow-xl w-full px-6 sm:px-8 py-6 hover:scale-[1.02] transition-transform duration-300"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <div className="absolute top-6 left-0 w-1 h-12 bg-gradient-to-b from-purple-400 via-pink-400 to-yellow-400 rounded-r-full animate-pulse" />
    <h3 className="text-2xl font-bold mb-2 text-[#98BAD2] pl-4">{title}</h3>
    <div className="text-[#ccd6f6] text-base pl-4">{children}</div>
  </motion.div>
);

const Timeline = ({ title, data }: { title: string; data: Record<string, string[]> }) => (
  <motion.div
    className="relative bg-[#1f1f28] rounded-2xl shadow-xl w-full px-6 sm:px-8 py-6 hover:scale-[1.02] transition-transform duration-300"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <div className="absolute top-6 left-0 w-1 h-12 bg-gradient-to-b from-blue-400 via-cyan-400 to-teal-400 rounded-r-full animate-pulse" />
    <h3 className="text-2xl font-bold mb-4 text-[#98BAD2] pl-4">{title}</h3>
    <ul className="space-y-4 pl-4">
      {Object.entries(data).map(([year, items]) => (
        <li key={year}>
          <p className="text-xl font-semibold text-[#d6e0f0]">{year}</p>
          <ul className="list-disc pl-5 text-[#ccd6f6]">
            {items.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  </motion.div>
);

const About: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center text-white">
      <div className="w-full h-[30vh]">
        <img src="/About_background.jpg" alt="Background" className="w-full h-full object-cover" />
      </div>

      <div className="w-full max-w-6xl px-4 -mt-30 flex flex-col items-center justify-start gap-8">
        <motion.div
          className="mt-8 flex justify-center"
          initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.8 }}
        >
          <img
            src="/About_profile.jpg"
            alt="Profile"
            className="w-36 h-36 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 rounded-full shadow-lg"
          />
        </motion.div>

        <div className="flex flex-col items-center justify-start gap-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold inline-block">
              Nekocat
            </h1>
            <span className="text-xl ml-2">(Yi-An Lin)</span>
          </motion.div>

          <motion.h2
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-gray-400"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            什麼都學，甚麼都不會
          </motion.h2>

          <motion.p
            className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            I am a passionate software developer with a love for creating innovative solutions.
          </motion.p>

          <motion.p
            className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            I enjoy working with modern technologies and continuously learning to improve my skills.
          </motion.p>
        </div>
      </div>

      <div className="w-full max-w-6xl px-4 mt-12 flex flex-col gap-8">
        <Card title="關於我">
          嗨嗨～我是林奕安，一名來自雲林科技大學資訊管理系 AI 專班的學生，熱愛結合軟硬體技術打造創新專案。我擁有程式設計、機器學習與硬體控制經驗，持續精進中！
        </Card>

        <Card title="技能雷達">
          <SkillRadar />
        </Card>

        <Timeline title="經歷與成就" data={achievements} />
        <Timeline title="參賽經歷" data={experiences} />

        <Card title="專業證照" >
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            {certifications.map((cert, idx) => (
              <div
                key={idx}
                className="bg-[#2c2f3a] px-4 py-2 rounded-xl text-white text-sm shadow border border-[#98BAD2] hover:scale-105 transition-transform duration-200"
              >
                {cert.name}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default About;
