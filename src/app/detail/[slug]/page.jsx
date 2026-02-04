export const dynamic = 'force-dynamic'

import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Play, 
  Download, 
  Calendar, 
  Clock, 
  Star, 
  Info,
  Layers
} from 'lucide-react';
import BackButton from '@/app/components/BackButton';

async function getDetailAnime(slug) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}/detail/${slug}`);
    if (!response.ok) {
      throw new Error('Gagal mengambil data anime utama');
    }
    const result = await response.json();
    return result.detail;
  } catch (error) {
    console.error("Gagal mengambil detail anime:", error);
    return null;
  }
}

export default async function DetailAnimePage({ params: paramsPromise }) {
  const params = await paramsPromise;
  const { slug } = params;

  const anime = await getDetailAnime(slug);

  if (!anime) {
    return (
      <div className="min-h-screen bg-[#0b0c10] text-white flex flex-col justify-center items-center text-center px-6">
        <div className="p-4 bg-red-500/10 rounded-full mb-6 border border-red-500/20">
          <Info size={48} className="text-red-500" />
        </div>
        <h1 className="text-3xl font-black mb-2 tracking-tighter uppercase">Anime Tidak Ditemukan</h1>
        <p className="text-neutral-500 mb-8 max-w-md">Data untuk anime ini tidak dapat dimuat atau telah dihapus.</p>
        <Link href="/" className="px-8 py-3 bg-white text-black font-bold rounded-2xl hover:scale-105 transition-all">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const duration = anime.duration || 'N/A';
  const producer = anime.author || 'N/A';
  const season = anime.season || 'N/A';
  const releaseDate = anime.aired || 'N/A';
  const studio = anime.studio || 'N/A';
  const japaneseTitle = anime.synonym || 'N/A';
  const status = anime.status || 'N/A';

  const historyQueryParams = new URLSearchParams({
    slug: slug,
    title: anime.title,
    image: anime.poster,
  });
  const queryString = historyQueryParams.toString();

  return (
    <div className="relative min-h-screen bg-[#0b0c10] text-white selection:bg-violet-500/30">
      
      {/* Background Hero Blur */}
      <div className="absolute top-0 left-0 w-full h-[60vh] overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center scale-110 blur-xl opacity-20"
          style={{ backgroundImage: `url(${anime.poster})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0b0c10]/50 to-[#0b0c10]"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-12 py-8">
        
        {/* Top Header */}
        <div className="mb-8 flex items-center justify-between">
            <BackButton />
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl">
                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                <span className="text-xs font-black uppercase tracking-widest">{status}</span>
            </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 mt-4">
          
          {/* Poster Section */}
          <div className="lg:w-1/3 xl:w-1/4 shrink-0">
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative aspect-[3/4.5] w-full max-w-[320px] mx-auto lg:max-w-none">
                    <Image
                        src={anime.poster}
                        alt={anime.title}
                        className="object-cover rounded-[2rem] shadow-2xl border border-white/10"
                        fill
                        priority
                    />
                </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="lg:w-2/3 xl:w-3/4 space-y-8">
            <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                    {anime.genres?.slice(0, 3).map((genre) => (
                        <span key={genre.slug} className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded-lg">
                            {genre.name}
                        </span>
                    ))}
                </div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
                    {anime.title}
                </h1>
                <div className="flex items-center gap-4 text-neutral-400 font-bold text-sm">
                    <div className="flex items-center gap-1.5">
                        <Clock size={16} className="text-violet-500" />
                        {duration}
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1.5">
                        <Calendar size={16} className="text-violet-500" />
                        {season}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                href={`/watch/${anime.episodes?.[0]?.slug || ''}?${queryString}`}
                className="group bg-violet-600 hover:bg-violet-700 text-white px-8 py-4 rounded-2xl flex items-center gap-3 font-bold transition-all hover:scale-105 shadow-xl shadow-violet-600/20"
              >
                <Play size={20} className="fill-current" />
                Watch Now
              </Link>

              {anime.batch && anime.batch.slug && (
                <Link
                  href={`/download/${anime.batch.slug}`}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-2xl flex items-center gap-3 font-bold transition-all hover:scale-105"
                >
                  <Download size={20} />
                  Download Batch
                </Link>
              )}
            </div>

            {/* Synopsis */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-md">
                <h3 className="text-lg font-black tracking-tight mb-4 flex items-center gap-2">
                    <Info size={18} className="text-violet-500" />
                    SYNOPSIS
                </h3>
                <p className="text-neutral-400 leading-relaxed text-sm md:text-base">
                    {anime.synopsis || 'Tidak ada sinopsis tersedia.'}
                </p>
            </div>

            {/* Info Grid Card */}
            <div className="bg-[#13141c] border border-white/10 rounded-3xl p-6 md:p-8 grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-4">
              <InfoItem label="English" value={japaneseTitle} />
              <InfoItem label="Producer" value={producer} />
              <InfoItem label="Studio" value={studio} />
              <InfoItem label="Release" value={releaseDate} />
              <InfoItem label="Status" value={status} />
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Genres</span>
                <div className="flex flex-wrap gap-1 mt-1">
                    {anime.genres?.map((g) => (
                        <span key={g.slug} className="text-[11px] text-neutral-300">#{g.name}</span>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Episode List Section */}
      <div className="relative z-10 container mx-auto px-4 md:px-12 py-16">
        <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-violet-600/20 rounded-xl flex items-center justify-center text-violet-500">
                <Layers size={20} />
            </div>
            <h2 className="text-3xl font-black tracking-tighter">EPISODE LIST</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {anime.episodes && anime.episodes.length > 0 ? (
            anime.episodes.map((episode, idx) => (
              <Link
                key={episode.slug}
                href={`/watch/${episode.slug}?${queryString}`}
                className="group relative bg-[#13141c] border border-white/5 rounded-2xl p-4 flex items-center gap-4 hover:border-violet-500/50 hover:bg-violet-500/5 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-white/5 group-hover:bg-violet-600 rounded-xl flex items-center justify-center shrink-0 transition-colors">
                  <span className="text-violet-500 group-hover:text-white font-black text-sm">
                    {episode.name.match(/\d+/)?.[0] || idx + 1}
                  </span>
                </div>
                <div className="overflow-hidden">
                  <h3 className="text-sm font-bold text-neutral-200 group-hover:text-white transition-colors line-clamp-1 italic uppercase">
                    {episode.name}
                  </h3>
                  <p className="text-[10px] text-neutral-500 font-black uppercase tracking-tighter mt-0.5">
                    {duration} • HD Quality
                  </p>
                </div>
                <div className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play size={16} className="text-violet-500 fill-current" />
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full bg-white/5 rounded-3xl py-12 text-center text-neutral-500 font-bold border border-dashed border-white/10">
              No episodes available for this anime yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
    return (
        <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">{label}</span>
            <p className="text-sm font-bold text-neutral-200 line-clamp-1">{value}</p>
        </div>
    );
}