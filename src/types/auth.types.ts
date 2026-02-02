import { Timestamp } from "firebase/firestore";

export interface IUser {
    uid?: string;
    name: string;
    email: string;
    imageUrl: string;
    bio?: string;
    points?: number;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
}

export interface CreateUserInput {
    uid: string;
    name: string;
    email: string;
    imageUrl: string;
}

export interface UpdateUserInput {
    name?: string;
    imageUrl?: string;
    bio?: string;
    points?: number;
}

export interface UserSearchQuery {
    name?: string;
    bio?: string;
    limit?: number;
}
