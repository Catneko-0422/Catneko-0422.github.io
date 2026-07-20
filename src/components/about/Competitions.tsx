import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe, faFlag, faFileAlt } from "@fortawesome/free-solid-svg-icons";
import type { Competition } from "@/data/about";

const awardColors: Record<string, { bg: string; text: string; border: string }> = {
  "金牌": { bg: "bg-yellow-500/10", text: "text-yellow-600 dark:text-yellow-400", border: "border-yellow-500/30" },
  "銀牌": { bg: "bg-gray-400/10", text: "text-gray-600 dark:text-gray-300", border: "border-gray-400/30" },
  "第三名": { bg: "bg-orange-500/10", text: "text-orange-600 dark:text-orange-400", border: "border-orange-500/30" },
  "佳作": { bg: "bg-purple-500/10", text: "text-purple-600 dark:text-purple-400", border: "border-purple-500/30" },
  "投稿": { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", border: "border-blue-500/30" },
};

const scopeIcons: Record<string, typeof faGlobe> = {
  "國際性": faGlobe,
  "全國性": faFlag,
  "研討會": faFileAlt,
};

export function Competitions({ data }: { data: Competition[] }) {
  return (
    <div className="space-y-3">
      {data.map((comp, idx) => {
        const colors = awardColors[comp.award] ?? awardColors["佳作"];
        return (
          <div
            key={idx}
            className="relative bg-white/5 dark:bg-white/5 rounded-xl border border-white/10 dark:border-white/5 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/10 hover:border-white/20 dark:hover:border-white/10"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
                    {comp.year}
                  </span>
                  <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${colors.bg} ${colors.text} ${colors.border}`}>
                    <FontAwesomeIcon icon={scopeIcons[comp.scope] ?? faGlobe} className="w-2.5 h-2.5" />
                    {comp.scope}
                  </span>
                </div>
                <p className="text-sm font-semibold text-foreground/90 truncate">
                  {comp.name}
                </p>
              </div>
              <span className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-lg border ${colors.bg} ${colors.text} ${colors.border}`}>
                {comp.award}
              </span>
            </div>
            <p className="text-xs text-foreground/50 leading-relaxed line-clamp-2">
              {comp.project}
            </p>
          </div>
        );
      })}
    </div>
  );
}
