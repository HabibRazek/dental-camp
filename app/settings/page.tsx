"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Settings,
  Store,
  Mail,
  Bell,
  Save,
  RefreshCw,
  MapPin,
  Phone,
  AtSign
} from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { useSettings } from "@/contexts/settings-context"

interface StoreSettings {
  storeName: string
  storeDescription: string
  storeEmail: string
  storePhone: string
  storeAddress: string
  currency: string
  timezone: string
  language: string
}

interface NotificationSettings {
  emailNotifications: boolean
  orderNotifications: boolean
  stockAlerts: boolean
  customerMessages: boolean
  marketingEmails: boolean
}



export default function SettingsPage() {
  const { language, currency, setLanguage, setCurrency } = useSettings()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    storeName: "Dental Camp",
    storeDescription: "Équipements et fournitures dentaires professionnels pour les professionnels dentaires",
    storeEmail: "contact@dentalcamp.com",
    storePhone: "+216 12 345 678",
    storeAddress: "123 Rue Dentaire, Tunis, Tunisie",
    currency: currency,
    timezone: "Africa/Tunis",
    language: language
  })

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    orderNotifications: true,
    stockAlerts: true,
    customerMessages: true,
    marketingEmails: false
  })



  // Load settings from API
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/settings')
        if (response.ok) {
          const data = await response.json()
          setStoreSettings(data.store)
          setNotifications(data.notifications)
        }
      } catch (error) {
        console.error('Failed to load settings:', error)
        toast.error('Failed to load settings')
      } finally {
        setInitialLoading(false)
      }
    }

    loadSettings()
  }, [])

  const handleSaveStoreSettings = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'store',
          data: storeSettings
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save settings')
      }

      toast.success("Store settings saved successfully!")
    } catch (error) {
      console.error('Save store settings error:', error)
      const errorMessage = error instanceof Error ? error.message : "Failed to save store settings"
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveNotifications = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'notifications',
          data: notifications
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save settings')
      }

      toast.success("Notification settings saved successfully!")
    } catch (error) {
      console.error('Save notification settings error:', error)
      const errorMessage = error instanceof Error ? error.message : "Failed to save notification settings"
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }



  if (initialLoading) {
    return (
      <DashboardLayout
        title="Settings"
        description="Configure your store settings, notifications, and preferences"
      >
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-600">Loading settings...</span>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      title="Settings"
      description="Configure your store settings, notifications, and preferences"
    >
      <div className="space-y-6 sm:space-y-8">
        {/* Header Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
        >
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Store className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-blue-700">Store Status</p>
                  <p className="text-lg sm:text-xl font-bold text-blue-900">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-green-700">Notifications</p>
                  <p className="text-lg sm:text-xl font-bold text-green-900">Enabled</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Tabs defaultValue="store" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-xl">
            <TabsTrigger value="store" className="flex items-center gap-2 text-xs sm:text-sm rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Store className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Store Settings</span>
              <span className="sm:hidden">Store</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2 text-xs sm:text-sm rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Bell className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Notifications</span>
              <span className="sm:hidden">Alerts</span>
            </TabsTrigger>
          </TabsList>

          {/* Store Settings */}
          <TabsContent value="store">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-gradient-to-br from-white to-blue-50/30 border-blue-200/50 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <Store className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    Store Information
                    <Badge variant="secondary" className="ml-auto text-xs">Essential</Badge>
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Basic information about your dental equipment store and contact details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="storeName" className="flex items-center gap-2 text-sm font-medium">
                        <Store className="h-3 w-3 text-blue-600" />
                        Store Name
                      </Label>
                      <Input
                        id="storeName"
                        value={storeSettings.storeName}
                        onChange={(e) => setStoreSettings(prev => ({ ...prev, storeName: e.target.value }))}
                        placeholder="Enter your store name"
                        className="h-10 sm:h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="storeEmail" className="flex items-center gap-2 text-sm font-medium">
                        <AtSign className="h-3 w-3 text-blue-600" />
                        Store Email
                      </Label>
                      <Input
                        id="storeEmail"
                        type="email"
                        value={storeSettings.storeEmail}
                        onChange={(e) => setStoreSettings(prev => ({ ...prev, storeEmail: e.target.value }))}
                        placeholder="contact@yourstore.com"
                        className="h-10 sm:h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="storeDescription" className="flex items-center gap-2 text-sm font-medium">
                      <Mail className="h-3 w-3 text-blue-600" />
                      Store Description
                    </Label>
                    <Textarea
                      id="storeDescription"
                      value={storeSettings.storeDescription}
                      onChange={(e) => setStoreSettings(prev => ({ ...prev, storeDescription: e.target.value }))}
                      rows={3}
                      placeholder="Describe your dental equipment store..."
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="storePhone" className="flex items-center gap-2 text-sm font-medium">
                      <Phone className="h-3 w-3 text-blue-600" />
                      Phone Number
                    </Label>
                    <Input
                      id="storePhone"
                      value={storeSettings.storePhone}
                      onChange={(e) => setStoreSettings(prev => ({ ...prev, storePhone: e.target.value }))}
                      placeholder="+216 XX XXX XXX"
                      className="h-10 sm:h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="storeAddress" className="flex items-center gap-2 text-sm font-medium">
                      <MapPin className="h-3 w-3 text-blue-600" />
                      Store Address
                    </Label>
                    <Textarea
                      id="storeAddress"
                      value={storeSettings.storeAddress}
                      onChange={(e) => setStoreSettings(prev => ({ ...prev, storeAddress: e.target.value }))}
                      rows={2}
                      placeholder="Enter your complete store address..."
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
                    />
                  </div>





                  <Separator />

                  <div className="flex justify-end">
                    <Button onClick={handleSaveStoreSettings} disabled={loading} className="w-full sm:w-auto">
                      {loading ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Enregistrement...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Enregistrer les modifications
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-gradient-to-br from-white to-green-50/30 border-green-200/50 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                    <div className="p-2 bg-green-500 rounded-lg">
                      <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    Notification Preferences
                    <Badge variant="secondary" className="ml-auto text-xs">Alerts</Badge>
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Configure how and when you receive notifications for your store
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-lg border border-gray-200 hover:border-green-300 transition-colors">
                      <div className="space-y-1">
                        <Label className="flex items-center gap-2 text-sm font-medium">
                          <Mail className="h-3 w-3 text-green-600" />
                          Email Notifications
                        </Label>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Receive general email notifications
                        </p>
                      </div>
                      <Switch
                        checked={notifications.emailNotifications}
                        onCheckedChange={(checked) =>
                          setNotifications(prev => ({ ...prev, emailNotifications: checked }))
                        }
                        className="flex-shrink-0"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-lg border border-gray-200 hover:border-green-300 transition-colors">
                      <div className="space-y-1">
                        <Label className="flex items-center gap-2 text-sm font-medium">
                          <Settings className="h-3 w-3 text-green-600" />
                          Order Notifications
                        </Label>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Get notified about new orders and order updates
                        </p>
                      </div>
                      <Switch
                        checked={notifications.orderNotifications}
                        onCheckedChange={(checked) =>
                          setNotifications(prev => ({ ...prev, orderNotifications: checked }))
                        }
                        className="flex-shrink-0"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-lg border border-gray-200 hover:border-green-300 transition-colors">
                      <div className="space-y-1">
                        <Label className="flex items-center gap-2 text-sm font-medium">
                          <Store className="h-3 w-3 text-green-600" />
                          Stock Alerts
                        </Label>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Receive alerts when products are running low on stock
                        </p>
                      </div>
                      <Switch
                        checked={notifications.stockAlerts}
                        onCheckedChange={(checked) =>
                          setNotifications(prev => ({ ...prev, stockAlerts: checked }))
                        }
                        className="flex-shrink-0"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-lg border border-gray-200 hover:border-green-300 transition-colors">
                      <div className="space-y-1">
                        <Label className="flex items-center gap-2 text-sm font-medium">
                          <Bell className="h-3 w-3 text-green-600" />
                          Customer Messages
                        </Label>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Get notified when customers send messages
                        </p>
                      </div>
                      <Switch
                        checked={notifications.customerMessages}
                        onCheckedChange={(checked) =>
                          setNotifications(prev => ({ ...prev, customerMessages: checked }))
                        }
                        className="flex-shrink-0"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-lg border border-gray-200 hover:border-green-300 transition-colors">
                      <div className="space-y-1">
                        <Label className="flex items-center gap-2 text-sm font-medium">
                          <Mail className="h-3 w-3 text-green-600" />
                          Marketing Emails
                        </Label>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Receive marketing and promotional emails
                        </p>
                      </div>
                      <Switch
                        checked={notifications.marketingEmails}
                        onCheckedChange={(checked) =>
                          setNotifications(prev => ({ ...prev, marketingEmails: checked }))
                        }
                        className="flex-shrink-0"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-end">
                    <Button onClick={handleSaveNotifications} disabled={loading} className="w-full sm:w-auto">
                      {loading ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>


        </Tabs>
      </div>
    </DashboardLayout>
  )
}
