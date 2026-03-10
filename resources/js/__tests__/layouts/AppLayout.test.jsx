import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AppLayout from '@/layouts/AppLayout';

// Mock @inertiajs/react
vi.mock('@inertiajs/react', () => ({
    Link: ({ href, children, className }) => (
        <a href={href} className={className}>{children}</a>
    ),
    router: { get: vi.fn() },
    usePage: vi.fn(),
}));

// Mock shadcn Button
vi.mock('@/components/ui/button', () => ({
    Button: ({ children, onClick, variant, size }) => (
        <button onClick={onClick} data-variant={variant} data-size={size}>
            {children}
        </button>
    ),
}));

import { usePage } from '@inertiajs/react';

describe('AppLayout', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders logo and brand name', () => {
        usePage.mockReturnValue({ props: { auth: null }, url: '/' });

        render(<AppLayout><div>Content</div></AppLayout>);

        expect(screen.getByText('ChronoDesk')).toBeInTheDocument();
        expect(screen.getByAltText('ChronoDesk Logo')).toBeInTheDocument();
    });

    it('renders children content', () => {
        usePage.mockReturnValue({ props: { auth: null }, url: '/' });

        render(<AppLayout><div>Test Content</div></AppLayout>);

        expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('shows login and register buttons when not authenticated', () => {
        usePage.mockReturnValue({ props: { auth: null }, url: '/' });

        render(<AppLayout><div /></AppLayout>);

        expect(screen.getByText('Login')).toBeInTheDocument();
        expect(screen.getByText('Register')).toBeInTheDocument();
    });

    it('shows user name and logout when authenticated', () => {
        usePage.mockReturnValue({
            props: { auth: { name: 'Alice', email: 'alice@example.com' } },
            url: '/todos',
        });

        render(<AppLayout><div /></AppLayout>);

        expect(screen.getByText('Alice')).toBeInTheDocument();
        expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    it('shows nav links when authenticated', () => {
        usePage.mockReturnValue({
            props: { auth: { name: 'Alice' } },
            url: '/todos',
        });

        render(<AppLayout><div /></AppLayout>);

        expect(screen.getByText('Todos')).toBeInTheDocument();
        expect(screen.getByText('Timer')).toBeInTheDocument();
        expect(screen.getByText('Finance')).toBeInTheDocument();
        expect(screen.getByText('Calendar')).toBeInTheDocument();
    });

    it('does not show nav links when not authenticated', () => {
        usePage.mockReturnValue({ props: { auth: null }, url: '/' });

        render(<AppLayout><div /></AppLayout>);

        expect(screen.queryByText('Todos')).not.toBeInTheDocument();
    });

    it('renders footer', () => {
        usePage.mockReturnValue({ props: { auth: null }, url: '/' });

        render(<AppLayout><div /></AppLayout>);

        expect(screen.getByText(/ChronoDesk Labs/)).toBeInTheDocument();
    });
});
