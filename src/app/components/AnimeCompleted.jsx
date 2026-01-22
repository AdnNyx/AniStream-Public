"use client";

import React from 'react'
import AnimeCard from './AnimeCard'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronRight, CheckCircle2 } from 'lucide-react'

const AnimeCompleted = ({ api }) => {
  return (
    <section className="relative py-16 px-4 md:px-12 lg:px-24 bg-[#0b0c10]">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-linear-to-r from-transparent via-purple-500/10 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-end mb-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-2"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-purple-400" />
              <span className="text-purple-400 text-xs font-black tracking-[0.2em] uppercase">
                Koleksi Lengkap
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter">
              Anime <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-indigo-500">Completed</span>
            </h2>
          </motion.div>

          <Link 
            href="/completed" 
            className="hidden md:flex items-center gap-2 text-neutral-400 hover:text-purple-400 font-bold text-sm transition-all group"
          >
            Lihat Seluruhnya 
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid Anime */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8"
        >
          {api.map((anime, index) => (
            <AnimeCard
              key={anime.slug}
              title={anime.title}
              image={anime.poster}
              slug={anime.slug}
              type={anime.type}
              episode={anime.episode}
              statusOrDay="Tamat"
              priority={index < 6}
            />
          ))}
        </motion.div>

        <div className="mt-12 flex justify-center md:hidden">
          <Link 
            href="/completed" 
            className="w-full text-center py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold text-sm hover:bg-purple-500/10 hover:border-purple-500/50 transition-all"
          >
            Lihat Seluruhnya
          </Link>
        </div>
      </div>
    </section>
  )
}

export default AnimeCompleted