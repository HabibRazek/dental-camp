"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Building, 
  Calendar, 
  Clock, 
  User, 
  MessageSquare, 
  Send,
  Loader2,
  AlertCircle,
  Globe,
  Monitor,
  MapPin
} from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { motion } from "framer-motion"

interface ContactMessage {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  subject: string
  message: string
  status: 'UNREAD' | 'READ' | 'IN_PROGRESS' | 'RESOLVED' | 'ARCHIVED'
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'
  adminResponse?: string
  respondedAt?: string
  respondedBy?: string
  ipAddress?: string
  userAgent?: string
  source?: string
  createdAt: string
  updatedAt: string
}

export default function MessageDetailPage() {
  const params = useParams()
  const router = useRouter()
  const messageId = Array.isArray(params.id) ? params.id[0] : params.id

  const [message, setMessage] = useState<ContactMessage | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [adminResponse, setAdminResponse] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch message data
  useEffect(() => {
    const fetchMessage = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(`/api/contact/${messageId}`)

        if (!response.ok) {
          if (response.status === 404) {
            setError("Message not found")
            return
          }
          throw new Error("Failed to fetch message")
        }

        const data = await response.json()
        setMessage(data.message)
        setAdminResponse(data.message.adminResponse || "")

      } catch (error) {
        console.error('Failed to fetch message:', error)
        setError("Failed to load message data")
      } finally {
        setIsLoading(false)
      }
    }

    if (messageId) {
      fetchMessage()
    }
  }, [messageId])

  const handleStatusChange = async (newStatus: string) => {
    if (!message) return

    try {
      const response = await fetch(`/api/contact/${messageId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      setMessage(prev => prev ? { ...prev, status: newStatus as ContactMessage['status'] } : null)
      toast.success('Status updated successfully')
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Failed to update status')
    }
  }

  const handlePriorityChange = async (newPriority: string) => {
    if (!message) return

    try {
      const response = await fetch(`/api/contact/${messageId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priority: newPriority }),
      })

      if (!response.ok) {
        throw new Error('Failed to update priority')
      }

      setMessage(prev => prev ? { ...prev, priority: newPriority as ContactMessage['priority'] } : null)
      toast.success('Priority updated successfully')
    } catch (error) {
      console.error('Error updating priority:', error)
      toast.error('Failed to update priority')
    }
  }

  const handleSubmitResponse = async () => {
    if (!message || !adminResponse.trim()) {
      toast.error('Please enter a response')
      return
    }

    try {
      setIsSubmitting(true)
      const response = await fetch(`/api/contact/${messageId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          adminResponse: adminResponse.trim(),
          status: 'RESOLVED'
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit response')
      }

      const data = await response.json()
      setMessage(data.message)
      toast.success('Response sent successfully')
    } catch (error) {
      console.error('Error submitting response:', error)
      toast.error('Failed to submit response')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    const styles = {
      UNREAD: "bg-red-100 text-red-800 border-red-200",
      READ: "bg-blue-100 text-blue-800 border-blue-200",
      IN_PROGRESS: "bg-yellow-100 text-yellow-800 border-yellow-200",
      RESOLVED: "bg-green-100 text-green-800 border-green-200",
      ARCHIVED: "bg-gray-100 text-gray-800 border-gray-200"
    }
    return styles[status as keyof typeof styles] || styles.READ
  }

  // Get priority badge styling
  const getPriorityBadge = (priority: string) => {
    const styles = {
      LOW: "bg-gray-100 text-gray-800 border-gray-200",
      NORMAL: "bg-blue-100 text-blue-800 border-blue-200",
      HIGH: "bg-orange-100 text-orange-800 border-orange-200",
      URGENT: "bg-red-100 text-red-800 border-red-200"
    }
    return styles[priority as keyof typeof styles] || styles.NORMAL
  }

  // Loading state
  if (isLoading) {
    return (
      <DashboardLayout
        title="Message Details"
        description="View and manage customer message"
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading message...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout
        title="Message Details"
        description="View and manage customer message"
      >
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/admin/messages">
              <Button variant="ghost" className="mb-4 hover:bg-blue-50 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Messages
              </Button>
            </Link>
          </div>

          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Error:</strong> {error}
            </AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    )
  }

  if (!message) {
    return null
  }

  return (
    <DashboardLayout
      title={`Message from ${message.name}`}
      description={`Customer inquiry: ${message.subject}`}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/admin/messages">
            <Button variant="ghost" className="hover:bg-blue-50 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Messages
            </Button>
          </Link>

          <div className="flex items-center gap-3">
            <Badge className={`${getStatusBadge(message.status)} border`}>
              {message.status.replace('_', ' ')}
            </Badge>
            <Badge className={`${getPriorityBadge(message.priority)} border`}>
              {message.priority}
            </Badge>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Message Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                    Customer Message
                  </CardTitle>
                  <CardDescription>
                    Subject: {message.subject}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                      {message.message}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Admin Response */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5 text-green-600" />
                    Admin Response
                  </CardTitle>
                  <CardDescription>
                    {message.adminResponse ? 'Response sent' : 'Compose your response'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {message.adminResponse && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800 font-medium mb-2">Previous Response:</p>
                      <p className="text-green-700 whitespace-pre-wrap">{message.adminResponse}</p>
                      {message.respondedAt && (
                        <p className="text-xs text-green-600 mt-2">
                          Sent on {formatDate(message.respondedAt)}
                          {message.respondedBy && ` by ${message.respondedBy}`}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="space-y-3">
                    <Label htmlFor="response">New Response</Label>
                    <Textarea
                      id="response"
                      placeholder="Type your response here..."
                      value={adminResponse}
                      onChange={(e) => setAdminResponse(e.target.value)}
                      rows={6}
                      className="resize-none"
                    />
                    <Button
                      onClick={handleSubmitResponse}
                      disabled={isSubmitting || !adminResponse.trim()}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Response
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="font-medium">{message.name}</p>
                        <p className="text-sm text-gray-500">Customer Name</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="font-medium">{message.email}</p>
                        <p className="text-sm text-gray-500">Email Address</p>
                      </div>
                    </div>

                    {message.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium">{message.phone}</p>
                          <p className="text-sm text-gray-500">Phone Number</p>
                        </div>
                      </div>
                    )}

                    {message.company && (
                      <div className="flex items-center gap-3">
                        <Building className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium">{message.company}</p>
                          <p className="text-sm text-gray-500">Company</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Message Management */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Message Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={message.status} onValueChange={handleStatusChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UNREAD">Unread</SelectItem>
                        <SelectItem value="READ">Read</SelectItem>
                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                        <SelectItem value="RESOLVED">Resolved</SelectItem>
                        <SelectItem value="ARCHIVED">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select value={message.priority} onValueChange={handlePriorityChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="NORMAL">Normal</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                        <SelectItem value="URGENT">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Message Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-gray-600" />
                    Message Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="font-medium">Received</p>
                        <p className="text-gray-500">{formatDate(message.createdAt)}</p>
                      </div>
                    </div>

                    {message.source && (
                      <div className="flex items-center gap-3">
                        <Globe className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium">Source</p>
                          <p className="text-gray-500 capitalize">{message.source.replace('_', ' ')}</p>
                        </div>
                      </div>
                    )}

                    {message.ipAddress && (
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium">IP Address</p>
                          <p className="text-gray-500 font-mono text-xs">{message.ipAddress}</p>
                        </div>
                      </div>
                    )}

                    {message.userAgent && (
                      <div className="flex items-center gap-3">
                        <Monitor className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium">User Agent</p>
                          <p className="text-gray-500 text-xs truncate" title={message.userAgent}>
                            {message.userAgent}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
