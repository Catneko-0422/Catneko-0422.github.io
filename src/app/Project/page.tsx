'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

type Repository = {
  id: number;
  name: string;
  description: string;
  html_url: string;
  homepage: string;
  language: string;
  topics: string[];
};

const GITHUB_USERNAME = 'Catneko-0422';
const TAGS = ['All', 'python', 'csharp', 'typescript'];

const Project: React.FC = () => {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [filteredRepos, setFilteredRepos] = useState<Repository[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [zoomedRepoId, setZoomedRepoId] = useState<number | null>(null);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await axios.get<Repository[]>(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos`,
          {
            headers: {
              Accept: 'application/vnd.github.mercy-preview+json',
            },
          }
        );
        setRepos(response.data);
        setFilteredRepos(response.data);
      } catch (error) {
        console.error('Error fetching repositories:', error);
      }
    };

    fetchRepos();
  }, []);

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
    if (tag === 'All') {
      setFilteredRepos(repos);
    } else {
      const filtered = repos.filter((repo) => repo.topics.includes(tag));
      setFilteredRepos(filtered);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="w-full flex flex-col items-center text-foreground px-4 py-8 relative"
    >
      <h1 className="text-4xl font-bold mb-6">Projects</h1>
      <p className="text-lg text-gray-400 mb-4">
        Here are some of my projects. Click on a card to zoom in.
      </p>

      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {TAGS.map((tag) => (
          <motion.button
            whileTap={{ scale: 0.9 }}
            key={tag}
            onClick={() => handleTagClick(tag)}
            className={`px-4 py-2 rounded-full border ${
              selectedTag === tag
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
            } hover:bg-blue-600 transition`}
          >
            {tag}
          </motion.button>
        ))}
      </div>

      {zoomedRepoId !== null && (
        <div
          className="fixed inset-0 bg-black/60 z-40 cursor-pointer"
          onClick={() => setZoomedRepoId(null)}
        />
      )}

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 w-full max-w-7xl">
        {filteredRepos
          .filter((repo) => repo.name !== GITHUB_USERNAME)
          .map((repo) => {
            const imagePath = `/project_images/${repo.name}.jpg`;
            const isZoomed = zoomedRepoId === repo.id;

            return (
              <motion.div
                key={repo.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomedRepoId(isZoomed ? null : repo.id);
                }}
                className={`bg-white dark:bg-[#1f1f28] rounded-xl overflow-auto border border-gray-700 shadow-md transition-all duration-300 ease-in-out
                ${isZoomed
                  ? 'fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 scale-100 w-[70%] h-[80%] max-w-4xl'
                  : 'relative w-full h-[420px]'} flex flex-col cursor-pointer`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative">
                  <img
                    src={imagePath}
                    alt={repo.name}
                    className={`w-full object-cover transition-all duration-300 ${
                      isZoomed ? 'h-75' : 'h-55'
                    }`}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/project_images/default.jpg';
                    }}
                  />
                </div>

                <div className="p-4 flex flex-col justify-between flex-grow">
                  <div>
                    <h2 className="text-lg font-bold text-foreground mb-1 text-left ml-[10%]">
                      {repo.name}
                    </h2>
                    <p className="text-sm text-gray-400 line-clamp-2 mb-2 text-left ml-[10%]">
                      {repo.description || 'No description provided.'}
                    </p>
                  </div>

                  <div className="items-center justify-between mt-4">
                    <div className={`flex flex-wrap gap-2 ${isZoomed ? 'ml-10' : 'ml-6'}`}>
                      {repo.topics.map((topic) => (
                        <span
                          key={topic}
                          className="flex items-center gap-1 text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full"
                        >
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M4 3a1 1 0 011-1h10a1 1 0 011 1v3H4V3zM4 8h12v9a1 1 0 01-1 1H5a1 1 0 01-1-1V8z" />
                          </svg>
                          {topic}
                        </span>
                      ))}
                    </div>

                    {isZoomed && (
                      <div className="mt-6 ml-[10%] mr-[10%] text-left space-y-4">
                        {repo.homepage && (
                          <a
                            href={repo.homepage}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-blue-500 hover:bg-blue-600 text-white dark:text-white px-4 py-2 rounded shadow"
                          >
                            🌐 Visit Website
                          </a>
                        )}

                        <div>
                          <h3 className="text-lg font-semibold">Features</h3>
                          <ul className="list-disc list-inside text-sm text-gray-300">
                            {repo.topics.length > 0 ? (
                              repo.topics.map((topic, i) => (
                                <li key={i}>Includes {topic}</li>
                              ))
                            ) : (
                              <li>No features listed.</li>
                            )}
                          </ul>
                        </div>

                        <p className="text-sm text-gray-400">
                          Language: <span className="text-foreground">{repo.language || 'N/A'}</span>
                        </p>
                      </div>
                    )}

                    <hr className="w-[80%] border-t border-gray-500 my-4 mx-auto" />

                    <div className="mt-4">
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm px-3 py-1 rounded hover:border-blue-400 hover:text-blue-400 transition"
                      >
                        View Details
                        <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M12.293 2.293a1 1 0 011.414 0L18 6.586V7h-1.586l-3.707-3.707a1 1 0 010-1.414zM10 4a1 1 0 00-1 1v6H5a1 1 0 000 2h6a1 1 0 001-1V5a1 1 0 00-1-1z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
      </div>
    </motion.div>
  );
};

export default Project;
