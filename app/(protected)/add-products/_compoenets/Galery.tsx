import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Edit3, ImagePlus, Plus } from "lucide-react";

function Galery() {
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
            <ImagePlus className="h-8 w-8 text-slate-400 mb-2" />
            <span className="text-xs text-slate-500">Main Image</span>
          </div>

          <div className="aspect-square bg-slate-100 rounded-md flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-colors border-2 border-dashed">
            <Plus className="h-6 w-6 text-slate-400" />
          </div>

          <div className="aspect-square bg-slate-100 rounded-md flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-colors border-2 border-dashed">
            <Plus className="h-6 w-6 text-slate-400" />
          </div>

          <div className="aspect-square bg-slate-100 rounded-md flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-colors border-2 border-dashed">
            <Plus className="h-6 w-6 text-slate-400" />
          </div>
        </div>

        <div className="mt-4 text-center">
          <Button variant="outline" size="sm" className="w-full">
            <ImagePlus className="h-4 w-4 mr-2" />
            Drag & Drop or Browse
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default Galery;
