import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// Settings validation schemas
const StoreSettingsSchema = z.object({
  storeName: z.string().min(1, "Store name is required"),
  storeDescription: z.string().optional(),
  storeEmail: z.string().email("Invalid email address"),
  storePhone: z.string().optional(),
  storeAddress: z.string().optional(),
  currency: z.string().min(1, "Currency is required"),
  timezone: z.string().min(1, "Timezone is required"),
  language: z.string().min(1, "Language is required")
})

const NotificationSettingsSchema = z.object({
  emailNotifications: z.boolean(),
  orderNotifications: z.boolean(),
  stockAlerts: z.boolean(),
  customerMessages: z.boolean(),
  marketingEmails: z.boolean()
})

const AppearanceSettingsSchema = z.object({
  theme: z.string(),
  primaryColor: z.string(),
  logoUrl: z.string().optional(),
  faviconUrl: z.string().optional()
})

// GET /api/settings - Get current settings
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get settings from database or return defaults
    const settings = await prisma.setting.findMany()
    
    // Convert array to object for easier access
    const settingsObj = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value
      return acc
    }, {} as Record<string, any>)

    // Return settings with defaults
    const response = {
      store: {
        storeName: settingsObj.storeName || "Dental Camp",
        storeDescription: settingsObj.storeDescription || "Professional dental equipment and supplies",
        storeEmail: settingsObj.storeEmail || "contact@dentalcamp.com",
        storePhone: settingsObj.storePhone || "+216 12 345 678",
        storeAddress: settingsObj.storeAddress || "123 Dental Street, Tunis, Tunisia",
        currency: settingsObj.currency || "TND",
        timezone: settingsObj.timezone || "Africa/Tunis",
        language: settingsObj.language || "en"
      },
      notifications: {
        emailNotifications: settingsObj.emailNotifications === 'true' || true,
        orderNotifications: settingsObj.orderNotifications === 'true' || true,
        stockAlerts: settingsObj.stockAlerts === 'true' || true,
        customerMessages: settingsObj.customerMessages === 'true' || true,
        marketingEmails: settingsObj.marketingEmails === 'true' || false
      },
      appearance: {
        theme: settingsObj.theme || "light",
        primaryColor: settingsObj.primaryColor || "#3b82f6",
        logoUrl: settingsObj.logoUrl || "",
        faviconUrl: settingsObj.faviconUrl || ""
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Settings GET error:', error)
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    )
  }
}

// POST /api/settings - Update settings
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { type, data } = body

    let validatedData
    switch (type) {
      case 'store':
        validatedData = StoreSettingsSchema.parse(data)
        break
      case 'notifications':
        validatedData = NotificationSettingsSchema.parse(data)
        break
      case 'appearance':
        validatedData = AppearanceSettingsSchema.parse(data)
        break
      default:
        return NextResponse.json(
          { error: "Invalid settings type" },
          { status: 400 }
        )
    }

    // Save settings to database
    const settingsToUpdate = Object.entries(validatedData).map(([key, value]) => ({
      key,
      value: typeof value === 'boolean' ? value.toString() : value.toString()
    }))

    // Use upsert to create or update settings
    for (const setting of settingsToUpdate) {
      await prisma.setting.upsert({
        where: { key: setting.key },
        update: { value: setting.value },
        create: { key: setting.key, value: setting.value }
      })
    }

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully"
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      )
    }

    console.error('Settings POST error:', error)
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    )
  }
}
