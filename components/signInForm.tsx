"use client";

import { signInSchema } from "@/zodSchema/signInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Button, Divider, Input } from "@heroui/react";
import {
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Lock,
  Mail,
} from "lucide-react";
import Link from "next/link";

export const SignInForm = () => {
  const router = useRouter();
  const { signIn, isLoaded, setActive } = useSignIn();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    if (!isLoaded) return;
    setIsSubmitting(true);
    setAuthError(null);

    try {
      const result = await signIn.create({
        identifier: data.identifier,
        password: data.password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      } else {
        setAuthError("Sign in error");
      }
    } catch (error: any) {
      setAuthError(
        error.errors?.[0]?.message || "Abn error occured during sign in process"
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Card>
      <CardHeader className="flex flex-col gap-1 items-center pb-2">
        <h1 className="text-2xl font-bold text-default-900">
          Create Your Account
        </h1>
        <p className="text-default-500 text-center">
          SignUp to start managing your images securely
        </p>
      </CardHeader>
      <Divider />
      <Divider />
      <CardBody className="py-6">
        {authError && (
          <div className="bg-danger-50 text-danger-700 p-4 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" flex-shrink-0 />
            <p>{authError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="verificationCode"
              className="text-sm font-medium text-default-900"
            >
              Email
            </label>
            <Input
              id="verificationCode"
              type="email"
              startContent={<Mail className="h-4 w-4 text-default-500" />}
              placeholder="your.email@example.com"
              isInvalid={!!errors.identifier}
              errorMessage={errors.identifier?.message}
              {...register("identifier")}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-default-900"
            >
              Password
            </label>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="....."
              startContent={<Lock className="h-4 w-4 text-default-500" />}
              endContent={
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-default-500 " />
                  ) : (
                    <Eye className="h-4 w-4 text-default-500" />
                  )}
                </Button>
              }
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message}
              {...register("password")}
              className="w-full"
            />
          </div>
          <Button
            type="button"
            color="primary"
            className="w-full"
            isLoading={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </CardBody>
      <Divider />
      <CardFooter className="flex justify-center py-4">
        <p className="text-sm text-default-600">
          Already have an account?{" "}
          <Link
            href="/sign-up"
            className="text-primary hover:underline font-medium"
          >
            Sign Up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};
