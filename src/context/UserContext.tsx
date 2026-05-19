import { createContext, ReactNode, useContext, useState } from 'react';
import { Application, CVFile, Notification, User, UserGender, UserRole } from '../types';

type UserContextType = {
  // Auth
  isLoggedIn: boolean;
  isGuest: boolean;
  login: (firstName: string, lastName: string, email: string) => void;
  continueAsGuest: () => void;
  logout: () => void;

  // Usuario
  user: User;
  setCv: (cv: CVFile | undefined) => void;
  // Backend TODO: PATCH /api/users/me  { firstName, lastName, phone, birthDate }
  updateProfile: (data: Partial<Pick<User, 'firstName' | 'lastName' | 'phone' | 'birthDate' | 'gender'>>) => void;
  // Backend TODO: POST /api/users/me/photo  |  DELETE /api/users/me/photo
  setProfilePhoto: (uri: string) => void;

  // Postulaciones
  addApplication: (application: Application) => void;
  hasApplied: (jobId: string) => boolean;

  // Favoritos
  toggleFavorite: (jobId: string, jobTitle?: string, companyName?: string) => void;
  isFavorite: (jobId: string) => boolean;

  // Notificaciones
  notifications: Notification[];
  addNotification: (n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  unreadCount: number;

  register: (data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  birthDate: string;
  gender: UserGender;
  role: UserRole;
}) => void;
};

const defaultUser: User = {
  id: 'u1',
  firstName: '',
  lastName: '',
  email: '',
  role: 'candidato',
  phone: undefined,
  birthDate: undefined,
  profilePhoto: undefined,
  cv: undefined,
  applications: [],
  favorites: [],
};

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn]       = useState(false);
  const [isGuest,    setIsGuest]          = useState(false);
  const [user,       setUser]             = useState<User>(defaultUser);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // ── Auth ──────────────────────────────────────────────────────────────────

  const login = (firstName: string, lastName: string, email: string) => {
    setUser((prev) => ({ ...prev, firstName, lastName, email }));
    setIsLoggedIn(true);
    setIsGuest(false);
    addNotificationInternal({
      type: 'bienvenida',
      title: '¡Bienvenido a Kaxt Meyaj!',
      body: `Hola ${firstName}, encuentra oportunidades cerca de ti en Quintana Roo.`,
    });
  };

  const continueAsGuest = () => {
    setIsGuest(true);
    setIsLoggedIn(false);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setIsGuest(false);
    setUser(defaultUser);
    setNotifications([]);
  };

  // ── Perfil ────────────────────────────────────────────────────────────────

  const setCv = (cv: CVFile | undefined) => {
    setUser((prev) => ({ ...prev, cv }));
    if (cv) {
      addNotificationInternal({
        type: 'cv_subido',
        title: 'CV actualizado',
        body: `Tu CV "${cv.name}" fue guardado. Ahora puedes postularte a más vacantes.`,
      });
    }
  };

  const updateProfile = (data: Partial<Pick<User, 'firstName' | 'lastName' | 'phone' | 'birthDate' | 'gender'>>) => {
    setUser((prev) => ({ ...prev, ...data }));
    // Backend TODO: await api.patch('/users/me', data)
  };

  const setProfilePhoto = (uri: string) => {
    setUser((prev) => ({ ...prev, profilePhoto: uri || undefined }));
    // Backend TODO: if (uri) await api.post('/users/me/photo', formData)
    //               else     await api.delete('/users/me/photo')
  };

  // ── Postulaciones ─────────────────────────────────────────────────────────

  const addApplication = (application: Application) => {
    setUser((prev) => ({
      ...prev,
      applications: [...prev.applications, application],
    }));
  };

  const hasApplied = (jobId: string) =>
    user.applications.some((a) => a.jobId === jobId);

  // ── Favoritos ─────────────────────────────────────────────────────────────

  const toggleFavorite = (jobId: string, jobTitle?: string, companyName?: string) => {
    setUser((prev) => {
      const already = prev.favorites.includes(jobId);
      if (!already && jobTitle) {
        addNotificationInternal({
          type: 'vacante_guardada',
          title: 'Vacante guardada',
          body: `Guardaste "${jobTitle}"${companyName ? ` en ${companyName}` : ''}.`,
          jobId,
        });
      }
      return {
        ...prev,
        favorites: already
          ? prev.favorites.filter((id) => id !== jobId)
          : [...prev.favorites, jobId],
      };
    });
  };

  const isFavorite = (jobId: string) => user.favorites.includes(jobId);

  // ── Notificaciones ────────────────────────────────────────────────────────

  const addNotificationInternal = (n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    setNotifications((prev) => [
      {
        ...n,
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        timestamp: new Date().toISOString(),
        read: false,
      },
      ...prev,
    ]);
  };

  const addNotification = (n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    addNotificationInternal(n);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  // ── Registro ────────────────────────────────────────────────────────
  const register = (data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  birthDate: string;
  gender: UserGender;
  role: UserRole;
}) => {
  // Backend TODO: await api.post('/auth/register', data)
  setUser((prev) => ({
    ...prev,
    firstName: data.firstName,
    lastName:  data.lastName,
    email:     data.email,
    phone:     data.phone,
    birthDate: data.birthDate,
    gender:    data.gender,
    role:      data.role,
  }));
  setIsLoggedIn(true);
  setIsGuest(false);
  addNotificationInternal({
    type: 'bienvenida',
    title: '¡Bienvenido a Kaxt Meyaj!',
    body: `Hola ${data.firstName}, encuentra oportunidades cerca de ti en Quintana Roo.`,
  });
  // Backend TODO: await api.post('/auth/register', data)
};

  return (
    <UserContext.Provider value={{
      isLoggedIn, isGuest, login, continueAsGuest, logout,
      user, setCv, updateProfile, setProfilePhoto,
      addApplication, hasApplied,
      toggleFavorite, isFavorite,
      notifications, addNotification, markAsRead, markAllAsRead, unreadCount,register,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser debe usarse dentro de UserProvider');
  return ctx;
}