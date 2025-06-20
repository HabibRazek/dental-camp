"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  Shield,
  Smartphone,
  Eye,
  EyeOff,
  AlertTriangle,
  Lock,
  RefreshCw,
  Save
} from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"

interface SecuritySettings {
  loginNotifications: boolean
  sessionTimeout: number
  passwordExpiry: number
  ipWhitelist: string[]
}

interface LoginSession {
  id: string
  device: string
  location: string
  ipAddress: string
  lastActive: string
  current: boolean
}

export default function SecurityPage() {
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  })

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    loginNotifications: true,
    sessionTimeout: 30,
    passwordExpiry: 90,
    ipWhitelist: []
  })

  // Load security settings from API
  useEffect(() => {
    const loadSecuritySettings = async () => {
      try {
        const response = await fetch('/api/security')
        if (response.ok) {
          const data = await response.json()
          setSecuritySettings(data)
        }
      } catch (error) {
        console.error('Failed to load security settings:', error)
        toast.error('Failed to load security settings')
      } finally {
        setInitialLoading(false)
      }
    }

    loadSecuritySettings()
  }, [])

  const [activeSessions] = useState<LoginSession[]>([
    {
      id: "1",
      device: "Chrome on Windows",
      location: "Tunis, Tunisia",
      ipAddress: "192.168.1.100",
      lastActive: "2 minutes ago",
      current: true
    },
    {
      id: "2",
      device: "Safari on iPhone",
      location: "Tunis, Tunisia",
      ipAddress: "192.168.1.101",
      lastActive: "1 hour ago",
      current: false
    },
    {
      id: "3",
      device: "Firefox on Mac",
      location: "Sfax, Tunisia",
      ipAddress: "41.230.45.123",
      lastActive: "2 days ago",
      current: false
    }
  ])

  const handleChangePassword = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      toast.error("Please fill in all password fields")
      return
    }

    if (passwords.new !== passwords.confirm) {
      toast.error("New passwords do not match")
      return
    }

    if (passwords.new.length < 8) {
      toast.error("Password must be at least 8 characters long")
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/security', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'password',
          data: {
            currentPassword: passwords.current,
            newPassword: passwords.new,
            confirmPassword: passwords.confirm
          }
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to change password')
      }

      toast.success("Password changed successfully!")
      setPasswords({ current: "", new: "", confirm: "" })
    } catch (error) {
      console.error('Change password error:', error)
      const errorMessage = error instanceof Error ? error.message : "Failed to change password"
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSecuritySettings = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/security', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'settings',
          data: securitySettings
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save settings')
      }

      toast.success("Security settings saved successfully!")
    } catch (error) {
      console.error('Save security settings error:', error)
      const errorMessage = error instanceof Error ? error.message : "Failed to save security settings"
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }



  const handleTerminateSession = (sessionId: string) => {
    toast.success("Session terminated successfully")
  }



  if (initialLoading) {
    return (
      <DashboardLayout
        title="Security"
        description="Manage your account security settings and authentication preferences"
      >
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-600">Loading security settings...</span>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      title="Security"
      description="Manage your account security settings and authentication preferences"
    >
      <div className="space-y-8">
        {/* Security Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Account Security</CardTitle>
                <Shield className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Strong</div>
                <p className="text-xs text-muted-foreground">Security level is good</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                <Smartphone className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{activeSessions.length}</div>
                <p className="text-xs text-muted-foreground">Devices logged in</p>
              </CardContent>
            </Card>
          </motion.div>


        </div>

        {/* Change Password */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Change Password
              </CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwords.current}
                      onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={passwords.new}
                      onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwords.confirm}
                      onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Le mot de passe doit contenir au moins 8 caractères et inclure des majuscules, minuscules, chiffres et caractères spéciaux.
                </AlertDescription>
              </Alert>

              <div className="flex justify-end">
                <Button onClick={handleChangePassword} disabled={loading}>
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Modification...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Changer le mot de passe
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>


      </div>
    </DashboardLayout>
  )
}
