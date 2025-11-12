import React, { useEffect, useState } from "react";
import AppLayout from "@/layouts/AppLayout";
import { usePage, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";

export default function TimerPage() {
    const { props } = usePage();
    const { tracks, current, flash } = props;

    const [elapsed, setElapsed] = useState(0);
    const [running, setRunning] = useState(!!current);
    const [mode, setMode] = useState("stopwatch"); // stopwatch | timer
    const [targetMinutes, setTargetMinutes] = useState(1); // default 1 menit
    const [remaining, setRemaining] = useState(targetMinutes * 60);

    // Flash alert
    useEffect(() => {
        if (flash?.success)
            Swal.fire({
                icon: "success",
                title: flash.success,
                timer: 1500,
                showConfirmButton: false,
            });
        if (flash?.error)
            Swal.fire({
                icon: "error",
                title: flash.error,
                timer: 2000,
                showConfirmButton: false,
            });
    }, [flash]);

    // Stopwatch / Timer interval
    useEffect(() => {
        let interval;
        if (running) {
            const startTime = new Date(current?.started_at || Date.now());
            interval = setInterval(() => {
                if (mode === "stopwatch") {
                    const diff = Math.floor((new Date() - startTime) / 1000);
                    setElapsed(diff);
                } else if (mode === "timer") {
                    setRemaining((prev) => {
                        if (prev <= 1) {
                            clearInterval(interval);
                            setRunning(false);
                            Swal.fire({
                                icon: "info",
                                title: "⏰ Waktu habis!",
                            });
                            return 0;
                        }
                        return prev - 1;
                    });
                }
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [running, mode]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    };

    const onStart = () => router.post("/timer/start");
    const onStop = () => router.post("/timer/stop");

    return (
        <AppLayout>
            <div className="container mx-auto px-4 py-8 max-w-3xl">
                <div className="flex items-center justify-between mb-6">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.visit("/")}
                    >
                        ⬅️ Kembali
                    </Button>
                    <h1 className="text-2xl font-bold">⏱️ Timer & Stopwatch</h1>
                </div>

                {/* Mode Selector */}
                <div className="flex justify-center gap-3 mb-6">
                    <Button
                        variant={mode === "stopwatch" ? "default" : "outline"}
                        onClick={() => setMode("stopwatch")}
                    >
                        Stopwatch
                    </Button>
                    <Button
                        variant={mode === "timer" ? "default" : "outline"}
                        onClick={() => setMode("timer")}
                    >
                        Timer
                    </Button>
                </div>

                {/* Display */}
                <div className="text-center mb-8">
                    {mode === "stopwatch" ? (
                        <div className="text-5xl font-mono mb-4">
                            {formatTime(elapsed)}
                        </div>
                    ) : (
                        <div className="text-5xl font-mono mb-4">
                            {formatTime(remaining)}
                        </div>
                    )}

                    {mode === "timer" && !running && (
                        <input
                            type="number"
                            min="1"
                            value={targetMinutes}
                            onChange={(e) =>
                                setTargetMinutes(Number(e.target.value))
                            }
                            className="border rounded px-3 py-2 text-center mb-3 w-24"
                        />
                    )}

                    <div className="space-x-3">
                        {!running ? (
                            <Button
                                onClick={() => {
                                    if (mode === "timer") {
                                        setRemaining(targetMinutes * 60);
                                    }
                                    setRunning(true);
                                    onStart();
                                }}
                                className="text-lg px-6"
                            >
                                Mulai
                            </Button>
                        ) : (
                            <Button
                                variant="destructive"
                                onClick={() => {
                                    setRunning(false);
                                    onStop();
                                }}
                            >
                                Stop
                            </Button>
                        )}
                    </div>
                </div>

                {/* Riwayat */}
                <div className="border-t mt-8 pt-4">
                    <h2 className="font-semibold mb-3">Riwayat Sesi</h2>
                    <table className="min-w-full text-sm border">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="p-2 text-left">Mulai</th>
                                <th className="p-2 text-left">Selesai</th>
                                <th className="p-2 text-left">
                                    Durasi (menit)
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {tracks.map((t) => (
                                <tr key={t.id} className="border-t">
                                    <td className="p-2">{t.started_at}</td>
                                    <td className="p-2">{t.ended_at ?? "-"}</td>
                                    <td className="p-2">
                                        {t.duration_minutes}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
