export type ToolNode =
    | { name: string; type: "folder"; children: ToolNode[] }
    | { name: string; type: "link"; url: string; color?: "blue" | "yellow" | "green" | "red" };

export type ToolsTree = ToolNode[];