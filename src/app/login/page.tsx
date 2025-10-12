import Image from "next/image";
import { LoginForm } from "./_components/login-form";

export default function Login() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex min-h-[500px]">
          <div className="flex-1 hidden bg-gray-300 md:flex items-center justify-center">
            <div className="text-gray-600 text-2xl font-light italic">
              <Image
                src={"/logo_YWKA.png"}
                alt="background"
                width={400}
                height={400}
              />
            </div>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
