import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TaskTable from '@/components/tasks/TaskTable';

vi.mock('@/components/ui/button', () => ({
    Button: ({ children, onClick, variant, size }) => (
        <button onClick={onClick} data-variant={variant} data-size={size}>
            {children}
        </button>
    ),
}));

const makeTasks = (overrides = []) => ({
    data: overrides,
});

describe('TaskTable', () => {
    const onEdit   = vi.fn();
    const onDelete = vi.fn();
    const onDetail = vi.fn();

    it('shows empty message when no tasks', () => {
        render(
            <TaskTable
                tasks={makeTasks()}
                onEdit={onEdit}
                onDelete={onDelete}
                onDetail={onDetail}
            />
        );
        expect(screen.getByText('Tidak ada tugas ditemukan.')).toBeInTheDocument();
    });

    it('renders task rows', () => {
        const tasks = makeTasks([
            { id: 1, title: 'Task A', priority: 'high', due_date: '2026-12-31', is_completed: false, sub_tasks: [] },
            { id: 2, title: 'Task B', priority: 'low',  due_date: null,         is_completed: true,  sub_tasks: [] },
        ]);

        render(
            <TaskTable
                tasks={tasks}
                onEdit={onEdit}
                onDelete={onDelete}
                onDetail={onDetail}
            />
        );

        expect(screen.getByText('Task A')).toBeInTheDocument();
        expect(screen.getByText('Task B')).toBeInTheDocument();
    });

    it('shows completed status correctly', () => {
        const tasks = makeTasks([
            { id: 1, title: 'Done Task', priority: 'low', due_date: null, is_completed: true, sub_tasks: [] },
        ]);

        render(
            <TaskTable tasks={tasks} onEdit={onEdit} onDelete={onDelete} onDetail={onDetail} />
        );

        expect(screen.getByText('Selesai')).toBeInTheDocument();
    });

    it('shows active status correctly', () => {
        const tasks = makeTasks([
            { id: 1, title: 'Active Task', priority: 'medium', due_date: null, is_completed: false, sub_tasks: [] },
        ]);

        render(
            <TaskTable tasks={tasks} onEdit={onEdit} onDelete={onDelete} onDetail={onDetail} />
        );

        expect(screen.getByText('Aktif')).toBeInTheDocument();
    });

    it('shows subtask progress when subtasks exist', () => {
        const tasks = makeTasks([
            {
                id: 1, title: 'Task With Subs', priority: 'medium', due_date: null, is_completed: false,
                sub_tasks: [
                    { id: 1, title: 'Sub 1', is_completed: true },
                    { id: 2, title: 'Sub 2', is_completed: false },
                ],
            },
        ]);

        render(
            <TaskTable tasks={tasks} onEdit={onEdit} onDelete={onDelete} onDetail={onDetail} />
        );

        expect(screen.getByText('1/2 (50%)')).toBeInTheDocument();
    });

    it('shows no-subtask message when no subtasks', () => {
        const tasks = makeTasks([
            { id: 1, title: 'Task', priority: 'low', due_date: null, is_completed: false, sub_tasks: [] },
        ]);

        render(
            <TaskTable tasks={tasks} onEdit={onEdit} onDelete={onDelete} onDetail={onDetail} />
        );

        expect(screen.getByText('Belum ada subtask')).toBeInTheDocument();
    });

    it('calls onEdit when Ubah button is clicked', () => {
        const task  = { id: 1, title: 'Task', priority: 'low', due_date: null, is_completed: false, sub_tasks: [] };
        const tasks = makeTasks([task]);

        render(
            <TaskTable tasks={tasks} onEdit={onEdit} onDelete={onDelete} onDetail={onDetail} />
        );

        fireEvent.click(screen.getByText('Ubah'));
        expect(onEdit).toHaveBeenCalledWith(task);
    });

    it('calls onDelete when Hapus button is clicked', () => {
        const task  = { id: 1, title: 'Task', priority: 'low', due_date: null, is_completed: false, sub_tasks: [] };
        const tasks = makeTasks([task]);

        render(
            <TaskTable tasks={tasks} onEdit={onEdit} onDelete={onDelete} onDetail={onDetail} />
        );

        fireEvent.click(screen.getByText('Hapus'));
        expect(onDelete).toHaveBeenCalledWith(task);
    });

    it('calls onDetail when Detail button is clicked', () => {
        const task  = { id: 1, title: 'Task', priority: 'low', due_date: null, is_completed: false, sub_tasks: [] };
        const tasks = makeTasks([task]);

        render(
            <TaskTable tasks={tasks} onEdit={onEdit} onDelete={onDelete} onDetail={onDetail} />
        );

        fireEvent.click(screen.getByText('Detail'));
        expect(onDetail).toHaveBeenCalledWith(task);
    });
});
