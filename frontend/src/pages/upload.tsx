import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Link } from "react-router";
import { useState } from "react";
import { type VideoMetaDataType } from "@/types";
import { useUpload } from "@/hooks/useUpload";
import { RoundSpinner } from "@/components/ui/spinner";

export function Upload() {
  const [videoMetaData, setVideoMetaData] = useState<VideoMetaDataType>({
    file: new File([], ""),
    title: "",
    description: "",
  });
  const { loading, upload } = useUpload();

  return (
    <div className="flex items-center justify-center">
      <Card className="w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Upload Video</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Video Title</Label>
              <Input
                id="title"
                type="text"
                name="title"
                value={videoMetaData.title}
                onChange={(e) =>
                  setVideoMetaData({ ...videoMetaData, title: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Video Description</Label>
              <Textarea
                id="description"
                name="description"
                value={videoMetaData.description}
                onChange={(e) =>
                  setVideoMetaData({
                    ...videoMetaData,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="file">Video File</Label>
              <Input
                id="file"
                type="file"
                name="file"
                accept="video/*"
                onChange={(e) => {
                  if (e.target.files !== null) {
                    const file = e.target.files[0];
                    if (file !== null) {
                      setVideoMetaData({
                        ...videoMetaData,
                        file: file,
                      });
                    }
                  }
                }}
              />
            </div>
            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={loading}
              onClick={() => upload(videoMetaData)}
            >
              {loading ? <RoundSpinner /> : "Upload"}
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Navigate to{" "}
            <Link to="/" className="underline underline-offset-4">
              Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
