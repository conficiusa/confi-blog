import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'
import { NextResponse } from 'next/server'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  // Fetch all posts from Sanity
  const posts = await client.fetch(
    groq`*[_type == "post" && defined(slug.current)] {
      "slug": slug.current
    }`
  )

  // Create XML sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${baseUrl}</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>
      <url>
        <loc>${baseUrl}/getting-started</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>
      ${posts
        .map(
          (post: { slug: string }) => `
        <url>
          <loc>${baseUrl}/posts/${post.slug}</loc>
          <changefreq>weekly</changefreq>
          <priority>0.7</priority>
        </url>
      `
        )
        .join('')}
    </urlset>`

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'text/xml',
    },
  })
}