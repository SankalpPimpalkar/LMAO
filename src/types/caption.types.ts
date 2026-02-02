import {
    Timestamp,
    DocumentReference,
} from "firebase/firestore";
import { IUser } from "@/types/auth.types";
import { IBattle } from "@/types/battle.types";

export interface ICaptionVote {
    user: DocumentReference<IUser>;
    votedAt: Timestamp;
}

export interface ICaption {
    id?: string;
    battle: DocumentReference<IBattle>;
    text: string;
    author: DocumentReference<IUser>;
    votes: ICaptionVote[];
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
}

export interface CreateCaptionInput {
    battle: DocumentReference<IBattle>;
    text: string;
    author: DocumentReference<IUser>;
}

export interface VoteCaptionInput {
    captionId: string;
    user: DocumentReference<IUser>;
}
