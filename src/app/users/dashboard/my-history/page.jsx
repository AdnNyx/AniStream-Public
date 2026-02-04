// File: src/app/users/dashboard/my-history/page.jsx
import { getServerSession } from "next-auth";
import prisma from "@/app/libs/prisma";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import BackButton from "@/app/components/BackButton";
import HistoryList from "./HistoryList"; 
import { Clock, Info, History } from "lucide-react";

const useDatabase = process.env.USE_DATABASE === 'true';

async function getWatchHistory(userId) {
  if (!prisma) {
    return [];
  }
  const history = await prisma.watchHistory.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      watchedAt: 'desc',
    },
    take: 50,
  });
  return history;
}

export default async function HistoryPage() {
  let session = null;
  let currentUser = null;
  let history = []; 

  if (useDatabase) {
    session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      redirect("/signin"); 
    }

    currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      redirect("/signin"); 
    }
    history = await getWatchHistory(currentUser.id);
  }

  return (
    <div className="min-h-screen bg-[#0b0c10] text-white selection:bg-violet-500/30 overflow-x-hidden">
      
      {/* Dekorasi Background Glow */}
      <div className="fixed top-0 left-1/4 -translate-x-1/2 w-[500px] h-[500px] bg-violet-600/5 blur-[120px] rounded-full pointer-events-none z-0"></div>

      <div className="relative z-10 container mx-auto px-4 md:px-12 py-8">
        
        {/* Header Section */}
        <div className="flex flex-col gap-6 mb-10">
            <div className="w-fit">
                <BackButton />
            </div>

            <div className="space-y-2">
                <div className="flex items-center gap-2 text-violet-400 text-[10px] font-black uppercase tracking-[0.3em]">
                    <History size={14} />
                    User Dashboard
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic">
                    My <span className="text-violet-500">History</span>
                </h1>
                <p className="text-neutral-500 text-sm font-medium max-w-md">
                    Lanjutkan tontonan Anda yang tertunda dengan mudah.
                </p>
            </div>
        </div>

        {/* Notifikasi Mode Cache (Non-DB) */}
        {!useDatabase && (
          <div className="mb-8 flex items-start gap-4 p-5 bg-amber-500/5 border border-amber-500/20 rounded-[2rem] backdrop-blur-md">
            <div className="p-2 bg-amber-500/20 rounded-xl text-amber-500">
                <Info size={20} />
            </div>
            <div>
                <h4 className="text-amber-500 font-bold text-sm uppercase tracking-tight">Mode Cache Aktif</h4>
                <p className="text-amber-200/60 text-xs mt-1 leading-relaxed">
                    Riwayat tontonan saat ini hanya disimpan sementara di peramban ini. 
                    Masuk ke akun Anda untuk sinkronisasi permanen.
                </p>
            </div>
          </div>
        )}

        {/* List Section Container */}
        <div className="bg-[#13141c]/50 border border-white/5 rounded-[2.5rem] p-4 md:p-8 backdrop-blur-sm min-h-[60vh]">
            <HistoryList initialHistory={history} />
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center">
            <div className="flex justify-center items-center gap-2 text-neutral-600 mb-2">
                <Clock size={12} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Last 50 Activities</span>
            </div>
        </div>
      </div>
    </div>
  );
}