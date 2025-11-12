import React, { useState } from "react";
import { usePage, router } from "@inertiajs/react";
import AppLayout from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";

export default function TaskDetail() {
    const { props } = usePage();
    const { task } = props;

    const [newSubTask, setNewSubTask] = useState("");

    const addSubTask = (e) => {
        e.preventDefault();
        if (!newSubTask.trim()) return;
        router.post(`/todos/${task.id}/subtasks`, { title: newSubTask });
        setNewSubTask("");
        router.reload({ only: ["task"] });
    };

    const toggleSubTask = (id) => {
        router.patch(`/subtasks/${id}/toggle`);
    };

    const deleteSubTask = (id, title) => {
        Swal.fire({
            title: "Hapus Subtask?",
            text: `Yakin ingin menghapus "${title}"?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Hapus",
            cancelButtonText: "Batal",
        }).then((r) => {
            if (r.isConfirmed) router.delete(`/subtasks/${id}`);
        });
    };

    return (
        <AppLayout>
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <Button
                    variant="outline"
                    className="mb-4"
                    onClick={() => router.visit("/todos")}
                >
                    ← Kembali
                </Button>

                <div className="border rounded-lg p-5 shadow-sm bg-card">
                    <h1 className="text-2xl font-bold mb-2">{task.title}</h1>
                    <p className="text-sm text-muted-foreground mb-4">
                        {task.description}
                    </p>

                    {task.cover && (
                        <img
                            src={`/storage/${task.cover}`}
                            alt="cover"
                            className="w-full h-48 object-cover rounded mb-4"
                        />
                    )}

                    <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                        <div>
                            <p>
                                <b>Prioritas:</b> {task.priority}
                            </p>
                            <p>
                                <b>Tenggat:</b> {task.due_date ?? "-"}
                            </p>
                        </div>
                        <div>
                            <p>
                                <b>Status:</b>{" "}
                                {task.is_completed ? "Selesai" : "Aktif"}
                            </p>
                        </div>
                    </div>

                    {/* ✅ Checklist Section */}
                    <div className="mt-4 border-t pt-4">
                        <h3 className="font-semibold mb-2">Checklist</h3>

                        <form onSubmit={addSubTask} className="flex gap-2 mb-3">
                            <input
                                className="border rounded px-3 py-2 flex-1 text-sm"
                                placeholder="Tambahkan subtask..."
                                value={newSubTask}
                                onChange={(e) => setNewSubTask(e.target.value)}
                            />
                            <Button type="submit" size="sm">
                                Tambah
                            </Button>
                        </form>

                        <ul className="space-y-1">
                            {task.sub_tasks?.length ? (
                                task.sub_tasks.map((st) => (
                                    <li
                                        key={st.id}
                                        className="flex items-center justify-between border-b py-1"
                                    >
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={st.is_completed}
                                                onChange={() =>
                                                    toggleSubTask(st.id)
                                                }
                                            />
                                            <span
                                                className={
                                                    st.is_completed
                                                        ? "line-through text-muted-foreground"
                                                        : ""
                                                }
                                            >
                                                {st.title}
                                            </span>
                                        </label>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                deleteSubTask(st.id, st.title)
                                            }
                                        >
                                            🗑️
                                        </Button>
                                    </li>
                                ))
                            ) : (
                                <li className="text-muted-foreground text-sm">
                                    Belum ada subtask.
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
