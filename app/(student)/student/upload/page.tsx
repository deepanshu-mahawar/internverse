import { useState, useEffect, ChangeEvent, FormEvent } from "react";

import { Upload as UploadIcon, CheckCircle } from "lucide-react";
import axios from "axios";
import { useAuth } from "@/app/context/AuthContext";
import Card from "@/app/components/Card";
import Input from "@/app/components/Input";

interface Mentor {
  id: string;
  name: string;
  expertise: string;
}

interface UploadFormData {
  title: string;
  project_type: "project" | "internship";
  description: string;
  company: string;
  startDate: string;
  endDate: string;
  technologies: string;
  mentorId: string;
  projectUrl: string;
  certificate: File | null;
}

interface FormErrors {
  [key: string]: string;
}

const Upload: React.FC = () => {
  const { user } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState<UploadFormData>({
    title: "",
    project_type: "project",
    description: "",
    company: "",
    startDate: "",
    endDate: "",
    technologies: "",
    mentorId: "",
    projectUrl: "",
    certificate: null,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [mentors, setMentors] = useState<Mentor[]>([]);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await axios.get<Mentor[]>(
          "http://127.0.0.1:5000/api/mentors"
        );
        setMentors(response.data);
      } catch (error) {
        console.error("Error fetching mentors:", error);
      }
    };
    fetchMentors();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if ((e.target as HTMLInputElement).files) {
      const files = (e.target as HTMLInputElement).files;
      setFormData((prev) => ({ ...prev, [name]: files ? files[0] : null }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (!formData.technologies.trim())
      newErrors.technologies = "Technologies are required";
    if (!formData.mentorId) newErrors.mentorId = "Please select a mentor";
    if (
      formData.startDate &&
      formData.endDate &&
      new Date(formData.startDate) > new Date(formData.endDate)
    ) {
      newErrors.endDate = "End date must be after start date";
    }
    return newErrors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) formDataToSend.append(key, value as string | Blob);
      });
      formDataToSend.append("studentId", user.id);

      const response = await axios.post(
        "http://127.0.0.1:5000/api/projects",
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 201) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setFormData({
            title: "",
            project_type: "project",
            description: "",
            company: "",
            startDate: "",
            endDate: "",
            technologies: "",
            mentorId: "",
            projectUrl: "",
            certificate: null,
          });
        }, 3000);
      }
    } catch (error) {
      console.error("Error uploading project:", error);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Upload Project or Internship
        </h1>
        <p className="text-gray-600 mt-1">Submit your work for mentor review</p>
      </div>
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
          <CheckCircle className="text-green-600 mr-3" size={24} />
          <div>
            <p className="font-medium text-green-800">
              Successfully Submitted!
            </p>
            <p className="text-sm text-green-700">
              Your work has been sent to your mentor for review.
            </p>
          </div>
        </div>
      )}
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter project or internship title"
            error={errors.title}
            required
          />
          {/* Rest of your inputs & selects remain the same */}
        </form>
      </Card>
    </div>
  );
};

export default Upload;
