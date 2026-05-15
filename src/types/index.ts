export type WorkType = 'tiempo-completo' | 'medio-tiempo' | 'por-horas';
export type Gender = 'hombre' | 'mujer' | 'indistinto';
export type Category = 'hoteles' | 'restaurantes' | 'turismo' | 'oficina' | 'construccion' | 'otro';
export type UserRole = 'candidato' | 'empresario';

export type Company = {
  id: string;
  name: string;
  logo?: string;           // URL cuando haya backend
  description?: string;
  ownerId: string;         // ID del empresario dueño
  branches?: string[];     // sucursales
};

export type Job = {
  id: string;
  title: string;
  company: Company;
  salary: string;
  location: string;
  category: Category;

  // Descripción
  description: string;
  requirements: string[];
  benefits: string[];

  // Horario
  schedule: string;
  workType: WorkType;

  // Perfil
  gender: Gender;
  ageRange?: { min: number; max: number };
  experienceRequired: boolean;

  // Contacto
  contactPhone?: string;
  contactEmail?: string;
  whatsapp?: string;       // para el botón de WhatsApp

  // CV
  requiresCv: boolean;     // ¿la vacante pide CV?

  // Meta
  postedAt: string;
  urgent: boolean;
};