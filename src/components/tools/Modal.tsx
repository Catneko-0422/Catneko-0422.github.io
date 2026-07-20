"use client";

import React, { useEffect, useRef } from "react";

export function Modal({
    title,
    onClose,
    children,
}: {
    title: string;
    onClose: () => void;
    children: React.ReactNode;
}) {
    const boxRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    useEffect(() => {
        boxRef.current?.focus();
    }, []);

    return (
        <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[100] flex items-center justify-center"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="absolute inset-0 bg-black/40" />
            <div
                ref={boxRef}
                tabIndex={-1}
                className="relative w-[min(92vw,560px)] rounded-xl bg-white p-6 shadow-xl outline-none dark:bg-[#222229] dark:text-[#BABABA]"
            >
                <div className="mb-4 text-lg font-semibold">{title}</div>
                {children}
            </div>
        </div>
    );
}
