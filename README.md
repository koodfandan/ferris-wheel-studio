# Ferris Wheel Studio

一个以盲盒/手办创作为核心的 3D 前端项目，支持角色展示、组合改造、舞台展示与动画交互。

## Tech Stack

- React + TypeScript + Vite
- Three.js + @react-three/fiber + @react-three/drei
- @react-three/postprocessing

## Quick Start

```bash
npm install
npm run dev
```

默认开发地址：

`http://localhost:5173`

## Build

```bash
npm run build
npm run preview
```

## Project Structure

- `src/reboot/`：新版舞台、角色与渲染主逻辑
- `src/components/`：界面组件与舞台壳层
- `src/features/`：盲盒、导入等功能模块
- `services/hunyuan-api/`：后端 API 示例与本地服务代码
- `docs/`：产品与技术方案文档

## Notes

- 仓库已忽略运行产物与临时文件（`node_modules/`、`dist/`、`tmp_*`、`__pycache__/`、日志等）。
- 如需接入模型生成 API，请先阅读 `docs/` 与 `services/hunyuan-api/README.md`。
