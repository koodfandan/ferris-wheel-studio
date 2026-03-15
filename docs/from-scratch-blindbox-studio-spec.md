# 从零开始的盲盒拼装工作室方案

## 1. 产品重新定义

这个产品不再是“一个手办的展示页”。

它应该被定义为：

**一个可拼装、可换装、可换色、可抽取风格、可 360 检视、可像真实潮玩一样展示的盲盒角色工作室。**

目标不是让用户看一个固定角色，而是让用户：

- 选一个物种基底
- 换脸、换头发、换耳朵、换帽子、换衣服、换道具、换底座、换配色
- 像拼盲盒部件一样拼出“自己想要的角色”
- 拼完之后还能像真实潮玩商品一样被展示出来

这不是电商详情页，也不是游戏捏脸页。
它更接近：

- 盲盒系列世界观入口
- 潮玩角色拼装器
- 商品级展示器

## 2. 核心产品目标

必须同时满足 4 件事：

1. `可玩`
- 用户能自由换部件
- 用户能抽随机组合
- 用户能形成“拼自己喜欢角色”的过程感

2. `可看`
- 完成后的角色能 360 看清楚
- 五官、材质、背面、配件都能检查

3. `好看`
- 成品展示必须接近日常看真实潮玩的质感
- 不能像建模软件
- 不能像游戏角色编辑器

4. `可扩展`
- 未来不仅有“人物”
- 还要支持“动物、怪物、机械宠物、主题系列”

## 3. 目标用户

### 用户 A：盲盒收藏爱好者

需求：
- 喜欢挑风格、角色、表情、配件
- 喜欢“抽到惊喜”的感觉
- 希望有收藏感和系列感

### 用户 B：内容创作者 / 设计爱好者

需求：
- 想组合一个独特角色
- 想保存配置、导出图
- 想拿这个角色做展示或分享

### 用户 C：潮玩品牌或工作室内部

需求：
- 快速验证角色组合是否成立
- 快速做主题系列组合
- 快速看哪些部件兼容、哪些不兼容

## 4. 产品结构

整个网站从零开始，重构为 4 个一级模式：

### 4.1 `Discover`

作用：
- 先让用户进入“盲盒世界”
- 选系列、选物种、选基调

用户在这里做的事：
- 选人物 / 动物 / 精灵 / 机械宠物
- 选主题系列
- 点“随机开盒”

### 4.2 `Assemble`

作用：
- 真正拼装角色

用户在这里做的事：
- 换脸
- 换头发/毛发
- 换头饰
- 换衣服
- 换手持物
- 换底座
- 换外环 / 主题组件
- 换配色

### 4.3 `Inspect`

作用：
- 360 查看成品
- 专门检查五官、材质、轮廓、背面、配件

用户在这里做的事：
- 自由拖拽旋转
- 放大看脸
- 看背面
- 看局部材质

### 4.4 `Shelf`

作用：
- 用真实潮玩商品的方式展示最终角色

用户在这里做的事：
- 看成品转台
- 看特写
- 看规格
- 看包装 / 陈列效果

## 5. 从零设计后的页面信息架构

### 首页

不是直接进 3D viewer。

首页结构：

1. 顶部系列入口
2. 中间主视觉
3. 三个核心入口卡：
- 选基底
- 拼角色
- 看成品
4. 下方展示当前热门组合或随机组合

### Discover 页面

布局：
- 左侧：系列/物种分类
- 中间：系列大图与介绍
- 右侧：快速开始按钮

### Assemble 页面

布局：
- 左栏：槽位导航
- 中栏：主 3D 拼装舞台
- 右栏：零件库 + 配色 + 当前 recipe

### Inspect 页面

布局：
- 顶部：模式切换与视角按钮
- 中间：大面积 3D viewer
- 底部：局部材质信息 / 当前零件摘要

### Shelf 页面

布局：
- 左上：标题与系列说明
- 中间：离线高质量转台图/视频
- 右侧：规格卡、材质卡、包装卡
- 底部：细节特写

## 6. 从零定义后的对象系统

这次不能按“一个成品模型”设计。
必须按“基底 + 槽位 + 零件库”设计。

### 6.1 基底类型

建议第一版只做 4 类：

- `human`
- `animal`
- `creature`
- `robot-pet`

### 6.2 槽位系统

建议固定这些槽位：

- `face`
- `eyes`
- `hair_or_fur`
- `head_accessory`
- `ear_or_horn`
- `body_outfit`
- `left_hand_prop`
- `right_hand_prop`
- `back_accessory`
- `ring_or_theme_frame`
- `cabins_or_side_props`
- `base`
- `palette`

### 6.3 零件规则

必须有兼容规则：

- 某些头发只适用于 `human`
- 某些耳朵只适用于 `animal`
- 某些 halo 只适用于 `creature`
- 某些底座只适用于某一类体型

这意味着产品一定需要一层“规则引擎”，不是只堆控件。

## 7. 智能度设计

你要求“智能度非常高”，那不能只靠用户自己选。
产品要主动帮用户避免丑组合、冲突组合、穿模组合。

### 必须具备的智能逻辑

1. `兼容性判断`
- 选择部件时自动过滤不兼容选项

2. `自动修正`
- 用户选了冲突部件时，自动切换到适配方案

3. `系列风格约束`
- 选“甜梦系列”后，零件库自动切成统一视觉语言

4. `随机开盒生成`
- 不是随机乱抽
- 而是生成“可装配、可展示、风格统一”的 recipe

5. `同系列推荐`
- 换了一个部件后，系统推荐相同风格的其他部件

## 8. UI 设计方向

这次 UI 不走“设计软件控制台”风格，也不走“普通电商”风格。
从头重新定义成：

**高级潮玩陈列盒 + 拼装抽屉 + 盲盒卡册**

### 视觉关键词

- 奶油色硬盒
- 糖果透明件
- 陈列盒灯带
- 卡册式零件托盘
- 像真实潮玩门店陈列

### 页面气质

- 不是未来科技蓝黑风
- 不是传统后台面板
- 是带零售感、收藏感、开盒感的轻梦幻陈列空间

### 设计原则

1. 3D 主体永远是主角
2. 零件选择像抽屉卡片，不像下拉框
3. 每个部件都要有缩略图
4. 每个模式都要有明确语义，不混在一起

## 9. 从零定义的关键交互

### 在 Assemble 中

- 点击槽位
- 右侧只显示该槽位的部件
- hover 部件时主模型预览
- 点击后正式替换
- 有动画过渡，不是瞬间硬切

### 在 Discover 中

- 像开盲盒一样随机生成一个 recipe
- 再进入 Assemble 细调

### 在 Inspect 中

- 默认不加花哨特效
- 重点是能看清五官、材质、边缘

### 在 Shelf 中

- 不用实时 viewer 做首屏主视觉
- 用离线 Beauty 输出做更像真实潮玩的展示

## 10. 3D 资产方案

这是彻底解决质感问题的关键。

### 资产分两条输出

#### 10.1 Beauty Output

用途：
- Shelf 页面
- 高质量展示

方式：
- Blender Cycles 或 Marmoset
- 转台视频 / 图片序列
- 产品棚拍质感

#### 10.2 Interactive Output

用途：
- Assemble 页面
- Inspect 页面

方式：
- `glb`
- 模块化零件
- 可独立替换

### 不能再这样做

- 不能再靠程序 primitives 拼人脸
- 不能再一个模型里混所有零件逻辑
- 不能再指望调灯把 placeholder 变成成品

## 11. 材质规范

为了接近真实潮玩效果，材质必须从一开始分层：

- `MAT_Face`
  - 哑光 PVC
  - 不发光
  - 不高反射

- `MAT_Eyes`
  - 局部亮面印刷

- `MAT_Blush`
  - decal/texture

- `MAT_Body`
  - 半哑光

- `MAT_GlossTrim`
  - 小面积亮边

- `MAT_ClearCandy`
  - 只给透明糖果件

- `MAT_MetalAccent`
  - 只给极少量金属件

- `MAT_EmitBulb`
  - 只给灯泡、环灯、底座灯带

## 12. 前端技术路线

从头开始建议仍然保留这套：

- `React`
- `TypeScript`
- `Vite`
- `R3F`
- `drei`
- `Zustand`

### 状态分 3 层

1. `ui state`
- 当前模式
- 当前槽位
- 面板状态

2. `recipe state`
- 当前角色组合

3. `viewer state`
- 相机
- 灯光
- 是否展示 Beauty 或 Inspect

## 13. 必须新增的数据结构

### Recipe

```ts
type Recipe = {
  species: string;
  face: string;
  eyes: string;
  hairOrFur: string;
  headAccessory: string;
  earOrHorn: string;
  bodyOutfit: string;
  leftHandProp: string;
  rightHandProp: string;
  backAccessory: string;
  ring: string;
  cabins: string;
  base: string;
  palette: string;
};
```

### Part manifest

```ts
type PartManifest = {
  id: string;
  slot: string;
  species: string[];
  label: string;
  glb: string;
  thumbnail: string;
  compatibleWith?: string[];
  incompatibleWith?: string[];
  tags: string[];
};
```

## 14. 从零重做后的需求优先级

### P0

- 多模式产品结构
- 多物种基底
- 槽位系统
- 零件库 UI
- 配方状态
- 360 Inspect
- 本地/正式 GLB 接入

### P1

- 随机开盒
- 同系列推荐
- 配色切换
- recipe 保存
- 分享链接

### P2

- 收藏夹
- 主题系列切换
- 包装盒展示
- 截图导出

## 15. 当前项目需要推倒重来的部分

这些不要再参考旧网页了：

- 单一 viewer 页面结构
- 旧的“Outer Edition Viewer”文案和定位
- 旧的单角色主视觉思路
- 旧的参数滑杆优先交互

这些可以保留作为技术底座：

- React/Vite 工程
- R3F viewer 基础
- GLB-first 资产加载思路

## 16. 推荐实施顺序

### 第一阶段

先完成：

- 新的 IA
- 四模式导航
- Recipe 系统
- Slot 系统
- 零件库 UI

### 第二阶段

完成：

- Assemble 真正替换部件
- Inspect 纯净 360
- 本地 GLB 模块导入

### 第三阶段

完成：

- Shelf Beauty 视图
- 离线渲染导入
- 细节特写区

### 第四阶段

完成：

- 智能推荐
- 随机盲盒生成
- 分享与导出

## 17. 这次的最终产品一句话

**一个像真实潮玩商品一样展示、又能像拼盲盒一样自由组合角色的模块化潮玩工作室。**

## 18. 参考来源

- POP MART 官方商品页关于盲盒形态、材质、尺寸与“随机盒”表达：
  - https://au.popmart.com/products/pop-mart-dimoo-aquarium-series-blind-box-action-figure
  - https://au.popmart.com/products/pop-mart-loong-presents-the-treasure-series-blind-box
  - https://au.popmart.com/products/pop-mart-super-track-pop-car-series-blind-box-molly-dimoo-pucky-labubu-skullpanda
- Sketchfab 官方关于 configurator、viewer、材质/灯光/后处理能力：
  - https://sketchfab.com/3d-configurators
  - https://sketchfab.com/features
- model-viewer 官方关于相机与展示：
  - https://modelviewer.dev/examples/stagingandcameras/
- Three.js / glTF / Blender 官方资料：
  - https://threejs.org/docs/pages/WebGLRenderer.html
  - https://threejs.org/docs/pages/GLTFLoader.html
  - https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html
  - https://docs.blender.org/manual/zh-hans/4.0/addons/import_export/scene_gltf2.html
