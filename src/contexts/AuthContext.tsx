"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/configs/firebase.config";
import { AuthService } from "@/services/firebase/auth.service";
import { IUser } from "@/types/auth.types";

interface AuthContextType {
    user: IUser | null;
    loading: boolean;
    login: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    login: async () => { },
    logout: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    // Try to get existing user from DB, or create if new is handled by signInWithGoogle usually
                    // But here we just want to fetch the profile
                    const dbUser = await AuthService.getCurrentUser();
                    setUser(dbUser);
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                    // Fallback to basic firebase user info if DB fetch fails?
                    // For now, let's keep it simple.
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async () => {
        try {
            const user = await AuthService.signInWithGoogle();
            if (user) setUser(user);
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    const logout = async () => {
        try {
            await auth.signOut();
            setUser(null);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
