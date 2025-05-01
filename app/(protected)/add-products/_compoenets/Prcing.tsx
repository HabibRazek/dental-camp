"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Edit3, Tag } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

type FormValues = {
  pricing: {
    price: number;
    hasPromotion: boolean;
    promotion: number;
    quantity: number;
  };
};

function Pricing() {
  const {
    register,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useFormContext<FormValues>();

  const pricing = watch("pricing") || {
    price: 0,
    hasPromotion: false,
    promotion: 0,
    quantity: 0,
  };

  const { price, hasPromotion, promotion, quantity } = pricing;

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setValue("pricing.price", value);
    trigger("pricing.price");
  };

  const handlePromotionToggle = (checked: boolean) => {
    setValue("pricing.hasPromotion", checked);
    if (!checked) {
      setValue("pricing.promotion", 0);
    }
    trigger(["pricing.hasPromotion", "pricing.promotion"]);
  };

  const handlePromotionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value) || 0;
    value = Math.min(100, Math.max(0, value));
    setValue("pricing.promotion", value);
    trigger("pricing.promotion");
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setValue("pricing.quantity", value);
    trigger("pricing.quantity");
  };

  const incrementQuantity = () => {
    const newValue = quantity + 1;
    setValue("pricing.quantity", newValue);
    trigger("pricing.quantity");
  };

  const decrementQuantity = () => {
    const newValue = Math.max(0, quantity - 1);
    setValue("pricing.quantity", newValue);
    trigger("pricing.quantity");
  };

  const calculateDiscountedPrice = () => {
    if (!hasPromotion || promotion <= 0) return price;
    return price * (1 - promotion / 100);
  };

  const discountedPrice = calculateDiscountedPrice();

  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 flex justify-between items-center border-b">
        <h3 className="font-semibold flex items-center">
          <Tag className="mr-2 h-4 w-4" />
          Pricing & Inventory
        </h3>
        <Button variant="ghost" size="sm">
          <Edit3 className="h-4 w-4" />
        </Button>
      </div>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label
                htmlFor="price"
                className="text-xs uppercase text-muted-foreground"
              >
                Price
              </Label>
              {errors.pricing?.price && (
                <span className="text-xs text-red-500">
                  {errors.pricing.price.message}
                </span>
              )}
            </div>
            <Input
              type="number"
              id="price"
              placeholder="$0.00"
              min={0}
              step="0.01"
              value={price}
              {...register("pricing.price", {
                required: "Price is required",
                min: { value: 0, message: "Price must be positive" },
                onChange: handlePriceChange,
                valueAsNumber: true,
              })}
            />
          </div>

          <div className="flex flex-col space-y-2 p-4 bg-slate-100 rounded-md">
            <div className="flex justify-between items-center">
              <span>Promotion %</span>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  id="promotion"
                  placeholder="0%"
                  className="w-16 text-center"
                  disabled={!hasPromotion}
                  max={100}
                  min={0}
                  value={promotion}
                  {...register("pricing.promotion", {
                    onChange: handlePromotionChange,
                    validate: (value) =>
                      !hasPromotion || value <= 100 || "Max discount is 100%",
                  
                  
                  })}
                />
                {/* <Switch
                  id="promotion-toggle"
                  checked={hasPromotion}
                  onCheckedChange={handlePromotionToggle}
                /> */}
              </div>
            </div>
            {!hasPromotion ? (
              <span className="text-xs text-muted-foreground">
                Enable to apply a discount percentage to the product price.
              </span>
            ) : (
              <div className="text-xs text-muted-foreground">
                {errors.pricing?.promotion ? (
                  <span className="text-red-500">
                    {errors.pricing.promotion.message}
                  </span>
                ) : (
                  <>
                    <span>
                      Until you remove the promotion, the product will be sold
                      at a new price:{" "}
                    </span>
                    <strong>
                      ${discountedPrice.toFixed(2)} (save {promotion}%)
                    </strong>
                  </>
                )}
              </div>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <Label
                htmlFor="quantity"
                className="text-xs uppercase text-muted-foreground"
              >
                Quantity in Stock
              </Label>
              {errors.pricing?.quantity && (
                <span className="text-xs text-red-500">
                  {errors.pricing.quantity.message}
                </span>
              )}
            </div>
            <div className="flex items-center mt-1">
              <Button
                variant="outline"
                size="icon"
                className="rounded-r-none"
                onClick={decrementQuantity}
                type="button"
              >
                -
              </Button>
              <Input
                id="quantity"
                type="number"
                className="rounded-none text-center"
                min={0}
                value={quantity}
                {...register("pricing.quantity", {
                  required: "Quantity is required",
                  min: { value: 0, message: "Quantity must be positive" },
                  onChange: handleQuantityChange,
                  valueAsNumber: true,
                })}
              />
              <Button
                variant="outline"
                size="icon"
                className="rounded-l-none"
                onClick={incrementQuantity}
                type="button"
              >
                +
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default Pricing;
