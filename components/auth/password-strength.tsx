"use client"

import { Progress } from "@/components/ui/progress"
import { Check, X } from "lucide-react"

interface PasswordStrengthProps {
  password: string
}

interface PasswordCriteria {
  label: string
  test: (password: string) => boolean
}

const passwordCriteria: PasswordCriteria[] = [
  {
    label: "At least 8 characters",
    test: (password) => password.length >= 8
  },
  {
    label: "Contains uppercase letter",
    test: (password) => /[A-Z]/.test(password)
  },
  {
    label: "Contains lowercase letter", 
    test: (password) => /[a-z]/.test(password)
  },
  {
    label: "Contains number",
    test: (password) => /\d/.test(password)
  },
  {
    label: "Contains special character",
    test: (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password)
  }
]

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const passedCriteria = passwordCriteria.filter(criteria => criteria.test(password))
  const strengthPercentage = (passedCriteria.length / passwordCriteria.length) * 100
  
  const getStrengthLabel = () => {
    if (passedCriteria.length === 0) return ""
    if (passedCriteria.length <= 2) return "Weak"
    if (passedCriteria.length <= 3) return "Fair"
    if (passedCriteria.length <= 4) return "Good"
    return "Strong"
  }

  const getStrengthColor = () => {
    if (passedCriteria.length <= 2) return "bg-red-500"
    if (passedCriteria.length <= 3) return "bg-orange-500"
    if (passedCriteria.length <= 4) return "bg-yellow-500"
    return "bg-green-500"
  }

  if (!password) return null

  return (
    <div className="space-y-3 mt-2">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Password Strength</span>
          <span className={`text-sm font-medium ${
            passedCriteria.length <= 2 ? 'text-red-600' :
            passedCriteria.length <= 3 ? 'text-orange-600' :
            passedCriteria.length <= 4 ? 'text-yellow-600' :
            'text-green-600'
          }`}>
            {getStrengthLabel()}
          </span>
        </div>
        <Progress 
          value={strengthPercentage} 
          className="h-2"
        />
      </div>

      {/* Criteria List */}
      <div className="space-y-1">
        {passwordCriteria.map((criteria, index) => {
          const isPassed = criteria.test(password)
          return (
            <div key={index} className="flex items-center space-x-2">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                isPassed ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                {isPassed ? (
                  <Check className="w-3 h-3 text-green-600" />
                ) : (
                  <X className="w-3 h-3 text-gray-400" />
                )}
              </div>
              <span className={`text-sm ${
                isPassed ? 'text-green-600' : 'text-gray-500'
              }`}>
                {criteria.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
