import React from "react";

export function Card({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="relative bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 dark:border-white/5 px-6 sm:px-8 py-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10 hover:border-white/20 dark:hover:border-white/10">
      <div className="flex items-center gap-3 mb-4">
        {icon && (
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-300">
            {icon}
          </div>
        )}
        <h3 className="text-xl font-bold text-purple-700 dark:text-purple-300">
          {title}
        </h3>
      </div>
      <div className="text-foreground/80 text-base leading-relaxed">
        {children}
      </div>
    </div>
  );
}
