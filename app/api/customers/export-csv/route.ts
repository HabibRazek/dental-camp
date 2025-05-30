import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

// Force this API route to use Node.js runtime
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get all users from database
    const users = await prisma.user.findMany({
      include: {
        accounts: {
          select: {
            provider: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Create professional CSV content with enhanced formatting
    const csvHeaders = [
      'Customer ID',
      'Full Name',
      'Email Address',
      'Account Status',
      'Email Verification Status',
      'Email Verified Date',
      'Authentication Provider',
      'Registration Date',
      'Last Updated',
      'Account Type',
      'Total Accounts'
    ]

    const csvRows = users.map((user, index) => {
      const authProvider = user.accounts.length > 0
        ? user.accounts[0].provider.toUpperCase()
        : 'EMAIL'

      const emailVerifiedStatus = user.emailVerified ? 'VERIFIED' : 'UNVERIFIED'
      const emailVerifiedDate = user.emailVerified
        ? new Date(user.emailVerified).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          })
        : 'N/A'

      const status = user.isActive ? 'ACTIVE' : 'DISABLED'
      const accountType = user.accounts.length > 0 ? 'OAUTH' : 'CREDENTIALS'

      return [
        `CUST-${String(index + 1).padStart(4, '0')}`, // Professional customer ID
        user.name || 'Not Provided',
        user.email,
        status,
        emailVerifiedStatus,
        emailVerifiedDate,
        authProvider,
        new Date(user.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }),
        new Date(user.updatedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }),
        accountType,
        user.accounts.length.toString()
      ]
    })

    // Create professional CSV format with metadata header
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    const currentTime = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })

    const csvMetadata = [
      '# DENTAL CAMP E-COMMERCE PLATFORM',
      '# CUSTOMER DATA EXPORT REPORT',
      `# Generated on: ${currentDate} at ${currentTime}`,
      `# Total Records: ${users.length}`,
      `# Export Format: CSV (Comma Separated Values)`,
      '# ================================================',
      ''
    ]

    const csvContent = [
      ...csvMetadata,
      csvHeaders.join(','),
      ...csvRows.map(row =>
        row.map(field => {
          // Enhanced field escaping for professional CSV format
          if (typeof field === 'string') {
            // Handle special characters and ensure proper CSV formatting
            if (field.includes(',') || field.includes('"') || field.includes('\n') || field.includes('\r')) {
              return `"${field.replace(/"/g, '""')}"`
            }
          }
          return field
        }).join(',')
      ),
      '',
      '# End of Report',
      `# Exported by: Dental Camp Customer Management System`,
      `# Contact: support@dentalcamp.com`
    ].join('\n')

    // Create response with CSV content
    const response = new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="customers-export-${new Date().toISOString().split('T')[0]}.csv"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })

    return response
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
