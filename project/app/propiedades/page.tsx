'use client'

import { useState, useEffect } from 'react'
import { Metadata } from 'next'
import PropertyCard from '@/components/PropertyCard'
import PropertyFilters, { PropertyFilters as Filters } from '@/components/PropertyFilters'
import { Button } from '@/components/ui/button'
import { Loader2, Search } from 'lucide-react'
import type { Property } from '@/lib/types'

export default function PropiedadesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<Filters>({})

  const fetchProperties = async (currentFilters: Filters = {}) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString())
        }
      })

      const response = await fetch(`/api/propiedades?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch properties')
      }
      
      const data = await response.json()
      setProperties(data)
    } catch (error) {
      console.error('Error fetching properties:', error)
      setProperties([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters)
    fetchProperties(newFilters)
  }

  const handleClearFilters = () => {
    const clearedFilters = {}
    setFilters(clearedFilters)
    fetchProperties(clearedFilters)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Propiedades Disponibles
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Encuentra la propiedad perfecta para ti en las mejores ubicaciones de Santiago
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Filters */}
          <PropertyFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />

          {/* Results */}
          <div className="space-y-6">
            {/* Results header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Search className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">
                  {loading ? 'Buscando...' : `${properties.length} propiedades encontradas`}
                </span>
              </div>
            </div>

            {/* Loading state */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Cargando propiedades...</span>
              </div>
            )}

            {/* Properties grid */}
            {!loading && properties.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}

            {/* Empty state */}
            {!loading && properties.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No se encontraron propiedades
                </h3>
                <p className="text-gray-600 mb-4">
                  Intenta ajustar los filtros de búsqueda para encontrar más opciones
                </p>
                <Button variant="outline" onClick={handleClearFilters}>
                  Limpiar filtros
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}