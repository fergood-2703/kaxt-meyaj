import { MessageThread, Notification } from '../types';

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'empresa_interesada',
    title: 'Empresa interesada en tu perfil',
    body: 'Restaurante El Faisán revisó tu postulación y está interesada en contactarte.',
    timestamp: '2025-05-16T10:30:00',
    read: false,
    companyName: 'Restaurante El Faisán',
    jobId: '2',
  },
  {
    id: 'n2',
    type: 'postulacion_enviada',
    title: 'Postulación enviada',
    body: 'Tu postulación para Cajero en Super Willys fue enviada correctamente.',
    timestamp: '2025-05-16T09:00:00',
    read: false,
    companyName: 'Super Willys',
    jobId: '1',
  },
  {
    id: 'n3',
    type: 'vacante_nueva',
    title: 'Nueva vacante en tu área',
    body: 'Se publicó una nueva vacante de Recepcionista en Tulum que podría interesarte.',
    timestamp: '2025-05-15T14:00:00',
    read: true,
    jobId: '3',
  },
  {
    id: 'n4',
    type: 'cv_faltante',
    title: 'Completa tu perfil',
    body: 'Sube tu CV para aumentar tus posibilidades de ser contactado por empresas.',
    timestamp: '2025-05-15T08:00:00',
    read: true,
  },
  {
    id: 'n5',
    type: 'postulacion_revisando',
    title: 'Tu postulación está siendo revisada',
    body: 'Hotel Maya Inn está revisando tu solicitud para Auxiliar Administrativo.',
    timestamp: '2025-05-14T16:00:00',
    read: true,
    companyName: 'Hotel Maya Inn',
    jobId: '3',
  },
];

export const mockMessages: MessageThread[] = [
  {
    id: 'm1',
    companyName: 'Restaurante El Faisán',
    jobTitle: 'Mesero',
    lastMessage: 'Estamos interesados en tu perfil. ¿Podemos contactarte?',
    timestamp: '2025-05-16T10:30:00',
    read: false,
    contactPhone: '9987654321',
    whatsapp: '9987654321',
  },
  {
    id: 'm2',
    companyName: 'Hotel Maya Inn',
    jobTitle: 'Auxiliar Administrativo',
    lastMessage: 'Revisamos tu CV y nos gustaría agendar una entrevista.',
    timestamp: '2025-05-15T11:00:00',
    read: true,
    contactPhone: '9831112233',
    whatsapp: '9831112233',
  },
];