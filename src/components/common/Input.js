function Input({ label, id, ...props }) {
    return (
      <div>
        <label htmlFor={id} className="sr-only">{label}</label>
        <input
          id={id}
          className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#004EA2] focus:border-[#004EA2] focus:z-10 sm:text-sm"
          {...props}
        />
      </div>
    );
  }
  
  export default Input;