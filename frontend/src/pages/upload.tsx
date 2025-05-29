import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Link } from "react-router";
import { useState } from "react";
import { type VideoMetaDataType } from "@/types";

export function Upload() {
  const [videoMetaData, setVideoMetaData] = useState<VideoMetaDataType>({
    title: "",
    description: "",
  });

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
              <Input id="file" type="file" name="file" />
            </div>
            <Button type="submit" className="w-full cursor-pointer">
              Upload
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
