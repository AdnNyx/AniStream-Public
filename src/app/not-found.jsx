"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, ArrowLeft, Ghost } from 'lucide-react';
import Link from 'next/link';

const NotFound = () => {
  // State untuk menangani data partikel agar tidak mismatch antara Server dan Client
  const [particles, setParticles] = useState([]);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    // Generate data posisi acak HANYA setelah komponen masuk ke sisi client
    const newParticles = [...Array(8)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: Math.random() * 5 + 5,
      delay: Math.random() * 5,
      size: Math.random() * 4 + 2
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#0b0c10] text-white p-6 overflow-hidden">
      
      {/* --- LAYER DEKORATIF BACKGROUND --- */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-600/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full"></div>

      {/* --- KONTEN UTAMA --- */}
      <div className="relative z-10 flex flex-col items-center text-center">
        
        {/* Animasi Ikon Ghost Mengapung */}
        <motion.div
          animate={{ 
            y: [0, -25, 0],
            rotate: [0, 8, -8, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="mb-6 relative"
        >
          {/* Efek Glow di belakang ikon */}
          <div className="absolute inset-0 bg-pink-500/20 blur-3xl rounded-full scale-150"></div>
          <Ghost size={100} className="relative text-white/90 drop-shadow-[0_0_15px_rgba(255,182,197,0.5)]" />
        </motion.div>

        {/* Angka 404 Stylized */}
        <div className="flex items-center justify-center gap-1 mb-2">
          <motion.span 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-linear-to-b from-white to-neutral-600"
          >
            4
          </motion.span>
          <motion.span 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-8xl md:text-9xl font-black text-pink-500 transform rotate-12 drop-shadow-[0_0_20px_rgba(236,72,153,0.4)]"
          >
            0
          </motion.span>
          <motion.span 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-linear-to-b from-white to-neutral-600"
          >
            4
          </motion.span>
        </div>

        {/* Teks Deskripsi */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl md:text-3xl font-black mb-4 tracking-tight">
            Oops! Kamu Terlempar ke <span className="text-pink-400">Isekai</span>
          </h2>
          <p className="text-neutral-400 mb-10 text-base md:text-lg max-w-md leading-relaxed font-light">
            Portal yang kamu tuju sepertinya sedang tertutup atau halaman ini telah berpindah dimensi.
          </p>
        </motion.div>

        {/* --- TOMBOL NAVIGASI --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-white text-black px-10 py-4 rounded-2xl font-black transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] active:scale-95"
          >
            <Home size={20} />
            Balik Beranda
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-10 py-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-pink-500/10 hover:border-pink-500/50 text-white font-bold transition-all active:scale-95"
          >
            <ArrowLeft size={20} />
            Sebelumnya
          </button>
        </motion.div>
      </div>

      {/* --- PARTIKEL SAKURA FALL (Aman dari Hydration Mismatch) --- */}
      <div className="absolute inset-0 pointer-events-none">
        <AnimatePresence>
          {hasMounted && particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute bg-pink-400/40 rounded-full blur-[1px]"
              style={{ 
                left: p.left, 
                top: p.top,
                width: p.size,
                height: p.size
              }}
              animate={{ 
                y: [0, 100, 200],
                x: [0, 20, -20],
                opacity: [0, 0.8, 0],
                rotate: 360
              }}
              transition={{ 
                duration: p.duration, 
                repeat: Infinity, 
                delay: p.delay,
                ease: "linear"
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Footer Branding Kecil */}
      <div className="absolute bottom-8 text-[10px] text-neutral-600 uppercase tracking-[0.5em] font-bold">
        AniStream Protocol v2.0
      </div>
    </div>
  );
};

export default NotFound;