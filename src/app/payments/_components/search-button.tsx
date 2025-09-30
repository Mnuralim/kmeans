import { CircleDotDashed } from "lucide-react";
import React from "react";
import { useFormStatus } from "react-dom";

export const SearchButton = () => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? <CircleDotDashed className="animate-spin" /> : "Cari"}
    </button>
  );
};
