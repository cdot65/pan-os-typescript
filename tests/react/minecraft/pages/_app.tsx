import 'styles/globals.scss';
import 'styles/cmdk/panos.scss';
import 'styles/cmdk/prisma.scss';
import 'styles/cmdk/scm.scss';
import 'styles/cmdk/settings.scss';

import AppProps from 'next/app';
import Head from 'next/head';
import { NextSeo } from 'next-seo';
import { ThemeProvider } from 'next-themes';

const title = 'pan-os-typescript';
const description = 'Object-Oriented SDK for PAN-OS Firewalls.';
const siteUrl = 'https://github.com/cdot65/pan-os-typescript';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <NextSeo
        title={`${description} — ${title}`}
        description={description}
        openGraph={{
          type: 'website',
          url: siteUrl,
          title,
          description: description + '.',
          images: [
            {
              url: `${siteUrl}/github-mark.png`,
              alt: title,
            },
          ],
        }}
      />
      <ThemeProvider disableTransitionOnChange attribute="class">
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}
