import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Plus } from "lucide-react";

const Navbar = () => {
  return (
    <div className="flex h-16 items-center px-6 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-8 flex-1">
        <Link href="/" className="text-lg font-black tracking-tighter text-zinc-100 hover:text-zinc-300 transition-colors">
          LMAO
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
          <Link href="/" className="hover:text-zinc-100 transition-colors">Feed</Link>
          <Link href="/leaderboard" className="hover:text-zinc-100 transition-colors">Leaderboard</Link>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/create">
          <Button variant="outline" size="sm" className="h-9 text-xs gap-2 border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-200">
            <Plus className="h-4 w-4" />
            Create
          </Button>
        </Link>
        <Link href="/u/me">
          <Avatar fallback="UI" className="h-8 w-8 text-xs cursor-pointer ring-2 ring-zinc-900 hover:ring-zinc-700 transition-all" />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
