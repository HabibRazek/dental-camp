"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Plus, Save } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Prodcut_Identity from "./Prodcut_Identity";
import Galery from "./Galery";
import Descreption_Card from "./Descreption_Card";
import Prcing from "./Prcing";
// import Preview from "./Preview";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Uplaod_Image_Products from "./Uplaod_Image_Products";
import { Quando } from "next/font/google";
import { createProduct } from "@/app/actions/product";

export const ProductCreatorSchema = z.object({
  identity: z.object({
    name: z.string().min(1, "Name is required"),
    category: z.string().min(1, "Category is required"),
    recommendedFor: z.array(z.string()).optional(),
    verifiedBy: z.array(z.string()).optional(),
  }),
  images: z.array(z.string()).min(1, "At least one image is required"),
  descreptions: z.object({
    primary: z.string().min(1, "Primary description is required"),
    technical: z.string().optional(),
  }),
  pricing: z.object({
    price: z.number().min(0.01, "Price must be at least $0.01"),
    hasPromotion: z.boolean(),
    promotion: z.string().optional(),
    quantity: z.number().min(0, "Quantity cannot be negative"),
  }),
});

export default function ProductCreatorWorkspace() {
  const form = useForm({
    resolver: zodResolver(ProductCreatorSchema),
    defaultValues: {
      identity: {
        name: "",
        category: "",
        recommendedFor: [],
        verifiedBy: [],
      },
      images: [],
      descreptions: {
        primary: "",
        technical: "",
      },
      pricing: {
        price: 0,
        hasPromotion: false,
        promotion: undefined,
        quantity: 0,
      },
    },
  });
  if (form.formState.errors) {
    console.log("form", form.formState.errors);
  }
  const handelSubmit = async (data: z.infer<typeof ProductCreatorSchema>) => {
    toast.loading("Creating product...");
    // @ts-ignore
    const res = await createProduct(data);
    console.log("res", res);
    toast.dismiss();
    if (res?.errors) {
      toast.error("Failed to create product", { id: "error" });
      console.log("Error", res.errors);
    } else if (res?.success) {
      toast.success("Product created successfully", { id: "success" });
    }
  };
  console.log("form", form.formState.errors);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with progress indicator */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Product Creator Studio</h1>
            <p className="text-muted-foreground">
              Bring your medical product to life
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm">
            <Badge variant="outline" className="bg-primary text-white">
              1
            </Badge>
            <span className="text-sm font-medium">Details</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <Badge variant="outline">2</Badge>
            <span className="text-sm text-muted-foreground">Pricing</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <Badge variant="outline">3</Badge>
            <span className="text-sm text-muted-foreground">Publish</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left sidebar - Quick actions */}

          {/* Main workspace - 3 columns on large screens */}
          <div className="lg:col-span-5 space-y-6">
            <Tabs defaultValue="canvas" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="canvas">Visual Canvas</TabsTrigger>
                <TabsTrigger value="preview">Customer Preview</TabsTrigger>
                <TabsTrigger value="data">Data View</TabsTrigger>
              </TabsList>

              {/* Visual Canvas Tab */}
              <TabsContent value="canvas" className="mt-6">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit((data: any) => {
                      console.log("valuz", data);
                      alert("Form submitted");
                    })}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Product Identity Card */}
                      <Prodcut_Identity />

                      {/* Visual Gallery Card */}
                      <Uplaod_Image_Products />

                      {/* Description Card */}
                      <Descreption_Card />

                      {/* Pricing & Inventory Card */}
                      <Prcing />
                    </div>
                  </form>
                </Form>
              </TabsContent>

              {/* Preview Tab */}
              {/* <TabsContent value="preview" className="mt-6">
                <Preview />
              </TabsContent> */}

              {/* Data View Tab */}
              {/* <TabsContent value="data" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            Name
                          </Label>
                          <div className="font-medium">Product Name</div>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            Brand
                          </Label>
                          <div className="font-medium">Brand Name</div>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            Categories
                          </Label>
                          <div className="font-medium">Medical, Equipment</div>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            Price
                          </Label>
                          <div className="font-medium">$99.00</div>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            Promotional Price
                          </Label>
                          <div className="font-medium">Not set</div>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            Quantity
                          </Label>
                          <div className="font-medium">100</div>
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs text-muted-foreground">
                          Primary Description
                        </Label>
                        <div className="font-medium">
                          Main product description will appear here.
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs text-muted-foreground">
                          Technical Details
                        </Label>
                        <div className="font-medium">
                          Additional technical information will appear here.
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs text-muted-foreground">
                          Images
                        </Label>
                        <div className="font-medium">0 images uploaded</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent> */}
            </Tabs>

            {/* Action Bar */}
            <div className="flex justify-between items-center bg-white rounded-lg p-4 shadow-sm">
              <Button
                variant="outline"
                // disabled={form.formState.isSubmitting}
                onClick={form.handleSubmit(handelSubmit)}
              >
                Save Draft
              </Button>

              <div className="flex items-center gap-2">
                <Button variant="outline">Preview</Button>
                <Button className="gap-2">
                  <Save className="h-4 w-4" />
                  Publish Product
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Product List Section */}
    </div>
  );
}
