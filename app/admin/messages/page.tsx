"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { ContactMessagesTable } from "@/components/messages/contact-messages-table"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export interface ContactMessage {
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

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    search: ''
  })
  const itemsPerPage = 10

  useEffect(() => {
    fetchMessages()
  }, [currentPage, filters])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        ...(filters.status !== 'all' && { status: filters.status }),
        ...(filters.priority !== 'all' && { priority: filters.priority }),
        ...(filters.search && { search: filters.search })
      })

      const response = await fetch(`/api/contact?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch messages')
      }

      const data = await response.json()
      setMessages(data.messages || [])
      setTotalPages(data.pagination?.totalPages || 1)
      setTotalCount(data.pagination?.totalCount || 0)
    } catch (err) {
      console.error('Error fetching messages:', err)
      setError('Failed to load messages')
      toast.error('Failed to load messages')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (messageId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/contact/${messageId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Failed to update message status')
      }

      // Update the message in the local state
      setMessages(prev => prev.map(msg =>
        msg.id === messageId
          ? { ...msg, status: newStatus as ContactMessage['status'] }
          : msg
      ))

      // Dispatch custom event to update sidebar badge immediately
      console.log('📧 Dispatching messagesUpdated event for status change:', newStatus)
      window.dispatchEvent(new CustomEvent('messagesUpdated'))

      toast.success('Message status updated successfully')
    } catch (err) {
      console.error('Error updating message status:', err)
      toast.error('Failed to update message status')
    }
  }

  const handlePriorityChange = async (messageId: string, newPriority: string) => {
    try {
      const response = await fetch(`/api/contact/${messageId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priority: newPriority }),
      })

      if (!response.ok) {
        throw new Error('Failed to update message priority')
      }

      // Update the message in the local state
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, priority: newPriority as ContactMessage['priority'] }
          : msg
      ))

      toast.success('Message priority updated successfully')
    } catch (err) {
      console.error('Error updating message priority:', err)
      toast.error('Failed to update message priority')
    }
  }

  const handleDelete = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/contact/${messageId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete message')
      }

      // Remove the message from the local state
      setMessages(prev => prev.filter(msg => msg.id !== messageId))
      setTotalCount(prev => prev - 1)

      // Dispatch custom event to update sidebar badge immediately
      window.dispatchEvent(new CustomEvent('messagesUpdated'))

      toast.success('Message deleted successfully')
    } catch (err) {
      toast.error('Failed to delete message')
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page when filters change
  }

  // Loading state
  if (loading && messages.length === 0) {
    return (
      <DashboardLayout
        title="Contact Messages"
        description="Manage customer inquiries and support requests"
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading messages...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout
        title="Contact Messages"
        description="Manage customer inquiries and support requests"
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <button
              onClick={fetchMessages}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      title="Contact Messages"
      description="Manage customer inquiries and support requests with advanced filtering and response tracking"
    >
      <ContactMessagesTable
        data={messages}
        onStatusChange={handleStatusChange}
        onPriorityChange={handlePriorityChange}
        onDelete={handleDelete}
        filters={filters}
        onFilterChange={handleFilterChange}
        pagination={{
          currentPage,
          totalPages,
          totalCount,
          itemsPerPage,
          onPageChange: handlePageChange,
          onPreviousPage: handlePreviousPage,
          onNextPage: handleNextPage,
        }}
        loading={loading}
      />
    </DashboardLayout>
  )
}
