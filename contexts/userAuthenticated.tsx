'use client'

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { IUser } from '../models/User';

interface AuthContextType {
    user: IUser | null;
    setUser: (user: IUser | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const UserAuthenticatedProvider = ({ children }: { children: ReactNode }) => {
    // Carrega o usuário do localStorage no estado inicial
    const [user, setUserState] = useState<IUser | null>(null);

    // Atualiza o localStorage sempre que o usuário mudar
    const setUser = (user: IUser | null) => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
        setUserState(user);
    };

    // Verifica se há um usuário no localStorage ao carregar o contexto
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUserState(JSON.parse(storedUser));
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useUserAuthenticated = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useUserAuthenticated must be used within a UserAuthenticatedProvider');
    }
    return context;
};