import Link from "next/link";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { auth } from "@/auth";

import Avatar from "./avatar";
import CoverImage from "./cover-image";
import DateComponent from "./date";
import MoreStories from "./more-stories";
import Onboarding from "./onboarding";

import type { HeroQueryResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { heroQuery, settingsQuery, topicsQuery } from "@/sanity/lib/queries";
import { ENVConfig, getStyles } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Intro } from "@/components/intro";

function HeroPost({
  title,
  slug,
  excerpt,
  coverImage,
  date,
  author,
  topics,
}: Pick<
  Exclude<HeroQueryResult, null>,
  "title" | "coverImage" | "date" | "excerpt" | "author" | "slug" | "topics"
>) {
  return (
    <article>
      <Link className="group mb-8 block md:mb-16" href={`/posts/${slug}`}>
        <CoverImage image={coverImage} priority />
      </Link>
      <div className="mb-20 md:mb-28 md:grid md:grid-cols-2 md:gap-x-16 lg:gap-x-8">
        <div>
          {topics?.[0] && (
            <Badge style={getStyles(topics[0].color ?? "")}>
              {topics[0].title}
            </Badge>
          )}
          <h3 className="text-pretty mb-4 text-4xl leading-tight lg:text-6xl">
            <Link href={`/posts/${slug}`} className="hover:underline">
              {title}
            </Link>
          </h3>
          <div className="mb-4 text-lg md:mb-0">
            <DateComponent dateString={date} />
          </div>
        </div>
        <div>
          {excerpt && (
            <p className="text-pretty mb-4 text-lg leading-relaxed">
              {excerpt}
            </p>
          )}
          {author && <Avatar name={author.name} picture={author.picture} />}
        </div>
      </div>
    </article>
  );
}

async function getPostsBasedOnInterests() {
  const cookieStore = await cookies();
  const response = await fetch(`${ENVConfig.getAppURL()}/api/interests`, {
    headers: { Cookie: cookieStore.toString() },
  });

  if (!response.ok) return null;
  const { posts } = await response.json();
  return posts?.length ? posts : null;
}

export default async function Page() {
  const session = await auth();
  let posts = null;

  if (session?.user) {
    // Try to fetch posts based on interests first
    posts = await getPostsBasedOnInterests();
  }

  // If no interest-based posts or user not logged in, fetch normally
  const [settings, normalPosts] = await Promise.all([
    sanityFetch({
      query: settingsQuery,
    }),
    !posts ? sanityFetch({ query: heroQuery }) : null,
  ]);

  const heroPost = posts?.[0] || normalPosts;
  const remainingPosts = posts?.slice(1);

  return (
    <div className="container mx-auto sm:px-5 px-2">
      <Intro title={settings?.title} description={settings?.description} />
      {heroPost ? (
        <HeroPost
          title={heroPost.title}
          slug={heroPost.slug}
          coverImage={heroPost.coverImage}
          excerpt={heroPost.excerpt}
          date={heroPost.date}
          author={heroPost.author}
          topics={heroPost.topics}
        />
      ) : (
        <Onboarding />
      )}
      {heroPost?._id && (
        <aside>
          <h2 className="mb-8 text-6xl font-bold leading-tight tracking-tighter md:text-7xl">
            More Stories
          </h2>
          <Suspense>
            {remainingPosts ? (
              <div className="grid grid-cols-1 gap-y-20 md:grid-cols-2 md:gap-x-16 md:gap-y-32 lg:gap-x-32">
                {remainingPosts.map((post: any) => (
                  <article key={post._id}>
                    <Link
                      href={`/posts/${post.slug}`}
                      className="group mb-4 block"
                    >
                      <CoverImage image={post.coverImage} />
                    </Link>
                    <div>
                      {post.topics?.[0] && (
                        <Badge style={getStyles(post.topics[0].color ?? "")}>
                          {post.topics[0].title}
                        </Badge>
                      )}
                      <h3 className="mb-4 text-3xl leading-tight lg:text-3xl">
                        <Link
                          href={`/posts/${post.slug}`}
                          className="hover:underline"
                        >
                          {post.title}
                        </Link>
                      </h3>
                      <div className="mb-4 text-lg md:mb-0">
                        <DateComponent dateString={post.date} />
                      </div>
                      {post.excerpt && (
                        <p className="mb-4 text-lg leading-relaxed">
                          {post.excerpt}
                        </p>
                      )}
                      {post.author && (
                        <Avatar
                          name={post.author.name}
                          picture={post.author.picture}
                        />
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <MoreStories skip={heroPost._id} limit={100} />
            )}
          </Suspense>
        </aside>
      )}
    </div>
  );
}
