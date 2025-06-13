"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Settings,
  Bell,
  Shield,
  Mail,
  Smartphone,
  Lock,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  Trash2,
  Download,
  AlertTriangle
} from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"

interface UserSettingsContentProps {
  userId: string
  userEmail: string
}

interface UserSettings {
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
    orderUpdates: boolean
    promotions: boolean
    newsletter: boolean
  }
  privacy: {
    profileVisibility: 'public' | 'private'
    showEmail: boolean
    showPhone: boolean
    dataCollection: boolean
  }
  security: {
    twoFactorEnabled: boolean
    loginAlerts: boolean
    sessionTimeout: number
  }
}

export function UserSettingsContent({ userId, userEmail }: UserSettingsContentProps) {
  console.log('🔍 UserSettingsContent initialized with:', { userId, userEmail })
  const [settings, setSettings] = React.useState<UserSettings>({
    notifications: {
      email: true,
      push: true,
      sms: false,
      orderUpdates: true,
      promotions: false,
      newsletter: true
    },
    privacy: {
      profileVisibility: 'private',
      showEmail: false,
      showPhone: false,
      dataCollection: true
    },
    security: {
      twoFactorEnabled: false,
      loginAlerts: true,
      sessionTimeout: 30
    }
  })

  const [loading, setLoading] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const [activeSection, setActiveSection] = React.useState('notifications')
  const [passwordData, setPasswordData] = React.useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [passwordLoading, setPasswordLoading] = React.useState(false)

  // Load settings from localStorage immediately on mount for better UX
  React.useEffect(() => {
    if (!userId || userId === 'undefined' || userId === 'null') {
      console.warn('⚠️ Invalid userId, skipping localStorage load:', userId)
      return
    }

    const savedSettings = localStorage.getItem(`userSettings_${userId}`)
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings)
        setSettings(parsedSettings)
        console.log('🔄 Loaded settings from localStorage:', parsedSettings)
      } catch (error) {
        console.error('Error parsing saved settings:', error)
        // If parsing fails, save current default settings
        const defaultSettings = {
          notifications: {
            email: true,
            push: true,
            sms: false,
            orderUpdates: true,
            promotions: false,
            newsletter: true
          },
          privacy: {
            profileVisibility: 'private' as const,
            showEmail: false,
            showPhone: false,
            dataCollection: true
          },
          security: {
            twoFactorEnabled: false,
            loginAlerts: true,
            sessionTimeout: 30
          }
        }
        setSettings(defaultSettings)
        localStorage.setItem(`userSettings_${userId}`, JSON.stringify(defaultSettings))
      }
    } else {
      // If no saved settings, save current default settings
      console.log('📝 No saved settings found, using defaults and saving them')
      const defaultSettings = {
        notifications: {
          email: true,
          push: true,
          sms: false,
          orderUpdates: true,
          promotions: false,
          newsletter: true
        },
        privacy: {
          profileVisibility: 'private' as const,
          showEmail: false,
          showPhone: false,
          dataCollection: true
        },
        security: {
          twoFactorEnabled: false,
          loginAlerts: true,
          sessionTimeout: 30
        }
      }
      setSettings(defaultSettings)
      localStorage.setItem(`userSettings_${userId}`, JSON.stringify(defaultSettings))
    }
  }, [userId])

  // Temporarily disable API loading to prevent overriding localStorage
  // React.useEffect(() => {
  //   // Only load from API if we have a valid userId
  //   if (userId && userId !== 'undefined' && userId !== 'null') {
  //     loadUserSettings()
  //   } else {
  //     console.warn('⚠️ Invalid userId, skipping API call:', userId)
  //     toast.error('User session invalid. Please sign in again.')
  //   }
  // }, [userId])

  const loadUserSettings = async () => {
    try {
      console.log('🔄 Loading user settings from API for user:', userId)
      const response = await fetch('/api/user/settings', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      })

      console.log('📡 API Response status:', response.status)

      if (response.ok) {
        const data = await response.json()
        console.log('📋 Loaded settings from API:', data.settings)
        setSettings(data.settings)
        // Update localStorage with fresh data from API
        localStorage.setItem(`userSettings_${userId}`, JSON.stringify(data.settings))
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('Failed to load settings from API:', response.status, errorData)

        // Show specific error message but don't make it too intrusive
        if (response.status === 401) {
          console.warn('⚠️ Authentication issue - using localStorage only')
          // For now, just use localStorage without showing error to user
        } else if (response.status === 500) {
          console.warn('⚠️ Server error - using localStorage only')
          // For now, just use localStorage without showing error to user
        } else {
          console.warn('⚠️ API error - using localStorage only:', errorData.error)
        }

        // Fallback to localStorage
        const savedSettings = localStorage.getItem(`userSettings_${userId}`)
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings)
          setSettings(parsedSettings)
          console.log('📋 Loaded settings from localStorage fallback:', parsedSettings)
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error)
      console.warn('⚠️ Network error - using localStorage only')

      // Fallback to localStorage
      const savedSettings = localStorage.getItem(`userSettings_${userId}`)
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings)
        setSettings(parsedSettings)
        console.log('📋 Loaded settings from localStorage fallback:', parsedSettings)
      }
    }
  }

  const saveSettings = async () => {
    try {
      setLoading(true)
      console.log('💾 Saving settings:', settings)

      // Always save to localStorage first (immediate persistence)
      if (userId && userId !== 'undefined' && userId !== 'null') {
        localStorage.setItem(`userSettings_${userId}`, JSON.stringify(settings))
        console.log('✅ Settings saved to localStorage')
        console.log('💾 Saved settings:', settings)

        // Verify the save worked
        const verification = localStorage.getItem(`userSettings_${userId}`)
        if (verification) {
          console.log('✅ Verification: Settings are in localStorage:', JSON.parse(verification))
        }
      }

      // Try to save to API as well (for sync across devices) - but don't let it fail the save
      try {
        const response = await fetch('/api/user/settings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(settings)
        })

        if (response.ok) {
          const data = await response.json()
          console.log('✅ Settings also saved to API:', data)
          toast.success('Settings saved successfully!')
        } else {
          console.warn('⚠️ API save failed, but localStorage save succeeded')
          toast.success('Settings saved successfully!')
        }
      } catch (apiError) {
        console.warn('⚠️ API save failed, but localStorage save succeeded:', apiError)
        toast.success('Settings saved successfully!')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  const updateSetting = (section: keyof UserSettings, key: string, value: any) => {
    const newSettings = {
      ...settings,
      [section]: {
        ...settings[section],
        [key]: value
      }
    }

    // Update state
    setSettings(newSettings)

    // Immediately save to localStorage for persistence
    if (userId && userId !== 'undefined' && userId !== 'null') {
      localStorage.setItem(`userSettings_${userId}`, JSON.stringify(newSettings))
      console.log(`🔄 Auto-saved setting: ${section}.${key} = ${value}`)
      console.log('💾 Current settings in localStorage:', newSettings)
    }
  }

  const exportData = () => {
    const dataStr = JSON.stringify(settings, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'user-settings.json'
    link.click()
    toast.success('Settings exported successfully!')
  }

  const updatePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast.error('Please fill in all password fields')
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long')
      return
    }

    try {
      setPasswordLoading(true)
      const response = await fetch('/api/user/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      })

      if (response.ok) {
        toast.success('Password updated successfully!')
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to update password')
      }
    } catch (error) {
      console.error('Error updating password:', error)
      toast.error('Failed to update password')
    } finally {
      setPasswordLoading(false)
    }
  }

  const resetSettings = async () => {
    if (confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
      try {
        setLoading(true)

        // Reset to default settings
        const defaultSettings = {
          notifications: {
            email: true,
            push: true,
            sms: false,
            orderUpdates: true,
            promotions: false,
            newsletter: true
          },
          privacy: {
            profileVisibility: 'private' as const,
            showEmail: false,
            showPhone: false,
            dataCollection: true
          },
          security: {
            twoFactorEnabled: false,
            loginAlerts: true,
            sessionTimeout: 30
          }
        }

        setSettings(defaultSettings)

        // Save to API
        const response = await fetch('/api/user/settings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(defaultSettings)
        })

        if (response.ok) {
          localStorage.setItem(`userSettings_${userId}`, JSON.stringify(defaultSettings))
          toast.success('Settings reset to default successfully!')
        } else {
          throw new Error('Failed to reset settings')
        }
      } catch (error) {
        console.error('Error resetting settings:', error)
        toast.error('Failed to reset settings')
      } finally {
        setLoading(false)
      }
    }
  }

  const sections = [
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'security', label: 'Security', icon: Lock }
  ]

  return (
    <div className="px-4 sm:px-6 lg:px-8 space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <Settings className="h-8 w-8 text-blue-500" />
            Settings
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Manage your account preferences and privacy settings
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button
            onClick={saveSettings}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Enregistrer les modifications
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Settings Navigation */}
        <Card className="lg:col-span-1 border border-gray-200/50 shadow-xl bg-gradient-to-br from-white to-gray-50/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">Categories</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 ${
                    activeSection === section.id
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <section.icon className="h-5 w-5" />
                  {section.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Notifications Settings */}
          {activeSection === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border border-gray-200/50 shadow-xl bg-gradient-to-br from-white to-gray-50/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Bell className="h-5 w-5 text-blue-600" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>
                    Choose how you want to be notified about updates and activities
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Communication Channels */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Communication Channels</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg gap-3 sm:gap-0">
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="font-medium">Email</p>
                            <p className="text-sm text-gray-600">Receive notifications via email</p>
                          </div>
                        </div>
                        <Switch
                          checked={settings.notifications.email}
                          onCheckedChange={(checked) => updateSetting('notifications', 'email', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Bell className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium">Push</p>
                            <p className="text-sm text-gray-600">Browser push notifications</p>
                          </div>
                        </div>
                        <Switch
                          checked={settings.notifications.push}
                          onCheckedChange={(checked) => updateSetting('notifications', 'push', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Smartphone className="h-5 w-5 text-purple-600" />
                          <div>
                            <p className="font-medium">SMS</p>
                            <p className="text-sm text-gray-600">Text message notifications</p>
                          </div>
                        </div>
                        <Switch
                          checked={settings.notifications.sms}
                          onCheckedChange={(checked) => updateSetting('notifications', 'sms', checked)}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Notification Types */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Types</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Order Updates</p>
                          <p className="text-sm text-gray-600">Get notified about order status changes</p>
                        </div>
                        <Switch
                          checked={settings.notifications.orderUpdates}
                          onCheckedChange={(checked) => updateSetting('notifications', 'orderUpdates', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Promotions & Offers</p>
                          <p className="text-sm text-gray-600">Receive special offers and discounts</p>
                        </div>
                        <Switch
                          checked={settings.notifications.promotions}
                          onCheckedChange={(checked) => updateSetting('notifications', 'promotions', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Newsletter</p>
                          <p className="text-sm text-gray-600">Monthly newsletter with updates and tips</p>
                        </div>
                        <Switch
                          checked={settings.notifications.newsletter}
                          onCheckedChange={(checked) => updateSetting('notifications', 'newsletter', checked)}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Privacy Settings */}
          {activeSection === 'privacy' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border border-gray-200/50 shadow-xl bg-gradient-to-br from-white to-gray-50/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    Privacy & Data
                  </CardTitle>
                  <CardDescription>
                    Control your privacy settings and data sharing preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="profileVisibility" className="text-base font-semibold">Profile Visibility</Label>
                    <p className="text-sm text-gray-600 mb-3">Choose who can see your profile information</p>
                    <Select
                      value={settings.privacy.profileVisibility}
                      onValueChange={(value: 'public' | 'private') => updateSetting('privacy', 'profileVisibility', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public - Anyone can see</SelectItem>
                        <SelectItem value="private">Private - Only you can see</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Information Sharing</h3>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Show Email Address</p>
                        <p className="text-sm text-gray-600">Allow others to see your email address</p>
                      </div>
                      <Switch
                        checked={settings.privacy.showEmail}
                        onCheckedChange={(checked) => updateSetting('privacy', 'showEmail', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Show Phone Number</p>
                        <p className="text-sm text-gray-600">Allow others to see your phone number</p>
                      </div>
                      <Switch
                        checked={settings.privacy.showPhone}
                        onCheckedChange={(checked) => updateSetting('privacy', 'showPhone', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Data Collection</p>
                        <p className="text-sm text-gray-600">Allow us to collect usage data to improve our service</p>
                      </div>
                      <Switch
                        checked={settings.privacy.dataCollection}
                        onCheckedChange={(checked) => updateSetting('privacy', 'dataCollection', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}



          {/* Security Settings */}
          {activeSection === 'security' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border border-gray-200/50 shadow-xl bg-gradient-to-br from-white to-gray-50/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Lock className="h-5 w-5 text-red-600" />
                    Security & Authentication
                  </CardTitle>
                  <CardDescription>
                    Manage your account security and authentication settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Password Change */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter current password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          placeholder="Enter new password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Confirm new password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        />
                      </div>
                    </div>
                    <Button
                      className="mt-4"
                      onClick={updatePassword}
                      disabled={passwordLoading}
                    >
                      {passwordLoading ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : null}
                      Update Password
                    </Button>
                  </div>

                  <Separator />

                  {/* Security Options */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Security Options</h3>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={settings.security.twoFactorEnabled}
                          onCheckedChange={(checked) => updateSetting('security', 'twoFactorEnabled', checked)}
                        />
                        {settings.security.twoFactorEnabled && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">Enabled</Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                      <div>
                        <p className="font-medium">Login Alerts</p>
                        <p className="text-sm text-gray-600">Get notified when someone logs into your account</p>
                      </div>
                      <Switch
                        checked={settings.security.loginAlerts}
                        onCheckedChange={(checked) => updateSetting('security', 'loginAlerts', checked)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="sessionTimeout" className="text-base font-semibold">Session Timeout</Label>
                    <p className="text-sm text-gray-600 mb-3">Automatically log out after inactivity (minutes)</p>
                    <Select
                      value={settings.security.sessionTimeout.toString()}
                      onValueChange={(value) => updateSetting('security', 'sessionTimeout', parseInt(value))}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Danger Zone */}
          <Card className="border border-red-200/50 shadow-xl bg-gradient-to-br from-red-50/30 to-white backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-red-900 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Irreversible and destructive actions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                <div>
                  <p className="font-medium text-red-900">Reset All Settings</p>
                  <p className="text-sm text-red-600">Reset all settings to their default values</p>
                </div>
                <Button variant="outline" onClick={resetSettings} className="border-red-200 text-red-700 hover:bg-red-50">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                <div>
                  <p className="font-medium text-red-900">Delete Account</p>
                  <p className="text-sm text-red-600">Permanently delete your account and all data</p>
                </div>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
