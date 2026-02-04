Platform streaming anime modern yang dibangun dengan Next.js dan fitur authentication lengkap.

## 🚀 Teknologi

- **Framework**: [Next.js](https://nextjs.org)
- **Authentication**: NextAuth.js
- **Database**: PostgreSQL/MySQL (optional)
- **Font Optimization**: [Geist](https://vercel.com/font) via `next/font`
- **Package Manager**: npm/yarn/pnpm/bun

## 📚 API & Resources

**Anime API**: [https://www.sankavollerei.com/anime](https://www.sankavollerei.com/anime)

## 📦 Instalasi

```bash
# Clone repository
git clone https://github.com/AdnNyx/AniStream.git
cd AniStream

# Install dependencies
npm install
# atau
yarn install
# atau
pnpm install
# atau
bun install
```

## ⚙️ Environment Variables

Ubah file `.env.example` menjadi `.env.local` di root project dan isi dengan variabel berikut:

```env
# API Configuration
NEXT_PUBLIC_API_URL=your_api_url

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXT_AUTH_SECRET=your_secret_key

# Database (Optional)
USE_DATABASE=false
DATABASE_URL=your_database_url

# OAuth Providers
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

## 🛠️ Development

Jalankan development server:

```bash
npm run dev
# atau
yarn dev
# atau
pnpm dev
# atau
bun dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser untuk melihat hasilnya.

## 🏗️ Build & Production

```bash
# Build untuk production
npm run build

# Menjalankan production server
npm run start
```

## 📖 Learn More

Untuk mempelajari lebih lanjut tentang Next.js:

- **[Next.js Documentation](https://nextjs.org/docs)** - Pelajari fitur dan API Next.js
- **[Learn Next.js](https://nextjs.org/learn)** - Tutorial interaktif Next.js
- **[Next.js GitHub](https://github.com/vercel/next.js)** - Feedback dan kontribusi Anda sangat diterima!

## 🚀 Deployment

Untuk panduan deployment Next.js, lihat [dokumentasi deployment Next.js](https://nextjs.org/docs/app/building-your-application/deploying).


## 🤝 Contributing

Open Kontribusi, issues, dan feature requests!

## 👨‍💻 Credits

**API**: [SankaVollerei](https://www.sankavollerei.com/anime/)

=======
# AniStream-Public
>>>>>>> 8fa6b1780d389b8ec393c422ae620aeb06f1cd54
