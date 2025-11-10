import React, { useState } from "react";
import { usePage, router } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import { Button } from "@/Components/ui/button";
import Swal from "sweetalert2";

export default function TaskDetail() {
    const { props } = usePage();
    const { task } = props;
    const [cover, setCover] = useState(null);

    const uploadCover = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const data = new FormData();
        data.append("cover", file);
        router.post(`/todos/${task.id}/cover`, data);
    };

    const updateStatus = (e) => {
        const data = new FormData();
        data.append("_method", "patch");
        data.append("is_completed", e.target.value);
        router.post(`/todos/${task.id}`, data, {
            onSuccess: () => Swal.fire({ icon: "success", title: "Status diperbarui", timer: 1000, showConfirmButton: false }),
        });
    };

    return (
        <AppLayout>
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <Button variant="outline" className="mb-4" onClick={() => router.visit("/todos")}>
                    ← Kembali
                </Button>

                <div className="border rounded-lg p-5 shadow-sm bg-card">
                    <h1 className="text-2xl font-bold mb-2">{task.title}</h1>
                    <p className="text-sm text-muted-foreground mb-4">{task.description}</p>

                    {task.cover && (
                        <img
                            src={`/storage/${task.cover}`}
                            alt="cover"
                            className="w-full h-48 object-cover rounded mb-4"
                        />
                    )}

                    <label className="block mb-4 cursor-pointer text-blue-500 underline">
                        Ubah Cover
                        <input type="file" className="hidden" onChange={uploadCover} />
                    </label>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p><b>Prioritas:</b> {task.priority}</p>
                            <p><b>Tenggat:</b> {task.due_date ?? "-"}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Status:</label>
                            <select
                                className="border rounded px-3 py-1"
                                value={task.is_completed ? 1 : 0}
                                onChange={updateStatus}
                            >
                                <option value={0}>Belum Selesai</option>
                                <option value={1}>Selesai</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
