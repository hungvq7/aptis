"use client"

import * as React from "react"
import Link from "next/link"
import { GraduationCap, MenuIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import type { SessionUser } from "@/lib/data/types"

const NAV_LINKS = [
  { href: "/#ky-nang", label: "Kỹ năng" },
  { href: "/gioi-thieu", label: "Giới thiệu" },
  { href: "/lien-he", label: "Liên hệ" },
]

export function SiteHeader({ user }: { user: SessionUser | null }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-heading text-lg font-medium">
          <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <GraduationCap className="size-5" />
          </span>
          Aptis Prep
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <Button asChild>
              <Link href="/bang-dieu-khien">Vào bảng điều khiển</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link href="/dang-nhap">Đăng nhập</Link>
              </Button>
              <Button asChild>
                <Link href="/dang-ky">Bắt đầu miễn phí</Link>
              </Button>
            </>
          )}
        </div>

        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button type="button" variant="outline" size="icon" className="md:hidden" aria-label="Mở menu">
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-3/4">
            <SheetHeader>
              <SheetTitle>Aptis Prep</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-6">
              {NAV_LINKS.map((link) => (
                <SheetClose key={link.href} asChild>
                  <Link
                    href={link.href}
                    className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </SheetClose>
              ))}
            </nav>
            <div className="mt-auto flex flex-col gap-2 p-6">
              {user ? (
                <SheetClose asChild>
                  <Button asChild>
                    <Link href="/bang-dieu-khien">Vào bảng điều khiển</Link>
                  </Button>
                </SheetClose>
              ) : (
                <>
                  <SheetClose asChild>
                    <Button asChild variant="outline">
                      <Link href="/dang-nhap">Đăng nhập</Link>
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button asChild>
                      <Link href="/dang-ky">Bắt đầu miễn phí</Link>
                    </Button>
                  </SheetClose>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
