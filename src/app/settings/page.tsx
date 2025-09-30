import { getSession } from "@/actions/session";
import { getUser } from "@/actions/user";
import { Setting } from "./_components/setting";

export default async function SettingsPage() {
  const session = await getSession();
  const user = await getUser(session!.userId);
  if (!user) return null;
  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-lg">
      <div className="px-6 py-6 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              Setting Management
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Kelola data Pengaturan disini
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Setting user={user} />
      </div>
    </div>
  );
}
