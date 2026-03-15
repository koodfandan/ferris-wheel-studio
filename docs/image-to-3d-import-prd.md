# 图片导入生成 3D 模型

## 1. 功能目标

在当前盲盒/手办网站中新增一个 `导入图片` 功能。

用户上传一张图片后，系统将图片转换为一个可在当前 3D 舞台中展示的模型，并允许继续：

- 旋转查看
- 缩放查看
- 保存为收藏品
- 后续作为可拼装角色的基础资产

第一版不追求“任意图片都能稳定生成完整可编辑手办”，而是先做到：

- 输入一张清晰图片
- 输出一个可展示的 `GLB`
- 自动进入当前舞台
- 风格尽量向潮玩/手办感收敛

## 2. 当前需求的真实边界

这个需求最容易做偏的地方，是把“图片导入生成 3D 模型”理解成“随便传一张图就能稳定生成高质量、完整 360、还能换件的手办模型”。

这在第一版里不现实。

原因：

- 单张图天然缺少背面信息
- 背景复杂时主体识别会变差
- 写实照片、多人图、半身遮挡图质量会非常不稳定
- 即使能出一个网格，也未必适合后续换发型、换衣服、换配件

基于官方资料，我建议把第一版目标设成：

- `单主体`
- `单张清晰图`
- `自动生成可展示 3D 资产`
- `统一成当前网站可显示的 GLB`

这是一条可落地路线。

## 3. 第一版产品范围

### 3.1 允许的输入

只支持以下输入：

- 单人物
- 单动物
- 单玩具
- 单个卡通形象
- 清晰正面图或 3/4 角度图
- JPG / PNG / WEBP

第一版不支持：

- 多人物同框
- 背景极复杂的图
- 严重遮挡图
- 只截到头部的图
- 文字海报图
- 整张图中主体过小

### 3.2 生成结果

第一版输出：

- 一个统一规格的 `GLB`
- 自动加到当前收藏品体系
- 自动进入当前中央 3D 舞台

第一版先不做：

- 自动拆成头发/衣服/道具等可换装部件
- 自动 rig
- 动画骨骼
- 高精度写实材质

## 4. 用户流程

### 4.1 页面流程

1. 用户点击 `导入图片`
2. 打开导入面板
3. 上传图片
4. 系统先做 `图片预检查`
5. 通过后进入 `生成中`
6. 生成完成后出现 `结果预览`
7. 用户点击 `放入舞台`
8. 进入当前 3D 舞台查看
9. 用户点击 `保存到收藏`

### 4.2 失败分支

如果图片不合格，不能直接进入生成。

要明确提示：

- 主体不清晰
- 背景过于复杂
- 检测到多人
- 图片尺寸太小
- 生成失败，请换图重试

## 5. 页面交互设计

### 5.1 导入入口

在右侧结果区或顶部工具区新增一个主按钮：

- 中文：`导入图片`
- 英文：`Import Image`

### 5.2 导入面板

导入面板建议包含：

- 上传区域
- 示例说明
- 输入限制说明
- 背景复杂时的提醒
- 生成按钮

### 5.3 生成中状态

生成中必须用任务态展示，不能让用户误以为卡死。

建议显示：

- `图片预处理中`
- `正在生成形体`
- `正在生成纹理`
- `正在导入舞台`

### 5.4 生成结果

生成成功后先显示：

- 3D 预览缩略区
- 名称
- 风格标签
- 生成方式
- `放入舞台`
- `重新生成`
- `保存为收藏`

## 6. 技术结论

基于官方资料，这类功能有 3 条现实路线：

### 路线 A：第三方 API

代表：

- Meshy Image to 3D API

从官方文档看，Meshy 已经提供 `image-to-3d` 和 `multi-image-to-3d` 接口，并能返回 `glb/fbx/obj`，还支持 `pose_mode`、`should_texture`、`enable_pbr`、`remove_lighting` 等参数。官方文档还说明多图模式支持 `1 到 4 张图`。

这条路线的优点：

- 接入快
- 最适合先做 MVP
- 有现成任务制接口
- 直接有 GLB 下载结果

缺点：

- 有按次成本
- 受第三方稳定性影响
- 风格可控性有限

来源：

- [Meshy Image to 3D API](https://docs.meshy.ai/api/image-to-3d)

### 路线 B：自部署开源模型

代表：

- Hunyuan3D 2.0 / 2.1 / 2.5
- Stable Fast 3D
- SPAR3D
- InstantMesh

这条路线的优点：

- 控制权更高
- 可以接到你自己的资产标准化流水线
- 后面适合继续做拼装和品牌风格统一

缺点：

- 需要 GPU
- 部署和维护成本高
- Windows 支持普遍不如 Linux 稳

官方资料里值得注意的点：

- Hunyuan3D 官方明确提供本地 `API Server`
- Hunyuan3D 官方明确采用 `shape -> texture` 的两阶段生成管线
- Stable Fast 3D 官方说明单图默认约需 `6GB VRAM`
- Stable Fast 3D 官方说明 Windows 支持是 `experimental`
- SPAR3D 官方明确强调它是为改善单图生成时 `背面/backside` 质量而设计的
- InstantMesh 官方说明它是“单图生成 3D 网格”，并配套白底图生成链路

来源：

- [Tencent Hunyuan3D-2 GitHub](https://github.com/Tencent-Hunyuan/Hunyuan3D-2)
- [Stable Fast 3D GitHub](https://github.com/Stability-AI/stable-fast-3d)
- [SPAR3D GitHub](https://github.com/Stability-AI/stable-point-aware-3d)
- [InstantMesh GitHub](https://github.com/TencentARC/InstantMesh)
- [TripoSR GitHub](https://github.com/VAST-AI-Research/TripoSR)

### 路线 C：混合路线

第一版先接第三方 API，第二版再逐步切到自部署。

这条路线最适合当前项目。

因为你这个仓库现在本质上还是前端展示工程，不是完整的 AI 资产生产平台。先用 API 做通功能，再把资产规范、模型归一化、收藏品接入打通，后面再考虑切换底层模型，会更稳。

## 7. 推荐方案

### 推荐：先走混合路线

#### 第一阶段

用第三方 API 做功能闭环。

推荐原因：

- 接入速度最快
- 可以先验证用户是否真的会频繁使用图片导入
- 先把前端交互、任务状态、资产入库和舞台展示打通

#### 第二阶段

如果后面使用量高，再切到自部署开源模型。

推荐路线：

- 速度优先：Stable Fast 3D
- 质量和完整度优先：Hunyuan3D
- 背面问题进一步优化：SPAR3D

### 我的最终建议

#### V1

- 前端上传
- 后端任务队列
- 第三方 API 生成
- GLB 结果统一入库
- 自动进入舞台

#### V2

- 增加多图输入
- 增加风格化处理
- 增加资产标准化
- 增加后端缓存

#### V3

- 改自部署模型
- 做结构化拆件
- 接入换装/拼装系统

## 8. 当前项目的系统设计

### 8.1 前端层

当前这个项目适合新增以下前端模块：

- `src/features/import-3d/`
- `src/features/import-3d/components/import-image-dialog.tsx`
- `src/features/import-3d/components/import-job-card.tsx`
- `src/features/import-3d/components/import-preview-card.tsx`
- `src/features/import-3d/import.machine.ts`
- `src/features/import-3d/import.schema.ts`

### 8.2 后端层

当前项目还没有正式后端。

这个功能要稳定落地，必须加一个服务层，哪怕是最薄的 Node 服务也要有。

建议后端职责：

- 接收上传
- 做图片预处理
- 调第三方 API 或本地模型
- 存储任务状态
- 下载并整理生成结果
- 输出标准化 `GLB`
- 回写前端

推荐接口：

- `POST /api/imports/image`
- `POST /api/imports/jobs`
- `GET /api/imports/jobs/:id`
- `POST /api/imports/jobs/:id/commit`
- `GET /api/assets/:id`

### 8.3 存储层

至少需要三类存储：

- 原始图片
- 生成任务记录
- 生成后的 GLB / 缩略图 / 贴图

### 8.4 数据结构

建议保存：

- `id`
- `sourceImageUrl`
- `thumbnailUrl`
- `generator`
- `generatorVersion`
- `status`
- `inputType`
- `assetUrl`
- `previewImageUrl`
- `modelFormat`
- `polycount`
- `textureResolution`
- `createdAt`

## 9. 预处理要求

图片导入前必须先做预处理。

建议最少做：

- 主体检测
- 背景移除
- 居中裁切
- 尺寸统一
- 白底化或浅底化
- 质量校验

原因：

- InstantMesh 官方链路里明确提到了白底图生成能力
- Meshy 官方帮助文档也强调清晰图和简洁背景更好

这里我做一个工程判断：

如果你不做预处理，生成结果波动会非常大。

这是基于这些官方资料的推断，不是官方逐字要求：

- [InstantMesh GitHub](https://github.com/TencentARC/InstantMesh)
- [Meshy Help Center](https://help.meshy.ai/en/articles/9996860-how-to-use-the-image-to-3d-feature)

## 10. 模型标准化要求

生成后的结果不能直接丢进现有舞台，必须标准化。

建议加一个统一流水线：

1. 下载生成结果
2. 转成统一 `GLB`
3. 统一朝向
4. 统一缩放
5. 计算包围盒
6. 自动加默认底座锚点
7. 生成缩略图
8. 注册到当前收藏品系统

否则会出现：

- 模型太大
- 模型太小
- 镜头看不到
- 底座穿模
- 进入舞台后偏移

## 11. 任务状态机

这个功能不能只靠 `loading` 布尔值。

建议用状态机：

- `idle`
- `image-selected`
- `validating`
- `preprocessing`
- `creating-job`
- `generating-shape`
- `generating-texture`
- `normalizing-asset`
- `preview-ready`
- `committed`
- `failed`

## 12. 成本和性能注意点

### 第三方 API 路线

优点是快，但要提前注意：

- 单次计费
- 失败重试成本
- 结果缓存
- 原图和生成结果存储费用

### 自部署路线

要注意：

- GPU 占用
- 推理时长
- 显存要求
- 并发任务数
- 模型下载和更新

例如：

- Stable Fast 3D 官方 README 提到默认单图约需 `6GB VRAM`
- Hunyuan3D 官方虽然支持 Windows / Mac / Linux，但部署链更重

## 13. 法务与安全

必须明确：

- 用户是否有权上传该图片
- 是否允许上传真人照片
- 是否保存原图
- 是否做敏感内容审核

Meshy 官方 API 文档中就有 `moderation` 字段。

这说明即使走第三方，也必须把输入审核当成正式需求来设计，而不是可选项。

来源：

- [Meshy Image to 3D API](https://docs.meshy.ai/api/image-to-3d)

## 14. 第一版验收标准

满足以下条件才算第一版完成：

1. 用户上传单张清晰图后，系统能创建生成任务
2. 任务状态能实时反馈
3. 成功后能得到标准化 `GLB`
4. 结果能进入当前 3D 舞台
5. 用户能旋转和缩放查看
6. 结果能保存到收藏品列表
7. 失败时有明确错误提示

## 15. 我建议你现在这样排期

### Phase 1

- 做前端导入面板
- 做图片校验
- 做任务状态 UI

### Phase 2

- 接后端任务服务
- 接第三方图片转 3D API
- 跑通结果导入舞台

### Phase 3

- 做资产标准化
- 做收藏品保存
- 做失败重试和缓存

### Phase 4

- 再考虑多图输入
- 再考虑风格统一
- 再考虑自部署模型

## 16. 最终建议

如果你的目标是：

- 快速上线
- 先验证功能
- 少走弯路

那就先做：

- `单图上传`
- `第三方 API 生成`
- `GLB 标准化`
- `进入当前舞台`

如果你的目标是：

- 长期可控
- 后面做拼装
- 做自己的网站特色

那后续一定要补：

- 资产标准化
- 多图输入
- 自部署模型
- 结构化拆件

这份方案里，关于“单图背面不足”“两阶段生成”“API Server”“GLB 输出”“多图支持”等判断，都基于上述官方资料；而“第一版先做单主体 + 单图 + 收藏品接入”这部分是我基于你当前项目结构做出的工程建议。
