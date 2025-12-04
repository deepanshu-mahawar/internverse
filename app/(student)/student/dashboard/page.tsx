"use client";

import { useState, useEffect } from "react";

import { FolderOpen, Clock, AlertCircle } from "lucide-react";
import axios from "axios";
import { useAuth } from "@/app/context/AuthContext";
import StatCard from "@/app/components/StatCard";
import Card from "@/app/components/Card";

interface Project {
  id: string;
  title: string;
  type: "internship" | "project";
  status: "approved" | "under_review" | "needs_improvement" | "pending";
  mentorName: string;
  feedback?: string;
}

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  console.log("Projects:", projects);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchProjects = async () => {
  //     try {
  //       const response = await axios.get(
  //         `http://127.0.0.1:5000/api/projects/student/${user?.id}`
  //       );

  //       setProjects(response.data.projects);
  //     } catch (error) {
  //       console.error("Error fetching projects:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   if (user?.id) {
  //     fetchProjects();
  //   }
  // }, [user?.id]);

  useEffect(() => {
  const fetchProjects = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/api/projects/student/${user?.id}`
      );

      setProjects(response.data.projects); // <-- correct
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  if (user?.id) {
    fetchProjects();
  }
}, [user?.id]);

  const activeInternships = projects.filter(
    (p) => p.type === "internship"
    // && p.status !== "completed"
  );

  const underReview = projects.filter((p) => p.status === "under_review");
  const needsImprovement = projects.filter(
    (p) => p.status === "needs_improvement"
  );
  const recentProjects = projects.slice(0, 5);

  const getStatusBadge = (status: Project["status"]) => {
    const badges: Record<Project["status"], string> = {
      approved: "bg-green-100 text-green-700",
      under_review: "bg-yellow-100 text-yellow-700",
      needs_improvement: "bg-red-100 text-red-700",
      pending: "bg-gray-100 text-gray-700",
    };
    return badges[status] || badges.pending;
  };

  // const getStatusText = (status: string) => {
  //   return status
  //     .split("_")
  //     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  //     .join(" ");
  // };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-1">
          Heres an overview of your internships and projects
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Projects"
          value={projects.length}
          icon={FolderOpen}
          color="indigo"
        />
        <StatCard
          title="Active Internships"
          value={activeInternships.length}
          icon={Clock}
          color="blue"
        />
        <StatCard
          title="Under Review"
          value={underReview.length}
          icon={AlertCircle}
          color="yellow"
        />
        <StatCard
          title="Needs Improvement"
          value={needsImprovement.length}
          icon={AlertCircle}
          color="red"
        />
      </div>

      <Card title="Recent Projects & Internships">
        {recentProjects.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No projects or internships yet
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Title
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Mentor
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentProjects.map((project) => (
                  <tr
                    key={project.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 text-sm text-gray-800">
                      {project.title}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 capitalize">
                      {project.type}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {project.mentorName}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                          project.status
                        )}`}
                      >
                        {/* {getStatusText(project.status)} */}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Quick Stats">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Approved Projects</span>
              <span className="font-semibold text-green-600">
                {projects.filter((p) => p.status === "approved").length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pending Feedback</span>
              <span className="font-semibold text-yellow-600">
                {underReview.length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Completed Internships</span>
              <span className="font-semibold text-indigo-600">
                {
                  projects.filter(
                    (p) => p.type === "internship" && p.status === "approved"
                  ).length
                }
              </span>
            </div>
          </div>
        </Card>

        <Card title="Recent Feedback">
          {projects.filter((p) => p.feedback).length === 0 ? (
            <p className="text-gray-500 text-center py-8">No feedback yet</p>
          ) : (
            <div className="space-y-3">
              {projects
                .filter((p) => p.feedback)
                .slice(0, 3)
                .map((project) => (
                  <div
                    key={project.id}
                    className="border-l-4 border-indigo-600 pl-3"
                  >
                    <p className="text-sm font-medium text-gray-800">
                      {project.title}
                    </p>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {project.feedback}
                    </p>
                  </div>
                ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
