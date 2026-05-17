export type WorkType = 'tiempo-completo' | 'medio-tiempo' | 'por-horas';
export type Gender = 'hombre' | 'mujer' | 'indistinto';
export type Category = 'hoteles' | 'restaurantes' | 'turismo' | 'oficina' | 'construccion' | 'otro';
export type UserRole = 'candidato' | 'empresario';

export type Company = {
  id: string;
  name: string;
  logo?: string;
  description?: string;
  ownerId: string;
  branches?: string[];
};

export type Job = {
  id: string;
  title: string;
  company: Company;
  salary: string;
  location: string;
  category: Category;
  description: string;
  requirements: string[];
  benefits: string[];
  schedule: string;
  workType: WorkType;
  gender: Gender;
  ageRange?: { min: number; max: number };
  experienceRequired: boolean;
  contactPhone?: string;
  contactEmail?: string;
  whatsapp?: string;
  requiresCv: boolean;
  postedAt: string;
  urgent: boolean;
};

export type CVFile = {
  uri: string;
  name: string;
  type: string;
  size?: number;
};

export type ApplicationStatus = 'pendiente' | 'revisando' | 'aceptado' | 'rechazado';

export type Application = {
  id: string;
  jobId: string;
  userId: string;
  status: ApplicationStatus;
  appliedAt: string;
  cvAttached: boolean;
};

// ─── favorites: array de jobId ───────────────────────────────────────────────
// Cuando haya backend: User.favorites vendrá del endpoint GET /users/me
// y toggleFavorite llamará a POST/DELETE /users/me/favorites/:jobId
export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  cv?: CVFile;
  applications: Application[];
  favorites: string[];   // ← nuevo campo
};

export type NotificationType =
  | 'postulacion_enviada'
  | 'empresa_interesada'
  | 'postulacion_revisando'
  | 'postulacion_aceptada'
  | 'postulacion_rechazada'
  | 'vacante_nueva'
  | 'perfil_incompleto'
  | 'cv_faltante'
  | 'mensaje';

export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  jobId?: string;
  companyName?: string;
};

export type MessageThread = {
  id: string;
  companyName: string;
  jobTitle: string;
  lastMessage: string;
  timestamp: string;
  read: boolean;
  contactPhone?: string;
  whatsapp?: string;
};