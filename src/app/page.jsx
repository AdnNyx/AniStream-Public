// app/page.js

import AnimeCompleted from "@/app/components/AnimeCompleted";
import AnimeOngoing from "@/app/components/AnimeOngoing";
import HeroSection from "@/app/components/HeroSection";
import React from 'react';
import Navbar from "./components/Navbar"; 
import { AuthUserSession } from "./libs/auth-libs";

// Komponen Pesan Error
function ApiWarningMessage({ sectionTitle }) {
  return (
    <div className="text-center px-4 py-20 bg-[#0b0c10]">
      <p className="text-lg font-semibold text-pink-500">
        Gagal Memuat Data {sectionTitle}
      </p>
      <p className="text-sm text-neutral-400 mt-2">
        API mungkin mencapai limit. Silakan coba muat ulang nanti.
      </p>
    </div>
  );
}

// Komponen Skeleton (Loading State)
function AnimeListSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 py-12 px-4 md:px-24 gap-4 md:gap-6 bg-[#0b0c10]">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="aspect-2/3 w-full rounded-2xl bg-white/5 animate-pulse"></div>
      ))}
    </div>
  );
}

const Home = async () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const user = await AuthUserSession();

  let animeOngoing = [];
  let animeComplete = [];
  let ongoingFetchFailed = false;
  let completedFetchFailed = false;

  try {
    const [ongoingResponse, completedResponse] = await Promise.allSettled([
      fetch(`${apiUrl}/ongoing`, { next: { revalidate: 3600 } }), // Cache 1 jam
      fetch(`${apiUrl}/completed`, { next: { revalidate: 3600 } })
    ]);

    if (ongoingResponse.status === 'fulfilled' && ongoingResponse.status === 'fulfilled' && ongoingResponse.value.ok) {
      const resultOnGoing = await ongoingResponse.value.json();
      animeOngoing = resultOnGoing.animes || [];
    } else {
      ongoingFetchFailed = true;
    }

    if (completedResponse.status === 'fulfilled' && completedResponse.value.ok) {
      const resultCompleted = await completedResponse.value.json();
      animeComplete = resultCompleted.animes || [];
    } else {
      completedFetchFailed = true;
    }
  } catch (error) {
    ongoingFetchFailed = true;
    completedFetchFailed = true;
  }

  return (
    <>
      <Navbar user={user} />

      <main className="bg-[#0b0c10]">
        {/* 1. Hero Section dengan animasi sakura */}
        <HeroSection />

        {/* 2. Section Ongoing (Header sudah ada di dalam komponen) */}
        {ongoingFetchFailed ? (
          <ApiWarningMessage sectionTitle="OnGoing" />
        ) : (
          <AnimeOngoing api={animeOngoing} />
        )}

        {/* 3. Section Completed */}
        <React.Suspense fallback={<AnimeListSkeleton />}>
          {completedFetchFailed ? (
            <ApiWarningMessage sectionTitle="Completed" />
          ) : (
            <AnimeCompleted api={animeComplete} />
          )}
        </React.Suspense>
      </main>
    </>
  );
}

export default Home;