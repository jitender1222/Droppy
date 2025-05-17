import * as z from "zod";

export const signUpSchema = z.object({
  identifier: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email" }),
  password: z
    .string()
    .min(1, { message: "password is required" })
    .min(8, { message: "password must be atleast 8 words long" }),
});
