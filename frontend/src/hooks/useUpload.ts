import { useState } from "react";
import { toast } from "sonner";
import { type VideoMetaDataType } from "@/types";

export function useUpload() {
  const [loading, setLoading] = useState(false);

  const upload = async ({ file, title, description }: VideoMetaDataType) => {
    try {
      setLoading(true);

      const res = await fetch("/api/upload/s3UploadUrl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          title,
          description,
        }),
      });

      const resObj = await res.json();
      if (resObj.error) {
        throw new Error(JSON.stringify(resObj.error));
      }

      const uploadUrl = resObj.data.uploadUrl;
      const awsKey = resObj.data.awsKey;
      const awsUploadRes = await fetch(uploadUrl, {
        mode: "cors",
        method: "PUT",
        body: file,
      });
      if (!awsUploadRes.ok) {
        throw new Error(JSON.stringify({ message: "Error uploading video" }));
      }

      const uploadRes = await fetch("/api/upload/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          title,
          description,
          awsKey,
        }),
      });
      if (!uploadRes.ok) {
        throw new Error(JSON.stringify({ message: "Error uploading video" }));
      }

      toast.success("Video uploaded successfully");
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

  return { loading, upload };
}
