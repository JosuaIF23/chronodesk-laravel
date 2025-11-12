import React, { useEffect, useRef, useState } from "react";
import AppLayout from "@/layouts/AppLayout";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Button } from "@/components/ui/button";
import { router } from "@inertiajs/react";

export default function CalendarPage() {
    const ref = useRef(null);
    const [calendar, setCalendar] = useState(null);
    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());

    useEffect(() => {
        const cal = new Calendar(ref.current, {
            plugins: [dayGridPlugin, interactionPlugin],
            initialView: "dayGridMonth",
            events: "/calendar/feed",
            height: "auto",
        });
        cal.render();
        setCalendar(cal);
    }, []);

    const months = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
    ];

    const years = Array.from({ length: 10 }, (_, i) => 2020 + i);

    const updateView = () => {
        if (calendar) {
            calendar.gotoDate(new Date(year, month, 1));
        }
    };

    useEffect(updateView, [month, year]);

    return (
        <AppLayout>
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <div className="flex items-center justify-between mb-6">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.visit("/")}
                    >
                        ⬅️ Kembali
                    </Button>
                    <h1 className="text-2xl font-bold">
                        📅 Kalender Aktivitas
                    </h1>
                </div>

                <div className="flex gap-2 mb-4">
                    <select
                        value={month}
                        onChange={(e) => setMonth(Number(e.target.value))}
                        className="border rounded px-3 py-2"
                    >
                        {months.map((m, i) => (
                            <option key={i} value={i}>
                                {m}
                            </option>
                        ))}
                    </select>
                    <select
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                        className="border rounded px-3 py-2"
                    >
                        {years.map((y) => (
                            <option key={y} value={y}>
                                {y}
                            </option>
                        ))}
                    </select>
                    <Button onClick={updateView}>Lihat</Button>
                </div>

                <div ref={ref}></div>
            </div>
        </AppLayout>
    );
}
