import {
    Timestamp,
    DocumentReference,
} from "firebase/firestore";
import { IUser } from "@/types/auth.types";
import { IBattle } from "@/types/battle.types";

export type NotificationType =
    | "battle_created"
    | "battle_expired"
    | "vote_received"
    | "battle_won";

export interface INotification {
    id?: string;
    user: DocumentReference<IUser>;
    type: NotificationType;
    title: string;
    message: string;
    battle?: DocumentReference<IBattle>;
    read: boolean;
    createdAt?: Timestamp;
}

export interface CreateNotificationInput {
    user: DocumentReference<IUser>;
    type: NotificationType;
    title: string;
    message: string;
    battle?: DocumentReference<IBattle>;
}
