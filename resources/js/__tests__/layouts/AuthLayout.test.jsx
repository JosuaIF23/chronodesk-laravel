import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AuthLayout from '@/layouts/AuthLayout';

vi.mock('@inertiajs/react', () => ({
    Link: ({ href, children, className }) => (
        <a href={href} className={className}>{children}</a>
    ),
}));

describe('AuthLayout', () => {
    it('renders brand name', () => {
        render(<AuthLayout><div>Auth Form</div></AuthLayout>);
        expect(screen.getByText('ChronoDesk')).toBeInTheDocument();
    });

    it('renders logo', () => {
        render(<AuthLayout><div /></AuthLayout>);
        expect(screen.getByAltText('ChronoDesk Logo')).toBeInTheDocument();
    });

    it('renders subtitle', () => {
        render(<AuthLayout><div /></AuthLayout>);
        expect(screen.getByText('Task & Productivity Management')).toBeInTheDocument();
    });

    it('renders children inside card', () => {
        render(<AuthLayout><div>Login Form</div></AuthLayout>);
        expect(screen.getByText('Login Form')).toBeInTheDocument();
    });

    it('renders footer text', () => {
        render(<AuthLayout><div /></AuthLayout>);
        expect(screen.getByText(/ChronoDesk Labs/)).toBeInTheDocument();
    });

    it('logo links to home', () => {
        render(<AuthLayout><div /></AuthLayout>);
        const logoLink = screen.getByRole('link', { name: /chronodesk/i });
        expect(logoLink).toHaveAttribute('href', '/');
    });
});
