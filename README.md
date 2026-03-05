# create-ai-rules

## Overview
`create-ai-rules` là CLI giúp scaffold nhanh bộ quy tắc cho AI coding assistants theo nhiều target khác nhau (Copilot, Cursor, Claude Code, Generic...).

Mục tiêu:
- Tạo sẵn cấu trúc rule files theo đúng định dạng từng công cụ.
- Cho phép chọn stack để sinh guideline phù hợp ngữ cảnh dự án.
- Hỗ trợ chế độ interactive hoặc chạy nhanh bằng cờ CLI.

## Install / Run
Bạn có thể chạy trực tiếp qua `npx` (không cần cài global):

```bash
npx create-ai-rules
```

Chạy nhanh với cấu hình mặc định:

```bash
npx create-ai-rules --yes
```

Xem trợ giúp:

```bash
npx create-ai-rules --help
```

## Interactive flow
Khi chạy không dùng `--yes`, CLI sẽ đi theo luồng tương tác:
1. Chọn target(s) muốn sinh rules.
2. Chọn tech stack(s).
3. Chọn chế độ minimal (file output) hay đầy đủ prompts/skills.
4. Chọn rule mode: core-only hoặc full (kèm stack-extended).
5. Chọn verbosity profile: minimal/standard/strict.

Phím điều hướng:
- `↑/↓`: di chuyển
- `Space`: chọn/bỏ chọn (multi-select)
- `A`: chọn/bỏ chọn tất cả
- `Enter`: xác nhận

## CLI flags
Các cờ chính (đồng bộ với `bin/create-ai-rules.js`):

- `-y, --yes`  
  Chạy nhanh với mặc định: `copilot + generic`, stack mặc định `ts`.
- `-f, --force`  
  Ghi đè file đã tồn tại.
- `--minimal`  
  Chỉ sinh file cốt lõi, bỏ qua prompts/skills/extras.
- `--full`  
  Bật extended stack sections (core luôn được include).
- `--verbosity=<minimal|standard|strict>`  
  Chọn profile độ chi tiết để giảm token dư thừa.
- `--stack=<name[,name2,...]>`  
  Chọn stack khi dùng `--yes` (hỗ trợ danh sách ngăn cách bằng dấu phẩy).
- `-h, --help`  
  Hiển thị hướng dẫn.
- `-v, --version`  
  Hiển thị phiên bản.

## Supported targets
- **GitHub Copilot**: `.github/` (instructions + prompts + skills)
- **Cursor**: `.cursor/rules/*.mdc` (+ `skills/` khi không minimal)
- **Windsurf**: `.windsurfrules`
- **Claude Code**: `CLAUDE.md`
- **Cline**: `.clinerules`
- **Antigravity**: `.agent/rules/` + `workflows/`
- **Generic / Agents**: `AGENTS.md`

## Supported stacks
Có thể chọn một hoặc nhiều stack:
- `ts` (TypeScript generic)
- `react` (React / Next.js)
- `node` (Node.js API)
- `nestjs` (NestJS)
- `python` (Python)
- `unity` (Unity C#)
- `go` (Golang)
- `flutter` (Flutter / Dart)

> Gợi ý: với `--yes`, dùng `--stack=` để override stack mặc định.

## Command examples
Mặc định nhanh:

```bash
npx create-ai-rules --yes
```

Mặc định + stack cụ thể:

```bash
npx create-ai-rules --yes --stack=react,node
```

Ghi đè file cũ và chỉ tạo core files:

```bash
npx create-ai-rules --yes --force --minimal
```

Sinh output core-only, profile ngắn gọn: 

```bash
npx create-ai-rules --yes --verbosity=minimal
```

Sinh đầy đủ stack-extended rule sections:

```bash
npx create-ai-rules --yes --stack=react,node --full --verbosity=strict
```

## Best practices for AI rules
### Khi nào dùng minimal vs full
- **Dùng `--minimal` khi:**
  - Bạn cần setup nhanh, ít file, giảm noise cho repo nhỏ.
  - Team đã có guideline riêng, chỉ cần khung rule cốt lõi để AI tuân thủ.
- **Dùng full (không `--minimal`) khi:**
  - Bạn muốn AI có thêm prompts/skills/extras để xử lý tình huống phức tạp.
  - Dự án nhiều module, cần hướng dẫn chi tiết theo workflow.

### Chọn stack để giảm token dư thừa
- Chỉ chọn stack thật sự dùng trong repo hiện tại.
- Tránh bật quá nhiều stack không liên quan (ví dụ vừa `python` vừa `unity` nếu dự án không dùng).
- Với monorepo, ưu tiên stack chính của phần code mà AI sẽ thao tác thường xuyên.
- Nếu dùng `--yes`, luôn cân nhắc thêm `--stack=...` để tránh bị fallback mặc định `ts` không đúng ngữ cảnh.

## Example output files by target
Ví dụ các file thường được sinh (tùy `minimal`/`full`):

### 1) Copilot
- `.github/copilot-instructions.md`
- `.github/instructions/00-style.instructions.md`
- `.github/prompts/` (khi full)
- `.github/skills/` (khi full)

### 2) Cursor
- `.cursor/rules/base.mdc`
- `.cursor/rules/*-stack.mdc` (theo stack đã chọn)
- `.cursor/skills/` (khi full)

### 3) Claude Code
- `CLAUDE.md`

### 4) Generic / Agents
- `AGENTS.md`
