import { auth, db } from "@/configs/firebase.config";
import {
    GoogleAuthProvider,
    signInWithPopup,
    deleteUser as firebaseDeleteUser,
} from "firebase/auth";
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    collection,
    query,
    where,
    getDocs,
    limit as limitQuery,
    Timestamp,
} from "firebase/firestore";

import {
    IUser,
    CreateUserInput,
    UpdateUserInput,
    UserSearchQuery,
} from "@/types/auth.types";

export class AuthService {
    static #googleProvider = new GoogleAuthProvider();

    static async #createUser(data: CreateUserInput): Promise<IUser | null> {
        const userRef = doc(db, "users", data.uid);

        const payload: IUser = {
            name: data.name,
            email: data.email,
            imageUrl: data.imageUrl,
            points: 0,
            createdAt: Timestamp.now()
        };

        await setDoc(userRef, payload, { merge: true });
        return await this.#getUser(data.uid);
    }

    static async #getUser(uid: string): Promise<IUser | null> {
        const userRef = doc(db, "users", uid);
        const snapshot = await getDoc(userRef);

        if (!snapshot.exists()) return null;
        return { uid, ...snapshot.data() } as IUser;
    }

    static async #updateUser(
        uid: string,
        data: UpdateUserInput
    ): Promise<IUser | null> {
        const userRef = doc(db, "users", uid);

        await updateDoc(userRef, { ...data });
        return await this.#getUser(uid);
    }

    static async #deleteUser(uid: string): Promise<boolean> {
        await deleteDoc(doc(db, "users", uid));
        return true;
    }

    static async signInWithGoogle(): Promise<IUser | null> {
        const { user } = await signInWithPopup(
            auth,
            this.#googleProvider
        );

        return this.#createUser({
            uid: user.uid,
            name: user.displayName || "",
            email: user.email || "",
            imageUrl: user.photoURL || "",
        });
    }

    static async getCurrentUser(): Promise<IUser | null> {
        const user = auth.currentUser;
        if (!user) return null;

        return this.#getUser(user.uid);
    }

    static async updateProfile(
        data: UpdateUserInput
    ): Promise<IUser | null> {
        const user = auth.currentUser;
        if (!user) throw new Error("User not authenticated");

        return this.#updateUser(user.uid, data);
    }

    static async deleteAccount(): Promise<boolean> {
        const user = auth.currentUser;
        if (!user) throw new Error("User not authenticated");

        await this.#deleteUser(user.uid);
        await firebaseDeleteUser(user);
        return true;
    }

    static async getUsersByNameAndBio(
        params: UserSearchQuery
    ): Promise<IUser[]> {
        const usersRef = collection(db, "users");
        const constraints = [];

        if (params.name) {
            constraints.push(
                where("name", ">=", params.name),
                where("name", "<=", params.name + "\uf8ff")
            );
        }

        if (params.bio) {
            constraints.push(
                where("bio", ">=", params.bio),
                where("bio", "<=", params.bio + "\uf8ff")
            );
        }

        if (params.limit) {
            constraints.push(limitQuery(params.limit));
        }

        const q = query(usersRef, ...constraints);
        const snapshot = await getDocs(q);

        return snapshot.docs.map(
            (doc) => ({ uid: doc.id, ...doc.data() }) as IUser
        );
    }
}
