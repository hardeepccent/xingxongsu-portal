import './globals.css';

export const metadata = {
  title: 'XingXongSu Publisher Portal',
  description: 'Global Analytics & Tracking Dashboard',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: '#0b0f19', color: '#fff' }}>
        {children}
      </body>
    </html>
  );
}
