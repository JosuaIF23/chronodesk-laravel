import React from "react";
import { router } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import Swal from "sweetalert2";

export default function TaskTable({ tasks }) {
    const onDelete = (task) => {
        Swal.fire({
            title: "Konfirmasi Hapus",
            html: `
                <p>Ketik ulang judul task untuk menghapus:</p>
                <input type="text" id="confirm-input" class="swal2-input" placeholder="${task.title}">
            `,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Hapus",
            cancelButtonText: "Batal",
            preConfirm: () => {
                const val = document.getElementById("confirm-input").value;
                if (val !== task.title) {
                    Swal.showValidationMessage("Judul tidak cocok!");
                    return false;
                }
                return true;
            },
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/todos/${task.id}`);
            }
        });
    };

    return (
        <table className="min-w-full border text-sm mt-4">
            <thead className="bg-muted/50">
                <tr>
                    <th className="p-2">Cover</th>
                    <th className="p-2 text-left">Title</th>
                    <th className="p-2">Priority</th>
                    <th className="p-2">Due</th>
                    <th className="p-2">Status</th>
                    <th className="p-2 text-center">Aksi</th>
                </tr>
            </thead>
            <tbody>
                {tasks.data.map((task) => (
                    <tr key={task.id} className="border-t">
                        <td className="p-2">
                            <a
                                href="#"
                                className="text-blue-600 hover:underline"
                            >
                                {task.cover ? "Lihat Cover" : "Upload Cover"}
                            </a>
                        </td>
                        <td className="p-2">{task.title}</td>
                        <td className="p-2 text-center">{task.priority}</td>
                        <td className="p-2 text-center">{task.due_date}</td>
                        <td className="p-2 text-center">
                            {task.is_completed ? "Selesai" : "Aktif"}
                        </td>
                        <td className="p-2 flex justify-center gap-2">
                            {/* Tombol Ubah */}
                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => router.get(`/todos/${task.id}`)}
                            >
                                Ubah
                            </Button>

                            {/* Tombol Hapus dengan konfirmasi */}
                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => onDelete(task)}
                            >
                                Hapus
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
