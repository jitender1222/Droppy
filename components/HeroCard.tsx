import React from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
} from "@heroui/react";
import { AlertCircle } from "lucide-react";
import { HeroCardProps } from "./signUpForm";

const HeroCard: React.FC<HeroCardProps> = ({
  verificationError,
  verificationCode,
  handleSubmit,
  onSubmit,
  setVerificationCode,
  isSubmitting,
  signUp,
}) => {
  return (
    <Card className="w-full max-w-md border border-default-200 bg-default-50 shadow-xl">
      <CardHeader className="flex flex-col gap-1 items-center pb-2">
        <h1 className="text-2xl font-bold text-default-900">
          Verify Your Email
        </h1>
        <p className="text-default-500 text-center">
          We have send a verification Code to your email
        </p>
      </CardHeader>

      <Divider />

      <CardBody className="py-6">
        {verificationError && (
          <div className="bg-danger-50 text-danger-700 p-4 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle className="h-5 w-5  flex-shrink-0" />
            <p>{verificationError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="verificationCode"
              className="text-sm font-medium text-default-900"
            >
              Verification Code
            </label>
            <Input
              id="verificationCode"
              type="text"
              placeholder="Enter the 6 digit code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="w-full"
              autoFocus
            />
          </div>

          <Button
            type="submit"
            color="primary"
            className="w-full"
            isLoading={isSubmitting}
          >
            {isSubmitting ? "Verifying..." : "Verify Email"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-default-500">
            Didn't receive a code ?{" "}
            <button
              onClick={async () => {
                if (signUp) {
                  await signUp.prepareEmailAddressVerification({
                    strategy: "email_code",
                  });
                }
              }}
              className="text-primary hover:underline font-medium"
            >
              Resend Code
            </button>
          </p>
        </div>
      </CardBody>
    </Card>
  );
};

export default HeroCard;
