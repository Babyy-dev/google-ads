"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/branding/logo";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export function TopNav() {
  const pathname = usePathname();
  const { user, signOut, loading } = useAuth();

  const publicLinks = [{ href: "/", label: "Product" }];

  const authLinks = [
    { href: "/login", label: "Login" },
    { href: "/signup", label: "Sign Up" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[color-mix(in_oklab,currentColor_12%,transparent)] bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex w-full max-w-none items-center justify-between px-6 py-3">
        <Link href={user ? "/dashboard" : "/"} aria-label="AdShield">
          <Logo />
        </Link>

        {!loading && (
          <nav className="flex items-center gap-2">
            {!user ? (
              <>
                {publicLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={cn(
                      "rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-[oklch(0.96_0.07_40)] hover:text-[oklch(0.36_0.12_40)]",
                      pathname === l.href &&
                        "bg-[oklch(0.96_0.07_40)] text-[oklch(0.36_0.12_40)]"
                    )}
                  >
                    {l.label}
                  </Link>
                ))}
                {authLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={cn(
                      "rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-[oklch(0.96_0.07_40)] hover:text-[oklch(0.36_0.12_40)]",
                      pathname === l.href &&
                        "bg-[oklch(0.96_0.07_40)] text-[oklch(0.36_0.12_40)]"
                    )}
                  >
                    {l.label}
                  </Link>
                ))}
                <Link
                  href="/signup"
                  className="ml-2 rounded-md bg-[oklch(0.72_0.18_40)] px-3 py-2 text-sm text-[oklch(0.98_0_0)] hover:opacity-90"
                >
                  Get started
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  className={cn(
                    "rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-[oklch(0.96_0.07_40)] hover:text-[oklch(0.36_0.12_40)]",
                    pathname.startsWith("/dashboard") &&
                      "bg-[oklch(0.96_0.07_40)] text-[oklch(0.36_0.12_40)]"
                  )}
                >
                  Dashboard
                </Link>
                <div className="flex items-center gap-3 ml-4 pl-4 border-l border-foreground/20">
                  <div className="flex items-center gap-2">
                    {user.user_metadata?.avatar_url ? (
                      <img
                        src={user.user_metadata.avatar_url}
                        alt="Profile"
                        className="size-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {user.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span className="text-sm text-foreground/70 hidden sm:block">
                      {user.email}
                    </span>
                  </div>
                  <Button
                    onClick={signOut}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    Sign out
                  </Button>
                </div>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
