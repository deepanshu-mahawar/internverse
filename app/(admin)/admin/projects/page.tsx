"use client";

import { useState, ChangeEvent, useEffect } from "react";

import { Eye, Filter } from "lucide-react";
import projectsData from "@/app/data/projects.json";
import Card from "@/app/components/Card";
import Modal from "@/app/components/Modal";
import axios from "axios";

// interface Project {
//   id: number | string;
//   title: string;
//   studentName: string;
//   mentorName: string;
//   type: "project" | "internship";
//   status: "approved" | "under_review" | "needs_improvement" | "pending";
//   description: string;
//   company?: string;
//   startDate: string;
//   endDate: string;
//   submittedDate?: string;
//   technologies: string[];
//   feedback?: string;
//   feedbackDate?: string;
// }

const AdminProjects: React.FC = () => {
  // const [projects, setProjects] = useState<any[]>([]);
  // const [loading, setLoading] = useState<boolean>(true);
  // const [error, setError] = useState<string | null>(null);
  // // const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  // const [filterType, setFilterType] = useState<string>("all");
  // const [filterStatus, setFilterStatus] = useState<string>("all");

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const projectResponse = await axios.get<any[]>(
  //         `http://127.0.0.1:5000/api/admins/projects`
  //       );

  //       const projResponse = projectResponse.data.projects || [];

  //       setProjects(projResponse);
  //     } catch (err) {
  //       console.error("Error fetching data:", err);
  //       setError("Failed to load data. Please try again later.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchData();
  // }, []);

  // console.log("projects", projects);

  // let filteredProjects: [] = projects as any[];

  // if (filterType !== "all") {
  //   filteredProjects = filteredProjects.filter((p) => p.type === filterType);
  // }

  // if (filterStatus !== "all") {
  //   filteredProjects = filteredProjects.filter(
  //     (p) => p.status === filterStatus
  //   );
  // }

  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectResponse = await axios.get(
          "http://127.0.0.1:5000/api/admins/projects"
        );

        const projResponse = projectResponse.data?.projects || [];

        const projectsWithMentors = await Promise.all(
          projResponse.map(async (project: any) => {
            try {
              const mentorRes = await axios.get(
                `http://127.0.0.1:5000/api/mentors/${project.mentor_id}`
              );

              return {
                ...project,
                mentorName: mentorRes.data?.mentor?.name || "Unknown",
              };
            } catch {
              return {
                ...project,
                mentorName: "Unknown",
              };
            }
          })
        );

        const projectsWithStudents = await Promise.all(
          projectsWithMentors.map(async (project: any) => {
            try {
              const mentorRes = await axios.get(
                `http://127.0.0.1:5000/api/students/${project.student_id}`
              );

              return {
                ...project,
                studentName: mentorRes.data?.data?.name || "Unknown",
              };
            } catch {
              return {
                ...project,
                studentName: "Unknown",
              };
            }
          })
        );
        setProjects(projectsWithStudents);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  console.log("projects", projects);

  // Corrected filtered projects
  let filteredProjects = [...projects];
  console.log("filtered", filteredProjects);

  if (filterType !== "all") {
    filteredProjects = filteredProjects.filter(
      (p) => p?.project_type === filterType
    );
  }

  if (filterStatus !== "all") {
    filteredProjects = filteredProjects.filter(
      (p) => p?.status === filterStatus
    );
  }

  const getStatusBadge = (status: any["status"]) => {
    const badges: Record<any["status"], string> = {
      approved: "bg-green-100 text-green-700",
      under_review: "bg-yellow-100 text-yellow-700",
      needs_improvement: "bg-red-100 text-red-700",
      pending: "bg-gray-100 text-gray-700",
    };
    return badges[status] || badges.pending;
  };

  const getStatusText = (status: any["status"]) => {
    return status
      .split("_")
      .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFilterType(e.target.value);
  };

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">All Projects</h1>
        <p className="text-gray-600 mt-1">
          View and manage all projects and internships
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-600">
              {projects.length}
            </p>
            <p className="text-sm text-gray-600 mt-1">Total Projects</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {projects.filter((p) => p.status === "approved").length}
            </p>
            <p className="text-sm text-gray-600 mt-1">Approved</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {projects.filter((p) => p.status === "Submitted").length}
            </p>
            <p className="text-sm text-gray-600 mt-1">Under Review</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">
              {projects.filter((p) => p.status === "needs_improvement").length}
            </p>
            <p className="text-sm text-gray-600 mt-1">Needs Work</p>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center space-x-4 mb-4">
          <Filter size={20} className="text-gray-600" />
          <span className="font-medium text-gray-700">Filters:</span>
          <select
            value={filterType}
            onChange={handleTypeChange}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Types</option>
            <option value="project">Projects</option>
            <option value="internship">Internships</option>
          </select>
          <select
            value={filterStatus}
            onChange={handleStatusChange}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="approved">Approved</option>
            <option value="under_review">Under Review</option>
            <option value="needs_improvement">Needs Improvement</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Title
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Student
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Mentor
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Type
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
                <tr
                  key={project._id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 text-sm text-gray-800">
                    {project.title}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {project.studentName}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {project.mentorName}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-xs font-medium capitalize">
                      {project.project_type}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                        project.status
                      )}`}
                    >
                      {getStatusText(project.status)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="text-indigo-600 hover:text-indigo-800"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProjects.length === 0 && (
          <p className="text-gray-500 text-center py-8">
            No projects found with the selected filters
          </p>
        )}
      </Card>

      <Modal
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        title="Project Details"
        size="lg"
      >
        {selectedProject && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                {selectedProject.title}
              </h3>
              <div className="flex items-center space-x-3 mt-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                    selectedProject.status
                  )}`}
                >
                  {getStatusText(selectedProject.status)}
                </span>
                <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-xs font-medium capitalize">
                  {selectedProject.project_type}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-700 mb-1">Student</h4>
                <p className="text-gray-600">{selectedProject.studentName}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-1">Mentor</h4>
                <p className="text-gray-600">{selectedProject.mentorName}</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Description</h4>
              <p className="text-gray-600">{selectedProject.description}</p>
            </div>

            {selectedProject.company && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Company</h4>
                <p className="text-gray-600">{selectedProject.company}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-700 mb-1">Start Date</h4>
                <p className="text-gray-600">
                  {new Date(selectedProject.start_date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-1">End Date</h4>
                <p className="text-gray-600">
                  {new Date(selectedProject.end_date).toLocaleDateString()}
                </p>
              </div>
            </div>

            {selectedProject.submittedDate && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-1">
                  Submitted On
                </h4>
                <p className="text-gray-600">
                  {new Date(selectedProject.submittedDate).toLocaleDateString()}
                </p>
              </div>
            )}

            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Technologies</h4>
              <div className="flex flex-wrap gap-2">
                {selectedProject.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {selectedProject.feedback && (
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <h4 className="font-semibold text-indigo-800 mb-2">
                  Mentor Feedback
                </h4>
                <p className="text-indigo-900">{selectedProject.feedback}</p>
                {selectedProject.feedbackDate && (
                  <p className="text-xs text-indigo-600 mt-2">
                    {new Date(
                      selectedProject.feedbackDate
                    ).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminProjects;
