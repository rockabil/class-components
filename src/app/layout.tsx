import './globals.css';
import { Providers } from './providers';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';

export const metadata = {
  title: 'Star Trek Heroes Search',
  description: 'Search for characters from the Star Trek universe using STAPI',
};

export default function RootLayout({ children, }: {children: React.ReactNode}) {
  return (
    <html lang='en'>
      <body>
        <div className="app-container">
          <Providers>
            <Header />
            <main className="app-main">{children}</main>
            <Header />
          </Providers>
        </div>
      </body>
    </html>
  );
}