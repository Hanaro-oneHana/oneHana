import AuthSessionProvider from '@/components/auth/session-provider';
import type { Metadata, Viewport } from 'next';
import { AgreementProvider } from '../contexts/account/agreementProvider';
import './globals.css';

export const metadata: Metadata = {
  title: '두리하나',
  description: '두 사람, 하나의 여정',
};

export const viewport: Viewport = {
  initialScale: 1.0,
  userScalable: false,
  maximumScale: 1,
  width: 'device-width',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`relative border-x-[0.5px]`}>
        <AuthSessionProvider>
          <AgreementProvider>{children}</AgreementProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
