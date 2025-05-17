import * as z from "zod";

export const signUpSchema = z
  .object({
    email: z.string().min(1, { message: "Email is required" }).email(),
    password: z
      .string()
      .min(1, { message: "password is required" })
      .min(8, { message: "password must be atleast 8 words long" }),
    passwordConfirmation: z
      .string()
      .min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Password did not match4",
    path: ["passwordConfirmation"],
  });
