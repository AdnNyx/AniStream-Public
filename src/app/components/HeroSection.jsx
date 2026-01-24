"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Play, Compass, Hash } from "lucide-react";

// --- KOMPONEN SAKURA ---
const SakuraFall = () => {
  const [petals, setPetals] = useState([]);
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 10 : 25;
    const newPetals = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
      size: Math.random() * 15 + 10,
    }));
    setPetals(newPetals);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          initial={{ y: -20, x: `${petal.left}vw`, opacity: 0, rotate: 0 }}
          animate={{
            y: "110vh",
            x: `${petal.left + (Math.random() * 10 - 5)}vw`,
            opacity: [0, 1, 1, 0],
            rotate: 360,
          }}
          transition={{ duration: petal.duration, repeat: Infinity, delay: petal.delay, ease: "linear" }}
          className="absolute"
          style={{ width: petal.size, height: petal.size }}
        >
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 38C20 38 36 29 36 17C36 5 25 2 20 12C15 2 4 5 4 17C4 29 20 38 20 38Z" fill="#d8b4fe" fillOpacity="0.4" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

const HeroSection = () => {
  const router = useRouter();
  const searchRef = useRef();
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const genreMap = {
    "Mobil": "Cars",
    "Antariksa": "Space",
    "Dimensia": "Dementia",
    "Parodi": "Parody",
    "Robot": "Mecha",
    "Perang" : "War",
    "Politik": "Political",
    "Polisi": "Police",
    "Reinkarnasi": "Reincarnation",
    "Fantasi Urban": "Urban Fantasy",
    "Ketegangan": "Suspense",
    "Aksi": "Action",
    "Petualangan": "Adventure",
    "Komedi": "Comedy",
    "Drama": "Drama",
    "Fantasi": "Fantasy",
    "Misteri": "Mystery",
    "Psikologis": "Psychological",
    "Romansa": "Romance",
    "Kehidupan": "Slice of Life",
    "Medis": "Medical",
    "Horor": "Horror",
    "Olahraga": "Sports",
    "Musik": "Music",
    "Militer": "Military",
    "Sekolahan": "School",
    "Sejarah": "Historical",
    "Iblis": "Demons",
    "Sihir": "Magic",
  };

  const blacklist = ["Hentai", "Erotica", "Yaoi", "Yuri", "Smut", "Adult", "Anak-Anak"];

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${apiUrl}/genres`);
        const result = await response.json();
        const rawGenres = result.genres || result || [];
        const cleanedGenres = rawGenres
          .filter(g => !blacklist.includes(g.name))
          .map(g => ({
            ...g,
            name: genreMap[g.name] || g.name
          }));

        setGenres(cleanedGenres);
      } catch (error) {
        console.error("Gagal mengambil genre:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGenres();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const keyword = searchRef.current.value;
    if (keyword === "") {
      alert("Please enter a keyword.");
    } else if (keyword.trim() === "") {
      alert("Spaces only are not allowed.");
    } else {
      router.push(`/search/${keyword}`);
    }
  };

  const handleScrollArea = (e) => {
    const element = e.currentTarget;
    const isScrollingDown = e.deltaY > 0;
    const isScrollingUp = e.deltaY < 0;

    if (
      (isScrollingDown && element.scrollHeight - element.scrollTop <= element.clientHeight) ||
      (isScrollingUp && element.scrollTop === 0)
    ) {
      if (e.cancelable) e.preventDefault();
    }
    e.stopPropagation();
  };

  return (
    <section className="relative w-full h-screen flex items-center bg-[#0b0c10] overflow-hidden">
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <SakuraFall />

      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[45%] bg-purple-600/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[45%] bg-indigo-600/10 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* AREA TEKS & SEARCH */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <div className="flex items-center gap-2 mb-6">
                <span className="h-px w-8 bg-purple-500"></span>
                <span className="text-purple-400 text-[10px] lg:text-xs font-black tracking-[0.3em] uppercase">Premium Anime Hub</span>
              </div>
              <h1 className="text-5xl md:text-7xl xl:text-8xl font-black text-white leading-none tracking-tighter mb-6">
                Ani<span className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 via-purple-500 to-indigo-500">Stream</span>
              </h1>
              <p className="text-neutral-400 text-base md:text-lg max-w-xl leading-relaxed font-light">
                Discover harmony in watching. The most complete anime collection with crystal visual quality without interruptions.
              </p>
            </motion.div>

            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 max-w-xl">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-purple-400 transition-colors" size={20} />
                <input
                  type="text"
                  ref={searchRef}
                  placeholder="Search anime title..."
                  className="w-full h-14 pl-12 pr-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
                />
              </div>
              <button type="submit" className="h-14 px-10 bg-white text-black rounded-2xl font-bold hover:scale-105 transition-all flex items-center justify-center gap-2">
                <Play size={18} fill="currentColor" />
                <span>Start</span>
              </button>
            </form>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/animelist" className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-bold hover:bg-purple-500/20 hover:border-purple-500/50 transition-all">Database A - Z</Link>
              <Link href="https://saweria.co/NanNyx" target="_blank" className="px-8 py-3 rounded-xl border border-white/10 bg-white/5 text-neutral-400 hover:text-white transition-all text-sm">Support Admin</Link>
            </div>
          </div>

          {/* AREA GENRE (Scrollable & Filtered) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="lg:col-span-5 hidden lg:block"
          >
            <div className="bg-[#13141c]/60 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 relative overflow-hidden group shadow-2xl">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <Compass className="text-purple-400" size={20} />
                    <h3 className="text-xl font-bold text-white tracking-tight">Explore Genres</h3>
                  </div>
                  <Link href="/genres" className="text-[10px] font-bold text-neutral-500 hover:text-purple-400 transition-colors uppercase tracking-widest">View All</Link>
                </div>

                {/* CONTAINER SCROLL LOCKED */}
                <div
                  onWheel={handleScrollArea}
                  className="grid grid-cols-2 xl:grid-cols-3 gap-2 max-h-[350px] overflow-y-auto no-scrollbar overscroll-none pr-2 scroll-smooth"
                >
                  {isLoading ? (
                    [...Array(12)].map((_, i) => <div key={i} className="h-10 bg-white/5 animate-pulse rounded-xl" />)
                  ) : (
                    genres.map((genre, i) => (
                      <Link
                        key={i}
                        href={`/genres/${genre.slug || genre.name.toLowerCase()}`}
                        className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/5 text-[11px] text-neutral-400 hover:text-white hover:bg-purple-500/20 hover:border-purple-500/30 transition-all group/tag flex items-center gap-2"
                      >
                        <Hash size={10} className="text-neutral-600 group-hover/tag:text-purple-400" />
                        <span className="truncate">{genre.name}</span>
                      </Link>
                    ))
                  )}
                </div>

                <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center text-[9px] text-neutral-600 font-bold uppercase tracking-[0.2em]">
                  <span>Source: Filtered API</span>
                  <span>v.1.0</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;