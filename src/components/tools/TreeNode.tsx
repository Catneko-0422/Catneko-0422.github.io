"use client";

import React from "react";
import type { ToolNode } from "@/types/tools";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronRight } from "@fortawesome/free-solid-svg-icons";

export function TreeNode({
    nodes,
    path,
    expanded,
    setExpanded,
    setDetailModal,
    floatLinks,
    prefersReducedMotion,
    alignRight,
    isAdmin,
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
    isAdmin: boolean;
}) {
    const depth = path ? path.split("/").filter(Boolean).length : 0;
    const indentPx = depth * 16;
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

                                <div className="justify-self-end">
                                    {isAdmin && (
                                        <button
                                            className="rounded bg-gray-200 px-2 py-0.5 text-sm dark:bg-black/30"
                                            onClick={() => setDetailModal({ node, parentPath: path })}
                                            title="詳細"
                                            type="button"
                                        >
                                            詳細
                                        </button>
                                    )}
                                </div>
                            </div>

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
                                        isAdmin={isAdmin}
                                    />
                                </div>
                            )}
                        </li>
                    );
                } else {
                    return (
                        <li key={nodePath} role="treeitem" aria-selected="false" className="mb-2 w-full">
                            <div className="grid w-full grid-cols-[1fr_auto] items-center">
                                <div
                                    className={`flex items-center ${alignRight ? "justify-end" : ""}`}
                                    style={indentStyle}
                                >
                                    <a
                                        href={node.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`inline-flex transition-all duration-200 text-gray-700 dark:text-[#BABABA] hover:scale-105 hover:-translate-y-0.5 hover:shadow-lg ${floatLinks && !prefersReducedMotion ? "mizuki-float" : ""}`}
                                        style={floatLinks && !prefersReducedMotion ? { animationDelay: `${(idx % 5) * 0.12}s` } : undefined}
                                    >
                                        {node.name}
                                    </a>
                                </div>

                                <div className="justify-self-end">
                                    {isAdmin && (
                                        <button
                                            className="rounded bg-gray-200 px-2 py-0.5 text-sm dark:bg-black/30"
                                            onClick={() => setDetailModal({ node, parentPath: path })}
                                            title="詳細"
                                            type="button"
                                        >
                                            詳細
                                        </button>
                                    )}
                                </div>
                            </div>
                        </li>
                    );
                }
            })}
        </ul>
    );
}
