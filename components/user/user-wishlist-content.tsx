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
import { useWishlist } from "@/contexts/WishlistContext"
import { toast } from "sonner"

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
  const [searchTerm, setSearchTerm] = React.useState('')
  const [selectedCategory, setSelectedCategory] = React.useState('all')
  const [sortBy, setSortBy] = React.useState('newest')
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid')
  const [currentPage, setCurrentPage] = React.useState(1)
  const itemsPerPage = 12 // 4 rows × 3 cards per row

  const { formatCurrency } = useSettings()
  const { addItem } = useCart()
  const { state: wishlistState, removeFromWishlist, updateItemRating } = useWishlist()

  // Get wishlist items from context
  const wishlistItems = wishlistState.items

  // Filter and sort wishlist items
  const filteredItems = React.useMemo(() => {
    let filtered = [...wishlistItems]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item =>
        item.category.toLowerCase().includes(selectedCategory.toLowerCase())
      )
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime())
        break
      case 'oldest':
        filtered.sort((a, b) => new Date(a.addedDate).getTime() - new Date(b.addedDate).getTime())
        break
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    return filtered
  }, [wishlistItems, searchTerm, selectedCategory, sortBy])

  // Calculate pagination
  const totalItems = filteredItems.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage)

  // Get unique categories from wishlist items
  const categories = React.useMemo(() => {
    const uniqueCategories = [...new Set(wishlistItems.map(item => item.category))]
    return uniqueCategories.map((category, index) => ({
      id: `cat-${index}`,
      name: category,
      slug: category.toLowerCase().replace(/\s+/g, '-')
    }))
  }, [wishlistItems])

  React.useEffect(() => {
    // Reset to first page when filters change
    setCurrentPage(1)
  }, [searchTerm, selectedCategory, sortBy])

  const handleRemoveFromWishlist = (itemId: string) => {
    removeFromWishlist(itemId)
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

  const rateProduct = async (itemId: string, rating: number) => {
    try {
      console.log('⭐ Rating product:', itemId, 'with rating:', rating)
      const response = await fetch('/api/user/rate-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId: itemId,
          rating: rating
        })
      })

      if (response.ok) {
        // Update the rating in wishlist context
        updateItemRating(itemId, rating)
        toast.success(`Merci pour votre évaluation de ${rating} étoile${rating > 1 ? 's' : ''}!`)
      } else {
        toast.error('Échec de l\'évaluation du produit')
      }
    } catch (error) {
      console.error('Error rating product:', error)
      toast.error('Échec de l\'évaluation du produit')
    }
  }







  return (
    <div className="px-4 lg:px-6 space-y-8">
      {/* Innovative Blue Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-4 sm:p-6 md:p-8 text-white shadow-2xl"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-300/20 rounded-full translate-y-24 -translate-x-24 animate-bounce"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-400/10 rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>

        <div className="relative z-10">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight flex items-center gap-3 text-white"
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
                  <Heart className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-blue-200 fill-blue-200" />
                </motion.div>
                Ma Liste de Souhaits
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-white/90 mt-2 text-base sm:text-lg font-medium"
              >
                {totalItems} produit{totalItems !== 1 ? 's' : ''} sauvegardé{totalItems !== 1 ? 's' : ''} • Page {currentPage} sur {totalPages}
              </motion.p>
            </div>
          </div>

          {/* Innovative Stats Cards - Redesigned to match your image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
          >
            {/* Produits Total */}
            <motion.div
              whileHover={{ scale: 1.05, y: -3 }}
              className="bg-white/15 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-blue-300/30 text-center min-w-0 hover:bg-blue-400/20 hover:border-blue-200/50 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-1 drop-shadow-sm">
                {totalItems}
              </div>
              <div className="text-blue-100/90 text-xs sm:text-sm font-semibold uppercase tracking-wide">
                Produits Total
              </div>
            </motion.div>

            {/* En Stock */}
            <motion.div
              whileHover={{ scale: 1.05, y: -3 }}
              className="bg-white/15 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-blue-300/30 text-center min-w-0 hover:bg-blue-400/20 hover:border-blue-200/50 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-1 drop-shadow-sm">
                {filteredItems.filter(item => item.inStock).length}
              </div>
              <div className="text-blue-100/90 text-xs sm:text-sm font-semibold uppercase tracking-wide">
                En Stock
              </div>
            </motion.div>

            {/* Valeur Total - Enhanced Blue Theme */}
            <motion.div
              whileHover={{ scale: 1.05, y: -3 }}
              className="bg-white/15 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-blue-300/30 text-center min-w-0 hover:bg-blue-400/20 hover:border-blue-200/50 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <div className="text-lg sm:text-xl lg:text-2xl font-black text-white mb-1 leading-tight drop-shadow-sm">
                TND {filteredItems.reduce((sum, item) => sum + Number(item.price), 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
              </div>
              <div className="text-blue-100/90 text-xs sm:text-sm font-semibold uppercase tracking-wide">
                Valeur Total
              </div>
            </motion.div>

            {/* Catégories */}
            <motion.div
              whileHover={{ scale: 1.05, y: -3 }}
              className="bg-white/15 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-blue-300/30 text-center min-w-0 hover:bg-blue-400/20 hover:border-blue-200/50 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-1 drop-shadow-sm">
                {categories.length}
              </div>
              <div className="text-blue-100/90 text-xs sm:text-sm font-semibold uppercase tracking-wide">
                Catégories
              </div>
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
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div className="flex flex-col sm:flex-row md:flex-row gap-2 sm:gap-3 md:gap-4">
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
                  className="pl-8 sm:pl-10 text-sm border-blue-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl transition-all duration-300 group-hover:shadow-md"
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
                  className="pl-8 sm:pl-10 pr-6 sm:pr-8 py-2 text-sm border border-blue-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white/80 backdrop-blur-sm min-w-[120px] sm:min-w-[160px] transition-all duration-300 group-hover:shadow-md"
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
                className="px-2 sm:px-3 py-2 text-sm border border-blue-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-md"
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
      {paginatedItems.length === 0 ? (
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
          <div className={`grid gap-2 sm:gap-3 md:gap-4 lg:gap-6 ${
            viewMode === 'grid'
              ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-1'
          }`}>
            {paginatedItems.map((item, index) => (
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
                    onRemove={handleRemoveFromWishlist}
                    onAddToCart={addToCart}
                    onRate={rateProduct}
                    formatCurrency={formatCurrency}
                  />
                ) : (
                  <WishlistItemRow
                    item={item}
                    onRemove={handleRemoveFromWishlist}
                    onAddToCart={addToCart}
                    onRate={rateProduct}
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
  onRate,
  formatCurrency
}: {
  item: WishlistItem
  onRemove: (id: string) => void
  onAddToCart: (item: WishlistItem) => void
  onRate: (itemId: string, rating: number) => void
  formatCurrency: (amount: number) => string
}) {
  const [userRating, setUserRating] = React.useState(0)
  const [isRating, setIsRating] = React.useState(false)
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

          {/* Innovative Remove Button - Always visible on mobile */}
          <div className="absolute top-2 right-2 z-10">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 bg-white/90 hover:bg-red-50 rounded-full shadow-lg backdrop-blur-sm opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 border border-white/50 hover:border-red-200"
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

            {/* Interactive Rating System */}
            <div className="space-y-2">
              {/* Current Rating Display */}
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

              {/* User Rating Interface */}
              <div className="bg-blue-50/50 rounded-lg p-2 sm:p-3 border border-blue-100">
                <div className="text-xs font-semibold text-blue-700 mb-2">Votre évaluation:</div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          setUserRating(star)
                          setIsRating(true)
                          onRate(item.id, star)
                        }}
                        className="focus:outline-none p-1"
                      >
                        <Star
                          className={`h-4 w-4 transition-colors duration-200 ${
                            star <= userRating
                              ? 'fill-blue-500 text-blue-500'
                              : 'fill-gray-200 text-gray-300 hover:fill-blue-300 hover:text-blue-300'
                          }`}
                        />
                      </motion.button>
                    ))}
                  </div>
                  {userRating > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-blue-100 px-2 py-1 rounded-full text-center mx-auto"
                    >
                      <span className="text-xs font-bold text-blue-700">
                        {userRating}/5
                      </span>
                    </motion.div>
                  )}
                </div>
              </div>
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
  onRate,
  formatCurrency
}: {
  item: WishlistItem
  onRemove: (id: string) => void
  onAddToCart: (item: WishlistItem) => void
  onRate: (itemId: string, rating: number) => void
  formatCurrency: (amount: number) => string
}) {
  const [userRating, setUserRating] = React.useState(0)
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
              {/* Current Rating Display */}
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

              {/* User Rating Interface */}
              <div className="bg-blue-50 rounded-lg p-2 sm:p-3 border border-blue-100">
                <div className="text-xs font-semibold text-blue-700 mb-2">Votre note:</div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          setUserRating(star)
                          onRate(item.id, star)
                        }}
                        className="focus:outline-none p-1"
                      >
                        <Star
                          className={`h-4 w-4 transition-colors duration-200 ${
                            star <= userRating
                              ? 'fill-blue-500 text-blue-500'
                              : 'fill-gray-200 text-gray-300 hover:fill-blue-300 hover:text-blue-300'
                          }`}
                        />
                      </motion.button>
                    ))}
                  </div>
                  {userRating > 0 && (
                    <div className="bg-blue-100 px-2 py-1 rounded-full text-center mx-auto">
                      <span className="text-xs font-bold text-blue-700">
                        {userRating}/5
                      </span>
                    </div>
                  )}
                </div>
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


          </div>
        </div>
      </CardContent>
    </Card>
  )
}
