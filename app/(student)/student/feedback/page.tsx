"use client";

import { useState, useEffect } from 'react';

import { MessageSquare, Calendar, User, CheckCircle, XCircle, Clock } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/app/context/AuthContext';
import Card from '@/app/components/Card';

interface Project {
  id: string;
  title: string;
  type: 'internship' | 'project';
  status: 'approved' | 'under_review' | 'needs_improvement' | 'pending';
  feedback?: string;
  feedbackDate?: string;
  submittedDate?: string;
  mentorName: string;
  technologies: string[];
}

const Feedback: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user?.id) return;
      try {
        const response = await axios.get<Project[]>(
          `http://127.0.0.1:5000/api/students/${user.id}/projects`
        );
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user?.id]);

  const projectsWithFeedback = projects.filter((p) => p.feedback);
  const pendingFeedback = projects.filter((p) => !p.feedback && p.submittedDate);

  const getStatusIcon = (status: Project['status']) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'needs_improvement':
        return <XCircle className="text-red-600" size={20} />;
      case 'under_review':
        return <Clock className="text-yellow-600" size={20} />;
      default:
        return <Clock className="text-gray-600" size={20} />;
    }
  };

  const getStatusBadge = (status: Project['status']) => {
    const badges: Record<Project['status'] | 'pending', string> = {
      approved: 'bg-green-100 text-green-700',
      under_review: 'bg-yellow-100 text-yellow-700',
      needs_improvement: 'bg-red-100 text-red-700',
      pending: 'bg-gray-100 text-gray-700',
    };
    return badges[status] || badges.pending;
  };

  const getStatusText = (status: string) =>
    status
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Feedback</h1>
        <p className="text-gray-600 mt-1">View feedback from your mentors</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Feedback</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{projectsWithFeedback.length}</p>
            </div>
            <MessageSquare className="text-indigo-600" size={32} />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Feedback</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{pendingFeedback.length}</p>
            </div>
            <Clock className="text-yellow-600" size={32} />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {projects.filter((p) => p.status === 'approved').length}
              </p>
            </div>
            <CheckCircle className="text-green-600" size={32} />
          </div>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Received Feedback</h2>
        {projectsWithFeedback.length === 0 ? (
          <Card>
            <p className="text-gray-500 text-center py-12">No feedback received yet</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {projectsWithFeedback.map((project) => (
              <Card key={project.id}>
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getStatusIcon(project.status)}
                        <h3 className="text-lg font-semibold text-gray-800">{project.title}</h3>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                          project.status
                        )}`}
                      >
                        {getStatusText(project.status)}
                      </span>
                    </div>
                    <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-xs font-medium capitalize">
                      {project.type}
                    </span>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <User size={16} className="mr-2" />
                      <span className="font-medium">{project.mentorName}</span>
                      {project.feedbackDate && (
                        <>
                          <Calendar size={16} className="ml-4 mr-2" />
                          <span>{new Date(project.feedbackDate).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                    <p className="text-gray-800">{project.feedback}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {pendingFeedback.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Awaiting Feedback</h2>
          <div className="space-y-4">
            {pendingFeedback.map((project) => (
              <Card key={project.id}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{project.title}</h3>
                    <p className="text-sm text-gray-600">
                      Submitted to {project.mentorName} on{' '}
                      {project.submittedDate &&
                        new Date(project.submittedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                      project.status
                    )}`}
                  >
                    {getStatusText(project.status)}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Feedback;
