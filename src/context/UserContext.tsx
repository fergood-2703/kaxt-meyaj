import { createContext, ReactNode, useContext, useState } from 'react';
import { Application, CVFile, User } from '../types';

type UserContextType = {
  user: User;
  setCv: (cv: CVFile | undefined) => void;
  addApplication: (application: Application) => void;
  hasApplied: (jobId: string) => boolean;
  // ─── Favoritos ────────────────────────────────────────────────────────────
  // Para el backend: reemplazar el setUser interno por llamadas a
  //   POST   /api/users/me/favorites/:jobId   (agregar)
  //   DELETE /api/users/me/favorites/:jobId   (quitar)
  // y actualizar el estado local con la respuesta.
  toggleFavorite: (jobId: string) => void;
  isFavorite: (jobId: string) => boolean;
};

const defaultUser: User = {
  id: 'u1',
  name: 'Fernando',
  email: 'fernando@kaxtmeyaj.com',
  role: 'candidato',
  cv: undefined,
  applications: [],
  favorites: [],
};

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(defaultUser);

  const setCv = (cv: CVFile | undefined) => {
    setUser((prev) => ({ ...prev, cv }));
  };

  const addApplication = (application: Application) => {
    setUser((prev) => ({
      ...prev,
      applications: [...prev.applications, application],
    }));
  };

  const hasApplied = (jobId: string) =>
    user.applications.some((a) => a.jobId === jobId);

  const toggleFavorite = (jobId: string) => {
    setUser((prev) => {
      const already = prev.favorites.includes(jobId);
      return {
        ...prev,
        favorites: already
          ? prev.favorites.filter((id) => id !== jobId)
          : [...prev.favorites, jobId],
      };
    });
    // TODO (backend):
    // const already = user.favorites.includes(jobId);
    // if (already) {
    //   await api.delete(`/users/me/favorites/${jobId}`);
    // } else {
    //   await api.post(`/users/me/favorites/${jobId}`);
    // }
  };

  const isFavorite = (jobId: string) => user.favorites.includes(jobId);

  return (
    <UserContext.Provider
      value={{ user, setCv, addApplication, hasApplied, toggleFavorite, isFavorite }}
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