import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const handelAuth = () => {
    const userId = "mpasas"
    if (!userId) throw new Error("You must be signed in to access this route")
    return { userId };
}


export const ourFileRouter = {
    prodcutsImage: f({ image: { maxFileSize: "4MB", maxFileCount: 8 } })
        .middleware(() => handelAuth())
        .onUploadComplete(({ metadata }) => {
            // Upload completed successfully
        }),


} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;