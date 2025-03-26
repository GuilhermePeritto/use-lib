'use client'

// contexts/AuthContext.tsx
import { createContext, ReactNode, useContext, useState } from 'react';
import { IUser } from '../models/User'; // Ajuste o caminho conforme sua estrutura

interface AuthContextType {
    user: IUser | null;
    setUser: (user: IUser | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const UserAuthenticatedProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(null);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useUserAuthenticated = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};