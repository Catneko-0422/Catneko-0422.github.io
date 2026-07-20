export function Timeline({
  title,
  data,
}: {
  title: string;
  data: Record<string, string[]>;
}) {
  const years = Object.entries(data);

  return (
    <div className="relative bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 dark:border-white/5 px-6 sm:px-8 py-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10 hover:border-white/20 dark:hover:border-white/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-300">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-purple-700 dark:text-purple-300">
          {title}
        </h3>
      </div>

      <div className="relative pl-8">
        {/* Vertical line */}
        <div className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-purple-400 via-pink-400 to-purple-300 dark:from-purple-500 dark:via-pink-500 dark:to-purple-400" />

        <div className="space-y-6">
          {years.map(([year, items], yearIdx) => (
            <div key={year} className="relative">
              {/* Dot */}
              <div
                className="absolute -left-8 top-1.5 w-3 h-3 rounded-full border-2 border-purple-400 dark:border-purple-500 bg-white dark:bg-[#1a1a2e] transition-all duration-300 hover:scale-125 hover:shadow-lg hover:shadow-purple-500/30"
                style={{ animationDelay: `${yearIdx * 0.1}s` }}
              />

              <div>
                <span className="inline-block text-sm font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-3 py-0.5 rounded-full mb-2">
                  {year}
                </span>
                <ul className="space-y-1.5">
                  {items.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-foreground/80 text-sm leading-relaxed flex items-start gap-2"
                    >
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-400 dark:bg-purple-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
