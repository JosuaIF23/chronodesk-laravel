import React from "react";
import { usePage, router } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import { Button } from "@/Components/ui/button";

export default function HomePage() {
    const { auth } = usePage().props;

    return (
        <AppLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-5xl mx-auto">
                    {/* 🔹 Header / Hero Section */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold mb-4">
                            👋 {auth ? `Hai, ${auth.name}!` : "Selamat Datang di ChronoDesk"}
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Kelola waktu, tugas, dan keuanganmu dengan lebih mudah 🚀
                        </p>
                        <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white mt-5"
                            onClick={() => router.visit("/todos")}
                        >
                            Buat Rencana
                        </Button>
                    </div>

                    {/* 🔹 Dashboard Overview Cards */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {/* Kalender */}
                        <div className="p-5 border rounded-xl bg-card shadow-sm hover:shadow-md transition">
                            <h2 className="text-lg font-semibold mb-2 flex items-center">
                                📅 <span className="ml-2">Kalender</span>
                            </h2>
                            <p className="text-sm text-muted-foreground mb-3">
                                Lihat jadwal dan deadline terdekatmu.
                            </p>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.visit("/calendar")}
                            >
                                Buka Kalender
                            </Button>
                        </div>

                        {/* Timer Kerja */}
                        <div className="p-5 border rounded-xl bg-card shadow-sm hover:shadow-md transition">
                            <h2 className="text-lg font-semibold mb-2 flex items-center">
                                ⏱️ <span className="ml-2">Timer Kerja</span>
                            </h2>
                            <p className="text-sm text-muted-foreground mb-3">
                                Catat durasi kerja dan tingkatkan fokusmu.
                            </p>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.visit("/timer")}
                            >
                                Mulai Timer
                            </Button>
                        </div>

                        {/* Catatan Keuangan */}
                        <div className="p-5 border rounded-xl bg-card shadow-sm hover:shadow-md transition">
                            <h2 className="text-lg font-semibold mb-2 flex items-center">
                                💰 <span className="ml-2">Catatan Keuangan</span>
                            </h2>
                            <p className="text-sm text-muted-foreground mb-3">
                                Pantau pemasukan dan pengeluaran proyekmu.
                            </p>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.visit("/finance")}
                            >
                                Lihat Keuangan
                            </Button>
                        </div>
                    </div>

                    {/* 🔹 Motivasi Harian */}
                    <div className="mt-12 text-center">
                        <h3 className="text-xl font-semibold mb-3">
                            🌟 Tetap Produktif Hari Ini!
                        </h3>
                        <p className="text-muted-foreground">
                            “Produktivitas bukan tentang bekerja keras, tapi bekerja cerdas dan konsisten.”
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
