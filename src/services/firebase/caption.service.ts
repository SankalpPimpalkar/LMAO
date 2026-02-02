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
        data: CreateCaptionInput
    ): Promise<ICaption> {
        const ref = doc(this.#collectionRef);

        const payload: ICaption = {
            battle: data.battle,
            text: data.text,
            author: data.author,
            votes: [],
            createdAt: Timestamp.now()
        };

        await setDoc(ref, payload);
        return this.#getCaption(ref.id);
    }

    static async #deleteCaption(
        captionId: string
    ): Promise<boolean> {
        await deleteDoc(doc(db, "captions", captionId));
        return true;
    }

    static async createCaption(
        data: CreateCaptionInput
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
        battleRef: DocumentReference<IBattle>
    ): Promise<ICaption[]> {
        const q = query(
            this.#collectionRef,
            where("battle", "==", battleRef)
        );

        const snapshot = await getDocs(q);

        return snapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() }) as ICaption
        );
    }

    static async voteCaption(
        captionId: string,
        userRef: DocumentReference<IUser>
    ): Promise<void> {
        const captionRef = doc(db, "captions", captionId);

        await runTransaction(db, async (tx) => {
            const snapshot = await tx.get(captionRef);
            if (!snapshot.exists()) {
                throw new Error("Caption not found");
            }

            const data = snapshot.data() as ICaption;
            const alreadyVoted = data.votes.some(
                (v) => v.user.path === userRef.path
            );

            if (alreadyVoted) return;

            const vote: ICaptionVote = {
                user: userRef,
                votedAt: Timestamp.now(),
            };

            tx.update(captionRef, {
                votes: arrayUnion(vote),
            });
        });
    }

    static async unvoteCaption(
        captionId: string,
        userRef: DocumentReference<IUser>
    ): Promise<void> {
        const captionRef = doc(db, "captions", captionId);

        await runTransaction(db, async (tx) => {
            const snapshot = await tx.get(captionRef);
            if (!snapshot.exists()) return;

            const data = snapshot.data() as ICaption;
            const updatedVotes = data.votes.filter(
                (v) => v.user.path !== userRef.path
            );

            tx.update(captionRef, { votes: updatedVotes });
        });
    }
}
