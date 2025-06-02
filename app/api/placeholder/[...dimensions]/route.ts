import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ dimensions: string[] }> }
) {
  try {
    const { dimensions } = await params
    const [width = '400', height = '300'] = dimensions

    // Create a simple SVG placeholder
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#8B5CF6;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)"/>
        <g transform="translate(${parseInt(width)/2}, ${parseInt(height)/2})">
          <circle cx="0" cy="-20" r="15" fill="white" opacity="0.3"/>
          <rect x="-20" y="-5" width="40" height="25" rx="5" fill="white" opacity="0.3"/>
          <text x="0" y="35" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="14" opacity="0.8">
            ${width}×${height}
          </text>
        </g>
      </svg>
    `

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Placeholder image error:', error)
    
    // Fallback SVG
    const fallbackSvg = `
      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <text x="50%" y="50%" text-anchor="middle" fill="#6b7280" font-family="Arial, sans-serif" font-size="16">
          Image Placeholder
        </text>
      </svg>
    `
    
    return new NextResponse(fallbackSvg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  }
}
