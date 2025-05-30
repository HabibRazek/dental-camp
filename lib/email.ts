import nodemailer from 'nodemailer'

// Create transporter for sending emails
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

// Verify email configuration
export async function verifyEmailConfig() {
  try {
    const transporter = createTransporter()
    await transporter.verify()
    console.log('✅ Email server is ready')
    return true
  } catch (error) {
    console.error('❌ Email server configuration error:', error)
    return false
  }
}

// Send verification email
export async function sendVerificationEmail(email: string, code: string, name?: string) {
  try {
    console.log('🔧 Creating email transporter...')
    const transporter = createTransporter()

    console.log('📧 Preparing to send verification email to:', email)
    console.log('🔢 Verification code:', code)

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: '🦷 Verify Your Dental Camp Account',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8fafc;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

            <!-- Header -->
            <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">🦷 Dental Camp</h1>
              <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">Premium Dental Supplies & Equipment</p>
            </div>

            <!-- Content -->
            <div style="padding: 40px 20px;">
              <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Verify Your Email Address</h2>

              <p style="color: #4b5563; margin: 0 0 20px 0; font-size: 16px; line-height: 1.5;">
                Hello ${name || 'there'}! 👋
              </p>

              <p style="color: #4b5563; margin: 0 0 30px 0; font-size: 16px; line-height: 1.5;">
                Thank you for signing up for Dental Camp! To complete your registration and secure your account, please use the verification code below:
              </p>

              <!-- Verification Code Box -->
              <div style="background-color: #f3f4f6; border: 2px dashed #d1d5db; border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0;">
                <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
                <div style="font-size: 36px; font-weight: bold; color: #1f2937; letter-spacing: 8px; font-family: 'Courier New', monospace;">${code}</div>
                <p style="color: #ef4444; margin: 15px 0 0 0; font-size: 14px;">⏰ Expires in 15 minutes</p>
              </div>

              <p style="color: #4b5563; margin: 0 0 20px 0; font-size: 16px; line-height: 1.5;">
                Simply enter this code on the verification page to activate your account and start exploring our premium dental products.
              </p>

              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
                <p style="color: #92400e; margin: 0; font-size: 14px;">
                  <strong>Security Note:</strong> If you didn't create an account with Dental Camp, please ignore this email.
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #f9fafb; padding: 30px 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px;">
                Need help? Contact our support team at
                <a href="mailto:support@dentalcamp.com" style="color: #3b82f6; text-decoration: none;">support@dentalcamp.com</a>
              </p>
              <p style="color: #9ca3af; margin: 0; font-size: 12px;">
                © 2024 Dental Camp. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Dental Camp - Verify Your Email

        Hello ${name || 'there'}!

        Thank you for signing up for Dental Camp!

        Your verification code is: ${code}

        This code expires in 15 minutes.

        If you didn't create an account with Dental Camp, please ignore this email.

        Best regards,
        The Dental Camp Team
      `
    }

    const result = await transporter.sendMail(mailOptions)

    console.log(`✅ Verification email sent to ${email}`)
    console.log(`📧 Message ID: ${result.messageId}`)
    console.log(`🔢 Verification Code: ${code}`)

    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('❌ Error sending verification email:', error)
    return { success: false, error: (error as Error).message }
  }
}

// Send welcome email after verification
export async function sendWelcomeEmail(email: string, name?: string) {
  try {
    const transporter = createTransporter()

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: '🎉 Welcome to Dental Camp!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Dental Camp</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8fafc;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

            <!-- Header -->
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">🎉 Welcome to Dental Camp!</h1>
              <p style="color: #d1fae5; margin: 10px 0 0 0; font-size: 16px;">Your account is now verified and ready to use</p>
            </div>

            <!-- Content -->
            <div style="padding: 40px 20px;">
              <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Hello ${name || 'there'}! 👋</h2>

              <p style="color: #4b5563; margin: 0 0 20px 0; font-size: 16px; line-height: 1.5;">
                Congratulations! Your email has been successfully verified and your Dental Camp account is now active.
              </p>

              <p style="color: #4b5563; margin: 0 0 30px 0; font-size: 16px; line-height: 1.5;">
                You now have access to our complete catalog of premium dental supplies and equipment. Here's what you can do:
              </p>

              <!-- Features List -->
              <div style="background-color: #f8fafc; border-radius: 8px; padding: 25px; margin: 25px 0;">
                <ul style="margin: 0; padding: 0; list-style: none;">
                  <li style="margin: 0 0 15px 0; padding: 0 0 0 30px; position: relative; color: #374151; font-size: 16px;">
                    <span style="position: absolute; left: 0; color: #10b981;">🛒</span>
                    Browse our extensive product catalog
                  </li>
                  <li style="margin: 0 0 15px 0; padding: 0 0 0 30px; position: relative; color: #374151; font-size: 16px;">
                    <span style="position: absolute; left: 0; color: #10b981;">💰</span>
                    Access exclusive member pricing
                  </li>
                  <li style="margin: 0 0 15px 0; padding: 0 0 0 30px; position: relative; color: #374151; font-size: 16px;">
                    <span style="position: absolute; left: 0; color: #10b981;">🚚</span>
                    Enjoy fast and secure delivery
                  </li>
                  <li style="margin: 0; padding: 0 0 0 30px; position: relative; color: #374151; font-size: 16px;">
                    <span style="position: absolute; left: 0; color: #10b981;">🎯</span>
                    Get personalized product recommendations
                  </li>
                </ul>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXTAUTH_URL}/dashboard" style="display: inline-block; background-color: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                  Start Shopping Now 🛒
                </a>
              </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #f9fafb; padding: 30px 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px;">
                Questions? We're here to help! Contact us at
                <a href="mailto:support@dentalcamp.com" style="color: #3b82f6; text-decoration: none;">support@dentalcamp.com</a>
              </p>
              <p style="color: #9ca3af; margin: 0; font-size: 12px;">
                © 2024 Dental Camp. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Welcome to Dental Camp!

        Hello ${name || 'there'}!

        Congratulations! Your email has been successfully verified and your Dental Camp account is now active.

        You now have access to our complete catalog of premium dental supplies and equipment.

        Visit ${process.env.NEXTAUTH_URL}/dashboard to start shopping.

        Best regards,
        The Dental Camp Team
      `
    }

    const result = await transporter.sendMail(mailOptions)

    console.log(`✅ Welcome email sent to ${email}`)
    console.log(`📧 Message ID: ${result.messageId}`)

    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('❌ Error sending welcome email:', error)
    return { success: false, error: (error as Error).message }
  }
}
