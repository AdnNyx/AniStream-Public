"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:bg-white/10 transition-all group"
    >
      <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
      <span className="text-sm font-bold">Kembali</span>
    </button>
  );
}