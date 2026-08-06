import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://nirmanai.com', // এখানে আপনার ওয়েবসাইটের আসল লিংক বা Vercel URL দিন
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}