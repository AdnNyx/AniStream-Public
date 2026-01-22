"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, Github, LayoutGrid } from "lucide-react";

const Navbar = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);
  const router = useRouter();

  const useDatabase = process.env.NEXT_PUBLIC_USE_DATABASE === "true";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen) searchInputRef.current?.focus();
  }, [isSearchOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    if (isSearchOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSearchOpen]);

  const handleSearch = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      e.preventDefault();
      if (!keyword.trim()) return;
      router.push(`/search/${keyword}`);
      setIsSearchOpen(false);
      setKeyword("");
    }
  };

  const navLinks = [
    { href: "/populer", name: "Populer" },
    { href: "/movie", name: "Movie" },
    { href: "/genre", name: "Genre" },
    { href: "/schedule", name: "Schedule" },
  ];

  const authLinks = user 
    ? [
        { href: "/users/dashboard", name: "Dashboard" },
        { href: "/api/auth/signout", name: "Logout", color: "text-pink-400" }
      ]
    : [{ href: "/api/auth/signin", name: "Login" }];

  const allLinks = [...navLinks, ...(!useDatabase ? [{ href: "/users/dashboard/my-history", name: "History" }] : authLinks)];

  return (
    <header 
      className={`fixed top-0 w-full z-100 transition-all duration-500 ${
        scrolled 
          ? "py-3 bg-[#0b0c10]/90 backdrop-blur-2xl border-b border-white/10 shadow-2xl shadow-purple-500/20" 
          : "py-4 bg-transparent" // Padding awal dikecilkan dari py-6 ke py-4 agar tidak "kosong"
      }`}
    >
      <div className="container mx-auto px-6 grid grid-cols-3 items-center">
        
        {/* 1. KIRI: LOGO (Sinkron dengan Hero: Pink-Purple) */}
        <div className="flex justify-start">
          <Link href="/" className="text-xl lg:text-2xl font-black tracking-tighter text-white group flex items-center gap-2">
            <div className="w-8 h-8 lg:w-9 lg:h-9 bg-linear-to-br from-pink-500 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-pink-500/20">
                <LayoutGrid size={18} className="text-white" />
            </div>
            <span className="hidden sm:inline">ANI<span className="text-transparent bg-clip-text bg-linear-to-r from-pink-400 to-purple-500 group-hover:from-purple-400 group-hover:to-pink-500 transition-all">STREAM</span></span>
          </Link>
        </div>

        {/* 2. TENGAH: NAVIGASI (Pill Style Glassmorphism) */}
        <div className="flex justify-center">
          <AnimatePresence mode="wait">
            {!isSearchOpen ? (
              <motion.ul 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="hidden lg:flex items-center gap-1 bg-white/3 backdrop-blur-md border border-white/10 px-2 py-1.5 rounded-2xl shadow-[inset_0_0_10px_rgba(255,255,255,0.05)]"
              >
                {allLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`px-4 py-2 text-[13px] font-bold rounded-xl transition-all hover:bg-white/5 ${
                        link.color ? link.color : "text-neutral-400 hover:text-white"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </motion.ul>
            ) : (
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="hidden lg:block text-[9px] uppercase tracking-[0.4em] text-pink-500/70 font-black animate-pulse"
                >
                    Quick Search
                </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 3. KANAN: ACTIONS */}
        <div className="flex justify-end items-center gap-2 md:gap-3">
          <div ref={searchContainerRef} className="relative flex items-center">
            <AnimatePresence>
                {isSearchOpen && (
                <motion.div 
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "240px", opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="absolute right-0 flex items-center"
                >
                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Cari anime..."
                        className="w-full bg-[#1a1b26]/90 backdrop-blur-md border border-pink-500/30 rounded-xl py-2 px-10 text-xs focus:border-pink-500/60 text-white outline-none shadow-xl"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyDown={handleSearch}
                    />
                    <Search size={14} className="absolute left-3 text-pink-400" />
                    <button 
                        onClick={() => setIsSearchOpen(false)} 
                        className="absolute right-3 p-1 hover:bg-white/10 rounded-full text-neutral-400"
                    >
                        <X size={12} />
                    </button>
                </motion.div>
                )}
            </AnimatePresence>

            {!isSearchOpen && (
                <button 
                    onClick={() => setIsSearchOpen(true)}
                    className="p-2.5 text-neutral-400 hover:text-pink-400 transition-all bg-white/5 rounded-xl border border-white/5"
                >
                    <Search size={18} />
                </button>
            )}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link 
              href="/join" 
              className="group relative bg-white text-black px-5 py-2.5 rounded-xl text-[11px] font-black transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-95"
            >
              Join Komunitas
            </Link>
          </div>

          <button className="lg:hidden p-2 text-white bg-white/5 rounded-lg" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 w-full bg-[#0b0c10]/95 backdrop-blur-2xl border-b border-white/10 lg:hidden overflow-hidden shadow-2xl"
          >
            <ul className="flex flex-col p-6 gap-2">
              {allLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} onClick={() => setIsOpen(false)} className="block py-3 px-4 text-neutral-300 hover:text-pink-400 font-bold rounded-xl hover:bg-white/5 transition-all">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;