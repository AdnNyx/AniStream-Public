import AnimeCard from '@/app/components/AnimeCard';
import BackButton from '@/app/components/BackButton'; // Impor tombol baru
import { Search, Compass } from "lucide-react";

async function searchAnime(slug) {
  if (!slug) return [];
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const searchUrl = `${apiUrl}/search/${slug}`;
    const response = await fetch(searchUrl, { next: { revalidate: 3600 } });

    if (!response.ok) return [];
    const result = await response.json();
    return result.animes || [];
  } catch (error) {
    return [];
  }
}

export default async function SearchPage({ params: ParamsPromise }) {
  const params = await ParamsPromise;
  const { slug } = params;
  const keyword = decodeURIComponent(slug);
  const searchResults = await searchAnime(slug);

  return (
    <div className="min-h-screen bg-[#0b0c10] text-white selection:bg-violet-500/30">
      {/* Background Decorative Glow */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-6 md:px-12 py-10 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="space-y-2">
            <BackButton />
            <div className="flex items-center gap-3 pt-4">
              <div className="p-2 bg-violet-500/20 rounded-lg text-violet-400">
                <Search size={24} />
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter">
                HASIL <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-indigo-500">PENCARIAN</span>
              </h1>
            </div>
            <p className="text-neutral-500 font-medium">
              Menampilkan hasil untuk: <span className="text-white italic">"{keyword}"</span>
            </p>
          </div>

          <div className="hidden md:block">
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                {searchResults.length} Anime Ditemukan
              </span>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {searchResults && searchResults.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-8">
            {searchResults.map((anime) => {
              const slugParts = anime.slug?.split('/').filter(Boolean);
              const processedSlug = slugParts?.pop() || '';
              return (
                <div key={processedSlug || anime.title} className="hover:scale-105 transition-transform duration-300">
                  <AnimeCard
                    slug={processedSlug}
                    type={anime.type}
                    title={anime.title}
                    image={anime.poster}
                    episode={anime.episode}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10 animate-pulse">
              <Compass size={40} className="text-neutral-600" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Yah, tidak ketemu...</h2>
            <p className="text-neutral-500 max-w-md">
              Kami tidak dapat menemukan anime dengan judul tersebut. Coba gunakan kata kunci yang lebih umum.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}