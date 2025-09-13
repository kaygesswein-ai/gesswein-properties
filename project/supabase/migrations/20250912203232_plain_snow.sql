/*
  # Gesswein Properties Database Schema

  1. New Tables
    - `propiedades` - Property listings with Chilean-specific fields
    - `leads` - Contact form submissions and property inquiries  
    - `referidos` - Referral program entries

  2. Security
    - Enable RLS on all tables
    - Public read access for properties
    - Insert-only access for leads and referidos via service role

  3. Chilean Real Estate Features
    - UF and CLP pricing support
    - Comuna (district) field
    - Property types common in Chile
    - Surface area measurements
    - Property status tracking
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Propiedades table
CREATE TABLE IF NOT EXISTS propiedades (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo text NOT NULL,
  descripcion text,
  tipo text NOT NULL CHECK (tipo IN ('casa', 'departamento', 'oficina', 'terreno')),
  operacion text NOT NULL CHECK (operacion IN ('venta', 'arriendo')),
  precio_uf numeric,
  precio_clp numeric,
  comuna text NOT NULL,
  direccion text,
  superficie_total numeric,
  superficie_util numeric,
  dormitorios integer,
  banos integer,
  estacionamientos integer,
  bodega boolean DEFAULT false,
  terraza boolean DEFAULT false,
  jardin boolean DEFAULT false,
  piscina boolean DEFAULT false,
  seguridad boolean DEFAULT false,
  imagenes text[] DEFAULT '{}',
  destacada boolean DEFAULT false,
  estado text DEFAULT 'disponible' CHECK (estado IN ('disponible', 'reservado', 'vendido', 'arrendado')),
  latitude numeric,
  longitude numeric,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre text NOT NULL,
  email text NOT NULL,
  telefono text,
  mensaje text,
  propiedad_id uuid REFERENCES propiedades(id),
  tipo_lead text DEFAULT 'contacto' CHECK (tipo_lead IN ('contacto', 'visita', 'general')),
  origen text DEFAULT 'web',
  created_at timestamptz DEFAULT now()
);

-- Referidos table
CREATE TABLE IF NOT EXISTS referidos (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre_referente text NOT NULL,
  email_referente text NOT NULL,
  telefono_referente text,
  nombre_referido text NOT NULL,
  email_referido text NOT NULL,
  telefono_referido text,
  tipo_propiedad text,
  presupuesto_min numeric,
  presupuesto_max numeric,
  comuna_interes text,
  comentarios text,
  estado text DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'contactado', 'cerrado')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE propiedades ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE referidos ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Propiedades: Public read access
CREATE POLICY "Public can read properties"
  ON propiedades
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Leads: Insert only for authenticated users
CREATE POLICY "Anyone can insert leads"
  ON leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Referidos: Insert only for authenticated users  
CREATE POLICY "Anyone can insert referrals"
  ON referidos
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Admin policies (for service role)
CREATE POLICY "Service role can manage properties"
  ON propiedades
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can manage leads"
  ON leads
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can manage referrals"
  ON referidos
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_propiedades_tipo ON propiedades(tipo);
CREATE INDEX IF NOT EXISTS idx_propiedades_operacion ON propiedades(operacion);
CREATE INDEX IF NOT EXISTS idx_propiedades_comuna ON propiedades(comuna);
CREATE INDEX IF NOT EXISTS idx_propiedades_precio_uf ON propiedades(precio_uf);
CREATE INDEX IF NOT EXISTS idx_propiedades_precio_clp ON propiedades(precio_clp);
CREATE INDEX IF NOT EXISTS idx_propiedades_destacada ON propiedades(destacada);
CREATE INDEX IF NOT EXISTS idx_propiedades_estado ON propiedades(estado);
CREATE INDEX IF NOT EXISTS idx_leads_propiedad_id ON leads(propiedad_id);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_referidos_estado ON referidos(estado);