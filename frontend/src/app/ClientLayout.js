'use client';

import Navbar from '../components/NavbarNext';

export default function ClientLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
