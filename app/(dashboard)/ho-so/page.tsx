import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { getCurrentUser } from "@/lib/session/current-user"

export const metadata: Metadata = {
  title: "Hồ sơ — Aptis Prep",
}

export default async function ProfilePage() {
  const user = await getCurrentUser()
  if (!user) redirect("/dang-nhap")

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-medium tracking-tight">Hồ sơ</h1>
        <p className="text-sm text-muted-foreground">Thông tin tài khoản của bạn.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Thông tin cá nhân</CardTitle>
          <CardDescription>Thông tin này được dùng để đăng nhập và hiển thị trong ứng dụng.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="profile-name">Họ và tên</FieldLabel>
              <Input id="profile-name" defaultValue={user.name} disabled />
            </Field>
            <Field>
              <FieldLabel htmlFor="profile-email">Email</FieldLabel>
              <Input id="profile-email" defaultValue={user.email} disabled />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  )
}
