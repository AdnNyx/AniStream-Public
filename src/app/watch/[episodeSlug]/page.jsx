"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  AlertCircle, 
  Layers, 
  Tv,
  Info,
  Download // Ikon untuk fitur download
} from 'lucide-react';
import BackButton from '@/app/components/BackButton';

// --- SKELETON (DIPERCANTIK) ---
function WatchPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#0b0c10] text-white animate-pulse">
      <div className="container mx-auto px-4 py-8">
        <div className="h-10 w-32 bg-white/5 rounded-xl mb-6"></div>
        <div className="aspect-video bg-white/5 rounded-3xl mb-6 shadow-2xl border border-white/5"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-12 w-3/4 bg-white/5 rounded-xl"></div>
            <div className="h-24 w-full bg-white/5 rounded-2xl"></div>
          </div>
          <div className="bg-white/5 h-48 rounded-3xl"></div>
        </div>
      </div>
    </div>
  );
}

function ErrorDisplay({ message }) {
  return (
    <div className="min-h-screen bg-[#0b0c10] text-white flex flex-col justify-center items-center text-center px-4">
      <div className="p-4 bg-red-500/10 rounded-full mb-6 border border-red-500/20">
        <AlertCircle size={48} className="text-red-500" />
      </div>
      <h1 className="text-3xl font-black mb-2 tracking-tighter">TERJADI KESALAHAN</h1>
      <p className="text-neutral-400 mb-8 max-w-md">{message}</p>
      <Link href="/" className="bg-white text-black px-8 py-3 rounded-2xl font-bold hover:scale-105 transition-all">
        Kembali ke Beranda
      </Link>
    </div>
  );
}

const HISTORY_CACHE_KEY = 'juju-otaku-history';
function saveHistoryToCache(animeInfo, episodeSlug) {
    if (!animeInfo || !episodeSlug) return;
    try {
      const newItem = {
        id: episodeSlug,
        userId: 'local-user',
        animeId: animeInfo.slug,
        episodeId: episodeSlug,
        title: animeInfo.title,
        image: animeInfo.image,
        watchedAt: new Date().toISOString(),
      };
      let currentHistory = [];
      try {
        currentHistory = JSON.parse(localStorage.getItem(HISTORY_CACHE_KEY)) || [];
      } catch (e) { currentHistory = []; }
      const filteredHistory = currentHistory.filter((item) => item.episodeId !== episodeSlug);
      const newHistory = [newItem, ...filteredHistory].slice(0, 50);
      localStorage.setItem(HISTORY_CACHE_KEY, JSON.stringify(newHistory));
    } catch (error) { console.error(error); }
}

function WatchPageContent({ params, episodeSlug }) {
  const { data: session, status: sessionStatus } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [episodeTitle, setEpisodeTitle] = useState(null);
  const [servers, setServers] = useState([]);
  const [downloads, setDownloads] = useState([]); // State untuk menyimpan data download
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentStreamUrl, setCurrentStreamUrl] = useState(null);
  const [activeIdentifier, setActiveIdentifier] = useState(null);
  const [isSwitchingServer, setIsSwitchingServer] = useState(false);
  const [isValidPrev, setIsValidPrev] = useState(false);
  const [isValidNext, setIsValidNext] = useState(false);
  const [animeInfo, setAnimeInfo] = useState(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!episodeSlug) {
      setError("Slug episode tidak valid.");
      setIsLoading(false);
      return;
    }

    async function fetchEpisodeData() {
      setIsLoading(true);
      setError(null);
      try {
        const episodeResponse = await fetch(`${apiUrl}/episode/${episodeSlug}`);
        if (!episodeResponse.ok) throw new Error(`Status: ${episodeResponse.status}`);
        const episodeData = await episodeResponse.json();

        setEpisodeTitle(episodeData.title);
        setServers(episodeData.streams || []);
        
        // --- PENAMBAHAN DATA DOWNLOAD ---
        setDownloads(episodeData.downloads || []); 

        const defaultStream = episodeData.streams?.[0];
        if (defaultStream) {
          setCurrentStreamUrl(defaultStream.url);
          setActiveIdentifier(defaultStream.url);
        }

        const slugFromUrl = searchParams.get('slug');
        const titleFromUrl = searchParams.get('title');
        const imageFromUrl = searchParams.get('image');

        if (slugFromUrl && titleFromUrl && imageFromUrl) {
          const info = { slug: slugFromUrl, title: titleFromUrl, image: imageFromUrl };
          setAnimeInfo(info);
          sessionStorage.setItem('lastWatchedAnimeInfo', JSON.stringify(info));
        } else {
          const cachedInfo = sessionStorage.getItem('lastWatchedAnimeInfo');
          if (cachedInfo) setAnimeInfo(JSON.parse(cachedInfo));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchEpisodeData();
  }, [episodeSlug, apiUrl, searchParams]);

  useEffect(() => {
    const useDatabase = process.env.NEXT_PUBLIC_USE_DATABASE === 'true';
    if (!animeInfo || !animeInfo.slug || sessionStatus === 'loading') return;
    if (useDatabase && session) {
      const saveHistoryToDb = async () => {
        try {
          await fetch('/api/history', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              animeId: animeInfo.slug,
              episodeId: episodeSlug,
              title: animeInfo.title,
              image: animeInfo.image,
            }),
          });
        } catch (err) {}
      };
      saveHistoryToDb();
    } else if (!useDatabase) {
      saveHistoryToCache(animeInfo, episodeSlug);
    }
  }, [animeInfo, session, sessionStatus, episodeSlug]);

  const handleServerClick = (server) => {
    setIsSwitchingServer(true);
    setActiveIdentifier(server.url);
    setCurrentStreamUrl(server.url);
    setTimeout(() => setIsSwitchingServer(false), 500);
  };

  const { prevSlug, nextSlug } = useMemo(() => {
    if (!episodeSlug) return { prevSlug: null, nextSlug: null };
    const match = episodeSlug.match(/-episode-(\d+)$/);
    if (!match) return { prevSlug: null, nextSlug: null };
    const baseSlug = episodeSlug.substring(0, match.index);
    const currentNum = parseInt(match[1], 10);
    return {
      nextSlug: `${baseSlug}-episode-${currentNum + 1}`,
      prevSlug: currentNum > 1 ? `${baseSlug}-episode-${currentNum - 1}` : null
    };
  }, [episodeSlug]);

  useEffect(() => {
    const checkExistence = async () => {
      if (prevSlug) {
        try {
          const res = await fetch(`${apiUrl}/episode/${prevSlug}`, { method: 'HEAD' });
          setIsValidPrev(res.ok);
        } catch (e) { setIsValidPrev(false); }
      }
      if (nextSlug) {
        try {
          const res = await fetch(`${apiUrl}/episode/${nextSlug}`, { method: 'HEAD' });
          setIsValidNext(res.ok);
        } catch (e) { setIsValidNext(false); }
      }
    };
    if (prevSlug || nextSlug) checkExistence();
  }, [prevSlug, nextSlug, apiUrl]);

  if (isLoading) return <WatchPageSkeleton />;
  if (error) return <ErrorDisplay message={error} />;

  return (
    <div className="min-h-screen bg-[#0b0c10] text-white selection:bg-violet-500/30">
      <div className="fixed top-0 right-0 w-[400px] h-[400px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="container mx-auto px-4 md:px-12 py-8 relative z-10">
        <div className="mb-6">
          <BackButton />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-6">
            {/* PLAYER Area */}
            <div className="relative aspect-video bg-[#13141c] rounded-[2rem] overflow-hidden shadow-2xl border border-white/5">
              {isSwitchingServer && (
                <div className="absolute inset-0 z-20 bg-[#0b0c10]/90 backdrop-blur-xl flex flex-col items-center justify-center">
                   <div className="w-16 h-16 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin"></div>
                   <p className="mt-4 text-sm font-black tracking-widest uppercase text-violet-400">Switching Server...</p>
                </div>
              )}
              {currentStreamUrl ? (
                <iframe
                  src={currentStreamUrl}
                  allowFullScreen
                  sandbox="allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation"
                  className="w-full h-full border-0"
                  key={currentStreamUrl}
                ></iframe>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900 text-neutral-500">
                  <Tv size={64} className="mb-4" />
                  <p className="font-bold uppercase tracking-widest text-xs">Video Source Not Ready</p>
                </div>
              )}
            </div>

            {/* INFO AREA */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-violet-400 text-[10px] font-black uppercase tracking-[0.3em]">
                    <Layers size={12} />
                    Now Streaming
                  </div>
                  <h1 className="text-2xl md:text-4xl font-black tracking-tighter leading-tight">
                    {episodeTitle || 'Loading Episode...'}
                  </h1>
                </div>

                <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/5">
                  <Link 
                    href={isValidPrev ? `/watch/${prevSlug}` : '#'} 
                    className={`p-3 rounded-xl transition-all ${isValidPrev ? 'bg-white/5 hover:bg-violet-500 text-white' : 'opacity-20 cursor-not-allowed text-neutral-500'}`}
                  >
                    <ChevronLeft size={20} strokeWidth={3} />
                  </Link>
                  <div className="h-8 w-px bg-white/10 mx-2"></div>
                  <Link 
                    href={isValidNext ? `/watch/${nextSlug}` : '#'} 
                    className={`p-3 rounded-xl transition-all ${isValidNext ? 'bg-white/5 hover:bg-violet-500 text-white' : 'opacity-20 cursor-not-allowed text-neutral-500'}`}
                  >
                    <ChevronRight size={20} strokeWidth={3} />
                  </Link>
                </div>
              </div>

              {/* --- BAGIAN DOWNLOAD (TERINTEGRASI) --- */}
              {downloads && downloads.length > 0 && (
                <div className="mt-4 pt-6 border-t border-white/10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-violet-500/20 rounded-xl text-violet-400 border border-violet-500/20">
                      <Download size={20} />
                    </div>
                    <h3 className="text-xl font-black tracking-tighter uppercase italic text-white">
                      Download <span className="text-violet-500">Links</span>
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {downloads.map((dl, idx) => (
                      <div 
                        key={idx} 
                        className="group flex flex-col md:flex-row md:items-center justify-between p-4 bg-black/40 border border-white/5 rounded-2xl hover:border-violet-500/30 transition-all duration-300"
                      >
                        <div className="flex items-center gap-4">
                          <div className="px-3 py-1 bg-violet-600/20 text-violet-400 text-[10px] font-black rounded-lg border border-violet-500/20 uppercase tracking-widest shadow-lg shadow-violet-600/5">
                            {dl.quality}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                          {dl.links.map((link, lIdx) => (
                            <a
                              key={lIdx}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-white/5 hover:bg-violet-600 border border-white/10 text-neutral-300 hover:text-white text-xs font-bold rounded-xl transition-all active:scale-95 shadow-sm"
                            >
                              {link.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            {/* SERVER LIST */}
            <div className="bg-[#13141c]/60 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400">
                        <Layers size={20} />
                    </div>
                    <h3 className="text-xl font-black tracking-tight">Multi Servers</h3>
                </div>

                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-4 mb-6 flex items-start gap-3 text-indigo-300">
                    <Info size={16} className="mt-0.5 shrink-0" />
                    <p className="text-[11px] leading-relaxed font-medium">
                        Gunakan server lain jika video tidak bisa diputar.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-2">
                    {servers.map((server, i) => (
                        <button
                            key={server.url}
                            onClick={() => handleServerClick(server)}
                            disabled={isSwitchingServer}
                            className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 border ${
                                activeIdentifier === server.url
                                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 border-white/20 shadow-lg'
                                : 'bg-white/5 border-white/5 hover:bg-white/10'
                            }`}
                        >
                            <span className={`text-sm font-bold ${activeIdentifier === server.url ? 'text-white' : 'text-neutral-400'}`}>
                                {server.name}
                            </span>
                            {activeIdentifier === server.url && (
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_8px_white]"></div>
                            )}
                        </button>
                    ))}
                </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function WatchPage({ params }) {
  const resolvedParams = React.use ? React.use(params) : params;
  const episodeSlugArray = resolvedParams?.episodeSlug;
  const episodeSlug = Array.isArray(episodeSlugArray) 
    ? episodeSlugArray[episodeSlugArray.length - 1] 
    : episodeSlugArray || null;

  return (
    <React.Suspense fallback={<WatchPageSkeleton />}>
      <WatchPageContent params={params} episodeSlug={episodeSlug} />
    </React.Suspense>
  );
}