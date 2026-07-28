import Image from "next/image";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";
import { Input, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

async function authenticate(formData: FormData) {
  "use server";
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/admin",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/admin/login?error=1");
    }
    throw error;
  }
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-wine-900 px-4 py-12">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl animate-fade-in-up">
        <div className="flex justify-center">
          <Image
            src="/img/monogram-wine.jpg"
            alt="K & B"
            width={72}
            height={72}
            className="rounded-full"
          />
        </div>
        <h1 className="mt-6 text-center font-display text-2xl text-wine-700">
          Painel administrativo
        </h1>
        <p className="mt-1 text-center text-sm text-ink/60">
          Entre para gerenciar a lista de presentes
        </p>

        <form action={authenticate} className="mt-8 space-y-4">
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" name="email" type="email" required autoComplete="email" />
          </div>
          <div>
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-wine-50 px-3 py-2 text-sm text-wine-700">
              E-mail ou senha inválidos.
            </p>
          )}

          <Button type="submit" className="w-full justify-center">
            Entrar
          </Button>
        </form>
      </div>
    </main>
  );
}
