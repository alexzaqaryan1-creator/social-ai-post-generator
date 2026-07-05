import Image from "next/image";
import { NAV_LINKS } from "@/components/layout/navLinks";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-14 sm:px-8 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-3">
          <Image
            src="/logo.png"
            alt="SANA"
            width={92}
            height={30}
            unoptimized
            className="h-6 w-auto"
          />
          <p className="max-w-xs text-sm text-muted">
            Free AI captions, hashtags, and ad copy for any photo — no sign-up, no cost.
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-8 gap-y-3">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 text-xs text-muted sm:px-8">
          <span>© {new Date().getFullYear()} SANA</span>
          <span>Built with free, open AI models</span>
        </div>
      </div>
    </footer>
  );
}
