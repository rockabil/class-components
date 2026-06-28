import './globals.css';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Providers } from '../providers';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';

export const metadata = {
  title: 'Star Trek Heroes Search',
  description: 'Search for characters from the Star Trek universe using STAPI',
};

export default async function LocaleLayout({ children, params }: {children: React.ReactNode, params: Promise<{ locale: string}>;}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <div className="app-container">
          <Providers>
            <Header />
            <main className="app-main">{children}</main>
            <Footer />
          </Providers>
        </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}