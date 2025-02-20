import { sanityFetch } from "@/sanity/lib/fetch";
import { settingsQuery, topicsQuery } from "@/sanity/lib/queries";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [settings, topics] = await Promise.all([
      sanityFetch({ query: settingsQuery }),
      sanityFetch({ query: topicsQuery }),
    ]);
    return NextResponse.json({ settings, topics }, { status: 200 });
  } catch (error) {
    console.error("[TOPICS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
