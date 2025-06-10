"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Heart, 
  ShoppingCart, 
  Search,
  Filter,
  Star,
  Eye,
  Trash2,
  Share2,
  Grid3X3,
  List,
  SortAsc,
  Package,
  TrendingUp,
  Clock
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useSettings } from "@/contexts/settings-context"
import { useCart } from "@/contexts/CartContext"
import { toast } from "sonner"
import { ProductRating } from "./product-rating"

interface WishlistItem {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  rating: number
  reviewCount: number
  inStock: boolean
  stockQuantity: number
  addedDate: string
  slug: string
  description: string
  discount?: number
}

interface UserWishlistContentProps {
  userId: string
}

export function UserWishlistContent({ userId }: UserWishlistContentProps) {
  const [wishlistItems, setWishlistItems] = React.useState<WishlistItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [selectedCategory, setSelectedCategory] = React.useState('all')
  const [sortBy, setSortBy] = React.useState('newest')
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid')
  const { formatCurrency } = useSettings()
  const { addItem } = useCart()

  React.useEffect(() => {
    fetchWishlistItems()
  }, [userId])

  const fetchWishlistItems = async () => {
    try {
      setLoading(true)
      console.log('🔄 Fetching real wishlist items for user:', userId)

      const response = await fetch('/api/user/wishlist')
      if (response.ok) {
        const data = await response.json()
        console.log('📦 Received wishlist data:', data)
        setWishlistItems(data.items || [])
      } else {
        console.error('Failed to fetch wishlist items')
        setWishlistItems([])
      }
    } catch (error) {
      console.error('Error fetching wishlist items:', error)
      setWishlistItems([])
    } finally {
      setLoading(false)
    }
  }

  const removeFromWishlist = async (itemId: string) => {
    try {
      console.log('💔 Removing item from wishlist:', itemId)
      const response = await fetch(`/api/user/wishlist?productId=${itemId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setWishlistItems(prev => prev.filter(item => item.id !== itemId))
        toast.success('Item removed from wishlist')
      } else {
        toast.error('Failed to remove item from wishlist')
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      toast.error('Failed to remove item from wishlist')
    }
  }

  const addToCart = (item: WishlistItem) => {
    if (!item.inStock) {
      toast.error('Item is out of stock')
      return
    }
    
    try {
      addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        slug: item.slug,
        stockQuantity: item.stockQuantity
      })
      toast.success('Item added to cart!')
    } catch (error) {
      toast.error('Failed to add item to cart')
    }
  }

  const filteredItems = wishlistItems
    .filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === 'all' || item.category === selectedCategory)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()
        case 'oldest':
          return new Date(a.addedDate).getTime() - new Date(b.addedDate).getTime()
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

  const categories = ['all', ...Array.from(new Set(wishlistItems.map(item => item.category)))]

  if (loading) {
    return (
      <div className="px-4 lg:px-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your wishlist...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 lg:px-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <Heart className="h-8 w-8 text-red-500" />
            My Wishlist
          </h1>
          <p className="text-gray-600 mt-2">
            {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved for later
          </p>
        </div>
        
        {/* Quick Stats */}
        <div className="flex gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{wishlistItems.length}</p>
            <p className="text-xs text-gray-600">Total Items</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {wishlistItems.filter(item => item.inStock).length}
            </p>
            <p className="text-xs text-gray-600">In Stock</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(wishlistItems.reduce((sum, item) => sum + item.price, 0))}
            </p>
            <p className="text-xs text-gray-600">Total Value</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="border border-gray-200/50 shadow-lg bg-gradient-to-r from-white to-gray-50/50">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search your wishlist..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
            
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name A-Z</option>
            </select>
            
            {/* View Mode */}
            <div className="flex border border-gray-200 rounded-md overflow-hidden">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wishlist Items */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchTerm || selectedCategory !== 'all' ? 'No items match your filters' : 'Your wishlist is empty'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Try adjusting your search or filters' 
              : 'Start adding items you love to your wishlist!'
            }
          </p>
          <Button asChild>
            <a href="/catalog">Browse Products</a>
          </Button>
        </div>
      ) : (
        <AnimatePresence>
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                layout
              >
                {viewMode === 'grid' ? (
                  <WishlistItemCard 
                    item={item} 
                    onRemove={removeFromWishlist}
                    onAddToCart={addToCart}
                    formatCurrency={formatCurrency}
                  />
                ) : (
                  <WishlistItemRow 
                    item={item} 
                    onRemove={removeFromWishlist}
                    onAddToCart={addToCart}
                    formatCurrency={formatCurrency}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  )
}

// Wishlist Item Card Component
function WishlistItemCard({ 
  item, 
  onRemove, 
  onAddToCart, 
  formatCurrency 
}: { 
  item: WishlistItem
  onRemove: (id: string) => void
  onAddToCart: (item: WishlistItem) => void
  formatCurrency: (amount: number) => string
}) {
  return (
    <Card className="group border border-gray-200/50 shadow-lg bg-gradient-to-br from-white to-gray-50/30 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 overflow-hidden">
      <div className="relative">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {item.discount && (
            <Badge className="bg-red-500 text-white">-{item.discount}%</Badge>
          )}
          {!item.inStock && (
            <Badge variant="secondary">Out of Stock</Badge>
          )}
        </div>
        
        {/* Actions */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
            onClick={() => onRemove(item.id)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {item.name}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{item.category}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= Math.floor(item.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : star <= item.rating
                      ? 'fill-yellow-200 text-yellow-400'
                      : 'fill-gray-200 text-gray-300'
                  }`}
                />
              ))}
              <span className="text-sm font-medium ml-1">{item.rating.toFixed(1)}</span>
            </div>
            <span className="text-sm text-gray-500">({item.reviewCount})</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              {formatCurrency(item.price)}
            </span>
            {item.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatCurrency(item.originalPrice)}
              </span>
            )}
          </div>
          
          <Button
            onClick={() => onAddToCart(item)}
            disabled={!item.inStock}
            className="w-full mb-3"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {item.inStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>

          {/* Product Rating */}
          <ProductRating
            productId={item.id}
            productName={item.name}
            onRatingSubmitted={(rating) => {
              console.log('Rating submitted:', rating, 'for product:', item.name)
              toast.success(`Thank you for rating ${item.name}!`)
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}

// Wishlist Item Row Component
function WishlistItemRow({ 
  item, 
  onRemove, 
  onAddToCart, 
  formatCurrency 
}: { 
  item: WishlistItem
  onRemove: (id: string) => void
  onAddToCart: (item: WishlistItem) => void
  formatCurrency: (amount: number) => string
}) {
  return (
    <Card className="border border-gray-200/50 shadow-lg bg-gradient-to-r from-white to-gray-50/30 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center gap-6">
          <img 
            src={item.image} 
            alt={item.name}
            className="w-20 h-20 object-cover rounded-lg"
          />
          
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
                <p className="text-gray-600">{item.category}</p>
              </div>
              <div className="flex items-center gap-2">
                {item.discount && (
                  <Badge className="bg-red-500 text-white">-{item.discount}%</Badge>
                )}
                {!item.inStock && (
                  <Badge variant="secondary">Out of Stock</Badge>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= Math.floor(item.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : star <= item.rating
                        ? 'fill-yellow-200 text-yellow-400'
                        : 'fill-gray-200 text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-sm font-medium ml-1">{item.rating.toFixed(1)}</span>
                <span className="text-sm text-gray-500 ml-1">({item.reviewCount})</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-gray-900">
                  {formatCurrency(item.price)}
                </span>
                {item.originalPrice && (
                  <span className="text-gray-500 line-through">
                    {formatCurrency(item.originalPrice)}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRemove(item.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remove
              </Button>
              <Button
                onClick={() => onAddToCart(item)}
                disabled={!item.inStock}
                size="sm"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {item.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
            </div>

            {/* Product Rating for List View */}
            <ProductRating
              productId={item.id}
              productName={item.name}
              onRatingSubmitted={(rating) => {
                console.log('Rating submitted:', rating, 'for product:', item.name)
                toast.success(`Thank you for rating ${item.name}!`)
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
