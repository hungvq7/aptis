import Link from "next/link"
import { Suspense } from "react"
import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Đăng nhập — Aptis Prep",
}

export default function LoginPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Đăng nhập</CardTitle>
        <CardDescription>Đăng nhập để tiếp tục luyện thi Aptis.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Suspense>
          <LoginForm />
        </Suspense>
        <p className="text-center text-sm text-muted-foreground">
          Chưa có tài khoản?{" "}
          <Link href="/dang-ky" className="font-medium text-primary hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
