import React from "react";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ size = "md", fullScreen = false }) => {
  const sizes: Record<"sm" | "md" | "lg", string> = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  const loader = (
    <div
      className={`${sizes[size]} border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin`}
    ></div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        {loader}
      </div>
    );
  }

  return <div className="flex items-center justify-center p-8">{loader}</div>;
};

export default Loader;
