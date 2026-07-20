"use client";

import React, { useEffect, useState } from "react";
import type { ToolsTree } from "@/types/tools";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faLockOpen } from "@fortawesome/free-solid-svg-icons";
import { AuthModal } from "./AuthModal";
import { DetailModal } from "./DetailModal";
import { TreeNode } from "./TreeNode";

export default function FloatingToolsWidget({
    offset = { right: 32, bottom: 32 },
    icon = "▣",
    iconOpen,
    align = "left",
}: {
    offset?: { right: number; bottom: number };
    icon?: React.ReactNode | string;
    iconOpen?: React.ReactNode | string;
    align?: "left" | "right";
}) {
    const [show, setShow] = useState(false);
    const [tools, setTools] = useState<ToolsTree>([]);
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    const [detailModal, setDetailModal] = useState<{ node: any; parentPath: string } | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showAuth, setShowAuth] = useState(false);

    const prefersReducedMotion = useReducedMotion();
    const alignRight = align === "right";
    const displayIcon = show && iconOpen ? iconOpen : icon;

    useEffect(() => {
        fetch("/api/tools")
            .then((r) => r.json())
            .then((data) => setTools(data))
            .catch(() => setTools([]));

        try {
            const saved = localStorage.getItem("tools_expanded");
            if (saved) setExpanded(JSON.parse(saved));
        } catch { }

        fetch("/api/auth/me")
            .then((r) => r.json())
            .then((d) => setIsAdmin(!!d.admin))
            .catch(() => setIsAdmin(false));
    }, []);

    const openRootDetail = () =>
        isAdmin &&
        setDetailModal({ node: { __isRoot: true, name: "", type: "folder" }, parentPath: "" });

    async function toggleLock() {
        if (!isAdmin) {
            setShowAuth(true);
            return;
        }
        try {
            await fetch("/api/admin/logout", { method: "POST" });
            setIsAdmin(false);
            setDetailModal(null);
        } catch {
            alert("登出失敗，請稍後再試");
        }
    }

    return (
        <>
            <button
                aria-label="小工具選單"
                aria-haspopup="dialog"
                onClick={() => setShow((p) => !p)}
                className={`fixed z-50 flex h-[48px] w-[48px] items-center justify-center rounded-full bg-white shadow-md transition-all duration-200 hover:shadow-lg hover:scale-108 dark:bg-[#222229] dark:text-[#BABABA] ${!show && !prefersReducedMotion ? "mizuki-fab-float" : ""}`}
                style={{ right: offset.right, bottom: offset.bottom }}
            >
                <span
                    className={`text-xl transition-transform duration-180 ${show ? "rotate-45" : ""}`}
                >
                    {displayIcon}
                </span>
            </button>

            {show && (
                <div
                    role="dialog"
                    aria-label="小工具選單"
                    className={`fixed z-50 rounded-xl bg-white p-4 text-gray-800 shadow-xl dark:bg-[#222229] dark:text-[#BABABA] ${prefersReducedMotion ? "" : "mizuki-panel-enter"}`}
                    style={{ right: offset.right, bottom: offset.bottom + 56, minWidth: 260 }}
                >
                    <div className="mb-2 flex items-center justify-between">
                        <span className="font-bold">小工具選單</span>

                        <div className="flex items-center gap-2">
                            {isAdmin && (
                                <button
                                    className="rounded bg-gray-200 px-2 py-0.5 text-sm dark:bg-black/30"
                                    onClick={openRootDetail}
                                    title="根目錄詳細（新增用）"
                                >
                                    詳細
                                </button>
                            )}

                            <button
                                onClick={toggleLock}
                                className={`rounded px-2 py-0.5 text-sm ${isAdmin ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-gray-200 hover:bg-gray-300 dark:bg-black/30"
                                    }`}
                                title={isAdmin ? "點擊鎖上（登出管理）" : "點擊解鎖（管理登入）"}
                                aria-pressed={isAdmin}
                            >
                                <FontAwesomeIcon icon={isAdmin ? faLockOpen : faLock} className="mr-1" />
                                {isAdmin ? "開啟" : "鎖定"}
                            </button>
                        </div>
                    </div>

                    <div className={`max-h-[60vh] w-full overflow-auto pr-1 ${alignRight ? "text-right" : ""}`}>
                        <TreeNode
                            nodes={tools}
                            path=""
                            expanded={expanded}
                            setExpanded={setExpanded}
                            setDetailModal={setDetailModal}
                            floatLinks={true}
                            prefersReducedMotion={!!prefersReducedMotion}
                            alignRight={alignRight}
                            isAdmin={isAdmin}
                        />
                    </div>
                </div>
            )}

            {showAuth && (
                <AuthModal
                    onClose={() => setShowAuth(false)}
                    onSuccess={() => {
                        setIsAdmin(true);
                    }}
                />
            )}

            {isAdmin && (
                <DetailModal
                    detailModal={detailModal}
                    setDetailModal={setDetailModal}
                    tools={tools}
                    setTools={setTools}
                />
            )}
        </>
    );
}
