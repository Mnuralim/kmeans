import { Filter } from "./_components/filter";

export default function PaymentsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-lg">
      <div className="px-6 py-6 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              Payment Management
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Kelola data pembayaran disini
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Filter />
        {children}
      </div>
    </div>
  );
}
