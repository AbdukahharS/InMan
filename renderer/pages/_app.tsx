import React from 'react'
import Head from 'next/head';
import type { AppProps } from 'next/app'


import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/components/providers/theme-provider'
import Prompt from '../components/Prompt';
import Confirm from '@/components/Confirm';

import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <React.Fragment>
      <Head>
        <title>InMan</title>
      </Head>
      <ThemeProvider
        attribute='class'
        defaultTheme='light'
        enableSystem
        storageKey='inman-theme'
      >
          <Component {...pageProps} />
          <Toaster />
          <Prompt />
          <Confirm />
      </ThemeProvider>
    </React.Fragment>
  )
}

export default MyApp
