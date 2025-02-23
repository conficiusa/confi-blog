import { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'
import { getAppURLBYENV } from '@/lib/utils'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getAppURLBYENV()

  // Fetch all posts from Sanity
  const posts = await client.fetch(
    groq`*[_type == "post" && defined(slug.current)] {
      "slug": slug.current,
      _updatedAt
    }`
  )

  // Create post entries
  const postEntries = posts.map((post: { slug: string; _updatedAt: string }) => ({
    url: `${baseUrl}/posts/${post.slug}`,
    lastModified: new Date(post._updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/getting-started`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...postEntries,
  ]
}