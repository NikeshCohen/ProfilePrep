import ThemeToggle from "./ThemeToggle";

function Footer() {
  return (
    <footer className="flex lg:flex-row flex-col justify-center lg:justify-between items-center space-y-4 lg:space-y-0 mr-auto ml-auto p-4 border-t max-w-[1800px]">
      <h1 className="font-bold text-xl tracking-wider">
        Profile<span className="text-primary">Prep</span>
      </h1>
      <ThemeToggle />
    </footer>
  );
}

export default Footer;
