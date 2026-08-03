import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import * as authService from "../../services/authService";
import Input from "../ui/Input";
import Button from "../ui/Button";

const schema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum([
    "Fleet Manager",
    "Driver",
    "Safety Officer",
    "Financial Analyst",
  ]),
});

function RegisterForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      role: "Fleet Manager",
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      await authService.register(data);

      toast.success("Registration successful");

      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Name"
        placeholder="Enter your name"
        register={register("name")}
        error={errors.name}
      />

      <Input
        label="Email"
        type="email"
        placeholder="Enter your email"
        register={register("email")}
        error={errors.email}
      />

      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
        register={register("password")}
        error={errors.password}
      />

      <div>
        <label className="mb-2 block text-sm font-medium">Role</label>

        <select
          {...register("role")}
          className="w-full rounded-lg border border-gray-300 px-4 py-2"
        >
          <option value="Fleet Manager">Fleet Manager</option>
          <option value="Driver">Driver</option>
          <option value="Safety Officer">Safety Officer</option>
          <option value="Financial Analyst">Financial Analyst</option>
        </select>
      </div>

      <Button type="submit" loading={loading} className="w-full">
        Register
      </Button>

      <p className="text-center text-sm">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-blue-600 hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
}

export default RegisterForm;
