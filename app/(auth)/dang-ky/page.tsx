import Link from "next/link"
import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RegisterForm } from "@/components/auth/register-form"

export const metadata: Metadata = {
  title: "Đăng ký — Aptis Prep",
}

export default function RegisterPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Tạo tài khoản</CardTitle>
        <CardDescription>Đăng ký miễn phí để bắt đầu luyện thi Aptis.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <RegisterForm />
        <p className="text-center text-sm text-muted-foreground">
          Đã có tài khoản?{" "}
          <Link href="/dang-nhap" className="font-medium text-primary hover:underline">
            Đăng nhập
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
