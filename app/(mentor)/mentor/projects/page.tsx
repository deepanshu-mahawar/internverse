"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";

import { Eye, Calendar, User, CheckCircle, XCircle, Edit } from "lucide-react";
import axios from "axios";
import { useAuth } from "@/app/context/AuthContext";
import Button from "@/app/components/Button";
import Card from "@/app/components/Card";
import Modal from "@/app/components/Modal";

const MentorProjects: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "approved" | "needs_improvement" | "Submitted"
  >("all");
  const [reviewForm, setReviewForm] = useState<ReviewForm>({
    feedback: "",
    status: "approved",
    grade: "A",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user?._id) return;
      try {
        const res = await axios.get<any[]>(
          `http://127.0.0.1:5000/api/projects/mentor/${user?._id}`
        );

        const projectsData = res.data.data || [];

        const projectsWithMentors = await Promise.all(
          projectsData.map(async (project: any) => {
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

        setProjects(projectsWithMentors);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to load projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [user?.id]);

  const myProjects = projects;

  const filteredProjects =
    filterStatus === "all"
      ? myProjects
      : myProjects.filter((p) => p.status === filterStatus);

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      approved: "bg-green-100 text-green-700",
      Submitted: "bg-yellow-100 text-yellow-700",
      needs_improvement: "bg-red-100 text-red-700",
    };
    return badges[status] || badges.Submitted;
  };

  const getStatusText = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleReview = (project: Project) => {
    setSelectedProject(project);
    setReviewForm({
      feedback: project.feedback || "",
      status: project.status,
      grade: project.grade || "A",
    });
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !user?._id) return;
    console.log("Submitting review:", selectedProject);
    try {
      await axios.post(
        `http://127.0.0.1:5000/api/projects/${selectedProject._id}/feedbacks`,
        {
          mentor_id: user._id,
          grade: reviewForm.grade,
          remarks: reviewForm.feedback,
        }
      );
      setIsReviewModalOpen(false);
      setSelectedProject(null);
      setReviewForm({ feedback: "", status: "approved", grade: "A" });
      // Refresh projects
      const res = await axios.get<any[]>(
        `http://127.0.0.1:5000/api/projects/mentor/${user._id}`
      );
      const projectsData = res.data.data || [];

      const projectsWithMentors = await Promise.all(
        projectsData.map(async (project: any) => {
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

      setProjects(projectsWithMentors);
    } catch (err) {
      console.error("Error submitting feedback:", err);
      setError("Failed to submit feedback. Please try again later.");
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!user)
    return <div className="text-center py-8">Unauthorized. Please log in.</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Review Projects</h1>
        <p className="text-gray-600 mt-1">
          Evaluate and provide feedback on student submissions
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button
          variant={filterStatus === "all" ? "primary" : "secondary"}
          onClick={() => setFilterStatus("all")}
        >
          All ({myProjects.length})
        </Button>
        <Button
          variant={filterStatus === "Submitted" ? "primary" : "secondary"}
          onClick={() => setFilterStatus("Submitted")}
        >
          Under Review (
          {myProjects.filter((p) => p.status === "Submitted").length})
        </Button>
        <Button
          variant={filterStatus === "approved" ? "primary" : "secondary"}
          onClick={() => setFilterStatus("approved")}
        >
          Approved ({myProjects.filter((p) => p.status === "approved").length})
        </Button>
        <Button
          variant={
            filterStatus === "needs_improvement" ? "primary" : "secondary"
          }
          onClick={() => setFilterStatus("needs_improvement")}
        >
          Needs Improvement (
          {myProjects.filter((p) => p.status === "needs_improvement").length})
        </Button>
      </div>

      {filteredProjects.length === 0 ? (
        <Card>
          <p className="text-gray-500 text-center py-12">No projects found</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <Card
              key={project._id}
              className="hover:shadow-md transition-shadow"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {project.title}
                    </h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                          project.status
                        )}`}
                      >
                        {getStatusText(project.status)}
                      </span>
                      <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-xs font-medium capitalize">
                        {project.project_type}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {project.description}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <User size={16} className="mr-2" />
                    {project.studentName}
                  </div>
                  {project.upload_date && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar size={16} className="mr-2" />
                      Submitted:{" "}
                      {new Date(project.upload_date).toLocaleDateString()}
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.technologies?.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies?.length &&
                    project.technologies.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                </div>
                <div className="flex space-x-2 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setSelectedProject(project)}
                  >
                    <Eye size={16} className="mr-2" /> View
                  </Button>
                  <Button
                    variant="primary"
                    className="flex-1"
                    onClick={() => handleReview(project)}
                  >
                    <Edit size={16} className="mr-2" /> Review
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={!!selectedProject && !isReviewModalOpen}
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
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Student</h4>
              <p className="text-gray-600">{selectedProject.studentName}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Description</h4>
              <p className="text-gray-600">{selectedProject.description}</p>
            </div>
            {selectedProject.company_name && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Company</h4>
                <p className="text-gray-600">{selectedProject.company_name}</p>
              </div>
            )}
            {selectedProject.start_date && selectedProject.end_date && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Duration</h4>
                <p className="text-gray-600">
                  {new Date(selectedProject.start_date).toLocaleDateString()} -{" "}
                  {new Date(selectedProject.end_date).toLocaleDateString()}
                </p>
              </div>
            )}
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Technologies</h4>
              <div className="flex flex-wrap gap-2">
                {selectedProject.technologies?.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            {selectedProject.github_link && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">
                  Project Link
                </h4>
                <a
                  href={selectedProject.github_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 break-all"
                >
                  {selectedProject.github_link}
                </a>
              </div>
            )}
            {selectedProject.certificate_path && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">
                  Certificate
                </h4>
                <a
                  href={selectedProject.certificate_path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
                >
                  View Certificate
                </a>
              </div>
            )}
            {selectedProject.feedback && (
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <h4 className="font-semibold text-indigo-800 mb-2">
                  Your Feedback
                </h4>
                <p className="text-indigo-900">{selectedProject.feedback}</p>
                {selectedProject.grade && (
                  <div className="mt-2 pt-2 border-t border-indigo-300">
                    <span className="text-sm font-semibold">
                      Grade:{" "}
                      <span className="text-lg text-indigo-600">
                        {selectedProject.grade}
                      </span>
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setSelectedProject(null);
        }}
        title="Provide Feedback"
        size="md"
      >
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              value={reviewForm.status}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setReviewForm({ ...reviewForm, status: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="approved">Approved</option>
              <option value="needs_improvement">Needs Improvement</option>
              <option value="Submitted">Under Review</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grade <span className="text-red-500">*</span>
            </label>
            <select
              value={reviewForm.grade}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setReviewForm({ ...reviewForm, grade: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="A">A (Excellent)</option>
              <option value="A-">A- (Very Good)</option>
              <option value="B+">B+ (Good)</option>
              <option value="B">B (Satisfactory)</option>
              <option value="B-">B- (Below Average)</option>
              <option value="C">C (Pass)</option>
              <option value="D">D (Poor)</option>
              <option value="F">F (Fail)</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="feedback"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Feedback <span className="text-red-500">*</span>
            </label>
            <textarea
              id="feedback"
              value={reviewForm.feedback}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setReviewForm({ ...reviewForm, feedback: e.target.value })
              }
              placeholder="Provide detailed feedback to the student"
              rows={5}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex space-x-3">
            <Button type="submit" variant="success" className="flex-1">
              <CheckCircle size={18} className="mr-2" /> Submit Feedback
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsReviewModalOpen(false);
                setSelectedProject(null);
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MentorProjects;
