import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Project = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("https://api.github.com/users/Catneko-0422/repos");
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (isLoading) {
    return <div className="text-center text-xl text-gray-600">正在加載專案...</div>;
  }

  return (
    <div className="flex flex-wrap gap-6 p-6 justify-center">
      {projects.map((project, index) => (
        <Card
          key={index}
          className="w-80 hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out transform rounded-xl bg-white p-4"
        >
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-pink-600 hover:text-pink-700 transition-colors">
              {project.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-2">
              {project.description || "這個專案目前沒有描述喵～"}
            </p>
            <p className="text-gray-500 text-sm mb-3">
              ⭐ Stars: {project.stargazers_count} | 🍴 Forks: {project.forks_count}
            </p>
            <a
              href={project.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline transition-colors"
            >
              查看 GitHub →
            </a>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Project;
