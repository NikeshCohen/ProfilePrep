import { Metadata } from "next";

import { roadmap } from "@/constants/roadmap";

import Header from "@/components/global/Header";

export const metadata: Metadata = {
  title: "RoadMap",
  description: "Track the development progress of ProfilePrep.",
};

export default function RoadmapPage() {
  return (
    <>
      <Header />
      <section className="flex justify-center items-center pt-32 min-h-[93vh] layout">
        <div className="mx-auto p-8 max-w-4xl">
          <div className="mb-12 text-center">
            <h1 className="mb-2 font-bold text-4xl">Development Timeline</h1>
          </div>

          <ol className="relative border-primary border-s">
            {roadmap
              .slice()
              .reverse()
              .map((pr, index) => (
                <li
                  key={pr.id}
                  className={`ms-4 ${index !== roadmap.length - 1 ? "mb-10" : ""}`}
                >
                  <div className="absolute bg-primary mt-1.5 border border-primary rounded-full w-5 h-5 -start-2.5"></div>
                  <time className="font-light text-gray-400 dark:text-gray-500 text-sm leading-none">
                    {pr.date}
                  </time>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                    {pr.title}
                  </h3>
                  <p className="mb-4 font-normal text-muted-foreground text-base">
                    {pr.description}
                  </p>
                </li>
              ))}
          </ol>
        </div>
      </section>
    </>
  );
}
