import { Timestamp } from "firebase/firestore";

export interface IUser {
    uid?: string;
    name: string;
    username: string;
    email: string;
    imageUrl: string;
    bio?: string;
    points?: number;
    createdAt?: Timestamp;
}

export interface CreateUserInput {
    uid: string;
    name: string;
    email: string;
    imageUrl: string;
}

export interface UpdateUserInput {
    name?: string;
    username?: string;
    imageUrl?: string;
    bio?: string;
    points?: number;
}

export interface UserSearchQuery {
    name?: string;
    bio?: string;
    limit?: number;
}
