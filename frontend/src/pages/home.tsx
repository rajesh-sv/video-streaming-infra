import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router";
import { Search } from "lucide-react";
import { RoundSpinner } from "@/components/ui/spinner";
import { useSearch } from "@/hooks/useSearch";
import { useState } from "react";

export function Home() {
  const [searchString, setSearchString] = useState("");
  const { loading, videos, search } = useSearch();

  return (
    <div>
      <div className="flex gap-8">
        <Input
          id="search"
          type="search"
          name="search"
          value={searchString}
          placeholder="Search..."
          className="max-w-sm"
          onChange={(e) => setSearchString(e.target.value)}
        />
        <Button
          type="submit"
          className="cursor-pointer"
          disabled={loading}
          onClick={() => search(searchString)}
        >
          {loading ? <RoundSpinner /> : <Search />}
        </Button>
        <Button>
          <Link to="/upload">Upload Video</Link>
        </Button>
      </div>
      <div>
        {videos.map((video) => {
          return (
            <div>
              <p>Title: {video.title}</p>
              <p>Description: {video.description}</p>
              <p>AWSUrl: {video.awsUrl}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
