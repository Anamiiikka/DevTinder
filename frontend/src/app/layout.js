import './globals.css';
import ClientLayout from './ClientLayout';

export const metadata = {
  title: 'DevConnect - Find Your Hackathon Teammates',
  description: 'Connect with developers who complement your skills for hackathons',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#0f0f1a] text-white min-h-screen">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
