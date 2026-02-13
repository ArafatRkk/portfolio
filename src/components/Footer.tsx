import { Github, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border py-10 px-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <p className="text-muted-foreground text-sm">
          © 2026 Arafat Amin. All Rights Reserved.
        </p>

        <div className="flex items-center gap-5">
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300" aria-label="GitHub">
            <Github size={20} />
          </a>
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300" aria-label="LinkedIn">
            <Linkedin size={20} />
          </a>
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300" aria-label="Twitter">
            <Twitter size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
