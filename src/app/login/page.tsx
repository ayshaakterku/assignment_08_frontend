'use client'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "react-toastify"

function LoginPage() {
  const router = useRouter();

  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const [loginLoading, setLoginLoading] = useState<boolean>(false);

  // Email Login
  const handleEmailLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const user = Object.fromEntries(formData.entries()) as {
      email: string,
      password: string
    };

    setLoginLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        ...user
      });

      if (error) {
        toast.warning(error.message || "Invalid email or password!");
        return;
      }

      if (data) {
        toast.success("Login successful! Welcome back.");

        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        toast.warning("Login failed. Please check your credentials.");
      }

    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  // Google Login
  const handleSignWithGoogle = async () => {
    setGoogleLoading(true);

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (error) {
        toast.warning(error.message || "Google login failed.");
        setGoogleLoading(false);
      }

      // On successful Google login, browser redirects.

    } catch {
      toast.error("Something went wrong. Please try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto mt-5">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            Welcome back
          </CardTitle>

          <CardDescription>
            Login with your Google account or email
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleEmailLogin}>
            <FieldGroup>

              <Field>
                <Button
                  onClick={handleSignWithGoogle}
                  variant="outline"
                  type="button"
                  disabled={googleLoading}
                >
                  <Image
                    src="/google.png"
                    alt="Google logo"
                    width={15}
                    height={15}
                  />

                  {googleLoading ? "Connecting..." : "Login with Google"}
                </Button>
              </Field>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>

              <Field>
                <FieldLabel htmlFor="email">
                  Email
                </FieldLabel>

                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">
                  Password
                </FieldLabel>

                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                />
              </Field>

              <Field>
                <Button
                  type="submit"
                  disabled={loginLoading}
                >
                  {loginLoading ? "Logging in..." : "Log In"}
                </Button>

                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <Link href="/signup">Register</Link>
                </FieldDescription>
              </Field>

            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our{" "}
        <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}

export default LoginPage;
