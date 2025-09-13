'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Users, Gift } from 'lucide-react'
import { COMUNAS_SANTIAGO } from '@/lib/utils/currency'
import { trackLeadSubmission } from '@/lib/analytics'

export default function ReferralForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    nombre_referente: '',
    email_referente: '',
    telefono_referente: '',
    nombre_referido: '',
    email_referido: '',
    telefono_referido: '',
    tipo_propiedad: '',
    presupuesto_min: '',
    presupuesto_max: '',
    comuna_interes: '',
    comentarios: '',
  })
  
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const submitData = {
        ...formData,
        presupuesto_min: formData.presupuesto_min ? Number(formData.presupuesto_min) : undefined,
        presupuesto_max: formData.presupuesto_max ? Number(formData.presupuesto_max) : undefined,
      }

      const response = await fetch('/api/referidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        throw new Error('Error al enviar el formulario')
      }

      // Track the referral submission
      trackLeadSubmission('referral')

      toast({
        title: "¡Referido enviado!",
        description: "Gracias por confiar en nosotros. Nos pondremos en contacto pronto.",
      })

      setFormData({
        nombre_referente: '',
        email_referente: '',
        telefono_referente: '',
        nombre_referido: '',
        email_referido: '',
        telefono_referido: '',
        tipo_propiedad: '',
        presupuesto_min: '',
        presupuesto_max: '',
        comuna_interes: '',
        comentarios: '',
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al enviar el formulario. Intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  return (
    <Card className="mx-auto">
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <Gift className="w-6 h-6 text-blue-600" />
        </div>
        <CardTitle className="text-2xl">Programa de Referidos con Exclusividad</CardTitle>
        <p className="text-muted-foreground">
          ¿Conoces a alguien que busca propiedad? Refiere a un amigo y obtén beneficios exclusivos
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Referente */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-medium">
              <Users className="w-5 h-5" />
              Tus datos (Referente)
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre_referente">Nombre completo *</Label>
                <Input
                  id="nombre_referente"
                  name="nombre_referente"
                  type="text"
                  required
                  value={formData.nombre_referente}
                  onChange={handleChange}
                  placeholder="Tu nombre completo"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email_referente">Email *</Label>
                <Input
                  id="email_referente"
                  name="email_referente"
                  type="email"
                  required
                  value={formData.email_referente}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono_referente">Teléfono</Label>
              <Input
                id="telefono_referente"
                name="telefono_referente"
                type="tel"
                value={formData.telefono_referente}
                onChange={handleChange}
                placeholder="+56 9 1234 5678"
              />
            </div>
          </div>

          {/* Referido */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-medium">
              <Users className="w-5 h-5" />
              Datos del referido
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre_referido">Nombre completo *</Label>
                <Input
                  id="nombre_referido"
                  name="nombre_referido"
                  type="text"
                  required
                  value={formData.nombre_referido}
                  onChange={handleChange}
                  placeholder="Nombre del referido"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email_referido">Email *</Label>
                <Input
                  id="email_referido"
                  name="email_referido"
                  type="email"
                  required
                  value={formData.email_referido}
                  onChange={handleChange}
                  placeholder="email@referido.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono_referido">Teléfono del referido</Label>
              <Input
                id="telefono_referido"
                name="telefono_referido"
                type="tel"
                value={formData.telefono_referido}
                onChange={handleChange}
                placeholder="+56 9 1234 5678"
              />
            </div>
          </div>

          {/* Preferencias */}
          <div className="space-y-4">
            <div className="text-lg font-medium">Preferencias del referido</div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipo_propiedad">Tipo de propiedad</Label>
                <Select
                  value={formData.tipo_propiedad}
                  onValueChange={(value) => handleSelectChange('tipo_propiedad', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casa">Casa</SelectItem>
                    <SelectItem value="departamento">Departamento</SelectItem>
                    <SelectItem value="oficina">Oficina</SelectItem>
                    <SelectItem value="terreno">Terreno</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="comuna_interes">Comuna de interés</Label>
                <Select
                  value={formData.comuna_interes}
                  onValueChange={(value) => handleSelectChange('comuna_interes', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar comuna" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMUNAS_SANTIAGO.map((comuna) => (
                      <SelectItem key={comuna} value={comuna}>
                        {comuna}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="presupuesto_min">Presupuesto mínimo (CLP)</Label>
                <Input
                  id="presupuesto_min"
                  name="presupuesto_min"
                  type="number"
                  value={formData.presupuesto_min}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="presupuesto_max">Presupuesto máximo (CLP)</Label>
                <Input
                  id="presupuesto_max"
                  name="presupuesto_max"
                  type="number"
                  value={formData.presupuesto_max}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comentarios">Comentarios adicionales</Label>
              <Textarea
                id="comentarios"
                name="comentarios"
                rows={3}
                value={formData.comentarios}
                onChange={handleChange}
                placeholder="Cualquier información adicional que pueda ser útil..."
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading} size="lg">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enviando referido...
              </>
            ) : (
              <>
                <Gift className="w-4 h-4 mr-2" />
                Enviar referido
              </>
            )}
          </Button>
          
          <p className="text-xs text-muted-foreground text-center">
            Al enviar este formulario, aceptas nuestros términos del programa de referidos y 
            política de privacidad.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}