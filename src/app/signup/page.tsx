
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

function SignUpPage() {
  const router = useRouter();

  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const [signupLoading, setSignupLoading] = useState<boolean>(false);

  const handleEmailSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const user = Object.fromEntries(formData.entries()) as {
      name: string,
      email: string,
      image: string,
      password: string,
      confirmPassword: string
    };

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    if (!passwordRegex.test(user.password)) {
      toast.error(
        "Password must be at least 8 characters and contain uppercase and lowercase letters."
      );
      return;
    }

    // Confirm password validation
    if (user.password !== user.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setSignupLoading(true);

    try {
      const { data, error } = await authClient.signUp.email({
        name: user.name,
        email: user.email,
        image: user.image || "",
        password: user.password
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data) {
        toast.success("Account created successfully!");

        setTimeout(() => {
          router.push("/");
        }, 1000);
      }

    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSignupLoading(false);
    }
  };

  // Google Signup
  const handleSignWithGoogle = async () => {
    setGoogleLoading(true);

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message ?? "Google authentication failed.");
        setGoogleLoading(false);
      }

    } catch {
      toast.error("Something went wrong. Please try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto mt-5">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create an account</CardTitle>
          <CardDescription>
            Sign up with your Google account or email
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleEmailSignUp}>
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
                  {googleLoading ? "Connecting..." : "Sign up with Google"}
                </Button>
              </Field>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>

              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Aysha Akter"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="image">Image URL</FieldLabel>
                <Input
                  id="image"
                  name="image"
                  type="url"
                  placeholder="Image URL"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  minLength={8}
                  required
                />
                <FieldDescription>
                  Minimum 8 characters, including uppercase and lowercase letters.
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="confirmPassword">
                  Confirm Password
                </FieldLabel>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Enter your password again"
                  minLength={8}
                  required
                />
              </Field>

              <Field>
                <Button type="submit" disabled={signupLoading}>
                  {signupLoading ? "Creating Account..." : "Register"}
                </Button>

                <FieldDescription className="text-center">
                  Have an account? <Link href="/login">Login</Link>
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

export default SignUpPage;



// 'use client'
// import { Button } from "@/components/ui/button"
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import {
//   Field,
//   FieldDescription,
//   FieldGroup,
//   FieldLabel,
//   FieldSeparator,
// } from "@/components/ui/field"
// import { Input } from "@/components/ui/input"
// import { authClient } from "@/lib/auth-client"
// import Image from "next/image"
// import Link from "next/link"
// import { redirect } from "next/navigation"
// import { useState } from "react"
// import { toast } from "react-toastify"

// function SignUpPage() {
//   const [googleLoading, setGoogleLoading] = useState<boolean>(false);

//   const handleEmailSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     const formData = new FormData(e.currentTarget);
//     const user = Object.fromEntries(formData.entries()) as {
//       name: string,
//       email: string,
//       image: string,
//       password: string
//     };

//     const { data, error } = await authClient.signUp.email({
//       ...user
//     });

//     if (data) {
//       redirect('/');
//     }

//     if (error) {
//       console.log(error);
//       toast.error(error.message);
//     }
//   };

//   // Google Signup
//   const handleSignWithGoogle = async () => {
//     setGoogleLoading(true);

//     try {
//       const { error } = await authClient.signIn.social({
//         provider: "google",
//         callbackURL: "/",
//       });

//       if (error) {
//         toast.error(error.message ?? "Auth system is failed with Google");
//         setGoogleLoading(false);
//       }
//       // On success, the browser redirects.
//     } catch {
//       toast.error("Something is wrong. Please try again");
//       setGoogleLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col gap-6 max-w-7xl mx-auto mt-5">
//       <Card>
//         <CardHeader className="text-center">
//           <CardTitle className="text-xl">Welcome back</CardTitle>
//           <CardDescription>
//             Login with your Google account
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleEmailSignUp}>
//             <FieldGroup>
//               <Field>
//                 <Button
//                   onClick={handleSignWithGoogle}
//                   variant="outline"
//                   type="button"
//                   disabled={googleLoading}
//                 >
//                   <Image src="/google.png" alt="Google logo" width={15} height={15} />
//                   {googleLoading ? "Connecting..." : "Login with Google"}
//                 </Button>
//               </Field>

//               <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
//                 Or continue with
//               </FieldSeparator>

//               <Field>
//                 <FieldLabel htmlFor="name">Name</FieldLabel>
//                 <Input
//                   id="name"
//                   name="name"
//                   type="text"
//                   placeholder="Aysha Akter"
//                   required
//                 />
//               </Field>

//               <Field>
//                 <FieldLabel htmlFor="image">Image URL</FieldLabel>
//                 <Input
//                   id="image"
//                   name="image"
//                   type="url"
//                   placeholder="Image URL"
//                   required
//                 />
//               </Field>

//               <Field>
//                 <FieldLabel htmlFor="email">Email</FieldLabel>
//                 <Input
//                   id="email"
//                   name="email"
//                   type="email"
//                   placeholder="m@example.com"
//                   required
//                 />
//               </Field>

//               <Field>
//                 <div className="flex items-center">
//                   <FieldLabel htmlFor="password">Password</FieldLabel>
//                   <a
//                     href="#"
//                     className="ml-auto text-sm underline-offset-4 hover:underline"
//                   >
//                     Forgot your password?
//                   </a>
//                 </div>
//                 <Input id="password" name="password" type="password" required />
//               </Field>

//               <Field>
//                 <Button type="submit">Register</Button>
//                 <FieldDescription className="text-center">
//                   Have an account? <Link href="/login">Login</Link>
//                 </FieldDescription>
//               </Field>
//             </FieldGroup>
//           </form>
//         </CardContent>
//       </Card>

//       <FieldDescription className="px-6 text-center">
//         By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
//         and <a href="#">Privacy Policy</a>.
//       </FieldDescription>
//     </div>
//   )
// }

// export default SignUpPage;
