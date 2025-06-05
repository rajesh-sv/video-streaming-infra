import { toast } from "sonner";
import { useState } from "react";
import { useAuthContext } from "@/contexts/authContext";

export function useLogout() {
  const [loading, setLoading] = useState(false);
  const { setUserAuthenticated } = useAuthContext();

  const logout = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      const resObj = await res.json();

      if (resObj.error) {
        throw new Error(JSON.stringify(resObj.error));
      }

      toast.success(resObj.data.message);
      setUserAuthenticated(false);
    } catch (error: any) {
      const errorObj = JSON.parse(error.message);
      toast.error(errorObj.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, logout };
}
