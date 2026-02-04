export const dynamic = 'force-dynamic';

import React from 'react';
import AnimeListClient from '../components/AnimeListClient';
import BackButton from '@/app/components/BackButton';
import { Layers, Search } from 'lucide-react';

// Server Component
const Page = async () => {

    async function getAllAnime() {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            // Fetch data dari API animelist
            const response = await fetch(`${apiUrl}/animelist`, { 
                cache: 'no-store' 
            }); 
            
            if (!response.ok) {
                throw new Error(`Gagal mengambil data: ${response.status}`);
            }
            
            const result = await response.json();
            return result.list || []; 
            
        } catch (error) {
            console.error("Gagal mengambil data anime:", error);
            return [];
        }
    }
    
    // Ambil data dari server
    const allAnimeData = await getAllAnime(); 
    
    // Transformasi data agar sesuai dengan prop yang dibutuhkan AnimeListClient
    const flattenedAnimeList = allAnimeData.flatMap(group => 
        group.animeList.map(anime => ({
            title: anime.title,
            href: anime.href
        }))
    );

    return (
        <div className="min-h-screen bg-[#0b0c10] text-white selection:bg-violet-500/30 overflow-x-hidden">
            
            {/* Dekorasi Cahaya Latar */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

            <div className="relative z-10 container mx-auto px-4 md:px-12 py-8">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="space-y-4">
                        <BackButton />
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-violet-400 text-[10px] font-black uppercase tracking-[0.3em]">
                                <Layers size={14} />
                                Library Database
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic">
                                Anime <span className="text-violet-500">Archive</span>
                            </h1>
                            <p className="text-neutral-500 text-sm font-medium max-w-md">
                                Telusuri seluruh koleksi database anime kami secara lengkap dari A sampai Z.
                            </p>
                        </div>
                    </div>

                    {/* Stats Ringkas */}
                    <div className="hidden lg:flex items-center gap-6 bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-md">
                        <div className="text-center px-4">
                            <div className="text-2xl font-black text-white">{flattenedAnimeList.length}</div>
                            <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Total Titles</div>
                        </div>
                        <div className="h-10 w-px bg-white/10"></div>
                        <div className="text-center px-4">
                            <div className="text-2xl font-black text-violet-500">A-Z</div>
                            <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Sorting</div>
                        </div>
                    </div>
                </div>

                {/* Search & List Section */}
                <div className="bg-[#13141c]/50 border border-white/5 rounded-[2.5rem] p-4 md:p-8 backdrop-blur-sm min-h-[60vh]">
                    {/* Komponen Client untuk Filter & List */}
                    <AnimeListClient initialData={flattenedAnimeList} />
                </div>

                {/* Footer Info */}
                <div className="mt-12 text-center">
                    <p className="text-neutral-600 text-[10px] font-bold uppercase tracking-[0.4em]">
                        Handcrafted for Otaku Experience
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Page;