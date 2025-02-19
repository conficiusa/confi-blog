import { VisualEditing, type PortableTextBlock } from "next-sanity";
import { draftMode } from "next/headers";
import AlertBanner from "./alert-banner";
import PortableText from "./portable-text";
import { sanityFetch } from "@/sanity/lib/fetch";
import { settingsQuery } from "@/sanity/lib/queries";
import Navbar from "@/components/navbar";
import { auth } from "@/auth";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await sanityFetch({ query: settingsQuery });
  const footer = data?.footer || [];
  const { isEnabled: isDraftMode } = await draftMode();

  return (
    <section>
      <div>
        <section className="min-h-screen">
          {isDraftMode && <AlertBanner />}
          <main>
            {children}
          </main>
          <footer className="bg-accent-1 border-accent-2 border-t">
            <div className="container mx-auto px-5">
              {footer.length > 0 ? (
                <PortableText
                  className="prose-sm text-pretty bottom-0 w-full max-w-none bg-white py-12 text-center md:py-20"
                  value={footer as PortableTextBlock[]}
                />
              ) : (
                <div className="flex flex-col items-center py-28 lg:flex-row">
                  <h3 className="mb-10 text-center text-4xl font-bold leading-tight tracking-tighter lg:mb-0 lg:w-1/2 lg:pr-4 lg:text-left lg:text-5xl">
                    Confi.dev
                  </h3>
                  <div className="flex flex-col items-center justify-center lg:w-1/2 lg:flex-row lg:pl-4">
                    <a
                      href="https://nextjs.org/docs"
                      className="mx-3 mb-6 border border-black bg-black py-3 px-12 font-bold text-white transition-colors duration-200 hover:bg-white hover:text-black lg:mb-0 lg:px-8"
                    >
                      Join the Community
                    </a>
                    <a
                      href="https://github.com/vercel/next.js/tree/canary/examples/cms-sanity"
                      className="mx-3 font-bold hover:underline"
                    >
                      View on GitHub
                    </a>
                  </div>
                </div>
              )}
            </div>
          </footer>
        </section>
        {isDraftMode && <VisualEditing />}
      </div>
    </section>
  );
}
