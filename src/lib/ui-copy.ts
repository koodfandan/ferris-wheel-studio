import {
  getPaletteOption,
  getPartOption,
  type PaletteId,
  type SpeciesId,
  type StageMode,
  type StudioRecipe,
  type StudioSection,
  type StudioSlot,
} from "./studio-system";

export type Locale = "zh" | "en";

type CopyEntry = {
  zh: string;
};

const SECTION_COPY: Record<StudioSection, { label: CopyEntry; kicker: CopyEntry; blurb: CopyEntry }> = {
  series: {
    label: { zh: "系列" },
    kicker: { zh: "世界货架" },
    blurb: { zh: "先选择玩具宇宙和物种基底，再进入对应的主题氛围包。" },
  },
  build: {
    label: { zh: "拼装" },
    kicker: { zh: "组装工坊" },
    blurb: { zh: "像拼盲盒零件一样替换部件，组出真正像收藏手办的角色。" },
  },
  inspect: {
    label: { zh: "检视" },
    kicker: { zh: "五官检查" },
    blurb: { zh: "专门检查表情、材质、轮廓和背面细节，再决定是否保存。" },
  },
  shelf: {
    label: { zh: "陈列" },
    kicker: { zh: "零售舞台" },
    blurb: { zh: "把成品像正式发售款一样摆上陈列舞台展示。" },
  },
  collection: {
    label: { zh: "收藏" },
    kicker: { zh: "已存配方" },
    blurb: { zh: "把人物、动物、怪物和机器人变体一起收进你的盲盒货架。" },
  },
};

const STAGE_MODE_COPY: Record<StageMode, { label: CopyEntry; blurb: CopyEntry }> = {
  assemble: {
    label: { zh: "拼装" },
    blurb: { zh: "在工作台灯光下拖动查看，并测试不同部件。" },
  },
  inspect: {
    label: { zh: "检视" },
    blurb: { zh: "提升五官和材质辨识度，更适合细看。" },
  },
  shelf: {
    label: { zh: "陈列" },
    blurb: { zh: "转成更像商品页的陈列灯光和转台氛围。" },
  },
};

const SPECIES_COPY: Record<SpeciesId, { label: CopyEntry; badge: CopyEntry; blurb: CopyEntry; middleEn: string }> = {
  human: {
    label: { zh: "人物娃娃" },
    badge: { zh: "核心线" },
    blurb: { zh: "大头娃娃比例，以发型和服装作为主要识别点。" },
    middleEn: "Doll Human",
  },
  animal: {
    label: { zh: "梦境动物" },
    badge: { zh: "宠物盒" },
    blurb: { zh: "更圆润的毛绒轮廓、耳朵语言和软萌陈列感。" },
    middleEn: "Dream Animal",
  },
  creature: {
    label: { zh: "月夜精灵" },
    badge: { zh: "夜游园" },
    blurb: { zh: "带光环、鳍片和披风挂件的奇幻游乐园生物。" },
    middleEn: "Moon Creature",
  },
  robot: {
    label: { zh: "玩具机器人" },
    badge: { zh: "新霓绒线" },
    blurb: { zh: "可爱外壳、面罩表情和发光科技配件。" },
    middleEn: "Toy Robot",
  },
};

const SLOT_COPY: Record<StudioSlot, { label: CopyEntry; blurb: CopyEntry }> = {
  expression: { label: { zh: "表情" }, blurb: { zh: "脸部印刷和情绪" } },
  silhouette: { label: { zh: "轮廓" }, blurb: { zh: "头发、毛发或外壳形状" } },
  headpiece: { label: { zh: "头饰" }, blurb: { zh: "蝴蝶结、光环、皇冠、天线" } },
  outfit: { label: { zh: "服装" }, blurb: { zh: "主体服装外形" } },
  prop: { label: { zh: "道具" }, blurb: { zh: "手持收藏物" } },
  frame: { label: { zh: "外环" }, blurb: { zh: "摩天轮或主题外框" } },
  pods: { label: { zh: "吊舱" }, blurb: { zh: "舱体或侧边胶囊" } },
  base: { label: { zh: "底座槽" }, blurb: { zh: "展示平台配置" } },
  palette: { label: { zh: "配色" }, blurb: { zh: "颜色与表面工艺包" } },
};

const PALETTE_COPY: Record<PaletteId, { label: CopyEntry; blurb: CopyEntry; finish: CopyEntry }> = {
  "vanilla-muse": {
    label: { zh: "香草缪斯" },
    blurb: { zh: "奶油壳色、黄油金边和柔和珊瑚腮红。" },
    finish: { zh: "PVC 哑光 + 缎面描边" },
  },
  "peach-fizz": {
    label: { zh: "蜜桃汽水" },
    blurb: { zh: "糖果蜜桃主体、草莓点缀和暖色展台。" },
    finish: { zh: "PVC 哑光 + 亮面糖果件" },
  },
  "mint-parade": {
    label: { zh: "薄荷巡游" },
    blurb: { zh: "冷薄荷主体、珍珠白外壳和冰感胶囊光。" },
    finish: { zh: "珠光哑面 + 磨砂透明舱" },
  },
  "midnight-jelly": {
    label: { zh: "午夜果冻" },
    blurb: { zh: "夜色蓝紫氛围，奶白角色和发光环件更突出。" },
    finish: { zh: "柔雾面 + 夜间展示发光" },
  },
};

const PART_COPY: Record<string, { label?: string; badge?: string; blurb?: string }> = {
  "expression-smile": { label: "微笑脸", badge: "经典", blurb: "睁眼带腮红的轻松笑脸。" },
  "expression-sleepy": { label: "困困脸", badge: "梦境", blurb: "弯弯闭眼和小嘴，更安静。" },
  "expression-wink": { label: "眨眼脸", badge: "主角", blurb: "单眼眨眼，情绪更活泼。" },
  "expression-led": { label: "LED 面罩", badge: "新霓", blurb: "屏幕式眼部灯条和简洁嘴缝。" },
  "silhouette-bob": { label: "圆波波头", badge: "发型", blurb: "圆润波波头，正面识别很强。" },
  "silhouette-curl": { label: "糖果卷发", badge: "发型", blurb: "块状卷发更像玩具手办。" },
  "silhouette-bunny": { label: "兔兔毛绒", badge: "毛发", blurb: "长耳朵和毛绒感脸框。" },
  "silhouette-bear": { label: "小熊毛绒", badge: "毛发", blurb: "圆耳短毛，更紧凑可爱。" },
  "silhouette-foam": { label: "云泡顶冠", badge: "冠饰", blurb: "像云团一样的奇幻头冠。" },
  "silhouette-shell": { label: "头盔壳体", badge: "外壳", blurb: "更像玩具外壳的圆顶结构。" },
  "headpiece-cloud": { label: "云朵冠", badge: "梦境", blurb: "蓬松云帽叠在头顶上方。" },
  "headpiece-bow": { label: "珊瑚蝴蝶结", badge: "可爱", blurb: "经典盲盒大蝴蝶结。" },
  "headpiece-halo": { label: "月环", badge: "夜色", blurb: "悬浮在头后的月光环。" },
  "headpiece-antenna": { label: "双星天线", badge: "新霓", blurb: "双天线头饰和发光星尖。" },
  "outfit-pajama": { label: "睡衣体", badge: "柔软", blurb: "更居家、更圆润的睡衣造型。" },
  "outfit-fairdress": { label: "游园裙", badge: "舞台", blurb: "更像发售款短裙壳体。" },
  "outfit-plush": { label: "毛绒服", badge: "宠物", blurb: "圆滚滚的绒毛身体。" },
  "outfit-cape": { label: "夜游披风", badge: "夜色", blurb: "更奇幻的披风轮廓。" },
  "outfit-pod": { label: "舱体服", badge: "新霓", blurb: "带接口和舱门感的机器人身体。" },
  "prop-ticket": { label: "票根", badge: "游园", blurb: "游乐园主题的小票道具。" },
  "prop-wand": { label: "星星魔杖", badge: "梦境", blurb: "更适合陈列照的细长手持物。" },
  "prop-lantern": { label: "月灯", badge: "夜色", blurb: "适合深色系主题的悬挂小灯。" },
  "prop-battery": { label: "电池心", badge: "新霓", blurb: "机械宠物专用的小型能源心脏。" },
  "frame-classic": { label: "经典环", badge: "轮环", blurb: "最平衡的摩天轮外环。" },
  "frame-candy": { label: "糖果轮", badge: "甜系", blurb: "更甜、更圆、更像糖果首饰。" },
  "frame-pearl": { label: "珍珠月环", badge: "夜色", blurb: "更开敞的月光珍珠弧环。" },
  "frame-bulb": { label: "灯泡网环", badge: "新霓", blurb: "带灯点和分段的科技环。" },
  "pods-moon": { label: "月亮吊舱", badge: "梦境", blurb: "圆润月亮舱和暖色透明窗。" },
  "pods-candy": { label: "糖果吊舱", badge: "甜系", blurb: "更高饱和的硬糖胶囊舱。" },
  "pods-plush": { label: "毛绒吊舱", badge: "宠物", blurb: "像绒布载具一样的软舱体。" },
  "pods-pixel": { label: "像素吊舱", badge: "新霓", blurb: "更方正的科技透明舱。" },
  "base-cloud": { label: "云朵平台", badge: "梦境", blurb: "更软、更低、更像云团舞台。" },
  "base-ticket": { label: "售票亭台", badge: "游园", blurb: "像小型售票台一样的有趣平台。" },
  "base-dock": { label: "充能平台", badge: "新霓", blurb: "适合机器人线的科技底台。" },
};

const EXACT_TEXT: Record<string, string> = {
  "Spatial guard is active. Invalid stage combinations are disabled or auto-repaired.": "空间守卫已开启。无效组合会被禁用或自动修正。",
  "Species base updated. Spatial guard stayed clear.": "物种基底已切换。空间守卫检查通过。",
  "Spatial-first Blind Mix generated. Spatial guard stayed clear.": "已生成优先通过空间规则的盲盒混搭。空间守卫检查通过。",
  "Smart Match updated the recipe. Spatial guard stayed clear.": "智能匹配已更新当前配方。空间守卫检查通过。",
  "Spatial guard blocked that combination and rolled back to the last collision-free recipe.": "空间守卫拦截了该组合，并已回退到上一套无穿模配方。",
  "Frame sits too low for the current base.": "外环对当前底座来说过低。",
  "Frame depth conflicts with the rear stage layer.": "外环深度与后层舞台发生冲突。",
  "Support geometry is too short for this frame.": "支撑结构对当前外环来说过短。",
  "Character body pushes too close to the frame.": "角色身体与外环距离过近。",
  "Prop extends too far into the frame.": "道具向前伸得太深，挤进了外环范围。",
  "This asset is missing stage anchor data.": "该资产缺少舞台锚点数据。",
  "frame hits base": "外环碰到底层",
  "frame hits backdrop": "外环碰到背层",
  "support too short": "支撑过短",
  "character hits frame": "角色碰到外环",
  "prop hits frame": "道具碰到外环",
  "anchor data missing": "缺少锚点数据",
  "Try a slimmer prop profile to clear the ring face.": "建议换更细的道具轮廓，让它避开外环正面。",
  "Pick a prop with a lighter front reach.": "建议换前伸更短的道具。",
  "Pick a higher-clearance frame profile.": "建议换净空更大的外环。",
  "Use a frame profile that opens more space around the character.": "建议换一个给角色留更多空间的外环。",
  "Use a lower base profile to open the ring gap.": "建议换更低的底座轮廓，腾出外环空间。",
  "Choose a base that leaves more stage clearance for this frame.": "建议换一个给当前外环留出更多空间的底座。",
  "Slim reach": "短前伸",
  "Tall slim": "细长型",
  "Deep lantern": "深灯型",
  "Compact block": "紧凑块体",
  "Balanced clearance": "平衡净空",
  "Deep frame": "深外环",
  "Open clearance": "开放净空",
  "Wide ring": "宽环",
  "Low profile": "低矮轮廓",
  "Mid profile": "中等轮廓",
  "Low dock": "低矮底台",
  "Smile Print": "微笑脸",
  "Sleepy Print": "困困脸",
  "Wink Print": "眨眼脸",
  "LED Visor": "LED 面罩",
  "Bob Cap": "圆波波头",
  "Candy Curl": "糖果卷发",
  "Bunny Fur": "兔兔毛绒",
  "Bear Fur": "小熊毛绒",
  "Foam Crest": "云泡顶冠",
  "Helmet Dome": "头盔壳体",
  "Cloud Crown": "云朵冠",
  "Coral Bow": "珊瑚蝴蝶结",
  "Moon Halo": "月环",
  "Twin Antenna": "双星天线",
  "Pajama Body": "睡衣体",
  "Fair Dress": "游园裙",
  "Plush Suit": "毛绒服",
  "Night Cape": "夜游披风",
  "Pod Suit": "舱体服",
  "Ticket Strip": "票根",
  "Star Wand": "星星魔杖",
  "Moon Lantern": "月灯",
  "Battery Core": "电池心",
  "Classic Ring": "经典环",
  "Candy Wheel": "糖果轮",
  "Pearl Halo Frame": "珍珠月环",
  "Bulb Grid": "灯泡网环",
  "Moon Pods": "月亮吊舱",
  "Candy Pods": "糖果吊舱",
  "Plush Pods": "毛绒吊舱",
  "Pixel Pods": "像素吊舱",
  "Cloud Platform": "云朵平台",
  "Ticket Booth": "售票亭台",
  "Charging Dock": "充能平台",
};

export function getLocalizedSection(section: StudioSection, locale: Locale) {
  if (locale === "en") return null;
  return SECTION_COPY[section];
}

export function getLocalizedStageMode(mode: StageMode, locale: Locale) {
  if (locale === "en") return null;
  return STAGE_MODE_COPY[mode];
}

export function getLocalizedSpecies(species: SpeciesId, locale: Locale) {
  if (locale === "en") return null;
  return SPECIES_COPY[species];
}

export function getLocalizedSpeciesMiddle(species: SpeciesId, locale: Locale, chinese: string) {
  if (locale === "zh") {
    return SPECIES_COPY[species].middleEn;
  }

  return chinese;
}

export function getLocalizedSlot(slot: StudioSlot, locale: Locale) {
  if (locale === "en") return null;
  return SLOT_COPY[slot];
}

export function getLocalizedPaletteMeta(id: PaletteId, locale: Locale) {
  if (locale === "en") return null;
  return PALETTE_COPY[id];
}

export function getLocalizedPartMeta(partId: string, locale: Locale) {
  if (locale === "en") return null;
  return PART_COPY[partId] ?? null;
}

export function getLocalizedRecipeLabel(recipe: StudioRecipe, slot: StudioSlot, locale: Locale) {
  if (locale === "en") {
    if (slot === "palette") return getPaletteOption(recipe.palette).label;
    return getPartOption(recipe[slot])?.label ?? recipe[slot];
  }

  if (slot === "palette") {
    return PALETTE_COPY[recipe.palette]?.label.zh ?? getPaletteOption(recipe.palette).label;
  }

  return PART_COPY[recipe[slot]]?.label ?? getPartOption(recipe[slot])?.label ?? recipe[slot];
}

export function localizeFreeText(text: string, locale: Locale) {
  if (locale === "en") return text;
  return EXACT_TEXT[text] ?? text;
}

export const UI_TEXT = {
  en: {
    brandTitle: "Blindbox Atelier",
    brandSubtitle: "Collectible builder for doll, animal, creature, and robot lines",
    builderBadge: "Blind Box Builder",
    saveRecipe: "Save Recipe",
    zhToggle: "中文",
    enToggle: "EN",
    speciesBase: "Species Base",
    speciesHelp: "Choose a family before swapping parts.",
    slotRail: "Slot Rail",
    slotHelp: "Pick the layer you want to replace.",
    blindMix: "Blind Mix",
    smartMatch: "Smart Match",
    spatialGuard: "Spatial guard",
    noBlocked: "No blocked options in the current slot.",
    autoFixed: "Auto fixed",
    suggestedFix: "Suggested fix",
    paletteLibrary: "Palette Library",
    paletteLibraryBlurb: "Swap the whole finish pack, page tone, figure body tint, and stage light mood.",
    blockedOptions: "blocked options",
    blockedHelp: "Spatial guard disabled combinations that would collide on the stage.",
    blockedByGuard: "Blocked by spatial guard",
    currentSelection: "Current selection",
    partsLibrary: "Parts Library",
    recipeLedger: "Recipe Ledger",
    currentBuild: "Current collectible build",
    ledgerBlurb: "The final shelf look is driven by these modular slots.",
    autoFixHistory: "Auto fixed history",
    autoFixHistoryBlurb: "Recent guard interventions are logged here so the build trail stays visible.",
    stageDrag: "Drag to rotate",
    stageZoom: "Scroll to zoom",
    stageLoading: "3D stage loading",
    stageLoadingBlurb: "The new collector stage is preparing its renderer.",
    workbench: "Workbench",
    previewing: "Previewing",
    currentFinish: "Current finish",
    activeSlot: "Active slot",
    savedBase: "Saved base",
    spatialStatus: "Spatial status",
    clean: "clean",
    warnings: "warnings",
    stageNote: "Stage note",
    stageNoteBlurb: "This renderer is object-centric, so the figure behaves more like a physical collectible on a display stage than a loose scene camera.",
    displayNote: "Display note",
    displayNoteBlurb: "Assemble keeps the parts readable, Inspect sharpens the face, and Shelf shifts into a retail turntable mood.",
    spatialRegistry: "Spatial registry",
    clearanceCheck: "Clearance check",
    clearanceOk: "Base, frame, backdrop, and support clearances are currently within the solver thresholds.",
    activeSlotNotice: "is active. Hover or click parts on the right to preview and commit a new combination.",
    showcaseSuffix: "Showcase",
  },
  zh: {
    brandTitle: "盲盒拼装工坊",
    brandSubtitle: "面向人物、动物、精灵和机器人的收藏手办拼装台",
    builderBadge: "盲盒拼装器",
    saveRecipe: "保存配方",
    zhToggle: "中文",
    enToggle: "EN",
    speciesBase: "物种基底",
    speciesHelp: "先选一个家族，再开始替换部件。",
    slotRail: "槽位轨道",
    slotHelp: "选择你现在要替换的层。",
    blindMix: "盲盒混搭",
    smartMatch: "智能匹配",
    spatialGuard: "空间守卫",
    noBlocked: "当前槽位没有被拦截的选项。",
    autoFixed: "已自动修复",
    suggestedFix: "建议修复",
    paletteLibrary: "配色库",
    paletteLibraryBlurb: "一键替换整套表面工艺、页面色调、角色主色和舞台灯光。",
    blockedOptions: "个选项被拦截",
    blockedHelp: "空间守卫已禁用会在舞台里发生碰撞的组合。",
    blockedByGuard: "已被空间守卫拦截",
    currentSelection: "当前选择",
    partsLibrary: "零件库",
    recipeLedger: "配方账本",
    currentBuild: "当前收藏成品",
    ledgerBlurb: "最终陈列效果由这些模块化槽位共同决定。",
    autoFixHistory: "自动修复记录",
    autoFixHistoryBlurb: "最近一次次空间修正会记录在这里，方便你回看系统改了什么。",
    stageDrag: "拖动旋转",
    stageZoom: "滚轮缩放",
    stageLoading: "3D 舞台加载中",
    stageLoadingBlurb: "新的收藏舞台正在准备渲染器。",
    workbench: "工作台",
    previewing: "当前预览",
    currentFinish: "当前工艺",
    activeSlot: "当前槽位",
    savedBase: "已存底座槽",
    spatialStatus: "空间状态",
    clean: "干净",
    warnings: "条警告",
    stageNote: "舞台说明",
    stageNoteBlurb: "这个渲染器围绕物体本身工作，所以角色更像摆在真实展示台上的收藏手办，而不是松散场景里的相机模型。",
    displayNote: "展示说明",
    displayNoteBlurb: "拼装模式更强调零件辨识，检视模式更适合看脸，陈列模式则更像零售转台。",
    spatialRegistry: "空间注册表",
    clearanceCheck: "净空检查",
    clearanceOk: "当前底层、外环、背层和支撑的净空都在求解器阈值之内。",
    activeSlotNotice: "当前激活。把鼠标移到右侧零件上可以预览，点击后正式替换。",
    showcaseSuffix: "展示台",
  },
} as const;

Object.assign(EXACT_TEXT, {
  "Spatial bundle is invalid, using built-in defaults": "空间清单无效，已改用内置默认配置",
  "Using built-in spatial registry": "正在使用内置空间注册表",
});
