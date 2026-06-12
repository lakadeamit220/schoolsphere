"use client";

import Link from "next/link";
import { LogIn } from "lucide-react";
import { useState } from "react";
import { loginUser } from "../actions/auth";

export default function LoginPage() {
  const [error, setError] = useState("");

  async function handleSubmit(formData) {
    setError(""); // Clear previous errors
    
    const response = await loginUser(formData);
    
    if (response?.error) {
      setError(response.error);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-blue-100 rounded-full text-blue-600 mb-4">
            <LogIn size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-500 text-sm mt-2">Log in to SchoolSphere</p>
        </div>

        <form action={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 bg-red-100 text-red-600 rounded-lg text-sm text-center">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
              type="email" 
              name="email"
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="amit@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              name="password"
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            Log In
          </button>
        </form>


      </div>
    </div>
  );
}
