import BattleCard from "@/components/BattleCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const mockBattles = [
  {
    id: "1",
    title: "When your boss says 'one more task' right before 5 PM",
    creator: {
      username: "meme_lord",
      displayName: "Meme Lord",
      avatar: "ML"
    },
    image: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbXN5aG15Zm55Zm55Zm55Zm55Zm55Zm55Zm55Zm55Zm55/ASd0Ukj0y3qMM/giphy.gif",
    topCaption: "I accept my fate.",
    stats: {
      captionCount: 248,
      viewCount: 1200
    },
    endsAt: "2024-05-20T12:00:00Z"
  },
  {
    id: "2",
    title: "Trying to center a div in 2024 be like",
    creator: {
      username: "css_hater",
      displayName: "CSS Hater",
      avatar: "CH"
    },
    description: "That moment when you use flexbox and it still goes to the left. Why is CSS so hard?",
    topCaption: "margin: 0 auto; why isn't it working?!",
    stats: {
      captionCount: 156,
      viewCount: 850
    },
    endsAt: "2024-05-21T15:00:00Z"
  },
  {
    id: "3",
    title: "Deploying on Friday: A Short Horror Story",
    creator: {
      username: "dev_ops",
      displayName: "Dev Ops Guy",
      avatar: "DO"
    },
    image: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbXN5aG15Zm55Zm55Zm55Zm55Zm55Zm55Zm55Zm55Zm55/NTYxj8F6N5a/giphy.gif",
    topCaption: "What could go wrong?",
    stats: {
      captionCount: 89,
      viewCount: 400
    },
    endsAt: "2024-05-22T09:00:00Z"
  }
];

export default function Home() {
  return (
    <div className="flex justify-center w-full bg-black min-h-screen">
      <div className="w-full max-w-3xl py-4 flex flex-col gap-4">
        {/* Feed Header / Filter Bar */}
        <div className="flex items-center gap-2 px-5">
          <Button variant="ghost" size="sm" className="h-auto py-1.5 px-5 rounded-full bg-zinc-100 text-zinc-900 font-bold text-xs hover:bg-white hover:text-black">Best</Button>
          <Button variant="ghost" size="sm" className="h-auto py-1.5 px-5 rounded-full text-zinc-500 font-bold text-xs hover:bg-zinc-900 hover:text-zinc-300">Hot</Button>
          <Button variant="ghost" size="sm" className="h-auto py-1.5 px-5 rounded-full text-zinc-500 font-bold text-xs hover:bg-zinc-900 hover:text-zinc-300">New</Button>
          <Button variant="ghost" size="sm" className="h-auto py-1.5 px-5 rounded-full text-zinc-500 font-bold text-xs hover:bg-zinc-900 hover:text-zinc-300">Top</Button>
        </div>

        {/* Feed */}
        <div className="flex flex-col gap-2">
          {mockBattles.map(battle => (
            <BattleCard key={battle.id} battle={battle} />
          ))}
        </div>
      </div>
    </div>
  );
}
