/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Production বিল্ডে রেন্ডারিং প্রসেস ফাস্ট করে
  reactStrictMode: true,
  
  // 2. Unused JavaScript কমাতে এবং বড় আইকন লাইব্রেরি (যেমন Lucide) ছোট করতে
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', '@radix-ui/react-icons'],
  },

  // 3. ইমেজ অপটিমাইজেশন (LCP কমানোর জন্য)
  images: {
    formats: ['image/avif', 'image/webp'], // ⚡ PageSpeed Fix: দ্রুততম ইমেজ ফরম্যাট সাপোর্ট
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;