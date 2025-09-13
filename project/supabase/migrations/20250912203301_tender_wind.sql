/*
  # Gesswein Properties Sample Data
  
  This file contains sample properties for testing the application.
  Run this after setting up the main database schema.
*/

-- Insert sample properties
INSERT INTO propiedades (
  titulo, descripcion, tipo, operacion, precio_uf, precio_clp, comuna, direccion,
  superficie_total, superficie_util, dormitorios, banos, estacionamientos,
  bodega, terraza, jardin, piscina, seguridad, imagenes, destacada, estado
) VALUES
(
  'Departamento Premium en Las Condes',
  'Exclusivo departamento de lujo con vista panorámica a la cordillera. Ubicado en el corazón de Las Condes, cerca del metro y centros comerciales. Cuenta con todas las comodidades modernas y acceso a áreas comunes premium.',
  'departamento',
  'venta',
  8500,
  NULL,
  'Las Condes',
  'Av. Apoquindo 4500',
  120,
  95,
  3,
  2,
  2,
  true,
  true,
  false,
  true,
  true,
  ARRAY['https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg', 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg', 'https://images.pexels.com/photos/2029670/pexels-photo-2029670.jpeg'],
  true,
  'disponible'
),
(
  'Casa Familiar en Providencia',
  'Hermosa casa familiar de dos pisos en sector residencial de Providencia. Ideal para familias que buscan tranquilidad pero con fácil acceso al centro de Santiago. Amplio jardín y excelente conectividad.',
  'casa',
  'arriendo',
  NULL,
  2500000,
  'Providencia',
  'Los Leones 1234',
  200,
  180,
  4,
  3,
  2,
  true,
  false,
  true,
  false,
  true,
  ARRAY['https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg', 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg'],
  true,
  'disponible'
),
(
  'Oficina Moderna en Vitacura',
  'Moderna oficina en edificio corporativo A+. Perfecta para empresas en crecimiento que buscan una ubicación estratégica en Vitacura. Incluye estacionamientos y bodega.',
  'oficina',
  'arriendo',
  NULL,
  1800000,
  'Vitacura',
  'Nueva Costanera 3456',
  85,
  85,
  0,
  2,
  3,
  true,
  true,
  false,
  false,
  true,
  ARRAY['https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg'],
  false,
  'disponible'
);