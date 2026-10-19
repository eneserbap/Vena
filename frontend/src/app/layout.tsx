import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://vena.monolithstudios.dev";

export const viewport: Viewport = {
  themeColor: "#4a637a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Vena | Explainable AI & Deep Learning for Stroke Risk Prediction",
    template: "%s | Vena Stroke AI",
  },
  description:
    "Vena is a production-grade healthcare AI platform predicting stroke risk in real-time with PyTorch MLP, SHAP explainability, and full MLOps observability.",
  applicationName: "Vena Health AI",
  authors: [
    { name: "Monolith Studios", url: "https://monolithstudios.dev" },
    { name: "Enes Erbap", url: "https://github.com/eneserbap" },
  ],
  generator: "Next.js",
  keywords: [
    "Vena",
    "Stroke Risk Prediction",
    "İnme Riski Tahmini",
    "Healthcare AI",
    "Explainable AI",
    "SHAP Clinical Report",
    "Deep Learning Stroke",
    "PyTorch Medical MLP",
    "MLOps Pipeline",
    "FastAPI Healthcare Inference",
    "Monolith Studios",
  ],
  referrer: "origin-when-cross-origin",
  creator: "Monolith Studios",
  publisher: "Monolith Studios",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "Vena | Explainable AI & Deep Learning for Stroke Risk Prediction",
    description:
      "Clinical-grade stroke risk assessment powered by PyTorch MLP and SHAP mathematical interpretability.",
    url: siteUrl,
    siteName: "Vena // Stroke AI",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/api-docs.png",
        width: 1200,
        height: 630,
        alt: "Vena Clinical Prediction Platform Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vena | Explainable AI & Deep Learning for Stroke Risk Prediction",
    description:
      "Predictive healthcare diagnostics with PyTorch MLP, SHAP Explainable AI, and real-time observability.",
    images: ["/api-docs.png"],
    creator: "@monolithstudios",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  verification: {
    google: "googlef3aba45a7e1a740d.html",
    other: {
      "google-site-verification": "googlef3aba45a7e1a740d.html",
    },
  },
  category: "technology",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      "url": siteUrl,
      "name": "Vena",
      "description": "Explainable AI & Deep Learning for Stroke Risk Prediction",
      "publisher": {
        "@type": "Organization",
        "name": "Monolith Studios",
        "url": "https://monolithstudios.dev",
      },
    },
    {
      "@type": "WebApplication",
      "@id": `${siteUrl}/#webapp`,
      "name": "Vena Clinical Inference Engine",
      "applicationCategory": "HealthApplication",
      "operatingSystem": "All",
      "browserRequirements": "Requires JavaScript. Requires HTML5.",
      "url": siteUrl,
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
      },
      "description":
        "Real-time PyTorch inference engine with SHAP explainability for stroke risk assessment.",
    },
    {
      "@type": "MedicalWebPage",
      "@id": `${siteUrl}/#medicalpage`,
      "url": siteUrl,
      "name": "Stroke Risk Assessment & Clinical AI Diagnostics",
      "description":
        "Evaluates clinical patient factors (glucose, age, hypertension, BMI, heart disease) to compute stroke risk percentage.",
      "about": {
        "@type": "MedicalCondition",
        "name": "Cerebrovascular Accident (Stroke)",
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
