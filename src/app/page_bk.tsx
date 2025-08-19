/**
 * Nekocat.cc 主頁面（修正版）
 * - 修正：DetailModal 未渲染、Tailwind 無效類名、可及性（button/aria-*）、Reduced Motion、樂觀更新等
 * - API 相容：沿用 /api/tools GET/POST 全量 JSON
 * - 小提醒：註解不加「喵」（依你的偏好）
 */
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faFacebook,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faBookOpen, faWindowMaximize } from "@fortawesome/free-solid-svg-icons";
import { motion, useReducedMotion } from "framer-motion";

/* ========== 小工具：隨機字與 URL 驗證 ========== */
const getRandomChar = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=";
  return chars[Math.floor(Math.random() * chars.length)];
};

const isValidHttpUrl = (str: string) => /^(https?:\/\/)/i.test(str);

/* ========== 樹狀資料工具函式（避免重複尋址） ========== */
type ToolNode =
  | { name: string; type: "folder"; children: ToolNode[] }
  | { name: string; type: "link"; url: string; color?: "blue" | "yellow" | "green" | "red" };

type ToolsTree = ToolNode[];

function cloneTools(tools: ToolsTree): ToolsTree {
  return JSON.parse(JSON.stringify(tools));
}

function getParentByPath(tree: ToolsTree, pathArray: string[]): ToolNode[] {
  // 空陣列代表根層
  let parent: any = tree;
  for (const seg of pathArray) {
    const next = parent.find((n: any) => n.name === seg);
    if (!next || next.type !== "folder") throw new Error("Invalid path");
    parent = next.children;
  }
  return parent as ToolNode[];
}

function findIndexInParent(parent: ToolNode[], name: string) {
  return parent.findIndex((n) => n.name === name);
}

/* ========== DetailModal ========== */
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
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!detailModal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDetailModal(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [detailModal, setDetailModal]);

  useEffect(() => {
    if (detailModal && dialogRef.current) {
      dialogRef.current.focus();
    }
  }, [detailModal]);

  if (!detailModal) return null;

  const handleAddFolder = async () => {
    const name = prompt("請輸入資料夾名稱");
    if (!name) return;

    const optimistic = cloneTools(tools);
    try {
      const parentPath = (detailModal.parentPath + "/" + detailModal.node.name)
        .split("/")
        .filter(Boolean);
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
    } catch (err) {
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
    const color = (prompt("請輸入顏色 (blue/yellow/green/red)") || "").trim() as
      | "blue"
      | "yellow"
      | "green"
      | "red"
      | "";

    const optimistic = cloneTools(tools);
    try {
      const parentPath = (detailModal.parentPath + "/" + detailModal.node.name)
        .split("/")
        .filter(Boolean);
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

  const handleDelete = async () => {
    if (!window.confirm("確定要刪除嗎？")) return;

    const optimistic = cloneTools(tools);
    try {
      const parentPath = detailModal.parentPath.split("/").filter(Boolean);
      const parent = getParentByPath(optimistic, parentPath);
      const idx = findIndexInParent(parent, detailModal.node.name);
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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem("edit-name") as HTMLInputElement).value.trim();
    const url = (form.elements.namedItem("edit-url") as HTMLInputElement).value.trim();
    const color = (form.elements.namedItem("edit-color") as HTMLInputElement).value.trim() as
      | "blue"
      | "yellow"
      | "green"
      | "red"
      | "";

    if (detailModal.node.type === "link" && url && !isValidHttpUrl(url)) {
      alert("URL 必須以 http:// 或 https:// 開頭");
      return;
    }

    const optimistic = cloneTools(tools);
    try {
      const parentPath = detailModal.parentPath.split("/").filter(Boolean);
      const parent = getParentByPath(optimistic, parentPath);
      const idx = findIndexInParent(parent, detailModal.node.name);
      if (idx < 0) throw new Error("node not found");

      parent[idx] = {
        ...parent[idx],
        name,
        ...(parent[idx].type === "link" ? { url, color } : {}),
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

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="編輯工具"
      tabIndex={-1}
      ref={dialogRef}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) setDetailModal(null);
      }}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative bg-white dark:bg-[#222229] text-gray-800 dark:text-[#BABABA] rounded-xl shadow-xl p-6 w-[min(92vw,560px)]">
        <form onSubmit={onSubmit}>
          <div className="mb-3 text-lg font-semibold">編輯工具</div>
          <div className="mb-2">
            <label className="mr-2">名稱：</label>
            <input
              id="edit-name"
              name="edit-name"
              defaultValue={detailModal.node.name}
              className="border rounded px-2 py-1 w-full dark:bg-black/20"
              required
            />
          </div>
          <div className="mb-2">
            <label className="mr-2">連結：</label>
            <input
              id="edit-url"
              name="edit-url"
              defaultValue={detailModal.node.url}
              className="border rounded px-2 py-1 w-full dark:bg-black/20"
              placeholder="http(s)://..."
            />
          </div>
          <div className="mb-4">
            <label className="mr-2">顏色：</label>
            <input
              id="edit-color"
              name="edit-color"
              defaultValue={detailModal.node.color}
              className="border rounded px-2 py-1 w-full dark:bg-black/20"
              placeholder="blue/yellow/green/red"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="submit" className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700">
              儲存
            </button>
            <button
              type="button"
              className="px-3 py-1 rounded bg-gray-200 dark:bg-black/30 hover:bg-gray-300"
              onClick={() => setDetailModal(null)}
            >
              取消
            </button>
            <button
              type="button"
              className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
              onClick={handleDelete}
            >
              刪除
            </button>
            {detailModal.node.type === "folder" && (
              <>
                <button
                  type="button"
                  className="px-3 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                  onClick={handleAddFolder}
                >
                  ＋資料夾
                </button>
                <button
                  type="button"
                  className="px-3 py-1 rounded bg-amber-600 text-white hover:bg-amber-700"
                  onClick={handleAddLink}
                >
                  ＋連結
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

/* ========== TreeNode ========== */
function TreeNode({
  nodes,
  path,
  expanded,
  setExpanded,
  setModal,
  setDetailModal,
  prefersReducedMotion,
}: {
  nodes: ToolNode[];
  path: string;
  expanded: Record<string, boolean>;
  setExpanded: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  setModal: React.Dispatch<
    React.SetStateAction<{ parentPath: string; type: "folder" | "link" | null }>
  >;
  setDetailModal: React.Dispatch<
    React.SetStateAction<{ node: any; parentPath: string } | null>
  >;
  prefersReducedMotion: boolean;
}) {
  return (
    <ul style={{ paddingLeft: path ? 16 : 0 }} role={path ? "group" : "tree"}>
      {nodes.map((node) => {
        const nodePath = path + "/" + node.name;

        if (node.type === "folder") {
          const isOpen = !!expanded[nodePath];
          return (
            <li key={nodePath} style={{ marginBottom: 8 }} role="treeitem" aria-expanded={isOpen}>
              <div className="inline-flex items-center gap-2">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={nodePath + "-children"}
                  className="font-bold cursor-pointer focus:outline-none focus:ring rounded"
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
                  {isOpen ? "▼" : "▶"} {node.name}
                </button>
                <button
                  className="text-sm px-2 py-0.5 rounded bg-gray-200 dark:bg-black/30"
                  onClick={() => setDetailModal({ node, parentPath: path })}
                  title="編輯"
                  type="button"
                >
                  詳細
                </button>
                <button
                  className="text-sm px-2 py-0.5 rounded bg-gray-200 dark:bg-black/30"
                  onClick={() => setModal({ parentPath: nodePath, type: "folder" })}
                  title="新增資料夾"
                  type="button"
                >
                  ＋資料夾
                </button>
                <button
                  className="text-sm px-2 py-0.5 rounded bg-gray-200 dark:bg-black/30"
                  onClick={() => setModal({ parentPath: nodePath, type: "link" })}
                  title="新增連結"
                  type="button"
                >
                  ＋連結
                </button>
              </div>

              {isOpen && node.children && (
                <div id={nodePath + "-children"} role="group">
                  <TreeNode
                    nodes={node.children}
                    path={nodePath}
                    expanded={expanded}
                    setExpanded={setExpanded}
                    setModal={setModal}
                    setDetailModal={setDetailModal}
                    prefersReducedMotion={prefersReducedMotion}
                  />
                </div>
              )}
            </li>
          );
        } else {
          const hoverAnim = prefersReducedMotion
            ? {}
            : {
              whileHover: {
                scale: 1.04,
                y: -2,
                boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
              } as any,
            };

          const colorClass =
            node.color === "blue"
              ? "hover:text-blue-500 dark:hover:text-blue-300"
              : node.color === "yellow"
                ? "hover:text-yellow-500 dark:hover:text-yellow-300"
                : node.color === "green"
                  ? "hover:text-green-500 dark:hover:text-green-300"
                  : node.color === "red"
                    ? "hover:text-red-500 dark:hover:text-red-300"
                    : "";

          return (
            <li key={nodePath} role="treeitem" aria-selected="false">
              <motion.a
                href={node.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "block", marginBottom: "4px" }}
                className={`transition-colors duration-200 text-gray-700 dark:text-[#BABABA] ${colorClass}`}
                {...hoverAnim}
              >
                {node.name}
              </motion.a>
              <button
                className="text-sm px-2 py-0.5 rounded bg-gray-200 dark:bg-black/30 ml-2"
                onClick={() => setDetailModal({ node, parentPath: path })}
                title="編輯"
                type="button"
              >
                詳細
              </button>
            </li>
          );
        }
      })}
    </ul>
  );
}

/* ========== Home 主元件 ========== */
const Home: React.FC = () => {
  // 網站標題動畫用
  const target = "Nekocat.cc";
  const [letters, setLetters] = useState<string[]>(Array(target.length).fill(""));
  // 小工具選單開關
  const [showWidgetMenu, setShowWidgetMenu] = useState(false);

  const titles = useMemo(
    () => ["NYUST student", "AI explorer", "Fullstack developer", "Techno-otaku"],
    []
  );

  // tools
  const [tools, setTools] = useState<ToolsTree>([]);
  // 詳細編輯彈窗狀態
  const [detailModal, setDetailModal] = useState<{ node: any; parentPath: string } | null>(null);
  // 展開狀態（持久化）
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  // 新增資料夾/連結彈窗狀態
  const [modal, setModal] = useState<{
    parentPath: string;
    type: "folder" | "link" | null;
  }>({ parentPath: "", type: null });

  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [typingSpeed] = useState(150);

  const prefersReducedMotion = useReducedMotion();

  // 初始載入 tools 與 expanded
  useEffect(() => {
    fetch("/api/tools")
      .then((res) => res.json())
      .then((data) => setTools(data))
      .catch(() => setTools([]));

    try {
      const saved = localStorage.getItem("tools_expanded");
      if (saved) setExpanded(JSON.parse(saved));
    } catch { }
  }, []);

  // 打字機動畫效果
  useEffect(() => {
    const current = titles[loopNum % titles.length];

    const handleTyping = () => {
      const updatedText = isDeleting
        ? current.substring(0, displayText.length - 1)
        : current.substring(0, displayText.length + 1);

      setDisplayText(updatedText);

      if (!isDeleting && updatedText === current) {
        setTimeout(() => setIsDeleting(true), 1000);
      } else if (isDeleting && updatedText === "") {
        setIsDeleting(false);
        setLoopNum((prev) => prev + 1);
      }
    };

    const typingTimeout = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(typingTimeout);
  }, [displayText, isDeleting, loopNum, typingSpeed, titles]);

  // 網站標題解碼動畫
  useEffect(() => {
    if (prefersReducedMotion) {
      setLetters(target.split(""));
      return;
    }

    const scrambleAll = () => {
      const scrambled = target.split("").map(() => getRandomChar());
      setLetters(scrambled);
    };

    const decodeLetter = async (index: number, correctChar: string) => {
      for (let i = 0; i < 5; i++) {
        await new Promise((resolve) => setTimeout(resolve, 50));
        setLetters((prev) => {
          const next = [...prev];
          next[index] = getRandomChar();
          return next;
        });
      }
      setLetters((prev) => {
        const next = [...prev];
        next[index] = correctChar;
        return next;
      });
    };

    const runDecode = async () => {
      for (let i = 0; i < target.length; i++) {
        await decodeLetter(i, target[i]);
      }
    };

    const triggerCycle = async () => {
      scrambleAll();
      await new Promise((resolve) => setTimeout(resolve, 10));
      await runDecode();
    };

    triggerCycle();

    const interval = setInterval(() => {
      triggerCycle();
    }, 10000);

    return () => clearInterval(interval);
  }, [prefersReducedMotion, target]);

  return (
    <div className="w-full flex flex-col items-center text-foreground">
      <div className="w-full h-[30vh]">
        <img
          src="/background.gif"
          alt="Animated background"
          className="w-full h-full object-cover"
          loading="eager"
        />
      </div>

      <div className="w-full max-w-6xl px-4 -mt-[30px] flex flex-col lg:flex-row items-center lg:items-start justify-start gap-8">
        <motion.div
          className="-mt-8 lg:-mt-8 flex justify-center lg:justify-start"
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.8, filter: "blur(10px)" }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.8 }}
        >
          <img
            src="/profile.jpg"
            alt="Profile photo"
            className="w-36 h-36 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 border-8 border-gray-200 dark:border-[#222229] rounded-full shadow-lg"
            loading="lazy"
          />
        </motion.div>

        <div className="text-center lg:text-left flex flex-col items-center lg:items-start lg:mt-[35px]">
          <motion.h2
            className="text-xl sm:text-2xl md:text-3xl font-bold mb-2"
            initial={prefersReducedMotion ? false : { opacity: 0, x: -20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Hello~ I'm a{" "}
            <span className="text-purple-400">
              {displayText}
              <span className="animate-pulse">|</span>
            </span>
          </motion.h2>

          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-blue-700 dark:text-[#98BAD2] mb-4 font-mono tracking-wider"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={prefersReducedMotion ? {} : { opacity: 1 }}
            transition={{ delay: 1, duration: 0.3 }}
          >
            {letters.map((char, index) => (
              <motion.span
                key={index}
                initial={prefersReducedMotion ? false : { opacity: 0, y: -10 }}
                animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {char}
              </motion.span>
            ))}
            <span className="animate-pulse text-gray-600 dark:text-[#BABABA]">|</span>
          </motion.h1>

          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-[#BABABA] leading-relaxed max-w-2xl">
            A student from <span className="text-green-400">NYUST</span> who
            loves <span className="text-pink-400">AI</span> and{" "}
            <span className="text-yellow-400">programming</span>.<br />I am
            familiar with both <span className="text-yellow-300">hardware</span>{" "}
            and <span className="text-blue-300">software</span>, exploring
            various technologies.
            <br />
            stay curious, <span className="text-pink-400">always learning</span>.
          </p>

          <div className="w-full mt-10 flex justify-center lg:justify-start">
            <div className="flex gap-8 text-4xl">
              <a
                href="https://blog.nekocat.cc"
                className="transition-transform duration-200 hover:scale-125 text-gray-600 dark:text-[#BABABA] hover:text-black dark:hover:text-white"
                aria-label="Blog"
              >
                <FontAwesomeIcon icon={faBookOpen} />
              </a>
              <a
                href="https://www.facebook.com/neko.cat.863674/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform duration-200 hover:scale-125 text-gray-600 dark:text-[#BABABA] hover:text-blue-400"
                aria-label="Facebook"
              >
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a
                href="https://www.instagram.com/neko._cat422/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform duration-200 hover:scale-125 text-gray-600 dark:text-[#BABABA] hover:text-pink-400"
                aria-label="Instagram"
              >
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a
                href="https://github.com/Catneko-0422"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform duration-200 hover:scale-125 text-gray-600 dark:text-[#BABABA] hover:text-black dark:hover:text-white"
                aria-label="GitHub"
              >
                <FontAwesomeIcon icon={faGithub} />
              </a>
              <a
                href="mailto:linyian0422@gmail.com"
                className="transition-transform duration-200 hover:scale-125 text-gray-600 dark:text-[#BABABA] hover:text-green-400"
                aria-label="Email"
              >
                <FontAwesomeIcon icon={faEnvelope} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 右下角小工具浮動按鈕 */}
      <div
        style={{
          position: "fixed",
          right: "32px",
          bottom: "32px",
          zIndex: 50,
        }}
      >
        <motion.button
          onClick={() => setShowWidgetMenu((prev) => !prev)}
          className="dark:bg-[#222229] dark:text-[#BABABA]"
          style={{
            background: "#fff",
            borderRadius: "50%",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            width: "45px",
            height: "45px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            cursor: "pointer",
          }}
          aria-label="小工具選單"
          aria-haspopup="dialog"
          animate={
            showWidgetMenu || prefersReducedMotion
              ? { y: 0 }
              : { y: [0, -4, 0, 4, 0] }
          }
          transition={
            showWidgetMenu || prefersReducedMotion ? {} : { repeat: Infinity, duration: 2 }
          }
          whileHover={
            prefersReducedMotion
              ? {}
              : { scale: 1.08, boxShadow: "0 4px 16px rgba(0,0,0,0.18)" }
          }
        >
          <FontAwesomeIcon icon={faWindowMaximize} />
        </motion.button>

        {showWidgetMenu && (
          <motion.div
            role="dialog"
            aria-label="小工具選單"
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.9, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "absolute",
              bottom: "72px",
              right: 0,
              background: "var(--menu-bg, #fff)",
              borderRadius: "12px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
              padding: "16px",
              minWidth: "220px",
              color: "var(--menu-text, #222)",
            }}
            className="dark:bg-[#222229] dark:text-[#BABABA] bg-white text-gray-800"
          >
            <div
              style={{
                fontWeight: "bold",
                marginBottom: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              <span>小工具選單</span>
              <div className="flex gap-2">
                <button
                  style={{
                    fontSize: "14px",
                    background: "#eee",
                    borderRadius: "6px",
                    border: "none",
                    padding: "4px 8px",
                    cursor: "pointer",
                  }}
                  onClick={() => setModal({ parentPath: "", type: "folder" })}
                  title="新增資料夾"
                >
                  ＋資料夾
                </button>
                <button
                  style={{
                    fontSize: "14px",
                    background: "#eee",
                    borderRadius: "6px",
                    border: "none",
                    padding: "4px 8px",
                    cursor: "pointer",
                  }}
                  onClick={() => setModal({ parentPath: "", type: "link" })}
                  title="新增連結"
                >
                  ＋連結
                </button>
              </div>
            </div>

            {/* 樹狀工具遞迴渲染 */}
            <TreeNode
              nodes={tools}
              path=""
              expanded={expanded}
              setExpanded={setExpanded}
              setModal={setModal}
              setDetailModal={setDetailModal}
              prefersReducedMotion={!!prefersReducedMotion}
            />

            {/* 新增資料夾/連結彈窗 */}
            {modal.type && (
              <div
                role="dialog"
                aria-modal="true"
                aria-label={modal.type === "folder" ? "新增資料夾" : "新增連結"}
                style={{
                  position: "fixed",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  background: "#fff",
                  borderRadius: "12px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
                  padding: "24px",
                  zIndex: 100,
                }}
                className="dark:bg-[#222229]"
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    setModal({ parentPath: "", type: null });
                  }
                }}
              >
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const name = (form.elements.namedItem("name") as HTMLInputElement).value.trim();

                    const newTools = cloneTools(tools);
                    const parentPath = modal.parentPath.split("/").filter(Boolean);
                    const parent = getParentByPath(newTools, parentPath);

                    if (modal.type === "folder") {
                      parent.push({ name, type: "folder", children: [] });
                    } else {
                      const url = (form.elements.namedItem("url") as HTMLInputElement).value.trim();
                      const color = (form.elements.namedItem("color") as HTMLInputElement).value.trim() as
                        | "blue"
                        | "yellow"
                        | "green"
                        | "red"
                        | "";
                      if (!isValidHttpUrl(url)) {
                        alert("URL 必須以 http:// 或 https:// 開頭");
                        return;
                      }
                      parent.push({ name, type: "link", url });
                    }

                    // 樂觀更新
                    setModal({ parentPath: "", type: null });
                    setTools(newTools);

                    try {
                      const res = await fetch("/api/tools", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(newTools),
                      });
                      if (!res.ok) throw new Error("POST /api/tools failed");
                    } catch {
                      alert("儲存失敗，已回滾");
                      fetch("/api/tools")
                        .then((r) => r.json())
                        .then((data) => setTools(data));
                    }
                  }}
                >
                  <div style={{ marginBottom: "12px" }}>
                    {modal.type === "folder" ? "新增資料夾" : "新增連結"}
                  </div>
                  <div className="mb-2">
                    <label className="mr-2">名稱：</label>
                    <input name="name" required className="border rounded px-2 py-1 w-full dark:bg-black/20" />
                  </div>
                  {modal.type === "link" && (
                    <>
                      <div className="mb-2">
                        <label className="mr-2">連結：</label>
                        <input
                          name="url"
                          required
                          className="border rounded px-2 py-1 w-full dark:bg-black/20"
                          placeholder="http(s)://..."
                        />
                      </div>
                      <div className="mb-4">
                        <label className="mr-2">顏色：</label>
                        <input
                          name="color"
                          className="border rounded px-2 py-1 w-full dark:bg-black/20"
                          placeholder="blue/yellow/green/red"
                        />
                      </div>
                    </>
                  )}
                  <div className="flex gap-2">
                    <button type="submit" className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700">
                      確定
                    </button>
                    <button
                      type="button"
                      className="px-3 py-1 rounded bg-gray-200 dark:bg-black/30 hover:bg-gray-300"
                      onClick={() => setModal({ parentPath: "", type: null })}
                    >
                      取消
                    </button>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* 真正把 DetailModal 渲染出來（修 bug） */}
      <DetailModal
        detailModal={detailModal}
        setDetailModal={setDetailModal}
        tools={tools}
        setTools={setTools}
      />
    </div>
  );
};

export default Home;
