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
  Key, 
  Smartphone, 
  Eye, 
  EyeOff, 
  AlertTriangle,
  CheckCircle,
  Lock,
  Unlock,
  RefreshCw,
  Save,
  Download,
  Trash2
} from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"

interface SecuritySettings {
  twoFactorEnabled: boolean
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
    twoFactorEnabled: false,
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

  const handleEnable2FA = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/security', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: '2fa',
          data: { enabled: true }
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to enable 2FA')
      }

      setSecuritySettings(prev => ({ ...prev, twoFactorEnabled: true }))
      toast.success("Two-factor authentication enabled!")
    } catch (error) {
      console.error('Enable 2FA error:', error)
      const errorMessage = error instanceof Error ? error.message : "Failed to enable two-factor authentication"
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleDisable2FA = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/security', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: '2fa',
          data: { enabled: false }
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to disable 2FA')
      }

      setSecuritySettings(prev => ({ ...prev, twoFactorEnabled: false }))
      toast.success("Two-factor authentication disabled!")
    } catch (error) {
      console.error('Disable 2FA error:', error)
      const errorMessage = error instanceof Error ? error.message : "Failed to disable two-factor authentication"
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleTerminateSession = (sessionId: string) => {
    toast.success("Session terminated successfully")
  }

  const handleDownloadBackupCodes = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/backup-codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        const error = await response.json()

        // Handle specific error cases
        if (error.error?.includes('Two-factor authentication must be enabled')) {
          toast.error("Please enable Two-Factor Authentication first before generating backup codes")
          return
        }

        if (error.error?.includes('Database schema needs to be updated')) {
          toast.warning("Database is being updated automatically. Please try again in a moment.")
          return
        }

        throw new Error(error.error || 'Failed to generate backup codes')
      }

      const data = await response.json()

      // Create downloadable file
      const codesText = [
        'Dental Camp - Backup Codes',
        '================================',
        'Generated: ' + new Date().toLocaleString(),
        '',
        'IMPORTANT: Store these codes in a safe place.',
        'Each code can only be used once.',
        '',
        ...data.codes.map((code: string, index: number) => `${index + 1}. ${code}`)
      ].join('\n')

      const blob = new Blob([codesText], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `dental-camp-backup-codes-${new Date().toISOString().split('T')[0]}.txt`
      a.click()
      URL.revokeObjectURL(url)

      toast.success("Backup codes generated and downloaded successfully!")
    } catch (error) {
      console.error('Generate backup codes error:', error)
      const errorMessage = error instanceof Error ? error.message : "Failed to generate backup codes"
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Two-Factor Auth</CardTitle>
                <Key className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {securitySettings.twoFactorEnabled ? "Enabled" : "Disabled"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {securitySettings.twoFactorEnabled ? "Extra security active" : "Consider enabling"}
                </p>
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
                  Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.
                </AlertDescription>
              </Alert>

              <div className="flex justify-end">
                <Button onClick={handleChangePassword} disabled={loading}>
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Changing...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Change Password
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Two-Factor Authentication */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Two-Factor Authentication
              </CardTitle>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Two-Factor Authentication</span>
                    <Badge variant={securitySettings.twoFactorEnabled ? "default" : "secondary"}>
                      {securitySettings.twoFactorEnabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {securitySettings.twoFactorEnabled 
                      ? "Your account is protected with 2FA" 
                      : "Secure your account with an authenticator app"
                    }
                  </p>
                </div>
                <div className="flex gap-2">
                  {securitySettings.twoFactorEnabled ? (
                    <>
                      <Button variant="outline" onClick={handleDownloadBackupCodes}>
                        <Download className="h-4 w-4 mr-2" />
                        Backup Codes
                      </Button>
                      <Button variant="destructive" onClick={handleDisable2FA} disabled={loading}>
                        <Unlock className="h-4 w-4 mr-2" />
                        Disable
                      </Button>
                    </>
                  ) : (
                    <Button onClick={handleEnable2FA} disabled={loading}>
                      <Lock className="h-4 w-4 mr-2" />
                      Enable 2FA
                    </Button>
                  )}
                </div>
              </div>

              {securitySettings.twoFactorEnabled && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Two-factor authentication is active. Make sure to keep your backup codes in a safe place.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
