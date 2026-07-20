"use client";

import React from "react";
import type { ToolsTree, ToolNode } from "@/types/tools";
import { Modal } from "./Modal";
import { isValidHttpUrl, cloneTools, getParentByPath, findIndexInParent } from "./helpers";

export function DetailModal({
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
    const isRoot = !!node?.__isRoot;

    const onSubmit = async (e: React.FormEvent) => {
        if (isRoot) return;
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
                    <button
                        type="button"
                        className="rounded bg-gray-200 px-3 py-1 hover:bg-gray-300 dark:bg-black/30"
                        onClick={() => setDetailModal(null)}
                    >
                        取消
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
                        <button
                            type="button"
                            className="rounded bg-gray-200 px-3 py-1 hover:bg-gray-300 dark:bg-black/30"
                            onClick={() => setDetailModal(null)}
                        >
                            取消
                        </button>
                    </div>
                </form>
            )}
        </Modal>
    );
}
