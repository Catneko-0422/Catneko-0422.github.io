'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

type Repository = {
  id: number;
  name: string;
  description: string;
  html_url: string;
  language: string;
  topics: string[];
};

const GITHUB_USERNAME = 'Catneko-0422';
const TAGS = ['All', 'python', 'csharp', 'typescript'];

const Project: React.FC = () => {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [filteredRepos, setFilteredRepos] = useState<Repository[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('All');

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
    <div className="w-full flex flex-col items-center text-white px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Projects</h1>

      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className={`px-4 py-2 rounded-full border ${
              selectedTag === tag
                ? 'bg-blue-500 text-white'
                : 'bg-gray-800 text-gray-300'
            } hover:bg-blue-600 transition`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 w-full max-w-7xl">
        {filteredRepos
          .filter((repo) => repo.name !== GITHUB_USERNAME)
          .map((repo) => {
            const imagePath = `/project_images/${repo.name}.jpg`;

            return (
              <div
                key={repo.id}
                className="bg-[#1f1f28] rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500 transition duration-300 shadow-md hover:shadow-blue-500/30 w-full h-[420px] flex flex-col"
              >
                <div className="relative">
                  <img
                    src={imagePath}
                    alt={repo.name}
                    className="w-full h-40 object-cover aspect-video"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/project_images/default.jpg';
                    }}
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M12.293 2.293a1 1 0 011.414 0L18 6.586V7h-1.586l-3.707-3.707a1 1 0 010-1.414zM10 4a1 1 0 00-1 1v6H5a1 1 0 000 2h6a1 1 0 001-1V5a1 1 0 00-1-1z" />
                      </svg>
                    </a>
                  </div>
                </div>

                <div className="p-4 flex flex-col justify-between flex-grow">
                  <div>
                    <h2 className="text-lg font-bold text-white mb-1">{repo.name}</h2>
                    <p className="text-sm text-gray-400 line-clamp-2 mb-2">
                      {repo.description || 'No description provided.'}
                    </p>

                    <div className="flex flex-wrap gap-2">
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
                  </div>

                  <div className="mt-4">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm border border-gray-600 px-3 py-1 rounded hover:border-blue-400 hover:text-blue-400 transition"
                    >
                      View Details
                      <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M12.293 2.293a1 1 0 011.414 0L18 6.586V7h-1.586l-3.707-3.707a1 1 0 010-1.414zM10 4a1 1 0 00-1 1v6H5a1 1 0 000 2h6a1 1 0 001-1V5a1 1 0 00-1-1z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Project;
