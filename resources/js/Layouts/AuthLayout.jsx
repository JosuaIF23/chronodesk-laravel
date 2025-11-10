import React from "react";

export default function AuthLayout({ children }) {
    return (
        <div className="min-h-screen bg-background">
            <main>{children}</main>
        </div>
    );
}
