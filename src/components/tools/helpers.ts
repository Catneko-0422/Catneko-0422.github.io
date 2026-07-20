import type { ToolsTree, ToolNode } from "@/types/tools";

export const isValidHttpUrl = (str: string) => /^(https?:\/\/)/i.test(str);
export const cloneTools = (tools: ToolsTree): ToolsTree => JSON.parse(JSON.stringify(tools));

export function getParentByPath(tree: ToolsTree, pathArray: string[]): ToolNode[] {
    let parent: any = tree;
    for (const seg of pathArray) {
        const next = parent.find((n: any) => n.name === seg);
        if (!next || next.type !== "folder") throw new Error("Invalid path");
        parent = next.children;
    }
    return parent as ToolNode[];
}

export const findIndexInParent = (parent: ToolNode[], name: string) =>
    parent.findIndex((n) => n.name === name);
