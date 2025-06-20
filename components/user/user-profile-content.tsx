"use client"

import React from "react"
import { SessionProvider } from "next-auth/react"
import { UserSidebar } from "@/components/user/user-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Phone, Calendar, MapPin, Edit, Save } from "lucide-react"
import { ProfileImageUpload } from "@/components/user/profile-image-upload"
import { toast } from "sonner"

interface UserProfileContentProps {
  session: any
}

export function UserProfileContent({ session }: UserProfileContentProps) {
  const [profileData, setProfileData] = React.useState({
    firstName: session.user.name?.split(' ')[0] || '',
    lastName: session.user.name?.split(' ').slice(1).join(' ') || '',
    email: session.user.email || '',
    phone: '',
    bio: ''
  })
  const [currentImage, setCurrentImage] = React.useState(session.user.image)
  const [saving, setSaving] = React.useState(false)
  const [loading, setLoading] = React.useState(true)

  // Load profile data on component mount
  React.useEffect(() => {
    loadProfileData()
  }, [])

  const loadProfileData = async () => {
    try {
      setLoading(true)
      console.log('🔄 Loading profile data from API')

      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const data = await response.json()
        console.log('📋 Loaded profile data:', data.profile)

        setProfileData({
          firstName: data.profile.firstName || '',
          lastName: data.profile.lastName || '',
          email: data.profile.email || '',
          phone: data.profile.phone || '',
          bio: data.profile.bio || ''
        })
        setCurrentImage(data.profile.image)
      } else {
        console.error('Failed to load profile data from API, using session data')
        // Fallback to session data
        const nameParts = session.user.name?.split(' ') || []
        setProfileData({
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          email: session.user.email || '',
          phone: '',
          bio: ''
        })
        setCurrentImage(session.user.image)
      }
    } catch (error) {
      console.error('Error loading profile data:', error)
      console.log('🔄 Using session data as fallback')

      // Fallback to session data
      const nameParts = session.user.name?.split(' ') || []
      setProfileData({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: session.user.email || '',
        phone: '',
        bio: ''
      })
      setCurrentImage(session.user.image)

      // Don't show error toast for fallback, just log it
      console.log('📝 Profile loaded from session data')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpdate = (newImageUrl: string) => {
    console.log('🖼️ Profile image updated:', newImageUrl)
    setCurrentImage(newImageUrl) // Update the image immediately in UI
    // Note: Success toast is already shown by the upload component
  }

  const handleSaveProfile = async () => {
    try {
      setSaving(true)

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      })

      if (response.ok) {
        const data = await response.json()
        toast.success('Profile updated successfully!')

        // Try to reload profile data, but don't fail if it doesn't work
        try {
          await loadProfileData()
        } catch (reloadError) {
          // Silent error handling
        }
      } else {
        const errorData = await response.json()
        toast.error(`Erreur lors de la mise à jour: ${errorData.error || 'Erreur inconnue'}`)
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du profil')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <SessionProvider session={session}>
      <SidebarProvider>
        <UserSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col bg-gradient-to-br from-blue-50/30 via-white to-blue-100/20 min-h-screen">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-8 py-8 md:py-10">
                
                {/* Header - Responsive */}
                <div className="px-4 sm:px-6 lg:px-6">
                  <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                        <User className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
                        <span>My Profile</span>
                      </h1>
                      <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
                        Manage your personal information and account settings
                      </p>
                    </div>
                  </div>
                </div>

                {/* Profile Content - Responsive */}
                <div className="px-4 sm:px-6 lg:px-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    
                    {/* Profile Picture Card - Responsive */}
                    <Card className="border border-gray-200/50 shadow-xl bg-gradient-to-br from-white to-gray-50/30 backdrop-blur-sm">
                      <CardHeader className="text-center p-4 sm:p-6">
                        <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">Profile Picture</CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-col items-center space-y-3 sm:space-y-4 p-4 sm:p-6">
                        {loading ? (
                          <div className="flex items-center justify-center h-24 sm:h-32">
                            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600"></div>
                          </div>
                        ) : (
                          <ProfileImageUpload
                            currentImage={currentImage}
                            userName={`${profileData.firstName} ${profileData.lastName}`.trim() || session.user.name}
                            onImageUpdate={handleImageUpdate}
                          />
                        )}
                        {!loading && (
                          <div className="text-center">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                              {`${profileData.firstName} ${profileData.lastName}`.trim() || session.user.name || 'User'}
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600 break-all">{profileData.email || session.user.email}</p>
                            <Badge variant="secondary" className="mt-2 text-xs sm:text-sm">
                              {session.user.role || 'Customer'}
                            </Badge>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Personal Information Card - Responsive */}
                    <Card className="lg:col-span-2 border border-gray-200/50 shadow-xl bg-gradient-to-br from-white to-gray-50/30 backdrop-blur-sm">
                      <CardHeader className="border-b border-gray-100/50 bg-gradient-to-r from-white to-gray-50/50 p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 tracking-tight flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                              <div className="w-2 h-6 sm:h-8 bg-gradient-to-b from-blue-600 to-blue-500 rounded-full"></div>
                              <span>Personal Information</span>
                            </CardTitle>
                            <CardDescription className="text-sm sm:text-base text-gray-600 font-medium mt-1 sm:mt-0">
                              Update your personal details and contact information
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="p-4 sm:p-6">
                        {loading ? (
                          <div className="flex items-center justify-center h-64">
                            <div className="text-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                              <p className="text-gray-600">Loading profile data...</p>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700">
                              First Name
                            </Label>
                            <Input
                              id="firstName"
                              value={profileData.firstName}
                              onChange={(e) => handleInputChange('firstName', e.target.value)}
                              className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700">
                              Last Name
                            </Label>
                            <Input
                              id="lastName"
                              value={profileData.lastName}
                              onChange={(e) => handleInputChange('lastName', e.target.value)}
                              className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                              Email Address
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              value={profileData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                              Phone Number
                            </Label>
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="+216 XX XXX XXX"
                              value={profileData.phone}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                              className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                            />
                          </div>

                          <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="bio" className="text-sm font-semibold text-gray-700">
                              Bio
                            </Label>
                            <Textarea
                              id="bio"
                              placeholder="Parlez-nous de vous..."
                              value={profileData.bio}
                              onChange={(e) => handleInputChange('bio', e.target.value)}
                              className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 min-h-[80px] sm:min-h-[100px] text-sm sm:text-base"
                            />
                          </div>
                        </div>
                        
                            <div className="flex flex-col sm:flex-row justify-end mt-4 sm:mt-6">
                              <Button
                                onClick={handleSaveProfile}
                                disabled={saving || loading}
                                className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto text-sm sm:text-base"
                              >
                                {saving ? (
                                  <>
                                    <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white mr-2"></div>
                                    <span className="hidden sm:inline">Enregistrement...</span>
                                    <span className="sm:hidden">Saving...</span>
                                  </>
                                ) : (
                                  <>
                                    <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                                    <span className="hidden sm:inline">Enregistrer les modifications</span>
                                    <span className="sm:hidden">Save Changes</span>
                                  </>
                                )}
                              </Button>
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>

                    {/* Account Information Card - Responsive */}
                    <Card className="lg:col-span-3 border border-gray-200/50 shadow-xl bg-gradient-to-br from-white to-gray-50/30 backdrop-blur-sm">
                      <CardHeader className="border-b border-gray-100/50 bg-gradient-to-r from-white to-gray-50/50 p-4 sm:p-6">
                        <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 tracking-tight flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                          <div className="w-2 h-6 sm:h-8 bg-gradient-to-b from-green-600 to-green-500 rounded-full"></div>
                          <span>Account Information</span>
                        </CardTitle>
                        <CardDescription className="text-sm sm:text-base text-gray-600 font-medium mt-1 sm:mt-0">
                          View your account details and membership information
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="p-4 sm:p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                          <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-blue-50 rounded-lg">
                            <div className="p-2 sm:p-3 bg-blue-100 rounded-full flex-shrink-0">
                              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-blue-600" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs sm:text-sm font-medium text-gray-600">Member Since</p>
                              <p className="text-sm sm:text-base md:text-lg font-bold text-gray-900 truncate">
                                {new Date(session.user.createdAt || Date.now()).toLocaleDateString('en-US', {
                                  month: 'long',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-green-50 rounded-lg">
                            <div className="p-2 sm:p-3 bg-green-100 rounded-full flex-shrink-0">
                              <User className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-green-600" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs sm:text-sm font-medium text-gray-600">Account Type</p>
                              <p className="text-sm sm:text-base md:text-lg font-bold text-gray-900 truncate">{session.user.role || 'Customer'}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-purple-50 rounded-lg sm:col-span-2 lg:col-span-1">
                            <div className="p-2 sm:p-3 bg-purple-100 rounded-full flex-shrink-0">
                              <Mail className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-purple-600" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs sm:text-sm font-medium text-gray-600">Email Status</p>
                              <p className="text-sm sm:text-base md:text-lg font-bold text-gray-900 truncate">
                                {session.user.emailVerified ? 'Verified' : 'Unverified'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                  </div>
                </div>

              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </SessionProvider>
  )
}
