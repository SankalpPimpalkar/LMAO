"use client";

import { useEffect, useState } from "react";
import BattleCard from "@/components/BattleCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { BattleService } from "@/services/firebase/battle.service";
import { CaptionService } from "@/services/firebase/caption.service";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/configs/firebase.config";
import { Battle } from "@/types";

export default function Home() {
  const [battles, setBattles] = useState<Battle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBattles = async () => {
      try {
        const data = await BattleService.getPublicBattles();

        const formattedBattles = await Promise.all(
          data.map(async (b) => {
            let creatorData = {
              username: "unknown",
              displayName: "Unknown User",
              avatar: ""
            };

            if (b.createdBy) {
              try {
                const userSnap = await getDoc(b.createdBy);
                if (userSnap.exists()) {
                  const u = userSnap.data();
                  creatorData = {
                    username: u.name?.toLowerCase().replace(/\s+/g, '') || "unknown", // Fallback username generation
                    displayName: u.name || "Unknown",
                    avatar: u.imageUrl || ""
                  };
                }
              } catch (e) {
                console.error("Error fetching creator", e);
              }
            }

            // Fallback for missing captionCount field
            let captionCount = (b as any).captionCount;
            if (captionCount === undefined) {
              const { totalCount } = await CaptionService.getCaptionsByBattle(doc(db, "battles", b.id!), undefined);
              captionCount = totalCount;
            }

            return {
              id: b.id || "temp",
              title: b.title,
              description: b.description,
              image: b.imageUrl,
              creator: creatorData,
              stats: {
                captionCount: captionCount,
                viewCount: 0 // Not tracked yet
              },
              endsAt: b.expiresAt?.toDate().toISOString() || new Date().toISOString()
            } as Battle;
          })
        );

        setBattles(formattedBattles);
      } catch (error) {
        console.error("Failed to fetch battles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBattles();
  }, []);

  return (
    <div className="flex justify-center w-full bg-black min-h-screen">
      <div className="w-full max-w-3xl py-4 px-4 md:px-0 flex flex-col gap-4">
        {/* Feed Header / Filter Bar */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto whitespace-nowrap scrollbar-hide pb-2 -mx-1 px-1">
          <Button variant="ghost" size="sm" className="h-auto py-1.5 px-5 flex-shrink-0 rounded-full bg-zinc-100 text-zinc-900 font-bold text-xs hover:bg-white hover:text-black">Best</Button>
          <Button variant="outline" size="sm" className="h-auto py-1.5 px-5 flex-shrink-0 rounded-full text-zinc-500 font-bold text-xs hover:bg-zinc-900 hover:text-zinc-300 border-zinc-800 bg-black/50">Hot</Button>
          <Button variant="outline" size="sm" className="h-auto py-1.5 px-5 flex-shrink-0 rounded-full text-zinc-500 font-bold text-xs hover:bg-zinc-900 hover:text-zinc-300 border-zinc-800 bg-black/50">New</Button>
          <Button variant="outline" size="sm" className="h-auto py-1.5 px-5 flex-shrink-0 rounded-full text-zinc-500 font-bold text-xs hover:bg-zinc-900 hover:text-zinc-300 border-zinc-800 bg-black/50">Top</Button>
        </div>

        {/* Feed */}
        <div className="flex flex-col gap-2">
          {loading ? (
            <div className="text-center text-zinc-500 py-10">Loading battles...</div>
          ) : battles.length > 0 ? (
            battles.map(battle => (
              <BattleCard key={battle.id} battle={battle} />
            ))
          ) : (
            <div className="text-center text-zinc-500 py-10">No active battles found. Be the first to create one!</div>
          )}
        </div>
      </div>
    </div>
  );
}
