import { Inter } from "next/font/google";
import Script from "next/script";
import "../styles/properties.css";
import "../styles/style.css";
import "../styles/header.css";
import "../styles/menu.css";
import "../styles/home.css";
import "../styles/about.css";
import "../styles/projects.css";
import "../styles/other_projects.css";
import "../styles/skills.css";
import "../styles/experience.css";
import "../styles/contact.css";
import "../styles/footer.css";
import "../styles/custom.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Radhi Badache",
  description: "Radhi Badache portfolio.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script src="/libraries/particlesjs/particles.js" strategy="beforeInteractive" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
