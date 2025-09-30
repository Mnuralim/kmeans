"use client";
import React, { useActionState } from "react";
import Form from "next/form";
import { login } from "@/actions/auth";
import { ErrorMessage } from "@/app/_components/error-message";
import { LogIn } from "lucide-react";

export const LoginForm = () => {
  const [error, action, loading] = useActionState(login, {
    error: null,
  });
  return (
    <div className="flex-1 bg-white flex flex-col">
      <div className="p-8 pb-4">
        <h1 className="text-2xl font-light text-gray-700">LOGIN</h1>
      </div>

      <div className="flex-1 px-8 pb-8">
        <Form action={action} className="space-y-4">
          <ErrorMessage message={error.error} />
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Sebagai
            </label>
            <select
              id="role"
              name="role"
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none cursor-pointer"
            >
              <option value="ADMIN">Admin</option>
              <option value="HEAD_MASTER">Kepala Sekolah</option>
            </select>
          </div>

          <div className="pt-4">
            <button
              disabled={loading}
              type="submit"
              className="w-full flex items-center justify-center gap-3 
        bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600
        text-white font-medium py-3 px-4
        rounded-lg border border-blue-600
        focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2
        transition-colors duration-200 
        disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Login</span>
                </>
              )}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};
