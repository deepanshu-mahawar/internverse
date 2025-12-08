// "use client";

// import React, { ChangeEvent, ReactNode } from "react";

// interface InputProps {
//   label?: string;
//   type?: string;
//   value: string;
//   onChange: (e: ChangeEvent<HTMLInputElement>) => void;
//   placeholder?: string;
//   error?: string;
//   required?: boolean;
//   disabled?: boolean;
//   className?: string;
//   name: string; // required for forms
//   id?: string; // optional, fallback to name
//   icon: ReactNode;
// }

// const Input: React.FC<InputProps> = ({
//   label,
//   type = "text",
//   value,
//   onChange,
//   placeholder,
//   error,
//   required = false,
//   disabled = false,
//   className = "",
//   name,
//   id,
//   icon
// }) => {
//   const inputId = id || name;

//   return (
//     <div className={`w-full ${className}`}>
//       {label && (
//         <label
//           htmlFor={inputId}
//           className="block text-sm font-medium text-gray-700 mb-1"
//         >
//           {label}
//           {required && <span className="text-red-500 ml-1">*</span>}
//         </label>
//       )}

//       <input
//         id={inputId}
//         name={name}
//         type={type}
//         value={value}
//         onChange={onChange}
//         placeholder={placeholder}
//         required={required}
//         disabled={disabled}
//         className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
//           error ? "border-red-500" : "border-gray-300"
//         } ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
//       />

//       {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
//     </div>
//   );
// };

// export default Input;





"use client";

import React, { ChangeEvent, ReactNode } from "react";

interface InputProps {
  label?: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  name: string;
  id?: string;
  icon?: ReactNode; // 👈 icon optional now
}

const Input: React.FC<InputProps> = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  className = "",
  name,
  id,
  icon
}) => {
  const inputId = id || name;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input wrapper for icon */}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            {icon}
          </span>
        )}

        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors 
            ${icon ? "pl-10" : ""} 
            ${error ? "border-red-500" : "border-gray-300"} 
            ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
        />
      </div>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
