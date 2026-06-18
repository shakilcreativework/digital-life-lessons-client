"use client";

import Container from "@/components/shared/Container";
import BaseButton from "@/components/ui/BaseButton";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
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
import { BiUserPlus } from "react-icons/bi";

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const rawData = Object.fromEntries(formData.entries());

      if (rawData.password !== rawData.confirmPassword) {
        toast.error("Password and confirm password do not match.");
        return;
      }

      const userData = {
        name: rawData.name?.toString().trim(),
        email: rawData.email?.toString().trim().toLowerCase(),
        image: rawData.image?.toString().trim(),
        password: rawData.password?.toString(),
      };

      const { data, error } = await authClient.signUp.email({
        ...userData,
      });

      if (error) {
        switch (error.code) {
          case "user_already_exists":
          case "email_already_exists":
            toast.error("An account already exists with this email.");
            break;
          case "invalid_email":
            toast.error("Please enter a valid email address.");
            break;
          case "weak_password":
            toast.error("Password must be at least 8 characters.");
            break;
          default:
            toast.error(error.message || "Signup failed. Please try again.");
        }
        return;
      }

      if (!data?.user) {
        toast.error("Account could not be created.");
        return;
      }

      toast.success("Account created successfully 🎉");
      router.push("/login");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
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
      // console.log(data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Google Sign In failed!";
      toast.error(message);
    }
  };

  return (
    <main className="py-16 md:py-20">
      <Container>
        <section className="flex items-center justify-center">
          <div className={cn("w-full max-w-md rounded-[32px] bg-card p-6 border border-border shadow-card sm:p-8")}>
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Create Account
              </h1>
              <p className="mt-2 text-sm text-muted">
                Create your account to get started
              </p>
            </div>

            <Form className="flex flex-col gap-5" onSubmit={onSubmit}>
              <TextField isRequired name="name" className="w-full">
                <Label className="mb-2 text-sm font-medium text-foreground">
                  User Name
                </Label>
                <Input placeholder="Enter your name" className="rounded-sm border-0" />
                <FieldError />
              </TextField>

              <TextField name="image" type="url" className="w-full">
                <Label className="mb-2 text-sm font-medium text-foreground">
                  Image URL
                </Label>
                <Input placeholder="https://example.com/profile.jpg" className="rounded-sm border-0" />
                <FieldError />
              </TextField>

              <TextField isRequired name="email" type="email" className="w-full">
                <Label className="mb-2 text-sm font-medium text-foreground">
                  Email Address
                </Label>
                <Input placeholder="you@example.com" className="rounded-sm border-0" />
                <FieldError />
              </TextField>

              <TextField isRequired name="password" type="password" className="w-full">
                <Label className="mb-2 text-sm font-medium text-foreground">
                  Password
                </Label>
                <Input placeholder="Create a password" className="rounded-sm border-0" />
                <FieldError />
              </TextField>

              <TextField isRequired name="confirmPassword" type="password" className="w-full">
                <Label className="mb-2 text-sm font-medium text-foreground">
                  Confirm Password
                </Label>
                <Input placeholder="Confirm your password" className="rounded-sm border-0" />
                <FieldError />
              </TextField>

              <BaseButton
                animated
                type="submit"
                leftIcon={
                  loading ? (
                    <span className="animate-spin">⏳</span>
                  ) : (
                    <BiUserPlus className="text-2xl" />
                  )
                }
                aria-label="Create account"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Sign up"}
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
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-accent">
                  Login
                </Link>
              </p>
            </Form>
          </div>
        </section>
      </Container>
    </main>
  );
};

export default RegisterPage;