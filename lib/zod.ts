import { object, string } from "zod"

export const signInSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
})

// Schema for API validation (without confirmPassword)
export const createUserSchema = object({
  name: string({ required_error: "Name is required" })
    .min(1, "Name is required")
    .min(2, "Name must be more than 2 characters")
    .max(50, "Name must be less than 50 characters"),
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
})

// Schema for frontend form validation (with confirmPassword)
export const signUpSchema = object({
  name: string({ required_error: "Le nom est requis" })
    .min(1, "Le nom est requis")
    .min(2, "Le nom doit contenir plus de 2 caractères")
    .max(50, "Le nom doit contenir moins de 50 caractères"),
  email: string({ required_error: "L'email est requis" })
    .min(1, "L'email est requis")
    .email("Email invalide"),
  password: string({ required_error: "Le mot de passe est requis" })
    .min(1, "Le mot de passe est requis")
    .min(8, "Le mot de passe doit contenir plus de 8 caractères")
    .max(32, "Le mot de passe doit contenir moins de 32 caractères"),
  confirmPassword: string({ required_error: "La confirmation du mot de passe est requise" })
    .min(1, "La confirmation du mot de passe est requise"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
})

export type SignInInput = {
  email: string
  password: string
}

export type SignUpInput = {
  name: string
  email: string
  password: string
  confirmPassword: string
}
