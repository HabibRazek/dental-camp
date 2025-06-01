"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Mail, RefreshCw, CheckCircle } from "lucide-react"
import { toast } from "sonner"

interface OTPVerificationProps {
  email: string
  onVerificationSuccess: () => void
  onResendCode: () => Promise<void>
}

export function OTPVerification({ email, onVerificationSuccess, onResendCode }: OTPVerificationProps) {
  const [otp, setOtp] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [countdown])

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter the complete 6-digit code")
      return
    }

    setIsVerifying(true)
    try {
      const response = await fetch("/api/verify-email", {
        method: "PATCH", // ✅ CORRECT METHOD FOR VERIFICATION
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otp })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast.success("Email verified successfully!")
        onVerificationSuccess()
      } else {
        toast.error(data.error || data.message || "Invalid verification code")
        setOtp("")
      }
    } catch (error) {
      toast.error("Verification failed. Please try again.")
      setOtp("")
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResendCode = async () => {
    setIsResending(true)
    try {
      await onResendCode()
      toast.success("New verification code sent!")
      setCountdown(60)
      setCanResend(false)
      setOtp("")
    } catch (error) {
      toast.error("Failed to resend code. Please try again.")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <Card className="w-full max-w-sm mx-auto bg-white/80 backdrop-blur-sm shadow-xl border border-blue-100 rounded-2xl">
      <CardHeader className="text-center pb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Mail className="w-6 h-6 text-blue-600" />
        </div>
        <CardTitle className="text-xl font-bold text-gray-900 mb-2">Check Your Email</CardTitle>
        <CardDescription className="text-gray-600 leading-relaxed text-sm">
          We've sent a 6-digit verification code to
          <br />
          <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg mt-2 inline-block text-xs">{email}</span>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* OTP Input */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={setOtp}
              onComplete={handleVerifyOTP}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          
          <p className="text-sm text-gray-500 text-center">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        {/* Verify Button */}
        <Button
          onClick={handleVerifyOTP}
          disabled={otp.length !== 6 || isVerifying}
          className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
        >
          {isVerifying ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Verify Email
            </>
          )}
        </Button>

        {/* Resend Code */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            Didn't receive the code?
          </p>
          
          {canResend ? (
            <Button
              variant="outline"
              onClick={handleResendCode}
              disabled={isResending}
              className="h-10 px-6 text-blue-600 border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300 rounded-xl transition-all duration-200 font-medium"
            >
              {isResending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                "Resend Code"
              )}
            </Button>
          ) : (
            <div className="bg-gray-50 px-4 py-2 rounded-xl">
              <p className="text-sm text-gray-600 font-medium">
                Resend code in <span className="text-blue-600 font-bold">{countdown}s</span>
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
