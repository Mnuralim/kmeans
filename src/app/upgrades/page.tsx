import { upgradeStats } from "@/actions/upgrade";
import { Upgrade } from "./_components/upgrade";

interface Props {
  searchParams: Promise<{ success?: string; error?: string; message?: string }>;
}

export default async function UpgradePage({ searchParams }: Props) {
  const { error, message, success } = await searchParams;
  const stats = await upgradeStats();
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Transisi Tahun Akademik</h1>
      </div>
      <Upgrade
        stats={stats}
        alertType={success ? "success" : error ? "error" : undefined}
        message={message}
      />
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Panduan Transisi</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Pastikan tahun akademik berikutnya sudah dibuat di sistem</li>
          <li>
            Klik &quot;Siapkan Transisi&quot; untuk menentukan kelas tujuan
            siswa
          </li>
          <li>Tinjau kembali data siswa yang akan dipindahkan</li>
          <li>
            Klik &quot;Jalankan Transisi&quot; untuk memproses perpindahan ke
            tahun ajaran baru
          </li>
          <li>Proses ini bersifat permanen dan tidak dapat dibatalkan</li>
        </ol>
      </div>
    </div>
  );
}
