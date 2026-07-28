function Input({
  label,
  type = "text",
  placeholder,
  error,
  register,
  ...props
}) {
  return (
    <div className="mb-4">
      {label && (
        <label className="mb-2 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <input
        type={type}
        placeholder={placeholder}
        {...register}
        {...props}
        className={`w-full rounded-lg border px-4 py-2 outline-none transition ${
          error
            ? "border-red-500 focus:ring-2 focus:ring-red-300"
            : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
        }`}
      />

      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </div>
  );
}

export default Input;
