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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, Plus, ImagePlus, Package, Layers, Tag } from "lucide-react";
import Dropzone from "react-dropzone";
import Image from "next/image";
import { createProduct } from "@/app/actions/product";

export default function ProductCreatorWorkspace() {
  return <></>;
}
