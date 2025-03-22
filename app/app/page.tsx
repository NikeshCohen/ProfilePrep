import type { Metadata } from "next";

import GenerateContent from "@/app/app/_components/GenerateContent";

import Footer from "@/components/global/Footer";
import Header from "@/components/global/Header";

export const metadata: Metadata = {
  title: "App",
};

async function page() {
  return (
    <div>
      <Header />
      <GenerateContent />
      <Footer />
    </div>
  );
}

export default page;
