"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Bold, Italic, Link as LinkIcon, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { CaptionService } from "@/services/firebase/caption.service";
import { ICaption } from "@/types/caption.types";

interface SubmitCaptionProps {
    battleId: string;
    onSuccess?: (caption: ICaption) => void;
}

const SubmitCaption = ({ battleId, onSuccess }: SubmitCaptionProps) => {
    const { user } = useAuth();
    const router = useRouter();
    const [text, setText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handlePost = async () => {
        if (!user) {
            router.push("/login");
            return;
        }

        if (!text.trim()) return;

        setIsSubmitting(true);
        try {
            const newCaption = await CaptionService.createCaption({
                battleId,
                authorId: user.uid!,
                text: text.trim(),
            });
            setText("");
            if (onSuccess) onSuccess(newCaption);
        } catch (error) {
            console.error("Failed to post caption:", error);
            alert("Failed to post caption. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mb-4 border border-zinc-800 rounded-md bg-zinc-950 overflow-hidden focus-within:ring-1 focus-within:ring-zinc-700">
            <textarea
                className="w-full bg-zinc-950 p-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none min-h-[100px] resize-y"
                placeholder="Write a funny caption..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={isSubmitting}
            ></textarea>

            <div className="bg-zinc-900/50 p-2 flex justify-between items-center border-t border-zinc-800">
                <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-500 hover:text-zinc-300">
                        <Bold className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-500 hover:text-zinc-300">
                        <Italic className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-500 hover:text-zinc-300">
                        <LinkIcon className="h-3 w-3" />
                    </Button>
                </div>
                <Button
                    size="sm"
                    className="h-7 text-xs font-bold bg-zinc-100 text-zinc-900 hover:bg-zinc-200 rounded-full"
                    onClick={handlePost}
                    disabled={isSubmitting || !text.trim()}
                >
                    {isSubmitting ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
                    Post Caption
                </Button>
            </div>
        </div>
    );
};

export default SubmitCaption;
