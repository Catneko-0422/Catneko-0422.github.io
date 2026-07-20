"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Card } from "@/components/about/Card";
import { SkillRadar } from "@/components/about/SkillRadar";
import { Timeline } from "@/components/about/Timeline";
import { achievements, experiences, certifications, competitions } from "@/data/about";
import { Competitions } from "@/components/about/Competitions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faChartPie, faAward, faTrophy, faMedal } from "@fortawesome/free-solid-svg-icons";

ChartJS.register(ArcElement, Tooltip, Legend);

const About: React.FC = () => {
  return (
    <div className="w-full min-h-screen text-foreground">
      {/* Hero */}
      <div className="relative w-full h-[40vh] overflow-hidden">
        <img
          src="/About_background.jpg"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-background" />

        {/* Profile */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-8">
          <div className="relative mb-4">
            <img
              src="/About_profile.jpg"
              alt="Profile"
              className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full border-4 border-white/20 shadow-2xl object-cover mizuki-fade-in-scale"
            />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-green-500 border-4 border-background flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-lg mizuki-fade-in-up">
            Nekocat
          </h1>
          <p className="text-lg text-white/70 mt-1 mizuki-fade-in-up mizuki-delay-200">
            Yi-An Lin
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-4xl mx-auto px-4 -mt-6 relative z-10 pb-16">
        {/* Tagline */}
        <div className="text-center mb-10">
          <p className="text-xl sm:text-2xl font-semibold text-purple-600 dark:text-purple-400 mizuki-fade-in-up mizuki-delay-300">
            什麼都學，甚麼都不會
          </p>
          <p className="text-foreground/60 mt-2 max-w-xl mx-auto mizuki-fade-in-up mizuki-delay-400">
            熱愛結合軟硬體技術打造創新專案，持續精進中！
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* About Me - Full Width */}
          <div className="md:col-span-2">
            <Card
              title="關於我"
              icon={<FontAwesomeIcon icon={faUser} />}
            >
              <p>
                嗨嗨～我是林奕安，一名來自雲林科技大學資訊管理系 AI
                專班的學生。我擁有程式設計、機器學習與硬體控制經驗，
                喜歡挑戰跨領域的問題，用技術解決生活中的大小事。
              </p>
            </Card>
          </div>

          {/* Skills */}
          <div className="md:col-span-2">
            <Card
              title="技能雷達"
              icon={<FontAwesomeIcon icon={faChartPie} />}
            >
              <SkillRadar />
            </Card>
          </div>

          {/* Timeline - Achievements */}
          <div className="md:col-span-1">
            <Timeline title="學歷" data={achievements} />
          </div>

          {/* Timeline - Experience */}
          <div className="md:col-span-1">
            <Timeline title="校內經歷" data={experiences} />
          </div>

          {/* Competitions - Full Width */}
          <div className="md:col-span-2">
            <Card
              title="競賽成果"
              icon={<FontAwesomeIcon icon={faMedal} />}
            >
              <Competitions data={competitions} />
            </Card>
          </div>

          {/* Certifications - Full Width */}
          <div className="md:col-span-2">
            <Card
              title="專業證照"
              icon={<FontAwesomeIcon icon={faAward} />}
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {certifications.map((cert, idx) => (
                  <div
                    key={idx}
                    className="group relative bg-white/5 dark:bg-white/5 rounded-xl border border-white/10 dark:border-white/5 p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/10 hover:border-purple-500/30"
                  >
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300">
                      <FontAwesomeIcon icon={faTrophy} />
                    </div>
                    <p className="text-sm font-semibold text-foreground/90 mb-1">
                      {cert.name}
                    </p>
                    <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-medium">
                      {cert.level}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
