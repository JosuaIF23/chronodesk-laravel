import React from "react";

export default function TaskForm({ form, setForm, onSubmit }) {
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
            }}
            className="flex gap-2 items-center flex-wrap"
        >
            <input
                type="text"
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="border rounded p-2 w-48"
                required
            />

            <input
                type="text"
                placeholder="Deskripsi"
                value={form.description}
                onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                }
                className="border rounded p-2 w-56"
            />

            <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="border rounded p-2"
            >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>

            <input
                type="datetime-local"
                value={form.due_date}
                onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                className="border rounded p-2"
            />

            <button
                type="submit"
                className="bg-black text-white rounded px-4 py-2 hover:bg-gray-800"
            >
                Tambah
            </button>
        </form>
    );
}
