import BattleView from "@/components/BattleView";
import CaptionList from "@/components/CaptionList";
import SubmitCaption from "@/components/SubmitCaption";
import { Button } from "@/components/ui/Button";

export default async function BattlePage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;

    // Mock data for a specific battle
    const battle = {
        id: id,
        title: "When your boss says 'one more task'",
        creator: {
            username: "meme_lord",
            displayName: "Meme Lord",
            avatar: "ML"
        },
        image: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbXN5aG15Zm55Zm55Zm55Zm55Zm55Zm55Zm55Zm55Zm55/ASd0Ukj0y3qMM/giphy.gif",
        stats: {
            captionCount: 248,
            viewCount: 5000
        },
        endsAt: "2024-05-20T12:00:00Z"
    };

    const captions = [
        {
            id: "c1",
            battleId: id,
            text: "I accept my fate.",
            author: {
                username: "dev_guy",
                avatar: "DG"
            },
            votes: 42,
            createdAt: "2024-05-19T10:00:00Z"
        },
        {
            id: "c2",
            battleId: id,
            text: "Guess I'm sleeping in the office.",
            author: {
                username: "intern_noob",
                avatar: "IN"
            },
            votes: 15,
            createdAt: "2024-05-19T11:00:00Z"
        },
        {
            id: "c3",
            battleId: id,
            text: "*Quietly updates resume*",
            author: {
                username: "senior_dev",
                avatar: "SD"
            },
            votes: 8,
            createdAt: "2024-05-19T12:00:00Z"
        }
    ];

    return (
        <div className="flex justify-center w-full min-h-screen bg-black">
            <div className="w-full max-w-4xl py-6 px-4">
                <BattleView battle={battle} />

                <div className="bg-zinc-950 border border-zinc-800 rounded-sm p-4 md:p-8">
                    <div className="flex items-center justify-between mb-6">
                        <span className="text-sm font-medium text-zinc-400">Sort by: <span className="font-bold text-zinc-200">Best</span></span>
                    </div>

                    <SubmitCaption />

                    <div className="mt-8">
                        <CaptionList captions={captions} />
                    </div>
                </div>
            </div>
        </div>
    );
}
