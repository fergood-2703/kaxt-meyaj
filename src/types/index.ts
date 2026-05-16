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

// -- CV --
export type CVFile = {
  uri: string;
  name: string;
  type: string;      // 'application/pdf', 'image/jpeg', etc
  size?: number;
};

// -- Aplicación --
export type ApplicationStatus = 'pendiente' | 'revisando' | 'aceptado' | 'rechazado';

export type Application = {
  id: string;
  jobId: string;
  userId: string;
  status: ApplicationStatus;
  appliedAt: string;
  cvAttached: boolean;
};

// -- Usuario (lo usaremos como estado global provisional) --
export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  cv?: CVFile;
  applications: Application[];
};