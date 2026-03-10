import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TaskForm from '@/components/tasks/TaskForm';

const defaultForm = {
    title:       '',
    description: '',
    priority:    'medium',
    due_date:    '',
};

describe('TaskForm', () => {
    it('renders title input', () => {
        const setForm = vi.fn();
        const onSubmit = vi.fn();

        render(<TaskForm form={defaultForm} setForm={setForm} onSubmit={onSubmit} />);

        expect(screen.getByPlaceholderText('Title')).toBeInTheDocument();
    });

    it('renders description input', () => {
        render(<TaskForm form={defaultForm} setForm={vi.fn()} onSubmit={vi.fn()} />);
        expect(screen.getByPlaceholderText('Deskripsi')).toBeInTheDocument();
    });

    it('renders priority select with options', () => {
        render(<TaskForm form={defaultForm} setForm={vi.fn()} onSubmit={vi.fn()} />);

        expect(screen.getByDisplayValue('Medium')).toBeInTheDocument();
        expect(screen.getByText('Low')).toBeInTheDocument();
        expect(screen.getByText('High')).toBeInTheDocument();
    });

    it('renders submit button', () => {
        render(<TaskForm form={defaultForm} setForm={vi.fn()} onSubmit={vi.fn()} />);
        expect(screen.getByText('Tambah')).toBeInTheDocument();
    });

    it('calls setForm when title changes', () => {
        const setForm = vi.fn();
        render(<TaskForm form={defaultForm} setForm={setForm} onSubmit={vi.fn()} />);

        fireEvent.change(screen.getByPlaceholderText('Title'), {
            target: { value: 'New Task' },
        });

        expect(setForm).toHaveBeenCalledWith({ ...defaultForm, title: 'New Task' });
    });

    it('calls setForm when description changes', () => {
        const setForm = vi.fn();
        render(<TaskForm form={defaultForm} setForm={setForm} onSubmit={vi.fn()} />);

        fireEvent.change(screen.getByPlaceholderText('Deskripsi'), {
            target: { value: 'Some description' },
        });

        expect(setForm).toHaveBeenCalledWith({ ...defaultForm, description: 'Some description' });
    });

    it('calls setForm when priority changes', () => {
        const setForm = vi.fn();
        render(<TaskForm form={defaultForm} setForm={setForm} onSubmit={vi.fn()} />);

        fireEvent.change(screen.getByDisplayValue('Medium'), {
            target: { value: 'high' },
        });

        expect(setForm).toHaveBeenCalledWith({ ...defaultForm, priority: 'high' });
    });

    it('calls onSubmit when form is submitted', () => {
        const onSubmit = vi.fn();
        render(<TaskForm form={defaultForm} setForm={vi.fn()} onSubmit={onSubmit} />);

        fireEvent.submit(screen.getByRole('button', { name: 'Tambah' }).closest('form'));
        expect(onSubmit).toHaveBeenCalledOnce();
    });

    it('displays current form values', () => {
        const form = { ...defaultForm, title: 'Existing Task', description: 'Existing Desc' };
        render(<TaskForm form={form} setForm={vi.fn()} onSubmit={vi.fn()} />);

        expect(screen.getByDisplayValue('Existing Task')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Existing Desc')).toBeInTheDocument();
    });
});
