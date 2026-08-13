import './globals.css';

export const metadata = {
  title: 'Advatar — Marketing Done Right.',
  description: 'Strategic, high-level content for over 40 clients — generating millions of views, driving revenue, and elevating engagement, awareness, credibility and brand perception.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
