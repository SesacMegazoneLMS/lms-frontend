function Button({ children, type = "button", className = "", ...props }) {
    return (
      <button
        type={type}
        className={`w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#004EA2] hover:bg-[#003875] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#004EA2] ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
  
  export default Button;