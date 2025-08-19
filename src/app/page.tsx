/**
 * Nekocat.cc 主頁面
 * 包含打字機動畫、社群連結、小工具選單（支援 dark/light 模式與動畫）
 * 維護建議：小工具內容集中於 tools 陣列，主要互動區塊皆有註解
 */
"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faFacebook,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faBookOpen } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { faWindowMaximize } from "@fortawesome/free-solid-svg-icons";

const getRandomChar = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=";
  return chars[Math.floor(Math.random() * chars.length)];
};

const Home: React.FC = () => {
  // 網站標題動畫用
  const target = "Nekocat.cc";
  const [letters, setLetters] = useState<string[]>(
    Array(target.length).fill(""),
  );
  // 小工具選單開關
  const [showWidgetMenu, setShowWidgetMenu] = useState(false);

  const titles = [
    "NYUST student",
    "AI explorer",
    "Fullstack developer",
    "Techno-otaku",
  ];

  // 樹狀結構工具資料，type: folder/link
  // tools.json 讀取
  const [tools, setTools] = useState([]);
  useEffect(() => {
    fetch("/api/tools")
      .then(res => res.json())
      .then(data => setTools(data));
  }, []);
  // 詳細編輯彈窗狀態
  const [detailModal, setDetailModal] = useState<{ node: any, parentPath: string } | null>(null);
  // 展開狀態
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  // 彈窗狀態
  const [modal, setModal] = useState<{ parentPath: string; type: "folder" | "link" | null }>({ parentPath: "", type: null });
  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [typingSpeed, setTypingSpeed] = useState(150);

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
  }, [displayText, isDeleting, loopNum]);

  // 網站標題解碼動畫
  useEffect(() => {
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
  }, []);

  return (
    <div className="w-full flex flex-col items-center text-foreground">
      <div className="w-full h-[30vh]">
        <img
          src="/background.gif"
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="w-full max-w-6xl px-4 -mt-30 flex flex-col lg:flex-row items-center lg:items-start justify-start gap-8">
        <motion.div
          className="mt-8 lg:mt-0 flex justify-center lg:justify-start"
          initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.8 }}
        >
          <img
            src="/profile.jpg"
            alt="Profile"
            className="w-36 h-36 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 border-8 border-gray-200 dark:border-[#222229] rounded-full shadow-lg"
          />
        </motion.div>

        <div className="text-center lg:text-left flex flex-col items-center lg:items-start lg:mt-35">
          <motion.h2
            className="text-xl sm:text-2xl md:text-3xl font-bold mb-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.3 }}
          >
            {letters.map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {char}
              </motion.span>
            ))}
            <span className="animate-pulse text-gray-600 dark:text-[#BABABA]">
              |
            </span>
          </motion.h1>

          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-[#BABABA] leading-relaxed max-w-2xl">
            A student from <span className="text-green-400">NYUST</span> who
            loves <span className="text-pink-400">AI</span> and{" "}
            <span className="text-yellow-400">programming</span>.<br />I am
            familiar with both <span className="text-yellow-300">hardware</span>{" "}
            and <span className="text-blue-300">software</span>, exploring
            various technologies.
            <br />
            stay curious, <span className="text-pink-400">always learning</span>
            .
          </p>

          <div className="w-full mt-10 flex justify-center lg:justify-start">
            <div className="flex gap-8 text-4xl">
              <a
                href="https://blog.nekocat.cc"
                className="transition-transform duration-200 hover:scale-125 text-gray-600 dark:text-[#BABABA] hover:text-black dark:hover:text-white"
              >
                <FontAwesomeIcon icon={faBookOpen} />
              </a>
              <a
                href="https://www.facebook.com/neko.cat.863674/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform duration-200 hover:scale-125 text-gray-600 dark:text-[#BABABA] hover:text-blue-400"
              >
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a
                href="https://www.instagram.com/neko._cat422/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform duration-200 hover:scale-125 text-gray-600 dark:text-[#BABABA] hover:text-pink-400"
              >
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a
                href="https://github.com/Catneko-0422"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform duration-200 hover:scale-125 text-gray-600 dark:text-[#BABABA] hover:text-black dark:hover:text-white"
              >
                <FontAwesomeIcon icon={faGithub} />
              </a>
              <a
                href="mailto:linyian0422@gmail.com"
                className="transition-transform duration-200 hover:scale-125 text-gray-600 dark:text-[#BABABA] hover:text-green-400"
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
          className="dark:bg-[#222229] dark:text-black"
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
          animate={showWidgetMenu ? { y: 0 } : { y: [0, -4, 0, 4, 0] }}
          transition={showWidgetMenu ? {} : { repeat: Infinity, duration: 2 }}
          whileHover={{
            scale: 1.08,
            boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
          }}
        >
          <FontAwesomeIcon icon={faWindowMaximize} />
        </motion.button>
        {showWidgetMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "absolute",
              bottom: "72px",
              right: 0,
              background: "var(--menu-bg, #fff)",
              borderRadius: "12px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
              padding: "16px",
              minWidth: "180px",
              color: "var(--menu-text, #222)",
            }}
            className="dark:bg-[#222229] dark:text-[#BABABA] bg-white text-gray-800"
          >
            <div style={{ fontWeight: "bold", marginBottom: "8px", display: "flex", alignItems: "center" }}>
              小工具選單
              {/* 頂層新增資料夾按鈕 */}
              <button
                style={{
                  marginLeft: "8px",
                  fontSize: "18px",
                  background: "#eee",
                  borderRadius: "6px",
                  border: "none",
                  padding: "2px 8px",
                  cursor: "pointer",
                }}
                onClick={() => setModal({ parentPath: "", type: "folder" })}
                title="新增資料夾"
              >＋資料夾</button>
              {/* 頂層新增連結按鈕 */}
              <button
                style={{
                  marginLeft: "4px",
                  fontSize: "18px",
                  background: "#eee",
                  borderRadius: "6px",
                  border: "none",
                  padding: "2px 8px",
                  cursor: "pointer",
                }}
                onClick={() => setModal({ parentPath: "", type: "link" })}
                title="新增連結"
              >＋連結</button>
            </div>
            {/* 樹狀工具遞迴渲染 */}
            <TreeNode
              nodes={tools}
              path=""
              expanded={expanded}
              setExpanded={setExpanded}
              setModal={setModal}
              setDetailModal={setDetailModal}
              tools={tools}
              setTools={setTools}
            />
            {/* 新增資料夾/連結彈窗（簡易 alert 示意） */}
            {modal.type && (
              <div style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background: "#fff",
                borderRadius: "12px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
                padding: "24px",
                zIndex: 100,
              }}>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
                    let newTools = JSON.parse(JSON.stringify(tools));
                    if (modal.type === "folder") {
                      // 新增資料夾
                      const parentPath = modal.parentPath.split("/").filter(Boolean);
                      let parent = newTools;
                      for (const seg of parentPath) {
                        parent = parent.find((n: any) => n.name === seg).children;
                      }
                      parent.push({ name, type: "folder", children: [] });
                    } else {
                      // 新增連結
                      const url = (form.elements.namedItem("url") as HTMLInputElement).value;
                      const color = (form.elements.namedItem("color") as HTMLInputElement).value;
                      const parentPath = modal.parentPath.split("/").filter(Boolean);
                      let parent = newTools;
                      for (const seg of parentPath) {
                        parent = parent.find((n: any) => n.name === seg).children;
                      }
                      parent.push({ name, type: "link", url, color });
                    }
                    await fetch("/api/tools", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(newTools),
                    });
                    setModal({ parentPath: "", type: null });
                    // 重新 fetch
                    fetch("/api/tools")
                      .then(res => res.json())
                      .then(data => setTools(data));
                  }}
                >
                  <div style={{ marginBottom: "12px" }}>
                    {modal.type === "folder" ? "新增資料夾" : "新增連結"}
                  </div>
                  <div>
                    <label>名稱：</label>
                    <input name="name" required style={{ marginBottom: "8px" }} />
                  </div>
                  {modal.type === "link" && (
                    <>
                      <div>
                        <label>連結：</label>
                        <input name="url" required style={{ marginBottom: "8px" }} />
                      </div>
                      <div>
                        <label>顏色：</label>
                        <input name="color" style={{ marginBottom: "8px" }} placeholder="blue/yellow/green/red" />
                      </div>
                    </>
                  )}
                  <button type="submit">確定</button>
                  <button type="button" style={{ marginLeft: "12px" }} onClick={() => setModal({ parentPath: "", type: null })}>取消</button>
                </form>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

// 詳細編輯彈窗（放在 component 外層）
export function DetailModal({ detailModal, setDetailModal, tools, setTools }: {
  detailModal: { node: any, parentPath: string } | null,
  setDetailModal: React.Dispatch<React.SetStateAction<{ node: any, parentPath: string } | null>>,
  tools: any[],
  setTools: React.Dispatch<React.SetStateAction<any[]>>
}) {
  if (!detailModal) return null;
  return (
    <div style={{
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      background: "#fff",
      borderRadius: "12px",
      boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
      padding: "24px",
      zIndex: 100,
    }}>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const name = (form.elements.namedItem("edit-name") as HTMLInputElement).value;
          const url = (form.elements.namedItem("edit-url") as HTMLInputElement).value;
          const color = (form.elements.namedItem("edit-color") as HTMLInputElement).value;
          let newTools = JSON.parse(JSON.stringify(tools));
          // 找到要編輯的 node
          const parentPath = detailModal.parentPath.split("/").filter(Boolean);
          let parent = newTools;
          for (const seg of parentPath) {
            parent = parent.find((n: any) => n.name === seg).children;
          }
          const idx = parent.findIndex((n: any) => n.name === detailModal.node.name);
          parent[idx] = { ...parent[idx], name, url, color };
          await fetch("/api/tools", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newTools),
          });
          setDetailModal(null);
          fetch("/api/tools")
            .then(res => res.json())
            .then(data => setTools(data));
        }}
      >
        <div style={{ marginBottom: "12px" }}>編輯工具</div>
        <div>
          <label>名稱：</label>
          <input id="edit-name" name="edit-name" defaultValue={detailModal.node.name} style={{ marginBottom: "8px" }} />
        </div>
        <div>
          <label>連結：</label>
          <input id="edit-url" name="edit-url" defaultValue={detailModal.node.url} style={{ marginBottom: "8px" }} />
        </div>
        <div>
          <label>顏色：</label>
          <input id="edit-color" name="edit-color" defaultValue={detailModal.node.color} style={{ marginBottom: "8px" }} />
        </div>
        <button type="submit">儲存</button>
        <button type="button" style={{ marginLeft: "12px" }} onClick={() => setDetailModal(null)}>取消</button>
      </form>
    </div>
  );
}


/**
 * 遞迴渲染樹狀工具
 */
function TreeNode({
  nodes,
  path,
  expanded,
  setExpanded,
  setModal,
  setDetailModal,
  tools,
  setTools,
}: {
  nodes: any[];
  path: string;
  expanded: Record<string, boolean>;
  setExpanded: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  setModal: React.Dispatch<React.SetStateAction<{ parentPath: string; type: "folder" | "link" | null }>>;
  setDetailModal: React.Dispatch<React.SetStateAction<{ node: any, parentPath: string } | null>>;
  tools: any[];
  setTools: React.Dispatch<React.SetStateAction<any[]>>;
}) {
  return (
    <ul style={{ paddingLeft: path ? 16 : 0 }}>
      {nodes.map((node, idx) => {
        const nodePath = path + "/" + node.name;
        if (node.type === "folder") {
          return (
            <li key={nodePath} style={{ marginBottom: 8 }}>
              <span
                style={{ fontWeight: "bold", cursor: "pointer" }}
                onClick={() => setExpanded((prev) => ({ ...prev, [nodePath]: !prev[nodePath] }))}
              >
                {expanded[nodePath] ? "▼" : "▶"} {node.name}
              </span>
              {/* 編輯按鈕 */}
              <button
                style={{ marginLeft: 8 }}
                onClick={() => setDetailModal({ node, parentPath: path })}
                title="編輯"
              >詳細</button>
              {/* 刪除按鈕 */}
              <button
                style={{ marginLeft: 4, color: "red" }}
                onClick={async () => {
                  let newTools = JSON.parse(JSON.stringify(tools));
                  const parentPath = path.split("/").filter(Boolean);
                  let parent = newTools;
                  for (const seg of parentPath) {
                    parent = parent.find((n: any) => n.name === seg).children;
                  }
                  const idx = parent.findIndex((n: any) => n.name === node.name);
                  parent.splice(idx, 1);
                  await fetch("/api/tools", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newTools),
                  });
                  fetch("/api/tools")
                    .then(res => res.json())
                    .then(data => setTools(data));
                }}
                title="刪除"
              >🗑️</button>
              {/* 新增資料夾按鈕 */}
              <button
                style={{ marginLeft: 8 }}
                onClick={() => setModal({ parentPath: nodePath, type: "folder" })}
                title="新增資料夾"
              >＋資料夾</button>
              {/* 新增連結按鈕 */}
              <button
                style={{ marginLeft: 4 }}
                onClick={() => setModal({ parentPath: nodePath, type: "link" })}
                title="新增連結"
              >＋連結</button>
              {/* 展開內容 */}
              {expanded[nodePath] && node.children && (
                <TreeNode
                  nodes={node.children}
                  path={nodePath}
                  expanded={expanded}
                  setExpanded={setExpanded}
                  setModal={setModal}
                  setDetailModal={setDetailModal}
                  tools={tools}
                  setTools={setTools}
                />
              )}
            </li>
          );
        } else {
          return (
            <li key={nodePath}>
              <motion.a
                href={node.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "block", marginBottom: "4px" }}
                className={
                  `transition-colors duration-200 text-gray-700 dark:text-[#BABABA] ` +
                  (node.color === "blue"
                    ? "hover:text-blue-500 dark:hover:text-blue-300"
                    : node.color === "yellow"
                      ? "hover:text-yellow-500 dark:hover:text-yellow-300"
                      : node.color === "green"
                        ? "hover:text-green-500 dark:hover:text-green-300"
                        : node.color === "red"
                          ? "hover:text-red-500 dark:hover:text-red-300"
                          : "")
                }
                whileHover={{
                  scale: 1.08,
                  y: -2,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                }}
                animate={{
                  y: [0, -4, 0, 4, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                }}
              >
                {node.name}
              </motion.a>
              {/* 編輯按鈕 */}
              <button
                style={{ marginLeft: 8 }}
                onClick={() => setDetailModal({ node, parentPath: path })}
                title="編輯"
              >詳細</button>
              {/* 刪除按鈕 */}
              <button
                style={{ marginLeft: 4, color: "red" }}
                onClick={async () => {
                  let newTools = JSON.parse(JSON.stringify(tools));
                  const parentPath = path.split("/").filter(Boolean);
                  let parent = newTools;
                  for (const seg of parentPath) {
                    parent = parent.find((n: any) => n.name === seg).children;
                  }
                  const idx = parent.findIndex((n: any) => n.name === node.name);
                  parent.splice(idx, 1);
                  await fetch("/api/tools", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newTools),
                  });
                  fetch("/api/tools")
                    .then(res => res.json())
                    .then(data => setTools(data));
                }}
                title="刪除"
              >🗑️</button>
            </li>
          );
        }
      })}
    </ul>
  );
}

export default Home;

