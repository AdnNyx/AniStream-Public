"use client";

import React, { useEffect, useState } from 'react';
import SearchInput from './SearchInput';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

// Komponen Partikel Sakura
const SakuraFall = () => {
  const [petals, setPetals] = useState([]);

  useEffect(() => {
    // Generate petals hanya di sisi client
    const newPetals = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
      size: Math.random() * 10 + 5,
    }));
    setPetals(newPetals);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          initial={{ y: -20, x: `${petal.left}vw`, opacity: 0, rotate: 0 }}
          animate={{
            y: "110vh",
            x: `${petal.left + (Math.random() * 10 - 5)}vw`,
            opacity: [0, 1, 1, 0],
            rotate: 360
          }}
          transition={{
            duration: petal.duration,
            repeat: Infinity,
            delay: petal.delay,
            ease: "linear"
          }}
          className="absolute"
          style={{ width: petal.size, height: petal.size }}
        >
          {/* Kelopak Sakura SVG */}
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 38C20 38 36 29 36 17C36 5 25 2 20 12C15 2 4 5 4 17C4 29 20 38 20 38Z" fill="#ffb7c5" fillOpacity="0.6" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

// ... (Bagian SakuraFall tetap sama)

const HeroSection = () => {
  return (
    /* Perubahan: Menggunakan min-h-screen dan flex-col agar benar-benar center secara vertikal */
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#0b0c10] px-4 overflow-hidden py-20">

      {/* Animasi Sakura Background */}
      <SakuraFall />

      {/* Layer Dekoratif Premium */}
      <div className="absolute top-[-5%] left-[-5%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-5%] right-[-5%] w-[50%] h-[50%] bg-pink-600/10 blur-[120px] rounded-full"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        /* Perubahan: Penyesuaian max-width dan shadow agar lebih fit */
        className="w-full max-w-6xl bg-white/2 backdrop-blur-2xl rounded-[3rem] overflow-hidden 
                   grid grid-cols-1 lg:grid-cols-2 
                   shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 relative z-20"
      >

        {/* KONTEN TEKS */}
        {/* Perubahan: Padding p-8 lg:p-16 agar kontainer tidak terlalu molor ke bawah */}
        <div className="p-8 lg:p-16 flex flex-col justify-center relative z-30 order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="h-px w-8 bg-pink-500"></span>
              <span className="text-pink-400 text-[10px] lg:text-xs font-black tracking-[0.3em] uppercase">
                Premium Anime Hub
              </span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-black text-white mb-4 leading-[1.1] tracking-tighter">
              Ani<span className="text-transparent bg-clip-text bg-linear-to-br from-pink-400 via-purple-400 to-indigo-500">Stream</span>
            </h1>

            <p className="text-neutral-400 mb-8 text-sm lg:text-lg max-w-md leading-relaxed font-light">
              Temukan harmoni dalam menonton. Koleksi anime terlengkap dengan kualitas visual kristal tanpa gangguan.
            </p>
          </motion.div>

          <div className="mb-8 group">
            <SearchInput />
            <div className="mt-4 text-[10px] text-neutral-500 flex flex-wrap gap-3 items-center">
              <span className="text-pink-500/50 font-bold uppercase tracking-widest text-[9px]">Hot Topic:</span>
              {["One Piece", "Solo Leveling", "Kaoru Hana"].map((item) => (
                <span key={item} className="hover:text-pink-400 cursor-pointer transition-all duration-300">
                  #{item.replace(/\s/g, '')}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/animelist"
              className="group relative bg-white text-black px-8 py-3 rounded-xl font-black transition-all 
                         hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] flex items-center justify-center text-sm"
            >
              Database A - Z
            </Link>

            <Link
              href='https://saweria.co/NanNyx'
              target='_blank'
              className="group px-8 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-pink-500/10 
                         hover:border-pink-500/50 text-white font-bold transition-all text-center flex items-center justify-center text-sm"
            >
              Support Admin
            </Link>
          </div>
        </div>

        {/* BAGIAN GAMBAR */}
        {/* Perubahan: H-full pada desktop agar seimbang dengan teks di kiri */}
        <div className="relative h-[300px] lg:h-full order-1 lg:order-2 overflow-hidden bg-[#14151c]">
          <div className="absolute inset-0 bg-linear-to-t lg:bg-linear-to-r from-[#0b0c10]/80 lg:from-[#0b0c10] via-transparent to-transparent z-20"></div>

          <motion.div
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="w-full h-full relative"
          >
            <Image
              fill
              src="/images/yuki.gif"
              alt="Anime Character"
              className="object-cover object-center grayscale-20 hover:grayscale-0 transition-all duration-1000"
              priority
              unoptimized
            />
            <div className="absolute inset-0 bg-pink-500/5 mix-blend-overlay"></div>
          </motion.div>
        </div>

      </motion.div>
    </div>
  );
};

export default HeroSection;