#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import argparse
import os
import sys

def collect_files(paths, exts, recursive):
    files = []
    for p in paths:
        if os.path.isfile(p):
            files.append(p)
        elif os.path.isdir(p):
            if recursive:
                for root, _, fnames in os.walk(p):
                    for fn in fnames:
                        if any(fn.endswith(e) for e in exts):
                            files.append(os.path.join(root, fn))
            else:
                for fn in os.listdir(p):
                    full = os.path.join(p, fn)
                    if os.path.isfile(full) and any(fn.endswith(e) for e in exts):
                        files.append(full)
        else:
            # 如果既不是檔案也不是資料夾，試試當作 glob pattern
            import glob
            matched = glob.glob(p, recursive=recursive)
            for m in matched:
                if os.path.isfile(m) and any(m.endswith(e) for e in exts):
                    files.append(m)
    return sorted(set(files))

def main():
    parser = argparse.ArgumentParser(
        description="聚合小工具：支援目錄掃描＆副檔名篩選"
    )
    parser.add_argument("workspace",
                        help="工作區名稱，會出現在每個 header")
    parser.add_argument("paths", nargs="*",
                        help="要聚合的檔案或目錄（可混用）或 glob patterns")
    parser.add_argument("-e", "--ext", nargs="*",
                        default=[".py", ".js", ".ts", ".tsx", ".jsx"],
                        help="要包含的副檔名列表，預設：.py .js .ts .tsx .jsx")
    parser.add_argument("-r", "--recursive", action="store_true",
                        help="遞迴掃描資料夾裡的所有檔案")
    parser.add_argument("-o", "--output", default="output.txt",
                        help="輸出檔案名稱，預設 output.txt")
    args = parser.parse_args()

    # 如果使用者沒給任何 paths，就預設掃描整個專案資料夾
    if not args.paths:
        args.paths = [os.getcwd()]

    files = collect_files(args.paths, args.ext, args.recursive)
    if not files:
        print("⚠️ 沒有找到任何符合條件的檔案，確認路徑或副檔名", file=sys.stderr)
        sys.exit(1)

    try:
        with open(args.output, "w", encoding="utf-8") as fout:
            for fp in files:
                rel = os.path.relpath(fp, start=os.getcwd())
                fout.write(f"#{args.workspace}/{rel}\n")
                with open(fp, "r", encoding="utf-8", errors="ignore") as fin:
                    fout.write(fin.read())
                fout.write("\n\n")
        print(f"✅ 已生成：{args.output}，共聚合 {len(files)} 支檔案")
    except Exception as e:
        print(f"❌ 發生錯誤：{e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
