import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '두리하나',
  description: '두 사람, 하나의 여정',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`relative border-x-[0.5px]`}>{children}</body>
    </html>
  );
}
