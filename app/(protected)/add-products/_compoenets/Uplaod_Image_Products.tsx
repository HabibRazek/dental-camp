"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useUploadThing } from "@/lib/uploadthing";
import { Camera, Edit3, ImagePlus, Plus, Star, X } from "lucide-react";
import Image from "next/image";
import React from "react";
import Dropzone from "react-dropzone";
import { useFormContext } from "react-hook-form";
import { set } from "zod";

type formValues = {
  images: string[];
};

function Uplaod_Image_Products() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<formValues>();
  const images = watch("images") || [];
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const { startUpload } = useUploadThing("prodcutsImage", {
    onUploadError: (error) => {
      console.log("Upload Error", error);
      setError(error.message);
      setIsLoading(false);
    },
    onClientUploadComplete: (res) => {
      console.log("Upload Complete", res);
      setSuccess("Upload Complete");
      setError(null);
      setIsLoading(false);
      setValue(
        "images",
        res.map((item) => item.ufsUrl)
      );
    },
    onUploadProgress: (progress) => {
      setIsLoading(true);
    },
  });

  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 flex justify-between items-center border-b">
        <h3 className="font-semibold flex items-center">
          <Camera className="mr-2 h-4 w-4" />
          Visual Gallery
        </h3>
        <Button variant="ghost" size="sm">
          <Edit3 className="h-4 w-4" />
        </Button>
      </div>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="aspect-square bg-slate-100 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-slate-200 transition-colors border-2 border-dashed">
            <div className="aspect-square w-full h-full bg-slate-100 rounded-md flex items-center justify-center relative overflow-hidden">
              {images.length > 0 ? (
                <div className="w-full h-full relative">
                  <Image
                    src={images[0]}
                    alt={`Image 0`}
                    loading="lazy"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    className="absolute top-2 right-2 bg-white rounded-full p-1 cursor-pointer"
                    onClick={() => {
                      setValue(
                        "images",
                        images.filter((_, i) => i !== 0)
                      );
                    }}
                  >
                    <X className="h-4 w-4 text-red-500 fill-red-500 " />
                  </Button>
                </div>
              ) : (
                <>
                  <ImagePlus className="h-8 w-8 text-slate-400 mb-2" />
                  <span className="text-xs text-slate-500">Main Image</span>
                </>
              )}
            </div>
          </div>
          {images.length > 0 &&
            images.slice(1).map((image, index) => (
              <div
                key={index}
                className="aspect-square bg-slate-100 rounded-md flex items-center justify-center relative overflow-hidden border-2 border-dashed"
              >
                <Image
                  src={image}
                  alt={`Image ${index}`}
                  loading="lazy"
                  fill
                  className="object-cover"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  className="absolute top-2 right-2 bg-white rounded-full p-1 cursor-pointer"
                  onClick={() => {
                    setValue(
                      "images",
                      images.filter((_, i) => i !== index + 1)
                    );
                  }}
                >
                  <X className="h-4 w-4 text-red-500 fill-red-500 " />
                </Button>
              </div>
            ))}
          {images.length <= 0 && (
            <>
              <div className="aspect-square bg-slate-100 rounded-md flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-colors border-2 border-dashed">
                <Plus className="h-6 w-6 text-slate-400" />
              </div>

              <div className="aspect-square bg-slate-100 rounded-md flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-colors border-2 border-dashed">
                <Plus className="h-6 w-6 text-slate-400" />
              </div>

              <div className="aspect-square bg-slate-100 rounded-md flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-colors border-2 border-dashed">
                <Plus className="h-6 w-6 text-slate-400" />
              </div>
            </>
          )}
        </div>

        <div className="mt-4 text-center">
          <Dropzone
            onDrop={async (acceptedFiles) => {
              console.log("Accepted Files", acceptedFiles);
              setIsLoading(true);
              setError(null);
              setSuccess(null);
              const res = await startUpload(acceptedFiles);
              console.log("Upload Response", res);
              setIsLoading(false);

              if (res) {
                setSuccess("Upload Complete");
              } else {
                setError("Upload Failed");
              }
            }}
          >
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()} className="w-full">
                <input {...getInputProps()} />
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  type="button"
                >
                  <ImagePlus className="h-4 w-4 mr-2" />
                  Drag & Drop or Browse
                </Button>
              </div>
            )}
          </Dropzone>
          <div className="mt-2 text-sm  ">
            {isLoading && (
              <p className="text-sm text-blue-500 bg-blue-100 rounded-md p-2">
                Uploading...
              </p>
            )}
            {error ||
              (errors.images && (
                <p className="text-sm text-red-500 rounded-md bg-red-100 p-2">
                  {error}
                  {errors.images?.message}
                </p>
              ))}
            {success && (
              <p className="text-sm text-green-500 rounded-md bg-green-100 p-2">
                {success}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default Uplaod_Image_Products;
