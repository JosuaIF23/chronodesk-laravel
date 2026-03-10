import React from "react";
import { Link } from "@inertiajs/react";

export default function AuthLayout({ children }) {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            {/* Brand Header */}
            <div className="mb-8 flex flex-col items-center gap-3">
                <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
                    <img
                        src="/logo.png"
                        alt="ChronoDesk Logo"
                        className="w-12 h-12 object-contain rounded-lg"
                    />
                    <span className="text-2xl font-extrabold text-primary tracking-wide">
                        ChronoDesk
                    </span>
                </Link>
                <p className="text-sm text-muted-foreground">
                    Task & Productivity Management
                </p>
            </div>

            {/* Auth Card */}
            <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-xl p-8">
                {children}
            </div>

            {/* Footer */}
            <p className="mt-6 text-xs text-muted-foreground">
                © 2025 ChronoDesk Labs
            </p>
        </div>
    );
}
