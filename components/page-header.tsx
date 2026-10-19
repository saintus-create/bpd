import Link from "next/link";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/topics", label: "Topics" },
  { href: "/clinical-trials", label: "Clinical trials" },
  { href: "/resources", label: "Crisis support" },
];

/**
 * Compact header for the content pages. Sits on the left so it doesn't
 * collide with the app's fixed theme/GitHub controls in the top-right.
 */
export function PageHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4 lg:px-8">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          bpd
        </Link>
        <nav
          aria-label="Sections"
          className="flex items-center gap-5 overflow-x-auto text-sm"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
