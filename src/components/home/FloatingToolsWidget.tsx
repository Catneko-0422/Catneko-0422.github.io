"use client";

/**
 * FloatingToolsWidget
 * - 右下角圓形按鈕（未開啟時緩慢上下浮動；開啟後停止）
 * - 面板：樹狀工具清單（只保留「詳細」按鈕）
 * - 詳細視窗：編輯/刪除（節點）、＋資料夾、＋連結（含根目錄）
 * - 支援 align="right" 讓目錄靠右（含右縮排）
 * - 移除顏色選項（types 中 color 可留作 optional，不使用）
 */

import React, { useEffect, useRef, useState } from "react";
import type { ToolsTree, ToolNode } from "@/types/tools";
import { motion, useReducedMotion, type Transition } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronRight } from "@fortawesome/free-solid-svg-icons";

const EASE_IN_OUT: NonNullable<Transition["ease"]> = [0.42, 0, 0.58, 1];

/* helpers */
const isValidHttpUrl = (str: string) => /^(https?:\/\/)/i.test(str);
const cloneTools = (tools: ToolsTree): ToolsTree => JSON.parse(JSON.stringify(tools));

function getParentByPath(tree: ToolsTree, pathArray: string[]): ToolNode[] {
    let parent: any = tree;
    for (const seg of pathArray) {
        const next = parent.find((n: any) => n.name === seg);
        if (!next || next.type !== "folder") throw new Error("Invalid path");
        parent = next.children;
    }
    return parent as ToolNode[];
}
const findIndexInParent = (parent: ToolNode[], name: string) =>
    parent.findIndex((n) => n.name === name);

/* Modal (generic) */
function Modal({
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

/* DetailModal（外面只留「詳細」；新增資料夾/連結放到這裡） */
function DetailModal({
    detailModal,
    setDetailModal,
    tools,
    setTools,
}: {
    detailModal: { node: any; parentPath: string } | null;
    setDetailModal: React.Dispatch<
        React.SetStateAction<{ node: any; parentPath: string } | null>
    >;
    tools: ToolsTree;
    setTools: React.Dispatch<React.SetStateAction<ToolsTree>>;
}) {
    if (!detailModal) return null;
    const node = detailModal.node;
    const isRoot = !!node?.__isRoot; // 根目錄：只顯示 +資料夾/+連結

    const onSubmit = async (e: React.FormEvent) => {
        if (isRoot) return; // 根目錄不提供編輯
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const name = (form.elements.namedItem("edit-name") as HTMLInputElement).value.trim();
        const url = (form.elements.namedItem("edit-url") as HTMLInputElement).value.trim();

        if (node.type === "link" && url && !isValidHttpUrl(url)) {
            alert("URL 必須以 http:// 或 https:// 開頭");
            return;
        }

        const optimistic = cloneTools(tools);
        try {
            const parentPath = detailModal.parentPath.split("/").filter(Boolean);
            const parent = getParentByPath(optimistic, parentPath);
            const idx = findIndexInParent(parent, node.name);
            if (idx < 0) throw new Error("node not found");

            parent[idx] = {
                ...parent[idx],
                name,
                ...(parent[idx].type === "link" ? { url } : {}),
            } as ToolNode;

            setTools(optimistic);
            const res = await fetch("/api/tools", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(optimistic),
            });
            if (!res.ok) throw new Error("POST /api/tools failed");
            setDetailModal(null);
        } catch {
            alert("編輯失敗，已回滾");
            fetch("/api/tools")
                .then((r) => r.json())
                .then((data) => setTools(data));
        }
    };

    const handleDelete = async () => {
        if (isRoot) return;
        if (!confirm("確定要刪除嗎？")) return;
        const optimistic = cloneTools(tools);
        try {
            const parentPath = detailModal.parentPath.split("/").filter(Boolean);
            const parent = getParentByPath(optimistic, parentPath);
            const idx = findIndexInParent(parent, node.name);
            if (idx >= 0) parent.splice(idx, 1);
            setTools(optimistic);

            const res = await fetch("/api/tools", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(optimistic),
            });
            if (!res.ok) throw new Error("POST /api/tools failed");
            setDetailModal(null);
        } catch {
            alert("刪除失敗，已回滾");
            fetch("/api/tools")
                .then((r) => r.json())
                .then((data) => setTools(data));
        }
    };

    const handleAddFolder = async () => {
        const name = prompt("請輸入資料夾名稱");
        if (!name) return;

        const optimistic = cloneTools(tools);
        try {
            // folder 詳細→加在該資料夾底下；root 詳細→加在根層
            const parentPath = isRoot
                ? []
                : (detailModal.parentPath + "/" + node.name).split("/").filter(Boolean);
            const parent = getParentByPath(optimistic, parentPath);
            parent.push({ name, type: "folder", children: [] });
            setTools(optimistic);

            const res = await fetch("/api/tools", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(optimistic),
            });
            if (!res.ok) throw new Error("POST /api/tools failed");
            setDetailModal(null);
        } catch {
            alert("新增失敗，已回滾");
            fetch("/api/tools")
                .then((r) => r.json())
                .then((data) => setTools(data));
        }
    };

    const handleAddLink = async () => {
        const name = prompt("請輸入連結名稱");
        if (!name) return;
        const url = prompt("請輸入連結網址（須以 http/https 開頭）");
        if (!url || !isValidHttpUrl(url)) {
            alert("URL 必須以 http:// 或 https:// 開頭");
            return;
        }

        const optimistic = cloneTools(tools);
        try {
            const parentPath = isRoot
                ? []
                : (detailModal.parentPath + "/" + node.name).split("/").filter(Boolean);
            const parent = getParentByPath(optimistic, parentPath);
            parent.push({ name, type: "link", url });
            setTools(optimistic);

            const res = await fetch("/api/tools", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(optimistic),
            });
            if (!res.ok) throw new Error("POST /api/tools failed");
            setDetailModal(null);
        } catch {
            alert("新增失敗，已回滾");
            fetch("/api/tools")
                .then((r) => r.json())
                .then((data) => setTools(data));
        }
    };

    return (
        <Modal title="詳細" onClose={() => setDetailModal(null)}>
            {isRoot ? (
                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        className="rounded bg-emerald-600 px-3 py-1 text-white hover:bg-emerald-700"
                        onClick={handleAddFolder}
                    >
                        ＋資料夾
                    </button>
                    <button
                        type="button"
                        className="rounded bg-amber-600 px-3 py-1 text-white hover:bg-amber-700"
                        onClick={handleAddLink}
                    >
                        ＋連結
                    </button>
                </div>
            ) : (
                <form onSubmit={onSubmit}>
                    <div className="mb-2">
                        <label className="mr-2">名稱：</label>
                        <input
                            id="edit-name"
                            name="edit-name"
                            defaultValue={node.name}
                            className="w-full rounded border px-2 py-1 dark:bg-black/20"
                            required
                        />
                    </div>
                    {node.type === "link" && (
                        <div className="mb-2">
                            <label className="mr-2">連結：</label>
                            <input
                                id="edit-url"
                                name="edit-url"
                                defaultValue={node.url}
                                className="w-full rounded border px-2 py-1 dark:bg-black/20"
                                placeholder="http(s)://..."
                            />
                        </div>
                    )}

                    <div className="mb-4" />

                    <div className="flex flex-wrap gap-2">
                        <button type="submit" className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700">
                            儲存
                        </button>
                        <button
                            type="button"
                            className="rounded bg-gray-200 px-3 py-1 hover:bg-gray-300 dark:bg-black/30"
                            onClick={() => setDetailModal(null)}
                        >
                            取消
                        </button>
                        <button
                            type="button"
                            className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                            onClick={handleDelete}
                        >
                            刪除
                        </button>
                        {node.type === "folder" && (
                            <>
                                <button
                                    type="button"
                                    className="rounded bg-emerald-600 px-3 py-1 text-white hover:bg-emerald-700"
                                    onClick={handleAddFolder}
                                >
                                    ＋資料夾
                                </button>
                                <button
                                    type="button"
                                    className="rounded bg-amber-600 px-3 py-1 text-white hover:bg-amber-700"
                                    onClick={handleAddLink}
                                >
                                    ＋連結
                                </button>
                            </>
                        )}
                    </div>
                </form>
            )}
        </Modal>
    );
}

/* TreeNode（外面只留「詳細」；支援 alignRight） */
function TreeNode({
    nodes,
    path,
    expanded,
    setExpanded,
    setDetailModal,
    floatLinks,
    prefersReducedMotion,
    alignRight,
}: {
    nodes: ToolNode[];
    path: string;
    expanded: Record<string, boolean>;
    setExpanded: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
    setDetailModal: React.Dispatch<
        React.SetStateAction<{ node: any; parentPath: string } | null>
    >;
    floatLinks: boolean;
    prefersReducedMotion: boolean;
    alignRight: boolean;
}) {
    // 計算當前深度，用來決定縮排（每層 16px）
    const depth = path ? path.split("/").filter(Boolean).length : 0;
    const indentPx = depth * 16;

    // 只對「內容區」加縮排；右側詳細欄位不受影響
    const indentStyle: React.CSSProperties = alignRight
        ? { paddingInlineEnd: indentPx }
        : { paddingInlineStart: indentPx };

    return (
        <ul role={path ? "group" : "tree"} className="w-full">
            {nodes.map((node, idx) => {
                const nodePath = path + "/" + node.name;

                if (node.type === "folder") {
                    const isOpen = !!expanded[nodePath];
                    return (
                        <li key={nodePath} role="treeitem" aria-expanded={isOpen} className="mb-2 w-full">
                            {/* 每列：左=內容區，右=詳細固定在最右 */}
                            <div className="grid w-full grid-cols-[1fr_auto] items-center">
                                <div
                                    className={`flex items-center gap-2 ${alignRight ? "justify-end" : ""}`}
                                    style={indentStyle}
                                >
                                    <button
                                        type="button"
                                        aria-expanded={isOpen}
                                        aria-controls={nodePath + "-children"}
                                        className="rounded font-bold focus:outline-none focus:ring"
                                        onClick={() =>
                                            setExpanded((prev) => {
                                                const next = { ...prev, [nodePath]: !prev[nodePath] };
                                                try {
                                                    localStorage.setItem("tools_expanded", JSON.stringify(next));
                                                } catch { }
                                                return next;
                                            })
                                        }
                                    >
                                        <FontAwesomeIcon
                                            icon={isOpen ? faChevronDown : faChevronRight}
                                            className="mr-1 inline-block"
                                        />
                                        {node.name}
                                    </button>
                                </div>

                                {/* 右側固定欄位：詳細 */}
                                <div className="justify-self-end">
                                    <button
                                        className="rounded bg-gray-200 px-2 py-0.5 text-sm dark:bg-black/30"
                                        onClick={() => setDetailModal({ node, parentPath: path })}
                                        title="詳細"
                                        type="button"
                                    >
                                        詳細
                                    </button>
                                </div>
                            </div>

                            {/* 子節點放在下面（佔滿整列寬度），縮排交由子節點內容區處理 */}
                            {isOpen && node.children && (
                                <div id={nodePath + "-children"} role="group" className="w-full">
                                    <TreeNode
                                        nodes={node.children}
                                        path={nodePath}
                                        expanded={expanded}
                                        setExpanded={setExpanded}
                                        setDetailModal={setDetailModal}
                                        floatLinks={floatLinks}
                                        prefersReducedMotion={prefersReducedMotion}
                                        alignRight={alignRight}
                                    />
                                </div>
                            )}
                        </li>
                    );
                } else {
                    return (
                        <li key={nodePath} role="treeitem" aria-selected="false" className="mb-2 w-full">
                            {/* 左=連結內容（套縮排/動畫），右=詳細固定在最右 */}
                            <div className="grid w-full grid-cols-[1fr_auto] items-center">
                                <div
                                    className={`flex items-center ${alignRight ? "justify-end" : ""}`}
                                    style={indentStyle}
                                >
                                    <motion.a
                                        href={node.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex transition-colors duration-200 text-gray-700 dark:text-[#BABABA]"
                                        whileHover={
                                            prefersReducedMotion
                                                ? {}
                                                : { scale: 1.04, y: -2, boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }
                                        }
                                        animate={
                                            floatLinks && !prefersReducedMotion
                                                ? { y: [0, -4, 0, 4, 0] as number[] }
                                                : { y: 0 }
                                        }
                                        transition={
                                            floatLinks && !prefersReducedMotion
                                                ? ({
                                                    repeat: Infinity,
                                                    duration: 3.2,
                                                    ease: EASE_IN_OUT,
                                                    delay: (idx % 5) * 0.12,
                                                } as Transition)
                                                : undefined
                                        }
                                    >
                                        {node.name}
                                    </motion.a>
                                </div>

                                <div className="justify-self-end">
                                    <button
                                        className="rounded bg-gray-200 px-2 py-0.5 text-sm dark:bg-black/30"
                                        onClick={() => setDetailModal({ node, parentPath: path })}
                                        title="詳細"
                                        type="button"
                                    >
                                        詳細
                                    </button>
                                </div>
                            </div>
                        </li>
                    );
                }
            })}
        </ul>
    );
}


/* 主組件：外面只顯示「詳細」，根目錄的新增也放進詳細；支援 align="right" */
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
    const prefersReducedMotion = useReducedMotion();
    const alignRight = align === "right";
    const displayIcon = (show && iconOpen) ? iconOpen : icon;

    useEffect(() => {
        fetch("/api/tools")
            .then((r) => r.json())
            .then((data) => setTools(data))
            .catch(() => setTools([]));

        try {
            const saved = localStorage.getItem("tools_expanded");
            if (saved) setExpanded(JSON.parse(saved));
        } catch { }
    }, []);

    // 浮動按鈕動畫：未開啟時上下浮動；開啟/ReducedMotion 時停止
    const fabAnim =
        show || prefersReducedMotion
            ? { animate: { y: 0 } }
            : {
                animate: { y: [0, -6, 0, 6, 0] as number[] },
                transition: { repeat: Infinity, duration: 3, ease: EASE_IN_OUT } as Transition,
            };

    // 根目錄「詳細」：只顯示新增按鈕
    const openRootDetail = () =>
        setDetailModal({ node: { __isRoot: true, name: "", type: "folder" }, parentPath: "" });

    return (
        <>
            {/* Floating Action Button */}
            <motion.button
                aria-label="小工具選單"
                aria-haspopup="dialog"
                onClick={() => setShow((p) => !p)}
                className="fixed z-50 flex h-[48px] w-[48px] items-center justify-center rounded-full bg-white shadow-md transition hover:shadow-lg dark:bg-[#222229] dark:text-[#BABABA]"
                style={{ right: offset.right, bottom: offset.bottom }}
                whileHover={prefersReducedMotion ? {} : { scale: 1.08 }}
                {...fabAnim}
            >
                <motion.span
                    className="text-xl"
                    animate={show ? { rotate: 45 } : { rotate: 0 }}
                    transition={{ duration: 0.18 }}
                >
                    {displayIcon}
                </motion.span>
            </motion.button>

            {/* Panel */}
            {show && (
                <motion.div
                    role="dialog"
                    aria-label="小工具選單"
                    initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.92, y: 8 }}
                    animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.22, ease: EASE_IN_OUT }}
                    className="fixed z-50 rounded-xl bg-white p-4 text-gray-800 shadow-xl dark:bg-[#222229] dark:text-[#BABABA]"
                    style={{ right: offset.right, bottom: offset.bottom + 56, minWidth: 240 }}
                >
                    <div className={`mb-2 flex items-center ${alignRight ? "justify-between" : "justify-between"}`}>
                        <span className="font-bold">小工具選單</span>
                        <button
                            className="rounded bg-gray-200 mr-1 px-2 py-0.5 text-sm dark:bg-black/30"
                            onClick={openRootDetail}
                            title="根目錄詳細（新增用）"
                        >
                            詳細
                        </button>
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
                        />
                    </div>
                </motion.div>
            )}

            {/* Detail Modal */}
            <DetailModal
                detailModal={detailModal}
                setDetailModal={setDetailModal}
                tools={tools}
                setTools={setTools}
            />
        </>
    );
}
