"use client"

import React from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface ProductRatingProps {
  productId: string
  productName: string
  currentRating?: number
  onRatingSubmitted?: (rating: number) => void
}

export function ProductRating({ 
  productId, 
  productName, 
  currentRating = 0,
  onRatingSubmitted 
}: ProductRatingProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedRating, setSelectedRating] = React.useState(0)
  const [hoverRating, setHoverRating] = React.useState(0)
  const [review, setReview] = React.useState('')
  const [submitting, setSubmitting] = React.useState(false)
  const [userRating, setUserRating] = React.useState(currentRating)

  React.useEffect(() => {
    // Load user's existing rating from localStorage
    const savedRatings = localStorage.getItem('userProductRatings')
    if (savedRatings) {
      try {
        const ratings = JSON.parse(savedRatings)
        if (ratings[productId]) {
          setUserRating(ratings[productId].rating)
        }
      } catch (error) {
        console.error('Error loading saved ratings:', error)
      }
    }
  }, [productId])

  const submitRating = async () => {
    if (selectedRating === 0) {
      toast.error('Please select a rating')
      return
    }

    try {
      setSubmitting(true)
      
      const response = await fetch(`/api/products/${productId}/rating`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rating: selectedRating,
          review: review.trim() || null
        })
      })

      if (response.ok) {
        const result = await response.json()
        
        // Save rating to localStorage
        const savedRatings = localStorage.getItem('userProductRatings')
        const ratings = savedRatings ? JSON.parse(savedRatings) : {}
        ratings[productId] = {
          rating: selectedRating,
          review: review.trim(),
          submittedAt: new Date().toISOString()
        }
        localStorage.setItem('userProductRatings', JSON.stringify(ratings))
        
        setUserRating(selectedRating)
        setIsOpen(false)
        setSelectedRating(0)
        setReview('')
        
        toast.success('Thank you for your rating!')
        
        if (onRatingSubmitted) {
          onRatingSubmitted(selectedRating)
        }
      } else {
        throw new Error('Failed to submit rating')
      }
    } catch (error) {
      console.error('Error submitting rating:', error)
      toast.error('Failed to submit rating. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const displayRating = hoverRating || selectedRating

  return (
    <div className="flex items-center gap-2">
      {/* Display current user rating if exists */}
      {userRating > 0 ? (
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= userRating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-gray-200 text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">Your rating</span>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Update Rating
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Update Your Rating</DialogTitle>
                <DialogDescription>
                  Update your rating for {productName}
                </DialogDescription>
              </DialogHeader>
              <RatingForm />
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Rate Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Rate This Product</DialogTitle>
              <DialogDescription>
                Share your experience with {productName}
              </DialogDescription>
            </DialogHeader>
            <RatingForm />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )

  function RatingForm() {
    return (
      <div className="space-y-6 py-4">
        {/* Star Rating */}
        <div className="space-y-2">
          <Label>Your Rating</Label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setSelectedRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 hover:scale-110 transition-transform"
              >
                <Star
                  className={`h-8 w-8 transition-colors ${
                    star <= displayRating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'fill-gray-200 text-gray-300 hover:fill-yellow-200 hover:text-yellow-300'
                  }`}
                />
              </button>
            ))}
          </div>
          {selectedRating > 0 && (
            <p className="text-sm text-gray-600">
              {selectedRating === 1 && "Poor"}
              {selectedRating === 2 && "Fair"}
              {selectedRating === 3 && "Good"}
              {selectedRating === 4 && "Very Good"}
              {selectedRating === 5 && "Excellent"}
            </p>
          )}
        </div>

        {/* Review Text */}
        <div className="space-y-2">
          <Label htmlFor="review">Review (Optional)</Label>
          <Textarea
            id="review"
            placeholder="Share your thoughts about this product..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows={3}
          />
        </div>

        {/* Submit Button */}
        <div className="flex gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={submitRating}
            disabled={selectedRating === 0 || submitting}
            className="flex-1"
          >
            {submitting ? 'Submitting...' : 'Submit Rating'}
          </Button>
        </div>
      </div>
    )
  }
}
