"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Edit3, Package, Plus, X } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { FormMessage } from "@/components/ui/form";
import React from "react";

type FormValues = {
  identity: {
    name: string;
    category: string;
    recommendedFor: string[];
    verifiedBy: string[];
  };
};

function ProductIdentity() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<FormValues>();

  const recommendedFor = watch("identity.recommendedFor") || [];
  const verifiedBy = watch("identity.verifiedBy") || [];
  const [r, setR] = React.useState<string>("");
  const [v, setV] = React.useState<string>("");

  const handleAddNewRecommendedFor = () => {
    if (r.trim() === "") return;
    setValue("identity.recommendedFor", [...recommendedFor, r]);
    setR("");
  };

  const handleAddNewVerifiedBy = () => {
    if (v.trim() === "") return;
    setValue("identity.verifiedBy", [...verifiedBy, v]);
    setV("");
  };

  const handleRemoveRecommendedFor = (index: number) => {
    const newRecommendedFor = recommendedFor.filter((_, i) => i !== index);
    setValue("identity.recommendedFor", newRecommendedFor);
  };

  const handleRemoveVerifiedBy = (index: number) => {
    const newVerifiedBy = verifiedBy.filter((_, i) => i !== index);
    setValue("identity.verifiedBy", newVerifiedBy);
  };

  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 flex justify-between items-center border-b">
        <h3 className="font-semibold flex items-center">
          <Package className="mr-2 h-4 w-4" />
          Product Identity
        </h3>
        <Button variant="ghost" size="sm">
          <Edit3 className="h-4 w-4" />
        </Button>
      </div>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Name and Brand fields remain the same */}
          <div>
            <Label
              htmlFor="name"
              className="text-xs uppercase text-muted-foreground"
            >
              Name
            </Label>
            <Input
              id="name"
              placeholder="Enter product name"
              className="mt-1"
              {...register("identity.name")}
            />
            {errors.identity?.name && (
              <FormMessage>{errors.identity.name.message}</FormMessage>
            )}
          </div>

          <div>
            <Label
              htmlFor="brand"
              className="text-xs uppercase text-muted-foreground"
            >
              Brand
            </Label>
            <Input
              id="brand"
              placeholder="Product brand"
              className="mt-1"
              {...register("identity.category")}
            />
            {errors.identity?.category && (
              <FormMessage>{errors.identity.category.message}</FormMessage>
            )}
          </div>

          {/* Recommended For Section */}
          <div className="mt-4">
            <Label className="text-xs uppercase text-muted-foreground">
              Recommended for
            </Label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                placeholder="For whom this product is dedicated"
                className="mt-1"
                value={r}
                onChange={(e) => setR(e.target.value)}
              />
              <Button
                variant="primary"
                size="icon"
                type="button"
                className="rounded-r-none"
                onClick={handleAddNewRecommendedFor}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {recommendedFor.map((item, index) => (
                <Badge
                  key={index}
                  className="bg-blue-100 text-blue-800 hover:bg-blue-200 flex items-center gap-1"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => handleRemoveRecommendedFor(index)}
                    className="text-blue-800 hover:text-blue-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Verified By Section */}
          <div className="mt-4">
            <Label className="text-xs uppercase text-muted-foreground">
              Verified By
            </Label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                placeholder="Who verified this product"
                className="mt-1"
                value={v}
                onChange={(e) => setV(e.target.value)}
              />
              <Button
                variant="primary"
                size="icon"
                type="button"
                className="rounded-r-none"
                onClick={handleAddNewVerifiedBy}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {verifiedBy.map((item, index) => (
                <Badge
                  key={index}
                  className="bg-green-100 text-green-800 hover:bg-green-200 flex items-center gap-1"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => handleRemoveVerifiedBy(index)}
                    className="text-green-800 hover:text-green-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProductIdentity;
