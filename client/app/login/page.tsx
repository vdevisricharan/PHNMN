"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import type { RootState } from "@/redux/store";
import { login } from "@/redux/apiCalls";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { isFetching, error, currentUser } = useSelector((state: RootState) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      router.replace("/");
    }
  }, [currentUser, router]);

  const handleClick = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(dispatch, { username, password });
  };

  return (
    <div className="w-screen h-screen bg-cover bg-center flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8  shadow-lg">
        <h1 className="text-2xl font-light text-black mb-6 text-center">SIGN IN</h1>
        <form className="flex flex-col gap-4" onSubmit={handleClick}>
          <input
            className="px-4 py-2 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            placeholder="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <input
            className="px-4 py-2 text-black border border-gray-300  focus:outline-none focus:ring-2 focus:ring-gray-400"
            placeholder="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button
            type="submit"
            disabled={isFetching}
            className={`w-full py-3 mt-2  bg-black text-white font-semibold transition-colors duration-200 ${isFetching ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-700'}`}
          >
            LOGIN
          </button>
          {error && <span className="text-gray-500 text-sm text-center">Something went wrong</span>}
          <a className="text-xs underline text-gray-600 cursor-pointer text-center">FORGOT PASSWORD?</a>
          <a href="/register" className="text-xs underline text-gray-600 cursor-pointer text-center">CREATE A NEW ACCOUNT</a>
        </form>
      </div>
    </div>
  );
}