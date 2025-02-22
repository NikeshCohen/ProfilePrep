import React, { ReactNode } from "react";

interface SectionProps {
  title: ReactNode;
  children: ReactNode;
}

export default function Section({ title, children }: SectionProps) {
  return (
    <section className="flex place-items-center items-center justify-center py-10 md:py-20">
      <div className="container px-6 sm:px-6 md:px-8 lg:px-10">
        <h2 className="mb-8 text-center text-3xl font-bold">{title}</h2>
        {children}
      </div>
    </section>
  );
}
