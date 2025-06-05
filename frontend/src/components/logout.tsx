import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/useLogout";
import { RoundSpinner } from "@/components/ui/spinner";

export function Logout() {
  const { loading, logout } = useLogout();

  return (
    <Button
      className="cursor-pointer bg-red-300 hover:bg-red-500 hover:text-white"
      disabled={loading}
      onClick={logout}
    >
      {loading ? <RoundSpinner /> : "Logout"}
    </Button>
  );
}
