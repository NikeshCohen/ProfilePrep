import { roadmap } from "@/constants/roadmap";

export default function Roadmap() {
  return (
    <div className="mx-auto max-w-4xl p-8">
      <div className="mb-12 text-center">
        <h1 className="mb-2 text-4xl font-bold">Development Timeline</h1>
      </div>

      <ol className="relative border-s border-primary">
        {roadmap
          .slice()
          .reverse()
          .map((pr, index) => (
            <li
              key={pr.id}
              className={`ms-4 ${index !== roadmap.length - 1 ? "mb-10" : ""}`}
            >
              <div className="absolute -start-2.5 mt-1.5 h-5 w-5 rounded-full border border-primary bg-primary"></div>
              <time className="text-sm font-light leading-none text-gray-400 dark:text-gray-500">
                {pr.date}
              </time>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {pr.title}
              </h3>
              <p className="mb-4 text-base font-normal text-muted-foreground">
                {pr.description}
              </p>
            </li>
          ))}
      </ol>
    </div>
  );
}
