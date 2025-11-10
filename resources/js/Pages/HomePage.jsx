import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/Components/ui/card";

export default function HomePage() {
    const technologies = [
        {
            name: "PHP Laravel",
            icon: "💻",
            description:
                "Framework favorit saya untuk membangun backend yang efisien dan bersih.",
            docLink: "https://laravel.com/docs",
        },
        {
            name: "Inertia.js",
            icon: "🧩",
            description:
                "Bridge antara Laravel dan React tanpa perlu membuat API secara manual.",
            docLink: "https://inertiajs.com",
        },
        {
            name: "ViteJS",
            icon: "⚡",
            description:
                "Build tool modern dan cepat untuk proses development React.",
            docLink: "https://vitejs.dev",
        },
        {
            name: "React.js",
            icon: "⚛️",
            description:
                "Library JavaScript populer untuk membangun user interface interaktif.",
            docLink: "https://react.dev",
        },
        {
            name: "Shadcn/ui",
            icon: "🎨",
            description:
                "Kumpulan komponen UI yang elegan dan mudah dikustomisasi untuk React.",
            docLink: "https://ui.shadcn.com",
        },
    ];

    return (
        <AppLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-5xl mx-auto">
                    {/* Hero Section */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold mb-4 text-blue-600">
                            👋 Halo, Saya Josua Asido Prima Silalahi
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Selamat datang di proyek percobaan pribadi saya —
                            dibangun dengan Laravel, Inertia, Vite, React, dan
                            Shadcn/ui.
                        </p>
                    </div>

                    {/* Technologies Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {technologies.map((tech, index) => (
                            <Card key={index} className="flex flex-col">
                                <CardHeader className="text-center">
                                    <CardTitle className="flex items-center justify-center gap-2">
                                        <span
                                            className="text-2xl"
                                            dangerouslySetInnerHTML={{
                                                __html: tech.icon,
                                            }}
                                        />
                                        {tech.name}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grow">
                                    <p className="text-sm text-muted-foreground text-center">
                                        {tech.description}
                                    </p>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        asChild
                                    >
                                        <a
                                            href={tech.docLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            📘 Dokumentasi
                                        </a>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    {/* Tentang Saya */}
                    <Card className="mb-8">
                        <CardHeader className="text-center">
                            <CardTitle>👤 Tentang Saya</CardTitle>
                            <CardDescription>
                                Informatika 2023 – Institut Teknologi Del
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-center text-muted-foreground">
                            <p>
                                Saya <strong>Josua Asido Prima Silalahi</strong>
                                , mahasiswa Informatika yang antusias
                                mengeksplor teknologi modern di bidang web
                                development dan AI. Project ini saya buat
                                sebagai sarana belajar dan eksperimen
                                menggunakan stack modern berbasis Laravel +
                                React.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Quick Start */}
                    <Card className="mb-8">
                        <CardHeader className="text-center">
                            <CardTitle>🚀 Quick Start</CardTitle>
                            <CardDescription>
                                Langkah cepat untuk memahami stack ini
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <span className="text-lg">🧱</span>
                                    <div>
                                        <h4 className="font-semibold">
                                            Backend Development
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            Gunakan Laravel untuk mengatur
                                            routing, logic, dan autentikasi
                                            server-side.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="text-lg">💡</span>
                                    <div>
                                        <h4 className="font-semibold">
                                            Frontend Development
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            Bangun antarmuka interaktif
                                            menggunakan React dan komponen dari
                                            Shadcn/ui.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="text-lg">🔗</span>
                                    <div>
                                        <h4 className="font-semibold">
                                            Integration
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            Inertia.js menghubungkan Laravel dan
                                            React tanpa perlu API endpoint
                                            tambahan.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Footer */}
                    <div className="text-center text-muted-foreground">
                        <p>
                            🎉 Dibuat dengan ❤️ oleh{" "}
                            <strong>Josua Asido Prima Silalahi</strong> 🎉
                        </p>
                        <div className="mt-4">
                            <Button asChild>
                                <a
                                    href="https://github.com/JosuaAsido"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    🌐 Lihat Portofolio Saya
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
