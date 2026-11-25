import "./globals.css";
export const metadata = {
  title: "Rumah Sakit Digital",
  description: "Layanan rumah sakit digital",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
