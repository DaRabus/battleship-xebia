import localFont from 'next/font/local';
import type { Metadata } from 'next';
import './globals.css';
import type { ReactNode } from 'react';
import { ThemeRegistry } from '@theme/index';
import { Container, Divider } from '@mui/material';
import SWRProvider from '@react-feature/swr-provider/swr-provider';

export const metadata: Metadata = {
  title: 'Battleship Project',
  description: 'My own battleshipt'
};

const roboto = localFont({
  src: [
    { path: 'Roboto-Regular.ttf', weight: '400', style: 'normal' },
    { path: 'Roboto-Bold.ttf', weight: '700', style: 'normal' }
  ],
  variable: '--font-roboto'
});

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.variable}>
        <ThemeRegistry>
          <SWRProvider>
            <main className="flex flex-col min-h-screen">
              <Container maxWidth="xl" className="my-8">
                {children}
              </Container>
              <Divider />
            </main>
          </SWRProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
