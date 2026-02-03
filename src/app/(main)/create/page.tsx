"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ImagePlus, Info, Eye, EyeOff, X, Loader2 } from "lucide-react";
import BattleCard from "@/components/BattleCard";
import { Battle } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { UploadService } from "@/services/upload.service";
import { BattleService } from "@/services/firebase/battle.service";
import { Timestamp } from "firebase/firestore";

export default function CreateBattle() {
    const router = useRouter();
    const { user } = useAuth();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [duration, setDuration] = useState("24"); // hours
    const [previewMode, setPreviewMode] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            const url = URL.createObjectURL(selectedFile);
            setImage(url);
            setFile(selectedFile);
        }
    };

    const removeImage = () => {
        setImage(null);
        setFile(null);
    };

    const handlePost = async () => {
        if (!user) {
            router.push("/login");
            return;
        }
        if (!title) {
            alert("Please provide a title.");
            return;
        }

        setIsSubmitting(true);
        try {
            let imageUrl = undefined;
            // 1. Upload Image (Optional)
            if (file) {
                const uploadRes = await UploadService.uploadFile(file);
                imageUrl = uploadRes.url;
            }

            // Calculate expiration
            const durationHours = parseInt(duration);
            const expiresAt = new Date(Date.now() + durationHours * 60 * 60 * 1000);

            // 2. Create Battle
            const newBattle = await BattleService.createBattle({
                title,
                description,
                imageUrl,
                isPublic: true,
                duration: `${duration}h`,
                expiresAt: Timestamp.fromDate(expiresAt),
                createdBy: user.uid!,
            });

            // 3. Redirect
            router.push(`/battles/${newBattle.id}`);
        } catch (error) {
            console.error("Failed to create battle:", error);
            alert("Failed to create post. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Construct a mock battle object for preview
    const previewBattle: Battle = {
        id: "preview",
        title: title || "Your Title Here",
        description: description,
        image: image || undefined,
        creator: {
            username: user?.name?.toLowerCase().replace(/\s+/g, '') || "me",
            displayName: user?.name || "Me",
            avatar: user?.imageUrl || "UI", // Use user's avatar or fallback
        },
        stats: {
            captionCount: 0,
            viewCount: 0,
        },
        endsAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
    };

    return (
        <div className="flex justify-center w-full min-h-screen bg-black">
            <div className="w-full max-w-3xl py-8 px-0 md:px-4 flex flex-col gap-6">

                {/* Header with Preview Toggle */}
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                    <h1 className="text-xl font-medium text-zinc-100">Create a post</h1>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPreviewMode(!previewMode)}
                        className={`gap-2 ${previewMode ? 'text-blue-400 bg-blue-400/10' : 'text-zinc-400 hover:text-zinc-200'}`}
                    >
                        {previewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        {previewMode ? "Edit Post" : "Preview"}
                    </Button>
                </div>

                {previewMode ? (
                    // Preview Mode
                    <div className="animate-in fade-in zoom-in duration-200">
                        <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-md text-xs text-blue-200 font-bold text-center">
                            This is how your post will look to others
                        </div>
                        <BattleCard battle={previewBattle} />
                    </div>
                ) : (
                    // Edit Mode
                    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-200">

                        <div className="bg-zinc-950 rounded-md border border-zinc-800 p-4 flex flex-col gap-4">
                            {/* Title Input */}
                            <div>
                                <input
                                    type="text"
                                    placeholder="Title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-transparent border border-zinc-700 rounded p-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-100 focus:ring-0 transition-colors"
                                />
                            </div>

                            {/* Image Upload Area */}
                            {image ? (
                                <div className="relative rounded-md overflow-hidden border border-zinc-800 bg-black group">
                                    <img src={image} alt="Preview" className="w-full max-h-[400px] object-contain" />
                                    <button
                                        onClick={removeImage}
                                        className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-500/80 text-white rounded-full transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ) : null}

                            {/* Description Textarea */}
                            <textarea
                                className="w-full min-h-[150px] bg-zinc-950 border border-zinc-800 rounded p-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-700 resize-y font-sans leading-relaxed"
                                placeholder="Text (optional)"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            ></textarea>

                            {/* Toolbar */}
                            <div className="flex justify-between items-center pt-2">
                                <div className="flex gap-2">
                                    <label className={`flex items-center gap-2 px-3 py-1.5 border rounded-full cursor-pointer transition-colors ${image ? 'bg-zinc-800 border-zinc-700 text-zinc-400 cursor-not-allowed' : 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200'}`}>
                                        <ImagePlus className="h-4 w-4" />
                                        <span className="text-xs font-bold">{image ? 'Image Added' : 'Add Image'}</span>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            disabled={!!image}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Duration Selector */}
                        <div className="bg-zinc-950 rounded-md border border-zinc-800 p-3 md:p-4">
                            <label className="text-sm font-medium text-zinc-400 mb-3 block">Duration</label>
                            <div className="flex flex-wrap gap-2">
                                {["12", "24", "72", "168"].map((hours) => (
                                    <button
                                        key={hours}
                                        onClick={() => setDuration(hours)}
                                        className={`flex-1 min-w-[70px] px-3 py-2 rounded-full text-[10px] md:text-xs font-bold transition-all ${duration === hours
                                            ? "bg-zinc-100 text-black border border-zinc-100"
                                            : "bg-zinc-900 text-zinc-500 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-300"
                                            }`}
                                    >
                                        {hours === "168" ? "1 Week" : hours === "72" ? "3 Days" : `${hours}h`}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Rules Section */}
                        <Card className="bg-zinc-900 border-zinc-800">
                            <div className="p-3 border-b border-zinc-800 flex items-center gap-2">
                                <Info className="h-5 w-5 text-zinc-400" />
                                <span className="font-bold text-sm text-zinc-200">Posting to r/memebattles</span>
                            </div>
                            <ol className="p-4 list-decimal list-inside text-xs text-zinc-400 space-y-2">
                                <li>Remember the human</li>
                                <li>Behave like you would in real life</li>
                                <li>Look for the original source of content</li>
                                <li>Search for duplicates before posting</li>
                            </ol>
                        </Card>

                        <div className="flex justify-end pt-4 border-t border-zinc-800">
                            <Button
                                onClick={handlePost}
                                disabled={isSubmitting}
                                className="rounded-full px-8 font-bold bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Posting...
                                    </>
                                ) : "Post"}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
