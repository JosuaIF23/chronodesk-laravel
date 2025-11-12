import React, { useEffect, useMemo, useState } from "react";
import { usePage, router } from "@inertiajs/react";
import AppLayout from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import Chart from "react-apexcharts";

// ⬇️ Import tabel dengan progress bar
import TaskTable from "@/components/tasks/TaskTable";

export default function TasksPage() {
    const { props } = usePage();
    const { tasks, filters, stats, flash } = props;

    // 🔍 Filter & search state
    const [search, setSearch] = useState(filters?.q ?? "");
    const [priority, setPriority] = useState(filters?.priority ?? "");
    const [status, setStatus] = useState(filters?.status ?? "");

    // ⏳ debounce filter pencarian
    useEffect(() => {
        const delay = setTimeout(() => {
            router.get(
                "/todos",
                { q: search, priority, status },
                { preserveState: true, replace: true }
            );
        }, 600);
        return () => clearTimeout(delay);
    }, [search, priority, status]);

    // 🔔 SweetAlert flash message
    useEffect(() => {
        if (flash?.success) {
            Swal.fire({
                icon: "success",
                title: flash.success,
                timer: 1500,
                showConfirmButton: false,
            });
        }
        if (flash?.error) {
            Swal.fire({
                icon: "error",
                title: flash.error,
                timer: 2000,
                showConfirmButton: false,
            });
        }
    }, [flash]);

    // ➕ Tambah Task
    const onAdd = () => {
        Swal.fire({
            title: "Tambah Task Baru",
            html: `
                <input id="sw-title" class="swal2-input" placeholder="Judul" />
                <select id="sw-priority" class="swal2-input">
                    <option value="low">Low</option>
                    <option value="medium" selected>Medium</option>
                    <option value="high">High</option>
                </select>
                <input id="sw-due" class="swal2-input" type="datetime-local" />
                <textarea id="sw-desc" class="swal2-textarea" placeholder="Deskripsi"></textarea>
            `,
            confirmButtonText: "Tambah",
            showCancelButton: true,
            focusConfirm: false,
            preConfirm: () => {
                return {
                    title: document.getElementById("sw-title").value,
                    priority: document.getElementById("sw-priority").value,
                    due_date: document.getElementById("sw-due").value,
                    description: document.getElementById("sw-desc").value,
                };
            },
        }).then((res) => {
            if (res.isConfirmed) {
                const data = new FormData();
                Object.entries(res.value).forEach(([k, v]) =>
                    data.append(k, v)
                );
                router.post("/todos", data);
            }
        });
    };

    // ✏️ Edit Task
    const onEdit = (task) => {
        Swal.fire({
            title: "Ubah Task",
            html: `
                <input id="sw-title" class="swal2-input" placeholder="Judul" value="${
                    task.title || ""
                }">
                <select id="sw-priority" class="swal2-input">
                    <option value="low" ${
                        task.priority === "low" ? "selected" : ""
                    }>Low</option>
                    <option value="medium" ${
                        task.priority === "medium" ? "selected" : ""
                    }>Medium</option>
                    <option value="high" ${
                        task.priority === "high" ? "selected" : ""
                    }>High</option>
                </select>
                <input id="sw-due" class="swal2-input" type="datetime-local" value="${
                    task.due_date ? task.due_date.replace(" ", "T") : ""
                }">
                <textarea id="sw-desc" class="swal2-textarea" placeholder="Deskripsi">${
                    task.description || ""
                }</textarea>
            `,
            showCancelButton: true,
            confirmButtonText: "Simpan",
            focusConfirm: false,
            preConfirm: () => ({
                title: document.getElementById("sw-title").value,
                priority: document.getElementById("sw-priority").value,
                due_date: document.getElementById("sw-due").value,
                description: document.getElementById("sw-desc").value,
            }),
        }).then((res) => {
            if (res.isConfirmed) {
                const data = new FormData();
                data.append("_method", "patch");
                Object.entries(res.value).forEach(([k, v]) =>
                    data.append(k, v)
                );
                router.post(`/todos/${task.id}`, data);
            }
        });
    };

    // ❌ Hapus Task
    const onDelete = (task) => {
        Swal.fire({
            title: "Konfirmasi Hapus",
            html: `<p>Ketik ulang judul task untuk menghapus:</p>
                <input id="confirm-input" class="swal2-input" placeholder="${task.title}">`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Hapus",
            preConfirm: () => {
                const val = document.getElementById("confirm-input").value;
                if (val !== task.title) {
                    Swal.showValidationMessage("Judul tidak cocok!");
                    return false;
                }
                return true;
            },
        }).then((r) => {
            if (r.isConfirmed) router.delete(`/todos/${task.id}`);
        });
    };

    // 📖 Detail Task
    const onDetail = (task) => {
        router.visit(`/todos/${task.id}`);
    };

    // 📊 Chart configurations
    const timeOptions = useMemo(
        () => ({
            chart: { type: "bar", toolbar: { show: false } },
            xaxis: { categories: stats.time.categories },
            plotOptions: { bar: { borderRadius: 4 } },
            dataLabels: { enabled: false },
        }),
        [stats]
    );

    const financeOptions = useMemo(
        () => ({
            chart: { type: "bar", toolbar: { show: false } },
            xaxis: { categories: ["Income", "Expense"] },
            dataLabels: { enabled: false },
        }),
        []
    );

    return (
        <AppLayout>
            <div className="container mx-auto px-4 py-6 max-w-6xl">
                {/* 🔙 Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.visit("/")}
                        >
                            ⬅️ Kembali
                        </Button>
                        <h1 className="text-2xl font-bold">📋 Daftar Tugas</h1>
                    </div>
                    <Button
                        onClick={onAdd}
                        className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                        + Tambah
                    </Button>
                </div>

                {/* 🔍 Filter & Search */}
                <div className="grid md:grid-cols-5 gap-2 mb-5">
                    <input
                        className="border rounded px-3 py-2 md:col-span-2"
                        placeholder="Cari judul/deskripsi..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select
                        className="border rounded px-3 py-2"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                    >
                        <option value="">Semua Prioritas</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                    <select
                        className="border rounded px-3 py-2"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="">Semua Status</option>
                        <option value="active">Belum Selesai</option>
                        <option value="completed">Selesai</option>
                    </select>
                </div>

                {/* 📋 Tabel dengan Progress */}
                <div className="overflow-x-auto border rounded-md mt-4">
                    <TaskTable
                        tasks={tasks}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onDetail={onDetail}
                    />
                </div>

                {/* 📄 Pagination */}
                <div className="flex items-center justify-between mt-3">
                    <div className="text-sm text-muted-foreground">
                        Menampilkan {tasks.from ?? 0}–{tasks.to ?? 0} dari{" "}
                        {tasks.total} data
                    </div>
                    <div className="space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={!tasks.prev_page_url}
                            onClick={() => router.get(tasks.prev_page_url)}
                        >
                            Prev
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={!tasks.next_page_url}
                            onClick={() => router.get(tasks.next_page_url)}
                        >
                            Next
                        </Button>
                    </div>
                </div>

                {/* 📊 Charts */}
                <div className="grid md:grid-cols-2 gap-6 mt-8">
                    <div className="border rounded-lg p-4">
                        <h3 className="font-semibold mb-2">
                            ⏱️ Total Menit Kerja (7 Hari)
                        </h3>
                        <Chart
                            options={timeOptions}
                            series={[
                                { name: "Minutes", data: stats.time.series },
                            ]}
                            type="bar"
                            height={280}
                        />
                    </div>
                    <div className="border rounded-lg p-4">
                        <h3 className="font-semibold mb-2">
                            💰 Ringkasan Keuangan (7 Hari)
                        </h3>
                        <Chart
                            options={financeOptions}
                            series={[
                                {
                                    name: "Amount",
                                    data: [
                                        stats.finance.income,
                                        stats.finance.expense,
                                    ],
                                },
                            ]}
                            type="bar"
                            height={280}
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
