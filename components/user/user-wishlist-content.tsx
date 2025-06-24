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
  const itemsPerPage = 12 // 4 rows × 3 cards per row
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
      {/* Innovative Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500 via-red-500 to-rose-600 p-8 text-white"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold tracking-tight flex items-center gap-4"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <Heart className="h-10 w-10 md:h-12 md:w-12 text-white fill-white" />
              </motion.div>
              Ma Liste de Souhaits
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-white/90 mt-3 text-lg"
            >
              {totalItems} produit{totalItems !== 1 ? 's' : ''} sauvegardé{totalItems !== 1 ? 's' : ''} • Page {currentPage} sur {totalPages}
            </motion.p>
          </div>

          {/* Innovative Quick Stats */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border border-white/30 min-w-0"
            >
              <p className="text-2xl sm:text-3xl font-bold text-white truncate">{totalItems}</p>
              <p className="text-white/80 text-xs sm:text-sm">Produits Total</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border border-white/30 min-w-0"
            >
              <p className="text-2xl sm:text-3xl font-bold text-white truncate">
                {wishlistItems.filter(item => item.inStock).length}
              </p>
              <p className="text-white/80 text-xs sm:text-sm">En Stock</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border border-white/30 min-w-0"
            >
              <p className="text-lg sm:text-2xl md:text-3xl font-bold text-white truncate">
                {formatCurrency(wishlistItems.reduce((sum, item) => sum + item.price, 0))}
              </p>
              <p className="text-white/80 text-xs sm:text-sm">Valeur Total</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border border-white/30 min-w-0"
            >
              <p className="text-2xl sm:text-3xl font-bold text-white truncate">
                {categories.length}
              </p>
              <p className="text-white/80 text-xs sm:text-sm">Catégories</p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Innovative Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <Card className="border border-blue-200/50 shadow-xl bg-gradient-to-r from-white via-blue-50/30 to-purple-50/30 backdrop-blur-sm">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Innovative Search */}
              <div className="flex-1 relative group">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                >
                  <Search className="h-4 w-4 text-blue-500" />
                </motion.div>
                <Input
                  placeholder="🔍 Rechercher dans vos favoris..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="pl-10 border-blue-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white/80 backdrop-blur-sm rounded-xl transition-all duration-300 group-hover:shadow-md"
                />
              </div>

              {/* Innovative Category Filter */}
              <div className="relative group">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10"
                >
                  <Filter className="h-4 w-4 text-blue-500" />
                </motion.div>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="pl-10 pr-8 py-2 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white/80 backdrop-blur-sm min-w-[160px] transition-all duration-300 group-hover:shadow-md"
                >
                  <option value="all">🏷️ Toutes Catégories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.slug}>
                      📂 {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Innovative Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-md"
              >
                <option value="newest">🆕 Plus récent</option>
                <option value="oldest">📅 Plus ancien</option>
                <option value="price-low">💰 Prix croissant</option>
                <option value="price-high">💎 Prix décroissant</option>
                <option value="name">🔤 Nom A-Z</option>
              </select>

              {/* Innovative View Mode */}
              <div className="flex border border-blue-200 rounded-xl overflow-hidden bg-white/80 backdrop-blur-sm">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={`rounded-none ${viewMode === 'grid' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' : 'hover:bg-blue-50'}`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={`rounded-none ${viewMode === 'list' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' : 'hover:bg-blue-50'}`}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Wishlist Items */}
      {loading ? (
        <SectionLoader size="lg" />
      ) : wishlistItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center py-16"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="mb-6"
          >
            <Heart className="h-20 w-20 text-pink-400 mx-auto fill-pink-100" />
          </motion.div>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-gray-900 mb-3"
          >
            {searchTerm || selectedCategory !== 'all' ? '🔍 Aucun résultat trouvé' : '💝 Votre liste est vide'}
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 mb-8 text-lg"
          >
            {searchTerm || selectedCategory !== 'all'
              ? 'Essayez d\'ajuster vos filtres de recherche'
              : 'Commencez à ajouter vos produits préférés!'
            }
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              asChild
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-500 px-8 py-3 rounded-2xl text-lg"
            >
              <a href="/catalog">🛍️ Découvrir nos produits</a>
            </Button>
          </motion.div>
        </motion.div>
      ) : (
        <AnimatePresence>
          <div className={`grid gap-3 sm:gap-4 md:gap-6 ${
            viewMode === 'grid'
              ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4'
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

      {/* Innovative Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex justify-center items-center gap-3 mt-8"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border-blue-200 hover:bg-blue-50 hover:border-blue-300 rounded-xl px-4 py-2 transition-all duration-300"
            >
              <TrendingUp className="h-4 w-4 rotate-180" />
              <span className="hidden sm:inline">Précédent</span>
              <span className="sm:hidden">←</span>
            </Button>
          </motion.div>

          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <motion.div
                  key={page}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-xl transition-all duration-300 ${
                      currentPage === page
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg border-0'
                        : 'bg-white/80 backdrop-blur-sm border-blue-200 hover:bg-blue-50 hover:border-blue-300'
                    }`}
                  >
                    {page}
                  </Button>
                </motion.div>
              );
            })}
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border-blue-200 hover:bg-blue-50 hover:border-blue-300 rounded-xl px-4 py-2 transition-all duration-300"
            >
              <span className="hidden sm:inline">Suivant</span>
              <span className="sm:hidden">→</span>
              <TrendingUp className="h-4 w-4" />
            </Button>
          </motion.div>
        </motion.div>
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
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group"
    >
      <Card className="relative border border-blue-100/50 shadow-lg bg-gradient-to-br from-white via-blue-50/20 to-white hover:shadow-2xl hover:border-blue-200/70 transition-all duration-500 overflow-hidden h-full flex flex-col backdrop-blur-sm">
        {/* Innovative Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200/20 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-700"></div>

        <div className="relative overflow-hidden">
          <div className="aspect-[4/3] w-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center relative">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/api/placeholder/300/300';
              }}
            />
            {/* Innovative Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {/* Innovative Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
            {item.discount && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full shadow-lg border border-white/20">
                  🔥 -{item.discount}%
                </Badge>
              </motion.div>
            )}
            {!item.inStock && (
              <Badge className="bg-gradient-to-r from-gray-400 to-gray-500 text-white text-xs px-2 py-1 rounded-full shadow-lg">
                ⚠️ Rupture
              </Badge>
            )}
          </div>

          {/* Innovative Remove Button */}
          <div className="absolute top-2 right-2 z-10">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 bg-white/90 hover:bg-red-50 rounded-full shadow-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 border border-white/50 hover:border-red-200"
                onClick={() => onRemove(item.id)}
              >
                <Trash2 className="h-3.5 w-3.5 text-gray-600 hover:text-red-500 transition-colors duration-200" />
              </Button>
            </motion.div>
          </div>
        </div>

        <CardContent className="relative p-3 sm:p-4 flex-1 flex flex-col z-10">
          <div className="space-y-2 sm:space-y-3 flex-1 flex flex-col">
            <div>
              <motion.h3
                className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors text-sm sm:text-base leading-tight min-h-[2.5rem] sm:min-h-[3rem]"
                whileHover={{ scale: 1.02 }}
              >
                {item.name}
              </motion.h3>
              <p className="text-xs text-blue-600/70 mt-1 font-medium">{item.category}</p>
            </div>

            {/* Innovative Rating Display */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-gradient-to-r from-yellow-50 to-orange-50 px-2 py-1 rounded-full">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.div
                    key={star}
                    whileHover={{ scale: 1.2, rotate: 180 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Star
                      className={`h-3 w-3 ${
                        star <= Math.floor(item.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : star <= item.rating
                          ? 'fill-yellow-200 text-yellow-400'
                          : 'fill-gray-200 text-gray-300'
                      }`}
                    />
                  </motion.div>
                ))}
                <span className="text-xs font-bold ml-1 text-gray-700">{item.rating.toFixed(1)}</span>
              </div>
              <span className="text-xs text-gray-400">({item.reviewCount})</span>
            </div>

            {/* Innovative Price Display */}
            <div className="flex items-center gap-2">
              <motion.span
                className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
              >
                {formatCurrency(item.price)}
              </motion.span>
              {item.originalPrice && (
                <span className="text-xs text-gray-500 line-through bg-gray-100 px-1 rounded">
                  {formatCurrency(item.originalPrice)}
                </span>
              )}
            </div>

            {/* Innovative Add to Cart Button */}
            <div className="mt-auto pt-2">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => onAddToCart(item)}
                  disabled={!item.inStock}
                  size="sm"
                  className={`w-full h-9 sm:h-10 text-xs sm:text-sm font-semibold transition-all duration-300 rounded-xl ${
                    item.inStock
                      ? 'bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 hover:from-blue-600 hover:via-purple-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl border border-blue-200/50'
                      : 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  <motion.div
                    animate={{ rotate: item.inStock ? [0, 360] : 0 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  </motion.div>
                  <span>{item.inStock ? '🛒 Ajouter au panier' : '❌ Rupture'}</span>
                </Button>
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
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
          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/api/placeholder/300/300';
              }}
            />
          </div>
          
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
                className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-300"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remove
              </Button>
              <Button
                onClick={() => onAddToCart(item)}
                disabled={!item.inStock}
                size="sm"
                className={`transition-all duration-300 ${
                  item.inStock
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
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
