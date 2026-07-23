import { forwardRef } from "react";

const variants = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300",

  secondary:
    "bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-slate-300",

  outline:
    "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 focus:ring-slate-300",

  danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-300",
};

const sizes = {
  sm: "px-3 py-2 text-sm",
  md: "px-5 py-2.5 text-base",
  lg: "px-6 py-3 text-lg",
};

const Button = forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      className = "",
      type = "button",
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={`
          inline-flex
          items-center
          justify-center
          rounded-xl
          font-medium
          transition-all
          duration-200
          focus:outline-none
          focus:ring-2
          disabled:opacity-50
          disabled:cursor-not-allowed
          ${variants[variant]}
          ${sizes[size]}
          ${className}
        `}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
