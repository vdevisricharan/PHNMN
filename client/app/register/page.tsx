"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { register as registerApi } from "@/redux/apiCalls";

interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const [inputs, setInputs] = useState<RegisterForm>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    setSuccess(false);
    if (inputs.password !== inputs.confirmPassword) {
      setError(true);
      return;
    }
    try {
      await registerApi({
        username: inputs.username,
        email: inputs.email,
        password: inputs.password,
      });
      setSuccess(true);
      setTimeout(() => router.push("/login"), 1500);
    } catch {
      setError(true);
    }
  };

  return (
    <div className="w-screen h-screen bg-cover bg-center flex items-center justify-center">
      <div className="w-full max-w-xl bg-white p-8  shadow-lg">
        <h1 className="text-2xl font-light mb-6 text-center text-black">CREATE AN ACCOUNT</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            className="flex-1 min-w-[40%] px-4 py-2 text-black border border-gray-300  focus:outline-none focus:ring-2 focus:ring-gray-400"
            placeholder="username"
            name="username"
            value={inputs.username}
            onChange={handleChange}
          />
          <input
            className="flex-1 min-w-[40%] px-4 py-2 text-black border border-gray-300  focus:outline-none focus:ring-2 focus:ring-gray-400"
            placeholder="email"
            name="email"
            value={inputs.email}
            onChange={handleChange}
          />
          <input
            className="flex-1 min-w-[40%] px-4 py-2 text-black border border-gray-300  focus:outline-none focus:ring-2 focus:ring-gray-400"
            placeholder="password"
            name="password"
            type="password"
            value={inputs.password}
            onChange={handleChange}
          />
          <input
            className="flex-1 min-w-[40%] px-4 py-2 text-black border border-gray-300  focus:outline-none focus:ring-2 focus:ring-gray-400"
            placeholder="confirm password"
            name="confirmPassword"
            type="password"
            value={inputs.confirmPassword}
            onChange={handleChange}
          />
          <span className="w-full text-xs my-4 text-gray-600">
            By creating an account, I consent to the processing of my personal data in accordance with the PRIVACY POLICY
          </span>
          <button
            type="submit"
            className="w-2/5 py-3  bg-black text-white font-semibold transition-colors duration-200 hover:bg-gray-700"
          >
            CREATE
          </button>
          {error && <span className="w-full text-gray-500 text-sm text-center mt-2">Something went wrong or passwords do not match</span>}
          {success && <span className="w-full text-green-600 text-sm text-center mt-2">Registration successful! Redirecting...</span>}
        </form>
      </div>
    </div>
  );
}