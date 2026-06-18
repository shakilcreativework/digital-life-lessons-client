"use client";

/* -------------------------------------------------------------------------- */
/*                               COMPONENT IMPORTS                            */
/* -------------------------------------------------------------------------- */
/*
  Container   => Reusable layout wrapper for keeping content centered
  BaseButton  => Custom reusable button component with animation support
*/
import Container from "@/components/shared/Container";
import BaseButton from "@/components/ui/BaseButton";

/* -------------------------------------------------------------------------- */
/*                               AUTH & UTILITIES                             */
/* -------------------------------------------------------------------------- */
/*
  authClient => Better Auth client instance
  cn         => Utility function for merging class names conditionally
*/
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                               HERO UI COMPONENTS                           */
/* -------------------------------------------------------------------------- */
/*
  Form       => Form wrapper component
  TextField  => Accessible input wrapper
  Input      => Actual input element
  Label      => Input label
  FieldError => Validation error message
*/
import {
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";

/* -------------------------------------------------------------------------- */
/*                               NEXT.JS IMPORTS                              */
/* -------------------------------------------------------------------------- */
/*
  Image      => Optimized image component from Next.js
  Link       => Client-side navigation without full page reload
  useRouter  => Programmatic navigation
*/
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                               REACT IMPORTS                                */
/* -------------------------------------------------------------------------- */
/*
  useState => React hook for component state management
*/
import { useState } from "react";

/* -------------------------------------------------------------------------- */
/*                               THIRD PARTY LIBRARIES                        */
/* -------------------------------------------------------------------------- */
/*
  toast => Beautiful toast notification system
*/
import toast from "react-hot-toast";

/* -------------------------------------------------------------------------- */
/*                               ICON IMPORTS                                 */
/* -------------------------------------------------------------------------- */
/*
  BiUserPlus => Register button icon
*/
import { BiUserPlus } from "react-icons/bi";

/* -------------------------------------------------------------------------- */
/*                              REGISTER PAGE                                 */
/* -------------------------------------------------------------------------- */

const RegisterPage = () => {

  /* ------------------------------------------------------------------------ */
  /*                         LOADING STATE MANAGEMENT                          */
  /* ------------------------------------------------------------------------ */
  /*
    loading = true
    -> Form is currently submitting

    loading = false
    -> Form is idle

    Used to:
    - Prevent multiple submissions
    - Show loading text on button
  */
  const [loading, setLoading] = useState(false);

  /* ------------------------------------------------------------------------ */
  /*                           NEXT.JS ROUTER INSTANCE                         */
  /* ------------------------------------------------------------------------ */
  /*
    router.push("/login")
    -> Redirect user after successful registration
  */
  const router = useRouter();

  /* ------------------------------------------------------------------------ */
  /*                      REGISTER WITH EMAIL & PASSWORD                      */
  /* ------------------------------------------------------------------------ */
  /*
    This function handles:

    1. Prevent default form refresh
    2. Prevent double submit
    3. Get form values
    4. Validate passwords
    5. Create clean user object
    6. Send signup request
    7. Handle auth errors
    8. Show success/error messages
    9. Redirect user after success
  */
  const onSubmit = async (e) => {

    /* Prevent browser page refresh on submit */
    e.preventDefault();

    /* ---------------------------------------------------------------------- */
    /*                       PREVENT MULTIPLE FORM SUBMIT                      */
    /* ---------------------------------------------------------------------- */
    /*
      Stops accidental double clicking.
      Very important for:
      - Payments
      - Authentication
      - Database writes
    */
    if (loading) return;

    /* Start loading state */
    setLoading(true);

    try {

      /* -------------------------------------------------------------------- */
      /*                         GET FORM DATA FROM FORM                       */
      /* -------------------------------------------------------------------- */
      /*
        FormData extracts all form field values automatically.
      */
      const formData = new FormData(
        e.currentTarget
      );

      /* -------------------------------------------------------------------- */
      /*                      CONVERT FORM DATA TO OBJECT                      */
      /* -------------------------------------------------------------------- */
      /*
        Example:

        Before:
        FormData {}

        After:
        {
          name: "John",
          email: "john@gmail.com"
        }
      */
      const rawData = Object.fromEntries(
        formData.entries()
      );

      /* -------------------------------------------------------------------- */
      /*                         PASSWORD VALIDATION                           */
      /* -------------------------------------------------------------------- */
      /*
        Check if:
        password === confirmPassword

        If not:
        - show error
        - stop execution
      */
      if (
        rawData.password !==
        rawData.confirmPassword
      ) {

        toast.error(
          "Password and confirm password do not match."
        );

        return;
      }

      /* -------------------------------------------------------------------- */
      /*                          CLEAN & PREPARE USER DATA                    */
      /* -------------------------------------------------------------------- */
      /*
        trim()
        -> removes extra spaces

        toLowerCase()
        -> converts email to lowercase
           Example:
           JOHN@GMAIL.COM
           ->
           john@gmail.com
      */
      const userData = {

        /* User full name */
        name: rawData.name
          ?.toString()
          .trim(),

        /* User email */
        email: rawData.email
          ?.toString()
          .trim()
          .toLowerCase(),

        /* Optional profile image URL */
        image: rawData.image
          ?.toString()
          .trim(),

        /* User password */
        password:
          rawData.password?.toString(),
      };

      /* -------------------------------------------------------------------- */
      /*                         CREATE USER ACCOUNT                           */
      /* -------------------------------------------------------------------- */
      /*
        Better Auth signup request
      */
      const {
        data,
        error,
      } = await authClient.signUp.email(
        {
          ...userData,
        }
      );

      /* -------------------------------------------------------------------- */
      /*                          HANDLE AUTH ERRORS                           */
      /* -------------------------------------------------------------------- */
      /*
        Better Auth returns:
        error.code

        We use switch statement
        for cleaner error handling.
      */
      if (error) {

        switch (error.code) {

          /* User already exists */
          case "user_already_exists":
          case "email_already_exists":

            toast.error(
              "An account already exists with this email."
            );

            break;

          /* Invalid email format */
          case "invalid_email":

            toast.error(
              "Please enter a valid email address."
            );

            break;

          /* Weak password */
          case "weak_password":

            toast.error(
              "Password must be at least 8 characters."
            );

            break;

          /* Unknown errors */
          default:

            toast.error(
              error.message ||
              "Signup failed. Please try again."
            );
        }

        return;
      }

      /* -------------------------------------------------------------------- */
      /*                          SAFETY CHECK                                 */
      /* -------------------------------------------------------------------- */
      /*
        Extra protection:
        Ensure user object exists
        after successful signup.
      */
      if (!data?.user) {

        toast.error(
          "Account could not be created."
        );

        return;
      }

      /* -------------------------------------------------------------------- */
      /*                          SUCCESS MESSAGE                              */
      /* -------------------------------------------------------------------- */
      toast.success(
        "Account created successfully 🎉"
      );

      /* -------------------------------------------------------------------- */
      /*                          REDIRECT USER                                */
      /* -------------------------------------------------------------------- */
      /*
        Redirect user to login page
        after successful registration
      */
      router.push("/login");

    } catch (error) {

      /* -------------------------------------------------------------------- */
      /*                          CATCH UNKNOWN ERRORS                         */
      /* -------------------------------------------------------------------- */
      /*
        Handles:
        - Network errors
        - Server crashes
        - Unexpected exceptions
      */
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );

    } finally {

      /* -------------------------------------------------------------------- */
      /*                          STOP LOADING STATE                           */
      /* -------------------------------------------------------------------- */
      /*
        finally always runs:
        - success
        - error
        - return
      */
      setLoading(false);
    }
  };

  // Signup with Google
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

    /* ---------------------------------------------------------------------- */
    /*                               PAGE WRAPPER                              */
    /* ---------------------------------------------------------------------- */
    <main className="py-16 md:py-20">

      <Container>

        {/* ------------------------------------------------------------------ */}
        {/*                        CENTER CONTENT SECTION                       */}
        {/* ------------------------------------------------------------------ */}
        <section className="flex items-center justify-center">

          {/* ---------------------------------------------------------------- */}
          {/*                           REGISTER CARD                          */}
          {/* ---------------------------------------------------------------- */}
          <div
            className={cn("w-full max-w-md rounded-[32px] bg-card p-6 border border-border shadow-card sm:p-8")}
          >

            {/* -------------------------------------------------------------- */}
            {/*                           CARD HEADER                          */}
            {/* -------------------------------------------------------------- */}
            <div className="mb-8 text-center">

              {/* Main title */}
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Create Account
              </h1>

              {/* Subtitle */}
              <p className="mt-2 text-sm text-muted">
                Create your account to get started
              </p>
            </div>

            {/* -------------------------------------------------------------- */}
            {/*                             FORM                               */}
            {/* -------------------------------------------------------------- */}
            <Form className="flex flex-col gap-5" onSubmit={onSubmit}>

              {/* ================= USER NAME INPUT ================= */}
              <TextField
                isRequired
                name="name"
                className="w-full"
              >

                <Label className="mb-2 text-sm font-medium text-foreground">
                  User Name
                </Label>

                <Input
                  placeholder="Enter your name"
                  className="rounded-sm border-0"
                />

                {/* Validation Error */}
                <FieldError />
              </TextField>

              {/* ================= PROFILE IMAGE INPUT ================= */}
              <TextField
                name="image"
                type="url"
                className="w-full"
              >

                <Label className="mb-2 text-sm font-medium text-foreground">
                  Image URL
                </Label>

                <Input
                  placeholder="https://example.com/profile.jpg"
                  className="rounded-sm border-0"
                />

                <FieldError />
              </TextField>

              {/* ================= EMAIL INPUT ================= */}
              <TextField
                isRequired
                name="email"
                type="email"
                className="w-full"
              >

                <Label className="mb-2 text-sm font-medium text-foreground">
                  Email Address
                </Label>

                <Input
                  placeholder="you@example.com"
                  className="rounded-sm border-0"
                />

                <FieldError />
              </TextField>

              {/* ================= PASSWORD INPUT ================= */}
              <TextField
                isRequired
                name="password"
                type="password"
                className="w-full"
              >

                <Label className="mb-2 text-sm font-medium text-foreground">
                  Password
                </Label>

                <Input
                  placeholder="Create a password"
                  className="rounded-sm border-0"
                />

                <FieldError />
              </TextField>

              {/* ================= CONFIRM PASSWORD INPUT ================= */}
              <TextField
                isRequired
                name="confirmPassword"
                type="password"
                className="w-full"
              >

                <Label className="mb-2 text-sm font-medium text-foreground">
                  Confirm Password
                </Label>

                <Input
                  placeholder="Confirm your password"
                  className="rounded-sm border-0"
                />

                <FieldError />
              </TextField>

              {/* ================= REGISTER BUTTON ================= */}
              <BaseButton
                animated
                type="submit"
                leftIcon={
                  loading ? (
                    <span className="animate-spin">
                      ⏳
                    </span>
                  ) : (
                    <BiUserPlus className="text-2xl" />
                  )
                }
                aria-label="Create account"
                disabled={loading}
              >

                {/* Show loading text while submitting */}
                {loading ? "Creating account..." : "Sign up"}

              </BaseButton>

              {/* ================= OR DIVIDER ================= */}
              <div className="flex items-center gap-4 py-1">

                {/* Left line */}
                <div className="h-px flex-1 bg-border" />

                {/* OR text */}
                <span className="text-sm text-muted">
                  OR
                </span>

                {/* Right line */}
                <div className="h-px flex-1 bg-border" />
              </div>

              {/* ================= GOOGLE REGISTER BUTTON ================= */}
              <BaseButton
                onClick={handleGoogleSignIn}
                animated
                type="button"
                className={'from-[#11998E] to-[#38EF7D] text-white'} 
                animatedSpanOne={'bg-green-300'} 
                animatedSpanTwo={'bg-green-200'}
              >

                <div className="flex items-center gap-3">

                  {/* Google Logo */}
                  <Image
                    width={20}
                    height={20}
                    priority
                    alt="Google"
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                  />

                  {/* Button Text */}
                  <span className="font-medium">
                    Continue with Google
                  </span>

                </div>
              </BaseButton>

              {/* ================= LOGIN PAGE LINK ================= */}
              <p className="pt-2 text-center text-sm text-muted">

                Already have an account?{" "}

                <Link
                  href="/login"
                  className="font-semibold text-accent"
                >
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