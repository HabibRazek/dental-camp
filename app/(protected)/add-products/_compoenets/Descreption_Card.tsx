import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit3, Layers } from "lucide-react";
import { useFormContext } from "react-hook-form";

type FormValues = {
  descreptions: {
    primary: string;
    technical: string;
  };
};

function Descreption_Card() {
  const {
    formState: { errors },
    control,
    register,
    watch,
    setValue,
  } = useFormContext<FormValues>();
  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 flex justify-between items-center border-b">
        <h3 className="font-semibold flex items-center">
          <Layers className="mr-2 h-4 w-4" />
          Product Description
        </h3>
        <Button variant="ghost" size="sm">
          <Edit3 className="h-4 w-4" />
        </Button>
      </div>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <Label
              htmlFor="desc1"
              className="text-xs uppercase text-muted-foreground"
            >
              Primary Description
            </Label>
            <Textarea
              id="desc1"
              placeholder="Main product description"
              className="mt-1 resize-none"
              rows={3}
              {...register("descreptions.primary")}
            />
            {errors.descreptions?.primary && (
              <FormMessage>{errors.descreptions.primary.message}</FormMessage>
            )}
          </div>

          <div>
            <Label
              htmlFor="desc2"
              className="text-xs uppercase text-muted-foreground"
            >
              Technical Details
            </Label>
            <Textarea
              id="desc2"
              placeholder="Additional technical information"
              className="mt-1 resize-none"
              rows={3}
              {...register("descreptions.technical")}
            />
            {errors.descreptions?.technical && (
              <FormMessage>{errors.descreptions.technical.message}</FormMessage>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default Descreption_Card;
