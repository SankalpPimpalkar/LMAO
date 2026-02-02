import { Timestamp, DocumentReference } from "firebase/firestore";
import { IUser } from "@/types/auth.types";

export interface IBattle {
    id?: string;
    title: string;
    description?: string;
    imageUrl?: string;
    captions?: string[];
    isPublic: boolean;
    status: BattleStatus;
    duration?: string;
    expiresAt: Timestamp;
    createdBy: DocumentReference<IUser>;
    winner?: DocumentReference<IUser>;
    createdAt?: Timestamp;
}

export type BattleStatus = "active" | "expired";

export interface CreateBattleInput {
    title: string;
    description?: string;
    imageUrl?: string;
    captions?: string[];
    isPublic: boolean;
    duration?: string;
    expiresAt: Timestamp;
    createdBy: DocumentReference<IUser>;
}

export interface UpdateBattleInput {
    title?: string;
    description?: string;
    imageUrl?: string;
    captions?: string[];
    isPublic?: boolean;
    status?: BattleStatus;
    winner?: DocumentReference<IUser>;
}
