"use client";

import { useRouter } from "next/navigation";

import {
  GraduationCap,
  BookOpen,
  Users,
  CheckCircle,
  ArrowRight,
  Zap,
  Shield,
  BarChart3,
} from "lucide-react";
import Button from "./components/Button";

const Landing = () => {
  const router = useRouter();

  const features = [
    {
      icon: BookOpen,
      title: "Project Management",
      description: "Upload, manage, and track internships and projects with ease",
      color: "indigo",
    },
    {
      icon: Users,
      title: "Mentor Collaboration",
      description: "Connect with experienced mentors for personalized feedback",
      color: "blue",
    },
    {
      icon: Zap,
      title: "Real-time Feedback",
      description: "Receive instant feedback and grades on your submissions",
      color: "green",
    },
    {
      icon: BarChart3,
      title: "Progress Tracking",
      description: "Monitor your growth with comprehensive analytics",
      color: "yellow",
    },
  ];

  const steps = [
    { number: "1", title: "Register", description: "Create your account as a student or mentor" },
    { number: "2", title: "Submit Work", description: "Upload your projects and internship details" },
    { number: "3", title: "Get Feedback", description: "Receive detailed feedback from mentors" },
    { number: "4", title: "Grow & Improve", description: "Track progress and enhance your skills" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold text-indigo-600">Intern Verse</span>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => router.push("/login/student")}
              className="text-sm"
            >
              Login
            </Button>
            <Button
              variant="primary"
              onClick={() => router.push("/register/student")}
              className="text-sm"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HERO SECTION */}
        <section className="py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Master Your Internship & Projects
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect with mentors, get constructive feedback, and accelerate your career growth
            through structured project management and peer learning.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="primary"
              onClick={() => router.push("/register/student")}
              className="text-lg px-8 py-3"
            >
              Register as Student
              <ArrowRight size={20} className="ml-2" />
            </Button>

            <Button
              variant="outline"
              onClick={() => router.push("/register/mentor")}
              className="text-lg px-8 py-3"
            >
              Register as Mentor
            </Button>
          </div>
        </section>

        {/* FEATURES */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-gray-600 text-lg">Everything you need to succeed</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              const colorMap: Record<string, string> = {
                indigo: "bg-indigo-100 text-indigo-600",
                blue: "bg-blue-100 text-blue-600",
                green: "bg-green-100 text-green-600",
                yellow: "bg-yellow-100 text-yellow-600",
              };

              return (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 hover:shadow-md transition-all"
                >
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${colorMap[feature.color]}`}
                  >
                    <Icon size={24} />
                  </div>

                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* STEPS */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600 text-lg">Simple steps to get started</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-indigo-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4 mx-auto">
                  {step.number}
                </div>

                <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-center text-sm">{step.description}</p>

                {index < 3 && (
                  <div className="hidden md:block absolute top-12 -right-8 w-16 h-1 bg-gradient-to-r from-indigo-300 to-transparent"></div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* WHY CHOOSE US */}
        <section className="py-16 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl px-8 md:px-12 text-center my-16">
          <div className="flex justify-center mb-4">
            <Shield className="text-white" size={32} />
          </div>

          <h2 className="text-3xl font-bold text-white mb-4">Why Choose Intern Verse?</h2>

          <ul className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white max-w-4xl mx-auto">
            {[
              "Expert mentorship from industry professionals",
              "Structured feedback with grading system",
              "Certificate upload and recognition",
              "GitHub integration for easy project preview",
              "Real-time progress tracking",
              "Secure and reliable platform",
            ].map((text, i) => (
              <li key={i} className="flex items-start">
                <CheckCircle className="mr-3 flex-shrink-0 mt-1" size={20} />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <section className="py-16 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
          <p className="text-gray-600 text-lg mb-8">
            Join thousands of students and mentors on Intern Verse
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="primary"
              onClick={() => router.push("/register/student")}
              className="text-lg px-8 py-3"
            >
              Student Sign Up
              <ArrowRight size={20} className="ml-2" />
            </Button>

            <Button
              variant="secondary"
              onClick={() => router.push("/register/mentor")}
              className="text-lg px-8 py-3"
            >
              Mentor Sign Up
              <ArrowRight size={20} className="ml-2" />
            </Button>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* FOOTER GRID */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <FooterColumn title="Product" links={["Features", "Pricing", "Security"]} />
            <FooterColumn title="Company" links={["About", "Blog", "Careers"]} />
            <FooterColumn title="Legal" links={["Privacy", "Terms"]} />

            <div>
              <h3 className="text-white font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="mailto:support@internverse.com" className="hover:text-white transition">
                    support@internverse.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p>&copy; 2024 Intern Verse. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

// FOOTER COLUMN COMPONENT
function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: string[];
}) {
  return (
    <div>
      <h3 className="text-white font-semibold mb-4">{title}</h3>
      <ul className="space-y-2 text-sm">
        {links.map((link, i) => (
          <li key={i}>
            <a href="#" className="hover:text-white transition">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
