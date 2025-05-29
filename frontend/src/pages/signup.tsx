import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RoundSpinner } from "@/components/ui/spinner";
import { Link } from "react-router";
import { useState } from "react";
import { type SignupInputsType } from "@/types";
import { useSignup } from "@/hooks/useSignup";

export function Signup() {
  const [signupInputs, setSignupInputs] = useState<SignupInputsType>({
    username: "",
    email: "",
    password: "",
  });

  const { loading, signup } = useSignup();

  return (
    <div className="flex items-center justify-center">
      <Card className="w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="johndoe"
                name="username"
                value={signupInputs.username}
                onChange={(e) =>
                  setSignupInputs({ ...signupInputs, username: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="johndoe@email.com"
                name="email"
                value={signupInputs.email}
                onChange={(e) =>
                  setSignupInputs({ ...signupInputs, email: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                value={signupInputs.password}
                onChange={(e) =>
                  setSignupInputs({ ...signupInputs, password: e.target.value })
                }
              />
            </div>
            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={loading}
              onClick={() => signup(signupInputs)}
            >
              {loading ? <RoundSpinner /> : "Create an account"}
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="underline underline-offset-4">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
