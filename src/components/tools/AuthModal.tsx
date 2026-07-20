"use client";

import React, { useState } from "react";
import { Modal } from "./Modal";

export function AuthModal({
    onClose,
    onSuccess,
}: {
    onClose: () => void;
    onSuccess: () => void;
}) {
    const [pwd, setPwd] = useState("");
    const [loading, setLoading] = useState(false);

    async function doLogin(e: React.FormEvent) {
        e.preventDefault();
        if (!pwd) return;
        setLoading(true);
        try {
            const r = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: pwd }),
            });
            if (r.ok) {
                onSuccess();
                onClose();
            } else {
                alert("密碼錯誤或未設定 ADMIN_PASSWORD");
            }
        } catch {
            alert("登入失敗，請稍後再試");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal title="管理登入" onClose={onClose}>
            <form onSubmit={doLogin} className="flex gap-2">
                <input
                    type="password"
                    name="password"
                    value={pwd}
                    onChange={(e) => setPwd(e.target.value)}
                    placeholder="請輸入管理密碼"
                    className="w-full rounded border px-2 py-1 dark:bg-black/20"
                    autoComplete="current-password"
                    autoFocus
                />
                <button
                    type="submit"
                    disabled={loading || !pwd}
                    className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? "登入中…" : "登入"}
                </button>
                <button
                    type="button"
                    className="rounded bg-gray-200 px-3 py-1 hover:bg-gray-300 dark:bg-black/30"
                    onClick={onClose}
                >
                    取消
                </button>
            </form>
        </Modal>
    );
}
