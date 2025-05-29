import { useState } from "react";
import { toast } from "sonner";
import { useAuthContext } from "@/contexts/authContext";
import { type SignupInputsType } from "@/types";

export function useSignup() {
  const [loading, setLoading] = useState(false);
  const { setUserAuthenticated } = useAuthContext();

  const signup = async ({ username, email, password }: SignupInputsType) => {
    try {
      setLoading(true);

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const resObj = await res.json();
      if (resObj.error) {
        throw new Error(JSON.stringify(resObj.error));
      }

      toast.success(resObj.data.message);
      setUserAuthenticated(true);
    } catch (error: any) {
      const errorObj = JSON.parse(error.message);
      if (errorObj.message) {
        toast.error(errorObj.message);
      } else {
        for (const errorCategory of Object.keys(errorObj)) {
          const errors: string[] = errorObj[errorCategory]["errors"];
          toast.error(errorCategory, {
            description: errors.join("\n"),
            action: {
              label: "Close",
              onClick: () => undefined,
            },
          });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return { loading, signup };
}
