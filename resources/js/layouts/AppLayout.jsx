import React from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";

const navLinks = [
    { href: "/todos", label: "Todos" },
    { href: "/timer", label: "Timer" },
    { href: "/finance", label: "Finance" },
    { href: "/calendar", label: "Calendar" },
];

export default function AppLayout({ children }) {
    const { props, url } = usePage();
    const { auth } = props;

    const onLogout = () => router.get("/auth/logout");

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Navbar */}
            <nav className="bg-card sticky top-0 z-50 border-b-2 border-primary/60 shadow-lg">
                <div className="container mx-auto px-4">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo & Brand */}
                        <div className="flex items-center gap-6">
                            <Link
                                href="/"
                                className="flex items-center gap-2 text-lg font-bold hover:opacity-80 transition"
                            >
                                <img
                                    src="/logo.png"
                                    alt="ChronoDesk Logo"
                                    className="w-8 h-8 object-contain rounded"
                                />
                                <span className="text-primary font-extrabold tracking-wide">
                                    ChronoDesk
                                </span>
                            </Link>

                            {/* Nav Links (authenticated only) */}
                            {auth && (
                                <div className="hidden md:flex items-center gap-1">
                                    {navLinks.map((link) => {
                                        const isActive = url.startsWith(link.href);
                                        return (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                                    isActive
                                                        ? "bg-primary/20 text-primary"
                                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                                }`}
                                            >
                                                {link.label}
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Right Auth */}
                        <div className="flex items-center space-x-3">
                            {auth ? (
                                <>
                                    <span className="text-sm text-muted-foreground hidden sm:block">
                                        {auth.name}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={onLogout}
                                        className="border-border hover:border-primary/50"
                                    >
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link href="/auth/login">
                                        <Button variant="outline" size="sm">
                                            Login
                                        </Button>
                                    </Link>
                                    <Link href="/auth/register">
                                        <Button size="sm">Register</Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 container mx-auto px-4 py-6">
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-border bg-card py-6 mt-auto">
                <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                    © 2025 ChronoDesk Labs. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
