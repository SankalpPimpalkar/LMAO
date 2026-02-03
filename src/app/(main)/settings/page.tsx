"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { User, Shield, Bell, CreditCard, Loader2, Check, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthService } from "@/services/firebase/auth.service";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
    const { user, loading: authLoading, logout } = useAuth();
    const router = useRouter();

    const [displayName, setDisplayName] = useState("");
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");

    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);
    const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken" | "invalid">("idle");

    useEffect(() => {
        if (user) {
            setDisplayName(user.name || "");
            setUsername(user.username || "");
            setBio(user.bio || "");
            setAvatarUrl(user.imageUrl || "");
        }
    }, [user]);

    // Check username uniqueness
    useEffect(() => {
        if (!username || username === user?.username) {
            setUsernameStatus("idle");
            return;
        }

        if (username.length < 3) {
            setUsernameStatus("invalid");
            return;
        }

        const checkUsername = async () => {
            setUsernameStatus("checking");
            const isUnique = await AuthService.isUsernameUnique(username);
            setUsernameStatus(isUnique ? "available" : "taken");
        };

        const timer = setTimeout(checkUsername, 500);
        return () => clearTimeout(timer);
    }, [username, user?.username]);

    const handleSave = async () => {
        if (!user) return;

        if (usernameStatus === "taken") {
            setMessage({ type: "error", text: "Username is already taken" });
            return;
        }

        setSaving(true);
        setMessage(null);

        try {
            await AuthService.updateProfile({
                name: displayName,
                username: username,
                bio: bio,
                imageUrl: avatarUrl
            });
            setMessage({ type: "success", text: "Profile updated successfully!" });

            // If username changed, we might want to refresh since URL might be /u/old-username
            // But for now, just success message
        } catch (error) {
            console.error("Failed to update profile", error);
            setMessage({ type: "error", text: "Failed to update profile. Please try again." });
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone and you will lose all your data.")) {
            return;
        }

        try {
            setSaving(true);
            await AuthService.deleteAccount();
            router.push("/");
        } catch (error) {
            console.error("Failed to delete account", error);
            setMessage({ type: "error", text: "Failed to delete account. You may need to re-authenticate." });
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        router.push("/");
    };

    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh] w-full">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] w-full text-zinc-500">
                <p className="text-lg">Please sign in to access settings</p>
                <Button onClick={() => router.push("/")} className="mt-4">Go Home</Button>
            </div>
        );
    }

    return (
        <div className="flex justify-center w-full min-h-screen bg-black">
            <div className="w-full py-6 px-4 flex flex-col gap-6">

                <h1 className="text-xl font-medium text-zinc-100 pb-2 border-b border-zinc-800">User Settings</h1>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
                    {/* Settings Sidebar */}
                    <div className="hidden md:flex flex-col gap-1 text-sm text-zinc-400 sticky top-24 self-start">
                        <button className="flex items-center gap-3 text-left px-3 py-2 bg-zinc-900 text-zinc-100 font-bold rounded-md">
                            <User className="h-4 w-4" /> Account
                        </button>
                        <button className="flex items-center gap-3 text-left px-3 py-2 hover:bg-zinc-900 rounded-md transition-colors">
                            <Shield className="h-4 w-4" /> Safety & Privacy
                        </button>
                        <button className="flex items-center gap-3 text-left px-3 py-2 hover:bg-zinc-900 rounded-md transition-colors">
                            <Bell className="h-4 w-4" /> Notifications
                        </button>
                        <button className="flex items-center gap-3 text-left px-3 py-2 hover:bg-zinc-900 rounded-md transition-colors">
                            <CreditCard className="h-4 w-4" /> Premium
                        </button>
                    </div>

                    {/* Main Settings Form */}
                    <div className="md:col-span-3 flex flex-col gap-8">

                        {/* Account Section */}
                        <section>
                            <h2 className="text-sm font-bold text-zinc-500 uppercase mb-4 border-b border-zinc-800 pb-2">Account Preferences</h2>
                            <div className="space-y-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-zinc-200">Email Address</label>
                                    <Input type="email" value={user.email} disabled className="bg-zinc-900/50 text-zinc-500 border-zinc-800" />
                                    <p className="text-xs text-zinc-600">Email cannot be changed.</p>
                                </div>
                            </div>
                        </section>

                        {/* Profile Section */}
                        <section>
                            <h2 className="text-sm font-bold text-zinc-500 uppercase mb-4 border-b border-zinc-800 pb-2">Profile Customization</h2>
                            <div className="space-y-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-zinc-200">Username</label>
                                    <div className="relative">
                                        <Input
                                            type="text"
                                            placeholder="username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className={
                                                usernameStatus === "available" ? "border-green-500/50" :
                                                    usernameStatus === "taken" ? "border-red-500/50" : ""
                                            }
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            {usernameStatus === "checking" && <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />}
                                            {usernameStatus === "available" && <Check className="h-4 w-4 text-green-500" />}
                                            {usernameStatus === "taken" && <AlertCircle className="h-4 w-4 text-red-500" />}
                                        </div>
                                    </div>
                                    {usernameStatus === "taken" && <p className="text-[10px] text-red-500">This username is already taken.</p>}
                                    {usernameStatus === "invalid" && <p className="text-[10px] text-zinc-500">Username must be at least 3 characters.</p>}
                                    <p className="text-xs text-zinc-600">This is how people will find you: u/{username}</p>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-zinc-200">Display Name</label>
                                    <Input
                                        type="text"
                                        placeholder="Display Name"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-zinc-200">Bio</label>
                                    <textarea
                                        className="flex min-h-[80px] w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-300 text-zinc-100"
                                        placeholder="Tell us about yourself"
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-zinc-200">Avatar Image URL</label>
                                    <Input
                                        type="text"
                                        placeholder="https://..."
                                        value={avatarUrl}
                                        onChange={(e) => setAvatarUrl(e.target.value)}
                                    />
                                </div>
                            </div>
                        </section>

                        {message && (
                            <div className={`p-3 rounded-md text-sm flex items-center gap-2 ${message.type === "success" ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
                                }`}>
                                {message.type === "success" ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                                {message.text}
                            </div>
                        )}

                        <div className="flex justify-end pt-4 border-t border-zinc-800">
                            <Button
                                onClick={handleSave}
                                disabled={saving || usernameStatus === "taken" || usernameStatus === "invalid"}
                                className="bg-zinc-100 text-zinc-900 hover:bg-zinc-200 font-bold px-8 rounded-full disabled:opacity-50"
                            >
                                {saving ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Saving...
                                    </div>
                                ) : "Save Changes"}
                            </Button>
                        </div>

                        {/* Danger Zone */}
                        <section className="mt-8 pt-8 border-t border-zinc-800">
                            <h2 className="text-sm font-bold text-red-500 uppercase mb-4 pb-2">Danger Zone</h2>
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-md border border-zinc-800 bg-zinc-950/50 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-zinc-200">Logout from your account</p>
                                        <p className="text-xs text-zinc-500 mt-1">You will need to sign in again to access your profile.</p>
                                    </div>
                                    <Button
                                        onClick={handleLogout}
                                        variant="outline"
                                        className="border-zinc-800 text-zinc-300 hover:bg-zinc-900 transition-colors px-6"
                                    >
                                        Log Out
                                    </Button>
                                </div>

                                <div className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-md border border-red-900/20 bg-red-950/5 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-red-500/80">Delete Account</p>
                                        <p className="text-xs text-zinc-600 mt-1">Once you delete your account, there is no going back. Please be certain.</p>
                                    </div>
                                    <Button
                                        variant="destructive"
                                        onClick={handleDeleteAccount}
                                        className="bg-red-900/20 text-red-500 hover:bg-red-900/40 border-none transition-colors px-6"
                                    >
                                        Delete Account
                                    </Button>
                                </div>
                            </div>
                        </section>

                    </div>
                </div>

            </div>
        </div>
    );
}
