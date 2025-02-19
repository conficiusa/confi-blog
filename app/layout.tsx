import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";
import React, { ReactNode } from "react";
import "./globals.css";
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { toPlainText } from "next-sanity";
import * as demo from "@/sanity/lib/demo";
import { sanityFetch } from "@/sanity/lib/fetch";
import { settingsQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import Navbar from "@/components/navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});
export async function generateMetadata(): Promise<Metadata> {
  const settings = await sanityFetch({
    query: settingsQuery,
    // Metadata should never contain stega
    stega: false,
  });
  const title = settings?.title || demo.title;
  const description = settings?.description || demo.description;

  const ogImage = resolveOpenGraphImage(settings?.ogImage);
  let metadataBase: URL | undefined = undefined;
  try {
    metadataBase = settings?.ogImage?.metadataBase
      ? new URL(settings.ogImage.metadataBase)
      : undefined;
  } catch {
    // ignore
  }
  return {
    metadataBase,
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description: toPlainText(description),
    openGraph: {
      images: ogImage ? [ogImage] : [],
    },
  };
}
const Root = ({
  children,
  modal,
}: {
  children: ReactNode;
  modal: ReactNode;
}) => {
  return (
    <html lang="en" className={cn(" bg-white text-black", inter.variable)}>
      <body className="container mx-auto px-5 py-2 justify-end flex flex-col min-h-screen">
        <header className="flex justify-end">
          <Navbar />
          <Dialog>
            <DialogTrigger>ddd</DialogTrigger>
            <DialogContent className="overflow-hidden">
              <DialogHeader className="sr-only">
                <DialogTitle>hdd</DialogTitle>
                <DialogDescription>"d</DialogDescription>
              </DialogHeader>
              <ScrollArea className="w-full max-h-[80dvh]">jjj</ScrollArea>
            </DialogContent>
          </Dialog>
        </header>
        <main>
          {modal}
          {children}
        </main>
        <SpeedInsights />
      </body>
    </html>
  );
};

export default Root;
