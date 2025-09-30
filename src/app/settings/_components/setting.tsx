"use client";

import { useActionState, useState } from "react";
import { User as UserIcon, Lock, Eye, EyeOff, Save } from "lucide-react";
import { updateUser } from "@/actions/user";
import { ErrorMessage } from "@/app/_components/error-message";
import type { User } from "@prisma/client";
import Form from "next/form";

interface Props {
  user: User;
}

export const Setting = ({ user }: Props) => {
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [state, action, pending] = useActionState(updateUser, {
    error: null,
  });

  const togglePasswordVisibility = (field: "old" | "new" | "confirm") => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
            <UserIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Pengaturan Profil
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Kelola informasi akun dan keamanan Anda
            </p>
          </div>
        </div>
      </div>

      <ErrorMessage message={state.error} />

      <Form action={action} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
              <UserIcon className="w-4 h-4 text-slate-600" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-slate-900">
                Informasi Profil
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Data dasar akun administrator
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                defaultValue={user.username}
                className="w-full px-3 py-2.5 pr-10 border border-slate-200 rounded-lg text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors duration-150"
                placeholder="Masukkan username..."
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
              <Lock className="w-4 h-4 text-slate-600" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-slate-900">
                Keamanan Password
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Kosongkan jika tidak ingin mengubah password
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label
                htmlFor="oldPassword"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Password Lama
              </label>
              <div className="relative">
                <input
                  type={showPasswords.old ? "text" : "password"}
                  id="oldPassword"
                  name="oldPassword"
                  className="w-full px-3 py-2.5 pr-10 border border-slate-200 rounded-lg text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors duration-150"
                  placeholder="Masukkan password lama"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("old")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors duration-150"
                >
                  {showPasswords.old ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Password Baru
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  className="w-full px-3 py-2.5 pr-10 border border-slate-200 rounded-lg text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors duration-150"
                  placeholder="Masukkan password baru (minimal 6 karakter)"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("new")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors duration-150"
                >
                  {showPasswords.new ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Konfirmasi Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  className="w-full px-3 py-2.5 pr-10 border border-slate-200 rounded-lg text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors duration-150"
                  placeholder="Konfirmasi password baru"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirm")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors duration-150"
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 flex justify-end pt-6 border-t border-slate-200">
          <button
            disabled={pending}
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-900 text-white text-sm font-medium rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {pending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Simpan Perubahan
              </>
            )}
          </button>
        </div>
      </Form>
    </div>
  );
};
