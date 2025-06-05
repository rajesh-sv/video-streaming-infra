import { toast } from "sonner";
import { useState } from "react";
import { type SearchResultVideoType } from "@/types";

export function useSearch() {
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState<SearchResultVideoType[]>([]);

  const search = async (searchString: string) => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      params.append("s", searchString);
      const res = await fetch(`/api/search?${params}`, {
        method: "GET",
      });

      const resObj = await res.json();

      if (resObj.error) {
        throw new Error(JSON.stringify(resObj.error));
      }

      setVideos(resObj.data.videos);
      toast.success(resObj.data.message);
    } catch (error: any) {
      const errorObj = JSON.parse(error.message);
      toast.error(errorObj.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, videos, search };
}
