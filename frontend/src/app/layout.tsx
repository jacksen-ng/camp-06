import { AuthProvider } from './contexts/AuthContext';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-gray-100 min-h-screen flex flex-col">
        <AuthProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}