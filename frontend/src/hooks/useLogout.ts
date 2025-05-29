import { toast } from "sonner";
import { useState } from "react";
import { useAuthContext } from "@/contexts/authContext";

export default function useLogout() {
  const [loading, setLoading] = useState(false);
  const { setUserAuthenticated } = useAuthContext();

  const logout = async () => {
    try {
      setLoading(true);

      const res = await fetch("api/auth/logout", {
        method: "POST",
      });

      const resObj = await res.json();

      if (resObj.error) {
        throw new Error(JSON.stringify(resObj.error));
      }

      toast.success(resObj.message);
      setUserAuthenticated(false);
    } catch (error: any) {
      const errorObj = JSON.parse(error.message);
      toast.error(errorObj);
    } finally {
      setLoading(false);
    }
  };

  return { loading, logout };
}
