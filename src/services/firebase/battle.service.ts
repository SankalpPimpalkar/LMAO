import { db } from "@/configs/firebase.config";
import {
    collection,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit as limitQuery,
    Timestamp,
} from "firebase/firestore";

import {
    IBattle,
    CreateBattleInput,
    UpdateBattleInput,
} from "@/types/battle.types";

export class BattleService {
    static #collectionRef = collection(db, "battles");

    static async #createBattle(
        data: CreateBattleInput
    ): Promise<IBattle> {
        const battleRef = doc(this.#collectionRef);

        const payload: IBattle = {
            ...data,
            status: "active",
            createdAt: Timestamp.now()
        };

        await setDoc(battleRef, payload);
        return this.#getBattle(battleRef.id);
    }

    static async #getBattle(
        battleId: string
    ): Promise<IBattle> {
        const battleRef = doc(db, "battles", battleId);
        const snapshot = await getDoc(battleRef);

        if (!snapshot.exists()) {
            throw new Error("Battle not found");
        }

        return { id: snapshot.id, ...snapshot.data() } as IBattle;
    }

    static async #updateBattle(
        battleId: string,
        data: UpdateBattleInput
    ): Promise<IBattle> {
        const battleRef = doc(db, "battles", battleId);

        await updateDoc(battleRef, { ...data });
        return this.#getBattle(battleId);
    }

    static async #deleteBattle(
        battleId: string
    ): Promise<boolean> {
        await deleteDoc(doc(db, "battles", battleId));
        return true;
    }

    static async createBattle(
        data: CreateBattleInput
    ): Promise<IBattle> {
        return this.#createBattle(data);
    }

    static async getBattleById(
        battleId: string
    ): Promise<IBattle> {
        return this.#getBattle(battleId);
    }

    static async updateBattle(
        battleId: string,
        data: UpdateBattleInput
    ): Promise<IBattle> {
        return this.#updateBattle(battleId, data);
    }

    static async deleteBattle(
        battleId: string
    ): Promise<boolean> {
        return this.#deleteBattle(battleId);
    }

    static async getPublicBattles(
        limit = 10
    ): Promise<IBattle[]> {
        const q = query(
            this.#collectionRef,
            where("isPublic", "==", true),
            orderBy("createdAt", "desc"),
            limitQuery(limit)
        );

        const snapshot = await getDocs(q);

        return snapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() }) as IBattle
        );
    }

    static async getBattlesByUser(
        userRef: any
    ): Promise<IBattle[]> {
        const q = query(
            this.#collectionRef,
            where("createdBy", "==", userRef),
            orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);

        return snapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() }) as IBattle
        );
    }

    static async getActiveBattles(): Promise<IBattle[]> {
        const now = Timestamp.now();

        const q = query(
            this.#collectionRef,
            where("status", "==", "active"),
            where("expiresAt", ">", now),
            orderBy("expiresAt", "asc")
        );

        const snapshot = await getDocs(q);

        return snapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() }) as IBattle
        );
    }
}
