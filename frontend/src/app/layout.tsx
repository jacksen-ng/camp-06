import { AuthProvider } from './contexts/AuthContext';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Background from '@/components/Background';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen flex flex-col">
        <Background />
        <AuthProvider>
          <Header />
          <main className="flex-grow relative z-10">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}