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
import { type LoginInputsType } from "@/types";
import { useLogin } from "@/hooks/useLogin";

export function Login() {
  const [loginInputs, setSignupInputs] = useState<LoginInputsType>({
    username: "",
    password: "",
  });

  const { loading, login } = useLogin();

  return (
    <div className="flex items-center justify-center">
      <Card className="w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Login</CardTitle>
          <CardDescription>
            Enter the details below to login to your account
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
                value={loginInputs.username}
                onChange={(e) =>
                  setSignupInputs({ ...loginInputs, username: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                value={loginInputs.password}
                onChange={(e) =>
                  setSignupInputs({ ...loginInputs, password: e.target.value })
                }
              />
            </div>
            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={loading}
              onClick={() => login(loginInputs)}
            >
              {loading ? <RoundSpinner /> : "Login"}
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="underline underline-offset-4">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
