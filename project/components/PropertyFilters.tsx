'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { X, Filter } from 'lucide-react'
import { COMUNAS_SANTIAGO } from '@/lib/utils/currency'

export interface PropertyFilters {
  operacion?: 'venta' | 'arriendo'
  tipo?: 'casa' | 'departamento' | 'oficina' | 'terreno'
  comuna?: string
  precio_min?: number
  precio_max?: number
  superficie_min?: number
  dormitorios?: number
}

interface PropertyFiltersProps {
  filters: PropertyFilters
  onFiltersChange: (filters: PropertyFilters) => void
  onClearFilters: () => void
}

const ALL = '__all__' // Valor placeholder para "todas/todos"

export default function PropertyFilters({
  filters,
  onFiltersChange,
  onClearFilters,
}: PropertyFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const updateFilter = (key: keyof PropertyFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    })
  }

  const activeFiltersCount = Object.values(filters).filter((v) => v !== undefined && v !== null && v !== '').length

  const getActiveFilterLabels = () => {
    const labels: string[] = []
    if (filters.operacion) labels.push(filters.operacion === 'venta' ? 'Venta' : 'Arriendo')
    if (filters.tipo) labels.push(filters.tipo.charAt(0).toUpperCase() + filters.tipo.slice(1))
    if (filters.comuna) labels.push(filters.comuna)
    if (filters.precio_min) labels.push(`Min: ${filters.precio_min.toLocaleString('es-CL')}`)
    if (filters.precio_max) labels.push(`Max: ${filters.precio_max.toLocaleString('es-CL')}`)
    if (filters.superficie_min) labels.push(`${filters.superficie_min}m² min`)
    if (filters.dormitorios) labels.push(`${filters.dormitorios} dorm`)
    return labels
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex gap-2">
            {activeFiltersCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClearFilters}
                className="text-xs"
              >
                <X className="w-3 h-3 mr-1" />
                Limpiar
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="md:hidden"
            >
              {isExpanded ? 'Ocultar' : 'Mostrar'}
            </Button>
          </div>
        </div>

        {/* Filtros activos */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {getActiveFilterLabels().map((label, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {label}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent className={`space-y-4 ${isExpanded ? 'block' : 'hidden md:block'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Operación */}
          <div className="space-y-2">
            <Label htmlFor="operacion">Operación</Label>
            <Select
              value={filters.operacion ?? ALL}
              onValueChange={(v) => updateFilter('operacion', v === ALL ? undefined : (v as 'venta' | 'arriendo'))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Todas</SelectItem>
                <SelectItem value="venta">Venta</SelectItem>
                <SelectItem value="arriendo">Arriendo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tipo */}
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de Propiedad</Label>
            <Select
              value={filters.tipo ?? ALL}
              onValueChange={(v) =>
                updateFilter('tipo', v === ALL ? undefined : (v as 'casa' | 'departamento' | 'oficina' | 'terreno'))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Todos</SelectItem>
                <SelectItem value="casa">Casa</SelectItem>
                <SelectItem value="departamento">Departamento</SelectItem>
                <SelectItem value="oficina">Oficina</SelectItem>
                <SelectItem value="terreno">Terreno</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Comuna */}
          <div className="space-y-2">
            <Label htmlFor="comuna">Comuna</Label>
            <Select
              value={filters.comuna ?? ALL}
              onValueChange={(v) => updateFilter('comuna', v === ALL ? undefined : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Todas</SelectItem>
                {COMUNAS_SANTIAGO.map((comuna) => (
                  <SelectItem key={comuna} value={comuna}>
                    {comuna}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Precio mínimo */}
          <div className="space-y-2">
            <Label htmlFor="precio_min">Precio Mínimo (CLP)</Label>
            <Input
              id="precio_min"
              type="number"
              placeholder="0"
              value={filters.precio_min ?? ''}
              onChange={(e) =>
                updateFilter('precio_min', e.target.value ? Number(e.target.value) : undefined)
              }
            />
          </div>

          {/* Precio máximo */}
          <div className="space-y-2">
            <Label htmlFor="precio_max">Precio Máximo (CLP)</Label>
            <Input
              id="precio_max"
              type="number"
              placeholder="0"
              value={filters.precio_max ?? ''}
              onChange={(e) =>
                updateFilter('precio_max', e.target.value ? Number(e.target.value) : undefined)
              }
            />
          </div>

          {/* Superficie mínima */}
          <div className="space-y-2">
            <Label htmlFor="superficie_min">Superficie Mín (m²)</Label>
            <Input
              id="superficie_min"
              type="number"
              placeholder="0"
              value={filters.superficie_min ?? ''}
              onChange={(e) =>
                updateFilter('superficie_min', e.target.value ? Number(e.target.value) : undefined)
              }
            />
          </div>

          {/* Dormitorios */}
          <div className="space-y-2">
            <Label htmlFor="dormitorios">Dormitorios</Label>
            <Select
              value={filters.dormitorios != null ? String(filters.dormitorios) : ALL}
              onValueChange={(v) =>
                updateFilter('dormitorios', v === ALL ? undefined : Number(v))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Cualquiera" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Cualquiera</SelectItem>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export { PropertyFilters }
