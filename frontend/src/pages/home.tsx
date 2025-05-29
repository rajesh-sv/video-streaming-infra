import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router";

export function Home() {
  return (
    <div className="flex gap-8">
      <Input type="text" placeholder="Search..." className="max-w-sm" />
      <Button>
        <Link to="/upload">Upload Video</Link>
      </Button>
    </div>
  );
}
