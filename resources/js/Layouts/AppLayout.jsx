import React, { useEffect } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import Swal from "sweetalert2";

export default function AppLayout({ children }) {
    const { props } = usePage();
    const { auth } = props;

    // 🔔 Reminder popup (In-App)
    useEffect(() => {
        const checkReminders = async () => {
            try {
                const res = await fetch("/api/reminders");
                const data = await res.json();

                if (data.length > 0) {
                    Swal.fire({
                        icon: "info",
                        title: "🔔 Pengingat Tugas!",
                        html: data
                            .map(
                                (t) =>
                                    `<p><b>${t.title}</b><br/>Jatuh tempo ${t.remaining_time} (${t.due_date})</p>`
                            )
                            .join(""),
                        showCancelButton: true,
                        confirmButtonText: "📋 Lihat Todo",
                        cancelButtonText: "Tutup",
                        confirmButtonColor: "#2563eb",
                        allowOutsideClick: false,
                    }).then((r) => {
                        if (r.isConfirmed) {
                            router.visit("/todos");
                        }
                    });
                }
            } catch (e) {
                console.error("Gagal memuat reminder:", e);
            }
        };

        // Jalankan sekali saat halaman dibuka
        checkReminders();

        // Cek ulang setiap 5 menit
        const interval = setInterval(checkReminders, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    // 🔹 Fungsi Logout
    const onLogout = () => router.get("/auth/logout");

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* 🔹 Navbar */}
            <nav className="border-b bg-card shadow-sm sticky top-0 z-50">
                <div className="container mx-auto px-4">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo & Brand */}
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-lg font-bold text-foreground hover:text-primary transition"
                        >
                            <img
                                src="/logo.png"
                                alt="ChronoDesk Logo"
                                className="w-8 h-8 object-contain rounded"
                            />
                            <span>ChronoDesk</span>
                        </Link>

                        {/* Right Auth */}
                        <div className="flex items-center space-x-3">
                            {auth ? (
                                <>
                                    <span className="text-sm text-muted-foreground">
                                        👋 {auth.name}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={onLogout}
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
            <footer className="border-t bg-card py-6 mt-auto">
                <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                    © 2025 ChronoDesk Labs. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
