import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@/auth";

const f = createUploadthing();

const handelAuth = async () => {
    const session = await auth();
    if (!session?.user) throw new Error("You must be signed in to access this route")
    return { userId: session.user.id || session.user.email };
}


export const ourFileRouter = {
    prodcutsImage: f({ image: { maxFileSize: "4MB", maxFileCount: 8 } })
        .middleware(() => handelAuth())
        .onUploadComplete(({ metadata }) => {
            // Upload completed successfully
        }),

    paymentProof: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
        .middleware(() => handelAuth())
        .onUploadComplete(({ metadata, file }) => {
            console.log("Payment proof uploaded:", file.url);
            // Upload completed successfully
        }),


} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;