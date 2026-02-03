"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BattleView from "@/components/BattleView";
import CaptionList from "@/components/CaptionList";
import SubmitCaption from "@/components/SubmitCaption";
import { BattleService } from "@/services/firebase/battle.service";
import { CaptionService } from "@/services/firebase/caption.service";
import { AuthService } from "@/services/firebase/auth.service";
import { doc, getDoc } from "firebase/firestore";
import { Battle, Caption } from "@/types";
import { Loader2 } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/configs/firebase.config";

export default function BattlePage() {
    const { user: currentUser } = useAuth();
    const { id } = useParams<{ id: string }>()!;

    const [battle, setBattle] = useState<Battle | null>(null);
    const [captions, setCaptions] = useState<Caption[]>([]);
    const [loading, setLoading] = useState(true);

    const handleNewCaption = (rawCaption: any) => {
        if (!currentUser) return;

        const newCaption: Caption = {
            id: rawCaption.id,
            battleId: id,
            text: rawCaption.text,
            author: {
                username: currentUser.name?.toLowerCase().replace(/\s+/g, '') || "me",
                avatar: currentUser.imageUrl || ""
            },
            votes: 0,
            votedByMe: false,
            createdAt: new Date().toISOString()
        };

        setCaptions(prev => [newCaption, ...prev]);
        setBattle(prev => prev ? {
            ...prev,
            stats: {
                ...prev.stats,
                captionCount: prev.stats.captionCount + 1
            }
        } : null);
    };

    const fetchData = async () => {
        if (!id) return;
        try {
            // 1. Fetch Battle
            const b = await BattleService.getBattleById(id);

            // 2. Resolve Creator
            const creatorSnap = await getDoc(b.createdBy);
            const creatorData = creatorSnap.data();

            const formattedBattle: Battle = {
                id: b.id || id,
                title: b.title,
                description: b.description,
                image: b.imageUrl,
                creator: {
                    username: creatorData?.name?.toLowerCase().replace(/\s+/g, '') || "unknown",
                    displayName: creatorData?.name || "Unknown",
                    avatar: creatorData?.imageUrl || "U"
                },
                stats: {
                    captionCount: 0, // Will be updated by captions fetch
                    viewCount: 0
                },
                endsAt: b.expiresAt?.toDate().toISOString() || new Date().toISOString()
            };
            console.log(formattedBattle);

            const battleRef = doc(db, "battles", id);
            const { captions: resolvedCaptions, totalCount } = await CaptionService.getCaptionsByBattle(battleRef, currentUser?.uid);

            formattedBattle.stats.captionCount = totalCount;

            setBattle(formattedBattle);
            setCaptions(resolvedCaptions.sort((a, b) => b.votes - a.votes));
        } catch (error) {
            console.error("Failed to fetch battle data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
            </div>
        );
    }

    if (!battle) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black text-zinc-400">
                Battle not found.
            </div>
        );
    }

    return (
        <div className="flex justify-center w-full min-h-screen bg-black">
            <div className="w-full max-w-4xl py-6 px-4">
                <BattleView battle={battle} />

                <div className="bg-zinc-950 border border-zinc-800 rounded-sm p-4">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-zinc-400">Sort by: <span className="font-bold text-zinc-200">Best</span></span>
                    </div>

                    <SubmitCaption battleId={id} onSuccess={handleNewCaption} />

                    <div className="mt-8">
                        <CaptionList captions={captions} />
                    </div>
                </div>
            </div>
        </div>
    );
}
