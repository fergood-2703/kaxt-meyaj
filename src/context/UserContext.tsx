import { createContext, ReactNode, useContext, useState } from 'react';
import { Application, CVFile, Notification, User } from '../types';

type UserContextType = {
  // Auth
  isLoggedIn: boolean;
  isGuest: boolean;
  login: (name: string, email: string) => void;
  continueAsGuest: () => void;
  logout: () => void;

  // Usuario
  user: User;
  setCv: (cv: CVFile | undefined) => void;
  // Backend TODO: PATCH /api/users/me  { name, phone }
  updateProfile: (name: string, phone?: string) => void;
  // Backend TODO: POST /api/users/me/photo  (multipart)
  setProfilePhoto: (uri: string) => void;

  // Postulaciones
  addApplication: (application: Application) => void;
  hasApplied: (jobId: string) => boolean;

  // Favoritos
  // Backend TODO: POST/DELETE /api/users/me/favorites/:jobId
  toggleFavorite: (jobId: string, jobTitle?: string, companyName?: string) => void;
  isFavorite: (jobId: string) => boolean;

  // Notificaciones
  // Backend TODO: GET /api/notifications  |  PATCH /api/notifications/:id/read
  notifications: Notification[];
  addNotification: (n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  unreadCount: number;
};

const defaultUser: User = {
  id: 'u1',
  name: '',
  email: '',
  role: 'candidato',
  phone: undefined,
  profilePhoto: undefined,
  cv: undefined,
  applications: [],
  favorites: [],
};

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn]     = useState(false);
  const [isGuest, setIsGuest]           = useState(false);
  const [user, setUser]                 = useState<User>(defaultUser);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // ── Auth ──────────────────────────────────────────────────────────────────

  const login = (name: string, email: string) => {
    setUser((prev) => ({ ...prev, name, email }));
    setIsLoggedIn(true);
    setIsGuest(false);
    addNotificationInternal({
      type: 'bienvenida',
      title: '¡Bienvenido a Kaxt Meyaj!',
      body: `Hola ${name}, encuentra oportunidades cerca de ti en Quintana Roo.`,
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

  const updateProfile = (name: string, phone?: string) => {
    setUser((prev) => ({ ...prev, name, phone }));
    // Backend TODO: await api.patch('/users/me', { name, phone })
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

  const addNotificationInternal = (
    n: Omit<Notification, 'id' | 'timestamp' | 'read'>
  ) => {
    const newNotif: Notification = {
      ...n,
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const addNotification = (n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    addNotificationInternal(n);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <UserContext.Provider
      value={{
        isLoggedIn, isGuest, login, continueAsGuest, logout,
        user, setCv, updateProfile, setProfilePhoto,
        addApplication, hasApplied,
        toggleFavorite, isFavorite,
        notifications, addNotification, markAsRead, markAllAsRead, unreadCount,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser debe usarse dentro de UserProvider');
  return ctx;
}