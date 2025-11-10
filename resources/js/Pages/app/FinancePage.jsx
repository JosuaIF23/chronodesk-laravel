import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import { usePage, router } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import Swal from "sweetalert2";
import Chart from "react-apexcharts";

export default function FinancePage() {
    const { props } = usePage();
    const { logs, summary, flash } = props;
    const [form, setForm] = React.useState({
        title: "",
        amount: "",
        type: "expense",
        transaction_date: "",
    });

    React.useEffect(() => {
        if (flash?.success)
            Swal.fire({
                icon: "success",
                title: flash.success,
                timer: 1500,
                showConfirmButton: false,
            });
    }, [flash]);

    const onSubmit = (e) => {
        e.preventDefault();
        router.post("/finance", form, {
            onSuccess: () =>
                setForm({
                    title: "",
                    amount: "",
                    type: "expense",
                    transaction_date: "",
                }),
        });
    };

    const goPage = (url) => {
        if (url) router.get(url, {}, { preserveState: true });
    };

    return (
        <AppLayout>
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="flex items-center justify-between mb-6">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.visit("/")}
                    >
                        ⬅️ Kembali
                    </Button>
                    <h1 className="text-2xl font-bold">
                        💰 Manajemen Keuangan
                    </h1>
                </div>

                {/* Tambah Data */}
                <form
                    onSubmit={onSubmit}
                    className="grid md:grid-cols-5 gap-2 mb-6"
                >
                    <input
                        type="text"
                        placeholder="Judul"
                        className="border rounded px-3 py-2 md:col-span-2"
                        value={form.title}
                        onChange={(e) =>
                            setForm({ ...form, title: e.target.value })
                        }
                        required
                    />
                    <input
                        type="number"
                        placeholder="Nominal"
                        className="border rounded px-3 py-2"
                        value={form.amount}
                        onChange={(e) =>
                            setForm({ ...form, amount: e.target.value })
                        }
                        required
                    />
                    <select
                        className="border rounded px-3 py-2"
                        value={form.type}
                        onChange={(e) =>
                            setForm({ ...form, type: e.target.value })
                        }
                    >
                        <option value="income">Pemasukan</option>
                        <option value="expense">Pengeluaran</option>
                    </select>
                    <input
                        type="date"
                        className="border rounded px-3 py-2"
                        value={form.transaction_date}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                transaction_date: e.target.value,
                            })
                        }
                    />
                    <Button type="submit">Tambah</Button>
                </form>

                {/* Statistik */}
                <div className="border rounded-lg p-4 mb-6">
                    <h3 className="font-semibold mb-2">
                        📊 Statistik Keuangan
                    </h3>
                    <Chart
                        type="bar"
                        height={250}
                        options={{
                            xaxis: { categories: ["Income", "Expense"] },
                            plotOptions: { bar: { borderRadius: 6 } },
                        }}
                        series={[{ data: [summary.income, summary.expense] }]}
                    />
                </div>

                {/* Tabel */}
                <table className="min-w-full text-sm border rounded">
                    <thead className="bg-muted/50">
                        <tr>
                            <th className="p-2 text-left">Judul</th>
                            <th className="p-2 text-left">Tanggal</th>
                            <th className="p-2 text-left">Tipe</th>
                            <th className="p-2 text-right">Nominal</th>
                            <th className="p-2 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.data.map((l) => (
                            <tr key={l.id} className="border-t">
                                <td className="p-2">{l.title}</td>
                                <td className="p-2">{l.transaction_date}</td>
                                <td className="p-2 capitalize">{l.type}</td>
                                <td className="p-2 text-right">
                                    Rp {Number(l.amount).toLocaleString()}
                                </td>
                                <td className="p-2 text-right">
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() =>
                                            router.delete(`/finance/${l.id}`)
                                        }
                                    >
                                        Hapus
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="flex justify-between items-center mt-3">
                    <div className="text-sm text-muted-foreground">
                        Menampilkan {logs.from ?? 0}–{logs.to ?? 0} dari{" "}
                        {logs.total} data
                    </div>
                    <div className="space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={!logs.prev_page_url}
                            onClick={() => goPage(logs.prev_page_url)}
                        >
                            Prev
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={!logs.next_page_url}
                            onClick={() => goPage(logs.next_page_url)}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
