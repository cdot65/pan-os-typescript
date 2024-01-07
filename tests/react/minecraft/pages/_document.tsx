// tests/react/minecraft/pages/_document.tsx
import Head from 'next/document';
import Html from 'next/document';
import Main from 'next/document';
import NextDocument from 'next/document';
import NextScript from 'next/document';
import React from 'react';

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link
            rel="preload"
            href="/inter-var-latin.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
