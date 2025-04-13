import { VisualEditing, type PortableTextBlock } from "next-sanity";
import { draftMode } from "next/headers";
import AlertBanner from "./alert-banner";
import PortableText from "./portable-text";
import { sanityFetch } from "@/sanity/lib/fetch";
import { settingsQuery } from "@/sanity/lib/queries";
import Navbar from "@/components/navbar";
import { cn } from "@/lib/utils";
// import { Inter } from "next/font/google";
import React from "react";
import "../globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { toPlainText } from "next-sanity";
import * as demo from "@/sanity/lib/demo";

import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import AuthProvider from "@/components/providers/sessionProvider";
import TanstackProvider from "@/components/providers/tanstackProvider";
import { Analytics } from "@vercel/analytics/react";
import { geist } from "@/lib/fonts";
import Link from "next/link";
import { auth } from "@/auth";
import LoaderProvider from "@/components/providers/LoaderProvider";

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
	
	// Convert description to plain text and ensure it's string or undefined (not null)
	const plainTextDescription = description ? toPlainText(description) || undefined : undefined;
	
	return {
		metadataBase,
		title: {
			template: `%s | ${title}`,
			default: title,
		},
		description: plainTextDescription,
		openGraph: {
			images: ogImage ? [ogImage] : [],
		},
	};
}
export default async function RootLayout({
	children,
	modal,
}: {
	children: React.ReactNode;
	modal: React.ReactNode;
}) {
	const data = await sanityFetch({ query: settingsQuery });
	const footer = data?.footer || [];
	const { isEnabled: isDraftMode } = await draftMode();
	const session = await auth();

	return (
		<html
			lang='en'
			className={cn(" bg-white text-black", geist.className)}
			suppressHydrationWarning
		>
			<AuthProvider>
				<TanstackProvider>
					<body className='container mx-auto sm:px-5 px-2 py-2 justify-end flex flex-col min-h-screen'>
						<div>
							<section className='min-h-screen'>
								{isDraftMode && <AlertBanner />}
								<header className='flex justify-end'>
									<Navbar />
								</header>
								<main>
									{modal}
									{children}
									<Analytics />
								</main>
								<footer className='bg-accent-1 border-accent-2 border-t'>
									<div className='container mx-auto sm:px-5 px:2'>
										{footer.length > 0 ? (
											<PortableText
												className='prose-sm text-pretty bottom-0 w-full max-w-none bg-white py-12 text-center md:py-20'
												value={footer as PortableTextBlock[]}
											/>
										) : (
											<div className='flex flex-col items-center py-28 lg:flex-row'>
												<h3 className='mb-10 text-center text-4xl font-bold leading-tight tracking-tighter lg:mb-0 lg:w-1/2 lg:pr-4 lg:text-left lg:text-5xl'>
													Confi.dev
												</h3>
												<div className='flex flex-col items-center justify-center lg:w-1/2 lg:flex-row lg:pl-4'>
													{!session ||
														!session.user ||
														(!session.user.id && (
															<Link
																href='/sign-in'
																className='mx-3 mb-6 border border-black bg-black py-3 px-12 font-bold text-white transition-colors duration-200 hover:bg-white hover:text-black lg:mb-0 lg:px-8'
															>
																Join the Community
															</Link>
														))}

													<a
														href='https://github.com/conficiusa'
														className='mx-3 font-bold hover:underline'
														target='_blank'
														rel='noopener noreferrer'
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
							<SpeedInsights />
						</div>
					</body>
				</TanstackProvider>
			</AuthProvider>
		</html>
	);
}
