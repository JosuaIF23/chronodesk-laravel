import React from "react";
import { Button } from "@/Components/ui/button";

export default function TaskTable({ tasks, onEdit, onDelete, onDetail }) {
    // Debug data (opsional)
    console.log("📦 Tasks data from Laravel:", tasks.data);

    return (
        <table className="min-w-full border text-sm mt-4">
            <thead className="bg-muted/50">
                <tr>
                    <th className="p-2 text-left">Title</th>
                    <th className="p-2 text-center">Priority</th>
                    <th className="p-2 text-center">Progress</th>
                    <th className="p-2 text-center">Due</th>
                    <th className="p-2 text-center">Status</th>
                    <th className="p-2 text-center">Aksi</th>
                </tr>
            </thead>

            <tbody>
                {tasks.data.length > 0 ? (
                    tasks.data.map((task) => {
                        const total = task.sub_tasks?.length ?? 0;
                        const done =
                            task.sub_tasks?.filter((s) => s.is_completed)
                                .length ?? 0;
                        const percent =
                            total > 0 ? Math.round((done / total) * 100) : 0;

                        return (
                            <tr
                                key={task.id}
                                className="border-t hover:bg-muted/40 transition"
                            >
                                <td className="p-2">{task.title}</td>

                                {/* Priority color */}
                                <td className="p-2 text-center">
                                    <span
                                        className={`font-semibold ${
                                            task.priority === "high"
                                                ? "text-red-600"
                                                : task.priority === "medium"
                                                ? "text-yellow-600"
                                                : "text-green-600"
                                        }`}
                                    >
                                        {task.priority}
                                    </span>
                                </td>

                                {/* Progress bar */}
                                <td className="p-2 text-center">
                                    {total > 0 ? (
                                        <div className="flex flex-col items-center">
                                            <div className="w-32 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-500 h-2 rounded-full"
                                                    style={{
                                                        width: `${percent}%`,
                                                    }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {done}/{total} ({percent}%)
                                            </p>
                                        </div>
                                    ) : (
                                        <span className="text-gray-400 text-xs italic">
                                            Belum ada subtask
                                        </span>
                                    )}
                                </td>

                                {/* Due date */}
                                <td className="p-2 text-center">
                                    {task.due_date ?? "-"}
                                </td>

                                {/* Status */}
                                <td className="p-2 text-center">
                                    {task.is_completed ? "Selesai" : "Aktif"}
                                </td>

                                {/* Action buttons */}
                                <td className="p-2 flex justify-center gap-2">
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={() => onDetail(task)}
                                    >
                                        Detail
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => onEdit(task)}
                                    >
                                        Ubah
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => onDelete(task)}
                                    >
                                        Hapus
                                    </Button>
                                </td>
                            </tr>
                        );
                    })
                ) : (
                    <tr>
                        <td
                            colSpan="6"
                            className="p-4 text-center text-gray-500 italic"
                        >
                            Tidak ada tugas ditemukan.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}
