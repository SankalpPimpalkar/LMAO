export interface User {
    uid: string;
    username: string;
    displayName: string;
    avatar: string;
    stats: {
        wins: number;
        points: number;
    };
    bio?: string;
    joinedAt?: string;
}

export interface Battle {
    id: string;
    title: string;
    description?: string;
    image?: string;
    creator: {
        uid?: string;
        username: string;
        displayName: string;
        avatar: string;
    };
    stats: {
        captionCount: number;
        viewCount?: number;
    };
    endsAt: string; // ISO String
    topCaption?: string;
}

export interface Caption {
    id: string;
    battleId: string;
    text: string;
    author: {
        uid?: string;
        username: string;
        avatar: string;
    };
    votes: number;
    votedByMe?: boolean;
    createdAt: string;
}
