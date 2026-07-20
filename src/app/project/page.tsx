'use client';

import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar,
  faCodeFork,
  faExternalLinkAlt,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { GITHUB_USERNAME, TAGS, languageColors, type Repository } from '@/data/project';

const Project = () => {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [filteredRepos, setFilteredRepos] = useState<Repository[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);

  useEffect(() => {
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos`, {
      headers: { Accept: 'application/vnd.github.mercy-preview+json' },
    })
      .then((r) => r.json())
      .then((data: Repository[]) => {
        setRepos(data);
        setFilteredRepos(data);
      })
      .catch((err) => console.error('Error fetching repositories:', err));
  }, []);

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
    if (tag === 'All') {
      setFilteredRepos(repos);
    } else {
      setFilteredRepos(repos.filter((repo) => repo.topics.includes(tag)));
    }
  };

  return (
    <div className="w-full min-h-screen text-foreground">
      {/* Hero */}
      <div className="relative w-full h-[35vh] overflow-hidden">
        <img
          src="/About_background.jpg"
          alt="Projects background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background" />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg">
            Projects
          </h1>
          <p className="text-lg text-white/80 mt-3 drop-shadow">
            A collection of my work & experiments
          </p>
        </div>
      </div>

      {/* Tags */}
      <div className="w-full max-w-7xl mx-auto px-4 -mt-6 relative z-10">
        <div className="flex flex-wrap justify-center gap-3">
          {TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`px-5 py-2 rounded-full text-sm font-medium backdrop-blur-md border transition-all duration-200 active:scale-95 ${
                selectedTag === tag
                  ? 'bg-purple-600/90 text-white border-purple-400/30 shadow-lg shadow-purple-500/20'
                  : 'bg-white/10 dark:bg-white/5 text-foreground/80 border-white/10 hover:bg-white/20 dark:hover:bg-white/10 hover:border-white/20'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="w-full max-w-7xl mx-auto px-4 py-12">
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {filteredRepos
            .filter((repo) => repo.name !== GITHUB_USERNAME)
            .map((repo) => {
              const imagePath = `/project_images/${repo.name}.jpg`;

              return (
                <div
                  key={repo.id}
                  onClick={() => setSelectedRepo(repo)}
                  className="group relative bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 dark:border-white/5 overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10 hover:border-white/20 dark:hover:border-white/10"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={imagePath}
                      alt={repo.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/project_images/default.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {repo.language && (
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm text-xs text-white">
                        <span className={`w-2.5 h-2.5 rounded-full ${languageColors[repo.language] || 'bg-gray-400'}`} />
                        {repo.language}
                      </div>
                    )}

                    <div className="absolute top-3 right-3 flex items-center gap-3 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm text-xs text-white/90">
                      {repo.stargazers_count > 0 && (
                        <span className="flex items-center gap-1">
                          <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
                          {repo.stargazers_count}
                        </span>
                      )}
                      {repo.forks_count > 0 && (
                        <span className="flex items-center gap-1">
                          <FontAwesomeIcon icon={faCodeFork} />
                          {repo.forks_count}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5">
                    <h2 className="text-lg font-bold text-foreground mb-1 group-hover:text-purple-400 dark:group-hover:text-purple-300 transition-colors">
                      {repo.name}
                    </h2>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {repo.description || 'No description provided.'}
                    </p>

                    {repo.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {repo.topics.slice(0, 4).map((topic) => (
                          <span
                            key={topic}
                            className="text-[11px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/10"
                          >
                            {topic}
                          </span>
                        ))}
                        {repo.topics.length > 4 && (
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                            +{repo.topics.length - 4}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Modal Overlay */}
      {selectedRepo && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedRepo(null)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div
              className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-white/15 dark:bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/15 dark:border-white/10 shadow-2xl pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedRepo(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white hover:bg-black/60 transition-all"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>

              <div className="relative h-64 overflow-hidden rounded-t-3xl">
                <img
                  src={`/project_images/${selectedRepo.name}.jpg`}
                  alt={selectedRepo.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/project_images/default.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {selectedRepo.name}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-white/80">
                    {selectedRepo.language && (
                      <span className="flex items-center gap-1.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${languageColors[selectedRepo.language] || 'bg-gray-400'}`} />
                        {selectedRepo.language}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
                      {selectedRepo.stargazers_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <FontAwesomeIcon icon={faCodeFork} />
                      {selectedRepo.forks_count}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <p className="text-foreground/90 leading-relaxed">
                  {selectedRepo.description || 'No description provided.'}
                </p>

                {selectedRepo.topics.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground/60 uppercase tracking-wider mb-2">
                      Topics
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedRepo.topics.map((topic) => (
                        <span
                          key={topic}
                          className="text-xs px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/10"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-3 pt-2">
                  {selectedRepo.homepage && (
                    <a
                      href={selectedRepo.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors"
                    >
                      <FontAwesomeIcon icon={faExternalLinkAlt} />
                      Visit Website
                    </a>
                  )}
                  <a
                    href={selectedRepo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-foreground text-sm font-medium transition-colors"
                  >
                    <FontAwesomeIcon icon={faGithub} />
                    View on GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Project;
