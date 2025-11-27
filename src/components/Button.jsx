import React from "react";

function Button({
  children,
  onClick,
  disabled,
  type = "button",
  className = "",
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`bg-[#2DD4BF] text-white px-4 py-3 rounded-lg cursor-pointer hover:bg-white hover:text-[#2DD4BF] border border-transparent hover:border-[#2DD4BF] transition-colors duration-200 font-medium active:bg-[#1c9b8a] active:text-white ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
