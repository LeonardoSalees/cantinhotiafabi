
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      console.log("UploadThing middleware executing...");
      console.log("UPLOADTHING_SECRET exists:", !!process.env.UPLOADTHING_SECRET);
      console.log("UPLOADTHING_APP_ID exists:", !!process.env.UPLOADTHING_APP_ID);
      
      if (!process.env.UPLOADTHING_SECRET) {
        console.error("UPLOADTHING_SECRET is not defined");
        throw new UploadThingError("UPLOADTHING_SECRET is not defined");
      }
      
      return { userId: "anonymous" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete!");
      console.log("File name:", file.name);
      console.log("File size:", file.size);
      console.log("File URL:", file.url);
      console.log("File key:", file.key);
      
      return { 
        url: file.url,
        key: file.key,
        name: file.name 
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
