import { db } from "@/configs/firebase.config";
import {
    collection,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit as limitQuery,
    Timestamp,
} from "firebase/firestore";

import {
    INotification,
    CreateNotificationInput,
} from "@/types/notification.types";

export class NotificationService {
    static #collectionRef = collection(db, "notifications");

    static async #getNotification(
        notificationId: string
    ): Promise<INotification> {
        const ref = doc(db, "notifications", notificationId);
        const snapshot = await getDoc(ref);

        if (!snapshot.exists()) {
            throw new Error("Notification not found");
        }

        return {
            id: snapshot.id,
            ...snapshot.data(),
        } as INotification;
    }

    static async #createNotification(
        data: CreateNotificationInput
    ): Promise<INotification> {
        const ref = doc(this.#collectionRef);

        const payload: INotification = {
            user: data.user,
            type: data.type,
            title: data.title,
            message: data.message,
            battle: data.battle,
            read: false,
            createdAt: Timestamp.now()
        };

        await setDoc(ref, payload);
        return this.#getNotification(ref.id);
    }

    static async #markAsRead(
        notificationId: string
    ): Promise<boolean> {
        const ref = doc(db, "notifications", notificationId);
        await updateDoc(ref, { read: true });
        return true;
    }

    static async sendNotification(
        data: CreateNotificationInput
    ): Promise<INotification> {
        return this.#createNotification(data);
    }

    static async getNotificationById(
        notificationId: string
    ): Promise<INotification> {
        return this.#getNotification(notificationId);
    }

    static async markNotificationAsRead(
        notificationId: string
    ): Promise<boolean> {
        return this.#markAsRead(notificationId);
    }

    static async getUserNotifications(
        userRef: any,
        limit = 20
    ): Promise<INotification[]> {
        const q = query(
            this.#collectionRef,
            where("user", "==", userRef),
            orderBy("createdAt", "desc"),
            limitQuery(limit)
        );

        const snapshot = await getDocs(q);

        return snapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() }) as INotification
        );
    }

    static async getUnreadNotifications(
        userRef: any
    ): Promise<INotification[]> {
        const q = query(
            this.#collectionRef,
            where("user", "==", userRef),
            where("read", "==", false),
            orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);

        return snapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() }) as INotification
        );
    }
}
