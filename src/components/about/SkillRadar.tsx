"use client";

import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from "chart.js";
import { skills } from "@/data/about";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

export function SkillRadar() {
  const data = {
    labels: skills.map((s) => s.label),
    datasets: [
      {
        data: skills.map((s) => s.value),
        backgroundColor: "rgba(139, 92, 246, 0.15)",
        borderColor: "rgba(139, 92, 246, 0.8)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(139, 92, 246, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFont: { size: 13 },
        bodyFont: { size: 12 },
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (ctx: any) => `${ctx.label}: ${ctx.raw}%`,
        },
      },
    },
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20,
          display: false,
        },
        grid: {
          color: "rgba(139, 92, 246, 0.1)",
          circular: true,
        },
        angleLines: {
          color: "rgba(139, 92, 246, 0.1)",
        },
        pointLabels: {
          font: { size: 13, weight: "bold" as const },
          color: "rgba(139, 92, 246, 0.9)",
        },
      },
    },
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="w-full max-w-[360px] aspect-square">
        <Radar data={data} options={options} />
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        {skills.map((skill, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <span className="text-sm text-foreground/70">
              {skill.label}
              <span className="ml-1 font-semibold text-foreground/90">{skill.value}%</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
