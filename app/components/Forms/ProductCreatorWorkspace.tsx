// components/form/ProductCreatorWorkspace.tsx
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductSchema, type ProductFormValues } from "@/schemas/product";
import { useFormState, useFormStatus } from "react-dom";
import { useEffect, useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, Plus, ImagePlus, Package, Layers, Tag } from "lucide-react";
import Dropzone from "react-dropzone";
import Image from "next/image";
import { createProduct } from "@/app/actions/product";

export default function ProductCreatorWorkspace() {
    const [state, formAction] = useFormState(createProduct, null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const { startUpload } = useUploadThing("prodcutsImage", {
        onUploadProgress: (progress) => {
            setUploadProgress(progress);
        },
    });

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(ProductSchema),
        defaultValues: {
            name: "",
            category: "",
            price: 0,
            discount: undefined,
            stock: 0,
            description: "",
            technicalDetails: "",
            images: [],
            recommendedFor: [],
            verifiedBy: [],
        },
    });

    useEffect(() => {
        if (state?.errors) {
            Object.entries(state.errors).forEach(([field, errors]) => {
                form.setError(field as any, { message: errors?.[0] });
            });
        }
    }, [state, form]);

    const handleImageDrop = async (acceptedFiles: File[]) => {
        setUploadProgress(0);
        try {
            const res = await startUpload(acceptedFiles);
            if (res) {
                const urls = res.map((file) => file.url);
                form.setValue("images", [...form.getValues("images"), ...urls]);
            }
        } catch (error) {
            form.setError("images", { message: "Failed to upload images" });
        }
    };

    const removeImage = (index: number) => {
        const images = form.getValues("images");
        form.setValue("images", images.filter((_, i) => i !== index));
    };

    const addRecommendation = () => {
        const recommendation = form.getValues("newRecommendation");
        if (recommendation && recommendation.trim()) {
            const current = form.getValues("recommendedFor") || [];
            form.setValue("recommendedFor", [...current, recommendation]);
            form.setValue("newRecommendation", "");
        }
    };

    const addVerification = () => {
        const verification = form.getValues("newVerification");
        if (verification && verification.trim()) {
            const current = form.getValues("verifiedBy") || [];
            form.setValue("verifiedBy", [...current, verification]);
            form.setValue("newVerification", "");
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 max-w-7xl mx-auto">
            <Form {...form}>
                <form action={formAction} className="space-y-6 lg:col-span-2">
                    {/* Product Identity */}
                    <Card>
                        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Product Identity
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Product Name *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter product name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Product category" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="space-y-2">
                                <FormLabel>Recommended For</FormLabel>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Add recommendation"
                                        {...form.register("newRecommendation")}
                                    />
                                    <Button type="button" onClick={addRecommendation} variant="secondary">
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {form.watch("recommendedFor")?.map((item, index) => (
                                        <Badge key={index} variant="secondary">
                                            {item}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const current = form.getValues("recommendedFor") || [];
                                                    form.setValue(
                                                        "recommendedFor",
                                                        current.filter((_, i) => i !== index)
                                                    );
                                                }}
                                                className="ml-1"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                                <input
                                    type="hidden"
                                    {...form.register("recommendedFor")}
                                    value={JSON.stringify(form.watch("recommendedFor"))}
                                />
                            </div>

                            <div className="space-y-2">
                                <FormLabel>Verified By</FormLabel>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Add verification"
                                        {...form.register("newVerification")}
                                    />
                                    <Button type="button" onClick={addVerification} variant="secondary">
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {form.watch("verifiedBy")?.map((item, index) => (
                                        <Badge key={index} variant="secondary">
                                            {item}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const current = form.getValues("verifiedBy") || [];
                                                    form.setValue(
                                                        "verifiedBy",
                                                        current.filter((_, i) => i !== index)
                                                    );
                                                }}
                                                className="ml-1"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                                <input
                                    type="hidden"
                                    {...form.register("verifiedBy")}
                                    value={JSON.stringify(form.watch("verifiedBy"))}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Product Images */}
                    <Card>
                        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                            <CardTitle className="flex items-center gap-2">
                                <ImagePlus className="h-5 w-5" />
                                Product Images
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <Dropzone
                                onDrop={handleImageDrop}
                                accept={{ "image/*": [".jpeg", ".jpg", ".png", ".webp"] }}
                                maxFiles={5}
                                disabled={form.watch("images")?.length >= 5}
                            >
                                {({ getRootProps, getInputProps }) => (
                                    <div
                                        {...getRootProps()}
                                        className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                                    >
                                        <input {...getInputProps()} />
                                        <ImagePlus className="mx-auto h-12 w-12 text-gray-400" />
                                        <p className="mt-2">Drag & drop images here</p>
                                        <p className="text-sm text-muted-foreground">
                                            Upload up to 5 images (max 4MB each)
                                        </p>
                                    </div>
                                )}
                            </Dropzone>

                            {uploadProgress > 0 && uploadProgress < 100 && (
                                <Progress value={uploadProgress} className="h-2" />
                            )}

                            <div className="grid grid-cols-3 gap-2 mt-4">
                                {form.watch("images")?.map((image, index) => (
                                    <div
                                        key={index}
                                        className="relative aspect-square rounded-md overflow-hidden border"
                                    >
                                        <Image
                                            src={image}
                                            alt={`Product image ${index + 1}`}
                                            width={200}
                                            height={200}
                                            className="object-cover w-full h-full"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm hover:bg-red-50"
                                        >
                                            <X className="h-3 w-3 text-red-500" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <input
                                type="hidden"
                                {...form.register("images")}
                                value={JSON.stringify(form.watch("images"))}
                            />
                            <FormMessage>
                                {form.formState.errors.images?.message}
                            </FormMessage>
                        </CardContent>
                    </Card>

                    {/* Product Description */}
                    <Card>
                        <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50">
                            <CardTitle className="flex items-center gap-2">
                                <Layers className="h-5 w-5" />
                                Product Description
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description *</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Main product description"
                                                rows={5}
                                                className="min-h-[120px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="technicalDetails"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Technical Details</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Additional technical information"
                                                rows={5}
                                                className="min-h-[120px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* Pricing & Inventory */}
                    <Card>
                        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                            <CardTitle className="flex items-center gap-2">
                                <Tag className="h-5 w-5" />
                                Pricing & Inventory
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price ($) *</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                placeholder="0.00"
                                                {...field}
                                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="discount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Discount (%)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min="0"
                                                max="100"
                                                placeholder="0"
                                                {...field}
                                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="stock"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Stock Quantity *</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min="0"
                                                placeholder="0"
                                                {...field}
                                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <SubmitButton />
                </form>
            </Form>

            {/* Live Preview */}
            <div className="lg:col-span-1 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Product Preview</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                {form.watch("images")?.[0] ? (
                                    <Image
                                        src={form.watch("images")[0]}
                                        alt="Product preview"
                                        width={400}
                                        height={400}
                                        className="object-cover"
                                    />
                                ) : (
                                    <ImagePlus className="h-12 w-12 text-gray-400" />
                                )}
                            </div>

                            <div>
                                <h3 className="font-bold text-xl">
                                    {form.watch("name") || "Product Name"}
                                </h3>
                                <p className="text-muted-foreground">
                                    {form.watch("category") || "Category"}
                                </p>
                            </div>

                            {form.watch("recommendedFor")?.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {form.watch("recommendedFor")?.map((tag, index) => (
                                        <Badge key={index} variant="outline">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            )}

                            <div>
                                {form.watch("discount") > 0 ? (
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl font-bold">
                                            ${(form.watch("price") * (1 - form.watch("discount") / 100)).toFixed(2)}
                                        </span>
                                        <span className="line-through text-muted-foreground">
                                            ${form.watch("price")?.toFixed(2)}
                                        </span>
                                        <Badge variant="destructive">
                                            -{form.watch("discount")}%
                                        </Badge>
                                    </div>
                                ) : (
                                    <span className="text-2xl font-bold">
                                        ${form.watch("price")?.toFixed(2) || "0.00"}
                                    </span>
                                )}
                                <p className="text-sm text-muted-foreground">
                                    {form.watch("stock") || 0} in stock
                                </p>
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-medium">Description</h4>
                                <p className="text-sm text-muted-foreground">
                                    {form.watch("description") || "No description provided"}
                                </p>
                            </div>

                            {form.watch("technicalDetails") && (
                                <div className="space-y-2">
                                    <h4 className="font-medium">Technical Details</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {form.watch("technicalDetails")}
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full" size="lg" disabled={pending}>
            {pending ? "Saving Product..." : "Save Product"}
        </Button>
    );
}