"use client";

import { useForm } from "react-hook-form";
import { useSignUp } from "@clerk/nextjs";
import { z } from "zod";

import { signUpSchema } from "@/zodSchema/signUpSchema";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

export const signUpForm = () => {
  const router = useRouter();
  const [verifying, setverifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(
    null
  );
  const [authError, setAuthError] = useState<string | null>(null);
  const { signUp, isLoaded, setActive } = useSignUp();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    if (!isLoaded) return;
    setIsSubmitting(true);
    setAuthError(null);

    try {
      await signUp.create({
        emailAddress: data.email,
        password: data.password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });
      setverifying(true);
    } catch (error: any) {
      console.log("Signup Error", error);
      setAuthError(
        error.errors?.[0]?.message ||
          "An error occured during the signup. Please try again"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerificationSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!isLoaded || !signUp) return;
    setIsSubmitting(true);
    setAuthError(null);

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      console.log("result", result);

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      } else {
        console.error("Verification Complete", result);
        setVerificationError("Verification could not be complete");
      }
    } catch (error: any) {
      console.error("Verification incomplete", error);
      setVerificationError(
        error.errors?.[0]?.message ||
          "An error occured during the signup.Please try again"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (verifying) {
    return <h1>this is OTP entering field</h1>;
  }

  return <h1>Signup from with email and other fields</h1>;
};
