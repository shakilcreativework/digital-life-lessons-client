"use client";

import Container from "@/components/shared/Container";
import BaseButton from "@/components/ui/BaseButton";
import { authClient } from "@/lib/auth-client";
import {
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { IoIosArrowRoundForward } from "react-icons/io";

const LoginPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const rawData = Object.fromEntries(formData.entries());

      const userData = {
        email: rawData.email?.toString().trim().toLowerCase(),
        password: rawData.password?.toString(),
      };

      const { data, error } = await authClient.signIn.email({
        ...userData,
      });

      if (error) {
        toast.error(error.message || "Invalid email or password");
        return;
      }

      if (!data?.user) {
        toast.error("Login failed. Please try again.");
        return;
      }

      toast.success("Signed in successfully 🎉");
      router.push('/');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const data = await authClient.signIn.social({
        provider: "google",
      });
      console.log(data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Google Sign In failed!";
      toast.error(message);
    }
  };

  return (
    <main className="py-10 md:py-16">
      <Container>
        <section className="flex items-center justify-center">
          <div className="w-full max-w-md rounded-[32px] bg-card p-6 border border-border shadow-card sm:p-8">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Welcome Back
              </h1>
              <p className="mt-2 text-sm text-muted">
                Login to continue your account
              </p>
            </div>

            <Form className="flex flex-col gap-5" onSubmit={onSubmit}>
              <TextField isRequired name="email" type="email" className="w-full">
                <Label className="mb-2 text-sm font-medium text-foreground">
                  Email Address
                </Label>
                <Input placeholder="you@example.com" className="border-0 rounded-sm" />
                <FieldError />
              </TextField>

              <TextField isRequired name="password" type="password" className="w-full">
                <div className="mb-2 flex items-center justify-between">
                  <Label className="text-sm font-medium text-foreground">
                    Password
                  </Label>
                  <Link href="/forgot-password" className="text-sm font-medium text-accent">
                    Forgot password?
                  </Link>
                </div>
                <Input placeholder="Enter your password" className="border-0 rounded-sm" />
                <FieldError />
              </TextField>

              <BaseButton
                animated
                type="submit"
                rightIcon={
                  loading ? (
                    <span className="animate-spin">⏳</span>
                  ) : (
                    <IoIosArrowRoundForward className="text-2xl" />
                  )
                }
                aria-label="Log in"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Log in"}
              </BaseButton>

              <div className="flex items-center gap-4 py-1">
                <div className="h-px flex-1 bg-border" />
                <span className="text-sm text-muted">OR</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <BaseButton
                onClick={handleGoogleSignIn}
                animated
                type="button"
                className="from-[#11998E] to-[#38EF7D] text-white"
                animatedSpanOne="bg-green-300"
                animatedSpanTwo="bg-green-200"
              >
                <div className="flex items-center gap-3">
                  <Image
                    width={20}
                    height={20}
                    priority
                    alt="Google"
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                  />
                  <span className="font-medium">Continue with Google</span>
                </div>
              </BaseButton>

              <p className="pt-2 text-center text-sm text-muted">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="font-semibold text-accent">
                  Register
                </Link>
              </p>
            </Form>
          </div>
        </section>
      </Container>
    </main>
  );
};

export default LoginPage;