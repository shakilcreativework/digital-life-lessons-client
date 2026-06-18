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

/* -------------------------------------------------------------------------- */
/*                                 LOGIN PAGE                                 */
/* -------------------------------------------------------------------------- */
/**
 * LoginPage
 *
 * Authentication screen responsible for:
 * - Email/password sign in
 * - Google authentication
 * - Navigation to password recovery
 * - Navigation to registration page
 *
 * Design Goals:
 * - Keep authentication UI simple and reusable
 * - Separate UI concerns from authentication service logic
 * - Provide clear user feedback for success and failure states
 * - Remain scalable for future authentication methods
 *
 * Future Enhancements:
 * - Remember Me support
 * - Multi-factor authentication (MFA)
 * - Additional OAuth providers
 * - Password visibility toggle
 */
const LoginPage = () => {
  const router = useRouter();

  /**
   * Prevents duplicate form submissions
   * while an authentication request is active.
   */
  const [loading, setLoading] = useState(false);

  /* ------------------------------------------------------------------------ */
  /*                           EMAIL/PASSWORD LOGIN                           */
  /* ------------------------------------------------------------------------ */
  /**
   * Handles standard email/password authentication.
   *
   * Flow:
   * 1. Prevent default form submission.
   * 2. Extract values from form fields.
   * 3. Normalize email input.
   * 4. Send credentials to auth provider.
   * 5. Handle success or failure responses.
   * 6. Redirect authenticated users.
   */
  const onSubmit = async (e) => {
    e.preventDefault();

    // Prevent accidental double-click submissions.
    if (loading) return;

    setLoading(true);

    try {
      /**
       * Convert form values into a plain JavaScript object
       * for easier manipulation and validation.
       */
      const formData = new FormData(e.currentTarget);

      const rawData = Object.fromEntries(
        formData.entries()
      );

      /**
       * Normalize user input before sending
       * to the authentication service.
       */
      const userData = {
        email: rawData.email
          ?.toString()
          .trim()
          .toLowerCase(),

        password:
          rawData.password?.toString(),
      };

      /**
       * Attempt authentication using email/password.
       */
      const { data, error } =
        await authClient.signIn.email({
          ...userData,
        });

      /**
       * Authentication provider returned
       * a known login error.
       */
      if (error) {
        toast.error(
          error.message ||
          "Invalid email or password"
        );
        return;
      }

      /**
       * Extra safeguard in case authentication
       * succeeds without returning user data.
       */
      if (!data?.user) {
        toast.error(
          "Login failed. Please try again."
        );
        return;
      }

      /**
       * Authentication completed successfully.
       */
      toast.success(
        "Signed in successfully 🎉"
      );

      /**
       * Redirect authenticated user
       * to the application homepage.
       */
      router.push('/');

    } catch (error) {
      /**
       * Handles unexpected runtime,
       * network, or authentication errors.
       */
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      /**
       * Always restore button state
       * regardless of request outcome.
       */
      setLoading(false);
    }
  };

  /* ------------------------------------------------------------------------ */
  /*                              GOOGLE SIGN IN                              */
  /* ------------------------------------------------------------------------ */
  /**
   * Initiates OAuth authentication using Google.
   *
   * Authentication flow and redirection
   * are managed by the auth provider.
   */
  const handleGoogleSignIn = async () => {
    try {
      const data = await authClient.signIn.social({
        provider: "google",
      });

      // console.log(data);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Google Sign In failed!";

      toast.error(message);
    }
  };

  return (
    <main className="py-10 md:py-16">
      <Container>

        {/* ------------------------------------------------------------------ */}
        {/* PAGE LAYOUT
            Centers the authentication card within the viewport area.
        ------------------------------------------------------------------ */}
        <section className="flex items-center justify-center">

          {/* ------------------------------------------------------------------ */}
          {/* AUTHENTICATION CARD
              Primary container that holds all login-related content.
          ------------------------------------------------------------------ */}
          <div className="w-full max-w-md rounded-[32px] bg-card p-6 border border-border shadow-card sm:p-8">

            {/* ---------------------------------------------------------------- */}
            {/* PAGE HEADER
                Introduces the login experience and provides context.
            ---------------------------------------------------------------- */}
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Welcome Back
              </h1>

              <p className="mt-2 text-sm text-muted">
                Login to continue your account
              </p>
            </div>

            {/* ---------------------------------------------------------------- */}
            {/* AUTHENTICATION FORM
                HeroUI form structure containing all login inputs and actions.
            ---------------------------------------------------------------- */}
            <Form className="flex flex-col gap-5" onSubmit={onSubmit}>

              {/* ================= EMAIL INPUT ================= */}
              <TextField
                isRequired
                name="email"
                type="email"
                className="w-full"
              >
                {/* Accessible field label */}
                <Label className="mb-2 text-sm font-medium text-foreground">
                  Email Address
                </Label>

                {/* User email entry */}
                <Input
                  placeholder="you@example.com"
                  className="border-0 rounded-sm"
                />

                {/* Validation feedback */}
                <FieldError />
              </TextField>

              {/* ================= PASSWORD INPUT ================= */}
              <TextField
                isRequired
                name="password"
                type="password"
                className="w-full"
              >
                {/* Label and recovery shortcut */}
                <div className="mb-2 flex items-center justify-between">
                  <Label className="text-sm font-medium text-foreground">
                    Password
                  </Label>

                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-accent"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Secure password input */}
                <Input
                  placeholder="Enter your password"
                  className="border-0 rounded-sm"
                />

                {/* Validation feedback */}
                <FieldError />
              </TextField>

              {/* ================= LOGIN BUTTON ================= */}
              <BaseButton
                animated
                type="submit"
                rightIcon={
                  loading ? (
                    <span className="animate-spin">
                      ⏳
                    </span>
                  ) : (
                    <IoIosArrowRoundForward className="text-2xl" />
                  )
                }
                aria-label="Log in"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Log in"}
              </BaseButton>

              {/* ================= DIVIDER ================= */}
              {/* Separates traditional authentication from OAuth login. */}
              <div className="flex items-center gap-4 py-1">
                <div className="h-px flex-1 bg-border" />
                <span className="text-sm text-muted">OR</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              {/* ================= GOOGLE AUTHENTICATION ================= */}
              {/* Additional providers can be added here in the future. */}
              <BaseButton
                onClick={handleGoogleSignIn}
                animated
                type="button"
                className={'from-[#11998E] to-[#38EF7D] text-white'} 
                animatedSpanOne={'bg-green-300'} 
                animatedSpanTwo={'bg-green-200'}
              >
                <div className="flex items-center gap-3">

                  {/* Google brand icon */}
                  <Image
                    width={20}
                    height={20}
                    priority
                    alt="Google"
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                  />

                  {/* Action label */}
                  <span className="font-medium">
                    Continue with Google
                  </span>
                </div>
              </BaseButton>

              {/* ================= REGISTRATION LINK ================= */}
              {/* Provides a path for new users to create an account. */}
              <p className="pt-2 text-center text-sm text-muted">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-accent"
                >
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