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
    arrayUnion,
    arrayRemove,
    Timestamp,
    runTransaction,
    DocumentReference,
} from "firebase/firestore";

import {
    ICaption,
    CreateCaptionInput,
    ICaptionVote,
} from "@/types/caption.types";
import { IBattle } from "@/types/battle.types";
import { IUser } from "@/types/auth.types";
import { Caption } from "@/types";

export class CaptionService {
    static #collectionRef = collection(db, "captions");

    static async #getCaption(
        captionId: string
    ): Promise<ICaption> {
        const ref = doc(db, "captions", captionId);
        const snapshot = await getDoc(ref);

        if (!snapshot.exists()) {
            throw new Error("Caption not found");
        }

        return { id: snapshot.id, ...snapshot.data() } as ICaption;
    }

    static async #createCaption(
        data: { battleId: string; authorId: string; text: string }
    ): Promise<ICaption> {
        const battleRef = doc(db, "battles", data.battleId);
        const authorRef = doc(db, "users", data.authorId);
        const captionRef = doc(this.#collectionRef);

        const payload: any = {
            battle: battleRef,
            text: data.text,
            author: authorRef,
            votes: [],
            createdAt: Timestamp.now()
        };

        // Use transaction to ensure caption count stays in sync
        await runTransaction(db, async (transaction) => {
            const battleSnap = await transaction.get(battleRef);
            if (!battleSnap.exists()) {
                throw new Error("Battle not found");
            }

            const currentCount = (battleSnap.data() as any).captionCount || 0;
            transaction.set(captionRef, payload);
            transaction.update(battleRef, {
                captionCount: currentCount + 1
            });
        });

        return this.#getCaption(captionRef.id);
    }

    static async #deleteCaption(
        captionId: string
    ): Promise<boolean> {
        await deleteDoc(doc(db, "captions", captionId));
        return true;
    }

    static async createCaption(
        data: { battleId: string; authorId: string; text: string }
    ): Promise<ICaption> {
        return this.#createCaption(data);
    }

    static async getCaptionById(
        captionId: string
    ): Promise<ICaption> {
        return this.#getCaption(captionId);
    }

    static async deleteCaption(
        captionId: string
    ): Promise<boolean> {
        return this.#deleteCaption(captionId);
    }

    static async getCaptionsByBattle(
        battleRef: DocumentReference,
        currentUserId?: string
    ): Promise<{ captions: Caption[]; totalCount: number }> {
        const q = query(
            this.#collectionRef,
            where("battle", "==", battleRef)
        );

        const snapshot = await getDocs(q);
        const currentUserRef = currentUserId ? doc(db, "users", currentUserId) : null;

        const captions = await Promise.all(snapshot.docs.map(async (d) => {
            const data = d.data() as ICaption;

            // Resolve author
            const authorSnap = await getDoc(data.author as any);
            const authorData = authorSnap.data() as IUser;

            return {
                id: d.id,
                battleId: battleRef.id,
                text: data.text,
                author: {
                    uid: authorSnap.id,
                    username: authorData?.name?.toLowerCase().replace(/\s+/g, '') || "unknown",
                    avatar: authorData?.imageUrl || ""
                },
                votes: data.votes?.length || 0,
                votedByMe: currentUserRef ? data.votes?.some(v => v.user.path === currentUserRef.path) : false,
                createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString()
            } as Caption;
        }));

        return {
            captions,
            totalCount: snapshot.size
        };
    }

    static async voteCaption(
        captionId: string,
        userId: string
    ): Promise<void> {
        const captionRef = doc(db, "captions", captionId);
        const userRef = doc(db, "users", userId);

        await runTransaction(db, async (tx) => {
            const snapshot = await tx.get(captionRef);
            if (!snapshot.exists()) {
                throw new Error("Caption not found");
            }

            const data = snapshot.data() as ICaption;
            const alreadyVoted = data.votes?.some(
                (v) => v.user.path === userRef.path
            );

            if (alreadyVoted) return;

            const vote: ICaptionVote = {
                user: userRef as any,
                votedAt: Timestamp.now(),
            };

            tx.update(captionRef, {
                votes: arrayUnion(vote),
            });
        });
    }

    static async unvoteCaption(
        captionId: string,
        userId: string
    ): Promise<void> {
        const captionRef = doc(db, "captions", captionId);
        const userRef = doc(db, "users", userId);

        await runTransaction(db, async (tx) => {
            const snapshot = await tx.get(captionRef);
            if (!snapshot.exists()) return;

            const data = snapshot.data() as ICaption;
            const updatedVotes = (data.votes || []).filter(
                (v) => v.user.path !== userRef.path
            );

            tx.update(captionRef, { votes: updatedVotes });
        });
    }
}
