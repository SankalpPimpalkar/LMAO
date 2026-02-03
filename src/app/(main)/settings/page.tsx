"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { User, Shield, Bell, Lock, CreditCard } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="flex justify-center w-full min-h-screen bg-black">
            <div className="w-full py-6 px-4 flex flex-col gap-6">

                <h1 className="text-xl font-medium text-zinc-100 pb-2 border-b border-zinc-800">User Settings</h1>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Settings Sidebar */}
                    <div className="hidden md:flex flex-col gap-1 text-sm text-zinc-400">
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
                                    <Input type="email" value="user@example.com" disabled className="bg-zinc-900/50 text-zinc-500 border-zinc-800" />
                                    <p className="text-xs text-zinc-600">Email cannot be changed.</p>
                                </div>
                            </div>
                        </section>

                        {/* Profile Section */}
                        <section>
                            <h2 className="text-sm font-bold text-zinc-500 uppercase mb-4 border-b border-zinc-800 pb-2">Profile Customization</h2>
                            <div className="space-y-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-zinc-200">Display Name</label>
                                    <Input type="text" placeholder="Display Name (optional)" defaultValue="Meme Lord" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-zinc-200">Bio</label>
                                    <textarea
                                        className="flex min-h-[80px] w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-300 text-zinc-100"
                                        placeholder="Tell us about yourself"
                                        defaultValue="Just here to post memes and vote on the best captions. Professional procrastinator."
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-zinc-200">Avatar Image URL</label>
                                    <Input type="text" placeholder="https://..." />
                                </div>
                            </div>
                        </section>

                        <div className="flex justify-end pt-4 border-t border-zinc-800">
                            <Button className="bg-zinc-100 text-zinc-900 hover:bg-zinc-200 font-bold px-8 rounded-full">
                                Save Changes
                            </Button>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
