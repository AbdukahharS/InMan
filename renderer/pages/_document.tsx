import { Html, Head, Main, NextScript } from 'next/document'

export const metadata = {
  title: 'InMan',
  description: 'InMan - Inventory Management System',
  generator: 'Next.js',
  keywords: [
    'nextjs',
    'nextjs14',
    'next14',
    'next-ims',
    'ims',
    'inman',
    'inman-ims',
    'inventory',
    'management',
    'system',
  ],
  authors: [
    { name: 'Shakhzodbek Kakhkhorov', url: 'https://github.com/AbdukahharS' },
  ],
  icons: [
    { rel: 'apple-touch-icon', url: 'icons/icon-128x128.png' },
    { rel: 'icon', url: 'icons/icon-128x128.png' },
  ],
}

export const viewport = {
  themeColor: [{ media: '(prefers-color-scheme: light)', color: '#fff' }],
  viewport:
    'minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover',
}

export default function Document() {
  return (
    <Html>
      <Head>
        <meta name='description' content={metadata.description} />
        <meta name='generator' content={metadata.generator} />
        <meta name='keywords' content={metadata.keywords.join(', ')} />
        {viewport.themeColor.map(({ media, color }, index) => (
            <meta key={index} name='theme-color' media={media} content={color} />
        ))}
        {metadata.authors.map(({ name, url }, index) => (
            <meta
            key={index}
            name='author'
            content={name}
            {...(url && { href: url })}
            />
        ))}
        {metadata.icons.map(({ rel, url }, index) => (
            <link key={index} rel={rel} href={url} />
        ))}
        <link
          href='https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap'
          rel='stylesheet'
          ></link>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
