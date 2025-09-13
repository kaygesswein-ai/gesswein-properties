'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Send } from 'lucide-react'
import { trackLeadSubmission } from '@/lib/analytics'

interface LeadFormProps {
  propertyId?: string
  propertyTitle?: string
  type?: 'contact' | 'visit' | 'general'
  title?: string
  description?: string
}

export default function LeadForm({
  propertyId,
  propertyTitle,
  type = 'general',
  title = 'Contáctanos',
  description = 'Completa el formulario y nos pondremos en contacto contigo'
}: LeadFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: '',
  })
  
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          propiedad_id: propertyId,
          tipo_lead: type,
          origen: 'web',
        }),
      })

      if (!response.ok) {
        throw new Error('Error al enviar el formulario')
      }

      // Track the lead submission
      trackLeadSubmission(type)

      toast({
        title: "¡Mensaje enviado!",
        description: "Nos pondremos en contacto contigo pronto.",
      })

      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        mensaje: '',
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        {propertyTitle && (
          <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
            Consulta sobre: {propertyTitle}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre completo *</Label>
              <Input
                id="nombre"
                name="nombre"
                type="text"
                required
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Tu nombre completo"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              name="telefono"
              type="tel"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="+56 9 1234 5678"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mensaje">Mensaje</Label>
            <Textarea
              id="mensaje"
              name="mensaje"
              rows={4}
              value={formData.mensaje}
              onChange={handleChange}
              placeholder={
                type === 'visit' 
                  ? 'Cuéntanos sobre tu interés en visitar esta propiedad...'
                  : 'Cuéntanos cómo podemos ayudarte...'
              }
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                {type === 'visit' ? 'Solicitar visita' : 'Enviar mensaje'}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}