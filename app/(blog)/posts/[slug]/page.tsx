import { defineQuery } from "next-sanity";
import type { Metadata, ResolvingMetadata } from "next";
import { type PortableTextBlock } from "next-sanity";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import Avatar from "../../avatar";
import CoverImage from "../../cover-image";
import DateComponent from "../../date";
import MoreStories from "../../more-stories";
import PortableText from "../../portable-text";

import * as demo from "@/sanity/lib/demo";
import { sanityFetch } from "@/sanity/lib/fetch";
import { postQuery, settingsQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import { CommentSection } from "@/components/CommentSection";
import { auth } from "@/auth";
import { SignInButton } from "@/components/buttons";

type Props = {
  params: Promise<{ slug: string }>;
};

const postSlugs = defineQuery(
  `*[_type == "post" && defined(slug.current)]{"slug": slug.current}`
);

export async function generateStaticParams() {
  return await sanityFetch({
    query: postSlugs,
    perspective: "published",
    stega: false,
  });
}

export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  const post = await sanityFetch({
    query: postQuery,
    params,
    stega: false,
  });
  const previousImages = (await parent).openGraph?.images || [];
  
  // Use the resolveOpenGraphImage utility for proper image URL handling
  const ogImage = resolveOpenGraphImage(post?.coverImage);
  
  // Ensure description is string or undefined (not null)
  const safeExcerpt = post?.excerpt || undefined;

  return {
    authors: post?.author?.name ? [{ name: post?.author?.name }] : [],
    title: post?.title || undefined,
    description: safeExcerpt,
    openGraph: {
      title: post?.title || undefined,
      description: safeExcerpt,
      type: 'article',
      publishedTime: post?.date || undefined,
      authors: post?.author?.name ? [post.author.name] : [],
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: post?.title || undefined,
      description: safeExcerpt,
      images: ogImage ? [ogImage] : [],
    }
  } satisfies Metadata;
}

export default async function PostPage(props: Props) {
  const params = await props.params;
  const session = await auth();
  const [post, settings] = await Promise.all([
    sanityFetch({ query: postQuery, params }),
    sanityFetch({ query: settingsQuery }),
  ]);

  if (!post?._id) {
    return notFound();
  }

  return (
    <div className="container mx-auto sm:px-5 px-2">
      <h2 className="mb-16 mt-10 text-2xl font-bold leading-tight tracking-tight md:text-4xl md:tracking-tighter">
        <Link href="/" className="hover:underline">
          {settings?.title || demo.title}
        </Link>
      </h2>
      <article>
        <h1 className="text-balance mb-12 text-6xl font-bold leading-tight tracking-tighter md:text-7xl md:leading-none lg:text-8xl">
          {post.title}
        </h1>
        <div className="hidden md:mb-12 md:block">
          {post.author && (
            <Avatar name={post.author.name} picture={post.author.picture} />
          )}
        </div>
        <div className="mb-8 sm:mx-0 md:mb-16">
          <CoverImage image={post.coverImage} priority />
        </div>
        <div className="mx-auto max-w-2xl">
          <div className="mb-6 block md:hidden">
            {post.author && (
              <Avatar name={post.author.name} picture={post.author.picture} />
            )}
          </div>
          <div className="mb-6 text-lg">
            <div className="mb-4 text-lg">
              <DateComponent dateString={post.date} />
            </div>
          </div>
        </div>
        {post.content?.length && (
          <PortableText
            className="mx-auto max-w-2xl"
            value={post.content as PortableTextBlock[]}
          />
        )}
        {session ? (
          <div>
            <CommentSection postId={post._id} />
          </div>
        ) : (
          <div className="max-w-3xl mx-auto h-[300px] flex items-center flex-col gap-3">
            <p className="text-sm text-gray-500 mt-10">
              Please sign in to view comments.
            </p>
              <SignInButton/>
          </div>
        )}
      </article>
      <aside>
        <hr className="border-accent-2 mb-24 " />
        <h2 className="mb-8 text-6xl font-bold leading-tight tracking-tighter md:text-7xl">
          Recent Stories
        </h2>
        <Suspense>
          <MoreStories skip={post._id} limit={2} />
        </Suspense>
      </aside>
    </div>
  );
}
