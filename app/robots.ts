import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://nirmanai.com/sitemap.xml', // আপনার ওয়েবসাইটের ডোমেইন অনুযায়ী আপডেট করুন
  };
}