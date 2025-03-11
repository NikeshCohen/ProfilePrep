import { Metadata } from "next";

import Roadmap from "@/app/roadmap/Roadmap";

export const metadata: Metadata = {
  title: "RoadMap",
  description: "Track the development progress of ProfilePrep.",
};

export default function RoadmapPage() {
  return (
    <section className="layout flex min-h-[93vh] items-center justify-center">
      <Roadmap />
    </section>
  );
}
