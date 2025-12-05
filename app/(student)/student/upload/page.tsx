// "use client";

// import { useState, useEffect, ChangeEvent, FormEvent } from "react";

// import { Upload as UploadIcon, CheckCircle } from "lucide-react";
// import axios from "axios";
// import { useAuth } from "@/app/context/AuthContext";
// import Card from "@/app/components/Card";
// import Input from "@/app/components/Input";
// import Button from "@/app/components/Button";

// interface Mentor {
//   id: string;
//   name: string;
//   expertise: string;
// }

// interface UploadFormData {
//   title: string;
//   project_type: "project" | "internship";
//   description: string;
//   company: string;
//   startDate: string;
//   endDate: string;
//   technologies: string;
//   mentorId: string;
//   projectUrl: string;
//   certificate: File | null;
// }

// interface FormErrors {
//   [key: string]: string;
// }

// const Upload: React.FC = () => {
//   const { user } = useAuth();
//   console.log(user);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [formData, setFormData] = useState<UploadFormData>({
//     title: "",
//     project_type: "project",
//     description: "",
//     company: "",
//     startDate: "",
//     endDate: "",
//     technologies: "",
//     mentorId: "",
//     projectUrl: "",
//     certificate: null,
//   });
//   const [errors, setErrors] = useState<FormErrors>({});
//   const [mentors, setMentors] = useState<Mentor[]>([]);

//   useEffect(() => {
//     const fetchMentors = async () => {
//       try {
//         const response = await axios.get<Mentor[]>(
//           "http://127.0.0.1:5000/api/mentors"
//         );
//         setMentors(response.data);
//       } catch (error) {
//         console.error("Error fetching mentors:", error);
//       }
//     };
//     fetchMentors();
//   }, []);

//   const handleChange = (
//     e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     if ((e.target as HTMLInputElement).files) {
//       const files = (e.target as HTMLInputElement).files;
//       setFormData((prev) => ({ ...prev, [name]: files ? files[0] : null }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };

//   const validate = (): FormErrors => {
//     const newErrors: FormErrors = {};
//     if (!formData.title.trim()) newErrors.title = "Title is required";
//     if (!formData.description.trim())
//       newErrors.description = "Description is required";
//     if (!formData.startDate) newErrors.startDate = "Start date is required";
//     if (!formData.endDate) newErrors.endDate = "End date is required";
//     if (!formData.technologies.trim())
//       newErrors.technologies = "Technologies are required";
//     if (!formData.mentorId) newErrors.mentorId = "Please select a mentor";
//     if (
//       formData.startDate &&
//       formData.endDate &&
//       new Date(formData.startDate) > new Date(formData.endDate)
//     ) {
//       newErrors.endDate = "End date must be after start date";
//     }
//     return newErrors;
//   };

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();

//     const newErrors = validate();
//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }

//     if (!user || !user.id) {
//       console.error("User not authenticated");
//       return;
//     }

//     try {
//       const formDataToSend = new FormData();

//       formDataToSend.append("title", formData.title);
//       formDataToSend.append("project_type", formData.project_type);
//       formDataToSend.append("description", formData.description);
//       formDataToSend.append("company", formData.company);
//       formDataToSend.append("startDate", formData.startDate);
//       formDataToSend.append("endDate", formData.endDate);
//       formDataToSend.append("technologies", formData.technologies);
//       formDataToSend.append("mentorId", formData.mentorId);
//       formDataToSend.append("projectUrl", formData.projectUrl);
//       formDataToSend.append("studentId", user.id);

//       if (formData.certificate) {
//         formDataToSend.append("certificate", formData.certificate);
//       }

//       const response = await axios.post(
//         "http://127.0.0.1:5000/api/projects/create",
//         formDataToSend,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       if (response.status === 201) {
//         setShowSuccess(true);

//         setTimeout(() => {
//           setShowSuccess(false);
//         }, 2500);

//         // Reset form
//         setFormData({
//           title: "",
//           project_type: "project",
//           description: "",
//           company: "",
//           startDate: "",
//           endDate: "",
//           technologies: "",
//           mentorId: "",
//           projectUrl: "",
//           certificate: null,
//         });
//       }
//     } catch (error) {
//       console.error("❌ Error uploading project:", error);
//     }
//   };

//   return (
//     <div className="space-y-6 max-w-3xl">
//       <div>
//         <h1 className="text-3xl font-bold text-gray-800">
//           Upload Project or Internship
//         </h1>
//         <p className="text-gray-600 mt-1">Submit your work for mentor review</p>
//       </div>
//       {showSuccess && (
//         <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
//           <CheckCircle className="text-green-600 mr-3" size={24} />
//           <div>
//             <p className="font-medium text-green-800">
//               Successfully Submitted!
//             </p>
//             <p className="text-sm text-green-700">
//               Your work has been sent to your mentor for review.
//             </p>
//           </div>
//         </div>
//       )}
//       <Card>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <Input
//             label="Title"
//             name="title"
//             value={formData.title}
//             onChange={handleChange}
//             placeholder="Enter project or internship title"
//             error={errors.title}
//             required
//           />
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Type <span className="text-red-500">*</span>
//             </label>
//             <div className="flex space-x-4">
//               <label className="flex items-center">
//                 <input
//                   type="radio"
//                   name="project_type"
//                   value="project"
//                   checked={formData.project_type === "project"}
//                   onChange={handleChange}
//                   className="mr-2"
//                 />
//                 <span className="text-gray-700">Project</span>
//               </label>
//               <label className="flex items-center">
//                 <input
//                   type="radio"
//                   name="project_type"
//                   value="internship"
//                   checked={formData.project_type === "internship"}
//                   onChange={handleChange}
//                   className="mr-2"
//                 />
//                 <span className="text-gray-700">Internship</span>
//               </label>
//             </div>
//           </div>
//           <div>
//             <label
//               htmlFor="description"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Description <span className="text-red-500">*</span>
//             </label>
//             <textarea
//               id="description"
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               placeholder="Describe your project or internship experience"
//               rows={4}
//               required
//               className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
//                 errors.description ? "border-red-500" : "border-gray-300"
//               }`}
//             />
//             {errors.description && (
//               <p className="mt-1 text-sm text-red-500">{errors.description}</p>
//             )}
//           </div>
//           {formData.project_type === "internship" && (
//             <Input
//               label="Company Name"
//               name="company"
//               value={formData.company}
//               onChange={handleChange}
//               placeholder="Enter company name"
//             />
//           )}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <Input
//               label="Start Date"
//               type="date"
//               name="startDate"
//               value={formData.startDate}
//               onChange={handleChange}
//               error={errors.startDate}
//               required
//             />
//             <Input
//               label="End Date"
//               type="date"
//               name="endDate"
//               value={formData.endDate}
//               onChange={handleChange}
//               error={errors.endDate}
//               required
//             />
//           </div>
//           <Input
//             label="Technologies Used"
//             name="technologies"
//             value={formData.technologies}
//             onChange={handleChange}
//             placeholder="e.g., React, Node.js, MongoDB (comma-separated)"
//             error={errors.technologies}
//             required
//           />
//           <Input
//             label="Project/Repository URL"
//             type="url"
//             name="projectUrl"
//             value={formData.projectUrl}
//             onChange={handleChange}
//             placeholder="e.g., https://github.com/username/project or project link"
//             error={errors.projectUrl}
//           />
//           {formData.project_type === "internship" && (
//             <div>
//               <label
//                 htmlFor="certificate"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Internship Certificate (Optional)
//               </label>
//               <input
//                 id="certificate"
//                 name="certificate"
//                 type="file"
//                 accept=".pdf,.jpg,.jpeg,.png"
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
//               />
//               <p className="text-xs text-gray-500 mt-1">
//                 Accepted formats: PDF, JPG, PNG (Max 5MB)
//               </p>
//             </div>
//           )}
//           <div>
//             <label
//               htmlFor="mentorId"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Select Mentor <span className="text-red-500">*</span>
//             </label>
//             <select
//               id="mentorId"
//               name="mentorId"
//               value={formData.mentorId}
//               onChange={handleChange}
//               required
//               className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
//                 errors.mentorId ? "border-red-500" : "border-gray-300"
//               }`}
//             >
//               <option value="">Choose a mentor</option>
//               {mentors.map((mentor) => (
//                 <option key={mentor.id} value={mentor.id}>
//                   {mentor.name} ({mentor.expertise})
//                 </option>
//               ))}
//             </select>
//             {errors.mentorId && (
//               <p className="mt-1 text-sm text-red-500">{errors.mentorId}</p>
//             )}
//           </div>
//           <div className="flex space-x-3">
//             <Button type="submit" variant="primary">
//               <UploadIcon size={18} className="mr-2" />
//               Submit for Review
//             </Button>
//             <Button
//               type="button"
//               variant="secondary"
//               onClick={() => {
//                 setFormData({
//                   title: "",
//                   project_type: "project",
//                   description: "",
//                   company: "",
//                   startDate: "",
//                   endDate: "",
//                   technologies: "",
//                   mentorId: "",
//                   projectUrl: "",
//                   certificate: null,
//                 });
//                 setErrors({});
//               }}
//             >
//               Reset
//             </Button>
//           </div>
//         </form>
//       </Card>
//     </div>
//   );
// };

// export default Upload;


"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Upload as UploadIcon, CheckCircle } from "lucide-react";
import axios from "axios";
import { useAuth } from "@/app/context/AuthContext";
import Card from "@/app/components/Card";
import Input from "@/app/components/Input";
import Button from "@/app/components/Button";

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
  const [mentors, setMentors] = useState<Mentor[]>([]);
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

  // ---------------- FETCH MENTORS ------------------
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const res = await axios.get<Mentor[]>(
          "http://127.0.0.1:5000/api/mentors"
        );
        setMentors(res.data);
      } catch (err) {
        console.error("Error fetching mentors", err);
      }
    };

    fetchMentors();
  }, []);

  // ---------------- INPUT CHANGE ------------------
  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    const target = e.target as HTMLInputElement;

    // file input
    if (target.type === "file" && target.files) {
      setFormData((prev) => ({ ...prev, [name]: target.files![0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // clear error for that field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ---------------- VALIDATION ------------------
  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";

    if (
      formData.startDate &&
      formData.endDate &&
      new Date(formData.startDate) > new Date(formData.endDate)
    ) {
      newErrors.endDate = "End date must be after start date";
    }

    if (!formData.technologies.trim())
      newErrors.technologies = "Technologies are required";

    if (!formData.mentorId)
      newErrors.mentorId = "Please select a mentor";

    if (formData.projectUrl.trim()) {
      try {
        new URL(formData.projectUrl);
      } catch {
        newErrors.projectUrl = "Enter a valid URL";
      }
    }

    return newErrors;
  };

  // ---------------- SUBMIT ------------------
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!user?.id) {
      console.error("User not authenticated");
      return;
    }

    try {
      const formDataToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key === "certificate") {
          if (value) formDataToSend.append("certificate", value);
        } else {
          formDataToSend.append(key, value as string);
        }
      });

      formDataToSend.append("studentId", user.id);

      const res = await axios.post(
        "http://127.0.0.1:5000/api/projects/create",
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.status === 201) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);

        // reset form
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

        setErrors({});
      }
    } catch (err) {
      console.error("Error uploading:", err);
    }
  };

  // ---------------- RETURN UI ------------------
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Upload Project or Internship
        </h1>
        <p className="text-gray-600 mt-1">
          Submit your work for mentor review
        </p>
      </div>

      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
          <CheckCircle className="text-green-600 mr-3" size={24} />
          <div>
            <p className="font-medium text-green-800">
              Successfully Submitted!
            </p>
            <p className="text-sm text-green-700">
              Your work has been sent to your mentor.
            </p>
          </div>
        </div>
      )}

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* TITLE */}
          <Input
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter title"
            error={errors.title}
            required
          />

          {/* TYPE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type <span className="text-red-500">*</span>
            </label>
            <div className="flex space-x-4">
              {["project", "internship"].map((t) => (
                <label className="flex items-center" key={t}>
                  <input
                    type="radio"
                    name="project_type"
                    value={t}
                    checked={formData.project_type === t}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-gray-700 capitalize">{t}</span>
                </label>
              ))}
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe your work"
              className={`w-full px-4 py-2 border rounded-lg ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">
                {errors.description}
              </p>
            )}
          </div>

          {/* COMPANY (Only Internship) */}
          {formData.project_type === "internship" && (
            <Input
              label="Company Name"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Enter company"
            />
          )}

          {/* DATES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              error={errors.startDate}
              required
            />
            <Input
              label="End Date"
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              error={errors.endDate}
              required
            />
          </div>

          {/* TECHNOLOGIES */}
          <Input
            label="Technologies"
            name="technologies"
            value={formData.technologies}
            onChange={handleChange}
            placeholder="React, Node.js, MySQL"
            error={errors.technologies}
            required
          />

          {/* URL */}
          <Input
            label="Project/Repository URL"
            name="projectUrl"
            type="url"
            value={formData.projectUrl}
            onChange={handleChange}
            placeholder="https://github.com/user/project"
            error={errors.projectUrl}
          />

          {/* INTERNSHIP CERTIFICATE */}
          {formData.project_type === "internship" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Internship Certificate (optional)
              </label>
              <input
                type="file"
                name="certificate"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-lg"
              />
            </div>
          )}

          {/* MENTOR */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Mentor <span className="text-red-500">*</span>
            </label>
            <select
              name="mentorId"
              value={formData.mentorId}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg ${
                errors.mentorId ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Choose Mentor</option>
              {mentors.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.expertise})
                </option>
              ))}
            </select>

            {errors.mentorId && (
              <p className="text-sm text-red-500 mt-1">{errors.mentorId}</p>
            )}
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex space-x-3">
            <Button type="submit" variant="primary">
              <UploadIcon size={18} className="mr-2" /> Submit for Review
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={() => {
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
                setErrors({});
              }}
            >
              Reset
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Upload;
