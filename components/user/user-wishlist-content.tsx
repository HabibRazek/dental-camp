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
  Grid3X3,
  List,
  SortAsc,
  Package,
  TrendingUp,
  Clock
} from "lucide-react"
import { SectionLoader } from "@/components/ui/loader"
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
  const [categories, setCategories] = React.useState<{id: string, name: string, slug: string}[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [selectedCategory, setSelectedCategory] = React.useState('all')
  const [sortBy, setSortBy] = React.useState('newest')
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid')
  const [currentPage, setCurrentPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(1)
  const [totalItems, setTotalItems] = React.useState(0)
  const itemsPerPage = 12
  const { formatCurrency } = useSettings()
  const { addItem } = useCart()

  React.useEffect(() => {
    fetchWishlistItems()
    fetchCategories()
  }, [userId, currentPage, searchTerm, selectedCategory, sortBy])

  const fetchWishlistItems = async () => {
    try {
      setLoading(true)
      console.log('🔄 Fetching wishlist items for user:', userId)

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        search: searchTerm,
        category: selectedCategory,
        sortBy: sortBy
      })

      const response = await fetch(`/api/user/wishlist?${params}`)
      if (response.ok) {
        const data = await response.json()
        console.log('📦 Received wishlist data:', data)
        setWishlistItems(data.items || [])
        setTotalPages(data.pagination?.totalPages || 1)
        setTotalItems(data.pagination?.totalItems || 0)
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

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories?includeProducts=false')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories || [])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
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
      toast.error('Article en rupture de stock')
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
      // Don't show toast here - CartContext will handle it
    } catch (error) {
      toast.error('Échec de l\'ajout de l\'article au panier')
    }
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
            {totalItems} item{totalItems !== 1 ? 's' : ''} saved for later • Page {currentPage} of {totalPages}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
            <p className="text-xs text-gray-600">Total Items</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-2xl font-bold text-green-600">
              {wishlistItems.filter(item => item.inStock).length}
            </p>
            <p className="text-xs text-gray-600">In Stock</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(wishlistItems.reduce((sum, item) => sum + item.price, 0))}
            </p>
            <p className="text-xs text-gray-600">Page Value</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-2xl font-bold text-purple-600">{currentPage}</p>
            <p className="text-xs text-gray-600">Current Page</p>
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
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-10"
              />
            </div>
            
            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-10 pr-8 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[160px]"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
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
      {loading ? (
        <SectionLoader size="lg" />
      ) : wishlistItems.length === 0 ? (
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
          <div className={`grid gap-4 sm:gap-6 ${
            viewMode === 'grid'
              ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4'
              : 'grid-cols-1'
          }`}>
            {wishlistItems.map((item, index) => (
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-2"
          >
            <TrendingUp className="h-4 w-4 rotate-180" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 ${currentPage === page ? 'bg-blue-600 text-white' : ''}`}
                >
                  {page}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2"
          >
            Next
            <TrendingUp className="h-4 w-4" />
          </Button>
        </div>
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
    <Card className="group border border-gray-200/50 shadow-lg bg-gradient-to-br from-white to-gray-50/30 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 overflow-hidden h-full flex flex-col">
      <div className="relative">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-32 sm:h-40 md:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
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
        <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
          <Button
            size="sm"
            variant="secondary"
            className="h-6 w-6 sm:h-8 sm:w-8 p-0 bg-white/80 hover:bg-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300"
            onClick={() => onRemove(item.id)}
          >
            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
          </Button>
        </div>
      </div>
      
      <CardContent className="p-2 sm:p-3 md:p-4 flex-1 flex flex-col">
        <div className="space-y-2 sm:space-y-3 flex-1 flex flex-col">
          <div>
            <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors text-sm sm:text-base min-h-[2.5rem] sm:min-h-[3rem]">
              {item.name}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">{item.category}</p>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3 w-3 sm:h-4 sm:w-4 ${
                    star <= Math.floor(item.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : star <= item.rating
                      ? 'fill-yellow-200 text-yellow-400'
                      : 'fill-gray-200 text-gray-300'
                  }`}
                />
              ))}
              <span className="text-xs sm:text-sm font-medium ml-1">{item.rating.toFixed(1)}</span>
            </div>
            <span className="text-xs sm:text-sm text-gray-500">({item.reviewCount})</span>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-sm sm:text-lg font-bold text-gray-900">
              {formatCurrency(item.price)}
            </span>
            {item.originalPrice && (
              <span className="text-xs sm:text-sm text-gray-500 line-through">
                {formatCurrency(item.originalPrice)}
              </span>
            )}
          </div>
          
          <div className="mt-auto pt-2 sm:pt-4">
            <Button
              onClick={() => onAddToCart(item)}
              disabled={!item.inStock}
              className="w-full mb-2 sm:mb-3 text-xs sm:text-sm py-1.5 sm:py-2"
            >
              <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">{item.inStock ? 'Ajouter au panier' : 'Rupture de stock'}</span>
              <span className="sm:hidden">{item.inStock ? 'Ajouter' : 'Rupture'}</span>
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
