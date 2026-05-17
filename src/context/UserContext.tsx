import { createContext, ReactNode, useContext, useState } from 'react';
import { Application, CVFile, Notification, User } from '../types';

// ─── Tipos del contexto ───────────────────────────────────────────────────────
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

  // Postulaciones
  addApplication: (application: Application) => void;
  hasApplied: (jobId: string) => boolean;

  // Favoritos
  // Backend TODO: POST /api/users/me/favorites/:jobId  |  DELETE /api/users/me/favorites/:jobId
  toggleFavorite: (jobId: string, jobTitle?: string, companyName?: string) => void;
  isFavorite: (jobId: string) => boolean;

  // Notificaciones
  // Backend TODO: GET /api/notifications  |  POST /api/notifications  |  PATCH /api/notifications/:id/read
  notifications: Notification[];
  addNotification: (n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  unreadCount: number;
};

// ─── Defaults ─────────────────────────────────────────────────────────────────
const defaultUser: User = {
  id: 'u1',
  name: '',
  email: '',
  role: 'candidato',
  cv: undefined,
  applications: [],
  favorites: [],
};

const UserContext = createContext<UserContextType | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function UserProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isGuest, setIsGuest]       = useState(false);
  const [user, setUser]             = useState<User>(defaultUser);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // ── Auth ──────────────────────────────────────────────────────────────────

  const login = (name: string, email: string) => {
    setUser((prev) => ({ ...prev, name, email }));
    setIsLoggedIn(true);
    setIsGuest(false);

    // Notificación de bienvenida al iniciar sesión por primera vez
    // Backend TODO: este bloque se reemplaza con la respuesta del endpoint POST /api/auth/login
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

  // ── CV ────────────────────────────────────────────────────────────────────

  const setCv = (cv: CVFile | undefined) => {
    setUser((prev) => ({ ...prev, cv }));

    if (cv) {
      // Notificación automática al subir/cambiar CV
      addNotificationInternal({
        type: 'cv_subido',
        title: 'CV actualizado',
        body: `Tu CV "${cv.name}" fue guardado correctamente. Ahora puedes postularte a más vacantes.`,
      });
    }
  };

  // ── Postulaciones ─────────────────────────────────────────────────────────

  const addApplication = (application: Application) => {
    setUser((prev) => ({
      ...prev,
      applications: [...prev.applications, application],
    }));
    // La notificación la dispara ApplyButton junto con addApplication
    // para tener acceso al nombre del puesto y empresa
  };

  const hasApplied = (jobId: string) =>
    user.applications.some((a) => a.jobId === jobId);

  // ── Favoritos ─────────────────────────────────────────────────────────────

  const toggleFavorite = (jobId: string, jobTitle?: string, companyName?: string) => {
    setUser((prev) => {
      const already = prev.favorites.includes(jobId);

      // Notificación solo al guardar (no al quitar)
      if (!already && jobTitle) {
        addNotificationInternal({
          type: 'vacante_guardada',
          title: 'Vacante guardada',
          body: `Guardaste "${jobTitle}"${companyName ? ` en ${companyName}` : ''}. La encontrarás en tu lista de favoritos.`,
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
    // Backend TODO:
    // already
    //   ? await api.delete(`/users/me/favorites/${jobId}`)
    //   : await api.post(`/users/me/favorites/${jobId}`)
  };

  const isFavorite = (jobId: string) => user.favorites.includes(jobId);

  // ── Notificaciones ────────────────────────────────────────────────────────

  // Función interna usada por login, setCv, toggleFavorite
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

  // Función pública — para que ApplyButton y otros componentes puedan agregar notificaciones
  const addNotification = (n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    addNotificationInternal(n);
    // Backend TODO: await api.post('/notifications', n)
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    // Backend TODO: await api.patch(`/notifications/${id}/read`)
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    // Backend TODO: await api.patch('/notifications/read-all')
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  // ── Context value ─────────────────────────────────────────────────────────

  return (
    <UserContext.Provider
      value={{
        isLoggedIn,
        isGuest,
        login,
        continueAsGuest,
        logout,
        user,
        setCv,
        addApplication,
        hasApplied,
        toggleFavorite,
        isFavorite,
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        unreadCount,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser debe usarse dentro de UserProvider');
  return ctx;
}