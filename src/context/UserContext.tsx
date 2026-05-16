import { createContext, ReactNode, useContext, useState } from 'react';
import { Application, CVFile, User } from '../types';

type UserContextType = {
  user: User;
  setCv: (cv: CVFile | undefined) => void;
  addApplication: (application: Application) => void;
  hasApplied: (jobId: string) => boolean;
};

const defaultUser: User = {
  id: 'u1',
  name: 'Fernando',
  email: 'fernando@kaxtmeyaj.com',
  role: 'candidato',
  cv: undefined,
  applications: [],
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

  const hasApplied = (jobId: string) => {
    return user.applications.some((a) => a.jobId === jobId);
  };

  return (
    <UserContext.Provider value={{ user, setCv, addApplication, hasApplied }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser debe usarse dentro de UserProvider');
  return ctx;
}