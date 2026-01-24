export const dynamic = 'force-dynamic'

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, Database, Sparkles } from 'lucide-react';
import AnimeListClient from '../components/AnimeListClient';

async function getInitialAnime(letter, page) {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${apiUrl}/animelist?letter=${letter}&page=${page}`, { 
            cache: 'no-store' 
        }); 
        
        if (!response.ok) {
            throw new Error(`Gagal mengambil data: ${response.status}`);
        }
        
        const result = await response.json();
        return result.animes || []; 
        
    } catch (error) {
        console.error("Gagal mengambil data anime:", error);
        return []; 
    }
}

const Page = async () => {
    const initialLetter = 'A';
    const initialAnimeData = await getInitialAnime(initialLetter, 1); 
    
    return (
        <div className="min-h-screen bg-[#0b0c10] text-white selection:bg-purple-500 selection:text-white">
 
            <main className="container mx-auto px-4 pt-28 pb-20 md:px-6 relative z-10">

                <div className="mb-8">
                    <Link 
                        href="/" 
                        className="inline-flex items-center gap-2 text-sm font-bold text-neutral-400 hover:text-violet-400 transition-all duration-300 group"
                    >
                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-violet-500/50 group-hover:bg-violet-500/10 transition-all">
                            <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                        </div>
                        <span className="uppercase tracking-widest text-xs">Kembali ke Beranda</span>
                    </Link>
                </div>

                <header className="flex flex-col items-center text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6 shadow-[0_0_15px_rgba(139,92,246,0.1)]">
                        <Database size={12} className="text-purple-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-300">
                            Official Database
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter leading-tight relative">
                        <span className="absolute inset-0 blur-3xl bg-purple-600/20 -z-10"></span>
                        
                        Anime Library <br />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 via-purple-500 to-indigo-500 animate-gradient-x">
                            Archive A - Z
                        </span>
                    </h1>

                    <p className="text-neutral-400 text-sm md:text-base max-w-2xl leading-relaxed font-light">
                        Jelajahi koleksi lengkap anime kami. Gunakan filter huruf di bawah untuk menemukan judul favorit Anda.
                    </p>

                    <div className="w-24 h-1.5 bg-linear-to-r from-transparent via-purple-500 to-transparent rounded-full mt-8 opacity-60"></div>
                </header>

                <div className="relative">
                    <div className="absolute inset-0 bg-linear-to-b from-purple-900/10 to-transparent blur-3xl -z-10 rounded-[3rem]"></div>
                    
                    <AnimeListClient 
                        initialData={initialAnimeData} 
                        initialLetter={initialLetter} 
                    />
                </div>
            </main>

            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full mix-blend-screen animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-violet-800/10 blur-[120px] rounded-full mix-blend-screen"></div>
            </div>
        </div>
    );
}

export default Page;