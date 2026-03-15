import type { FigureOption, FigureSlotId } from "./catalog-v2";

type CharacterDisplay = {
  name: string;
  badge: string;
  family: string;
  intro: string;
};

type ThemeDisplay = {
  title: string;
  atmosphere: string;
  effectLabel: string;
  keywords: [string, string, string];
};

type FinishDisplay = {
  label: string;
  blurb: string;
};

export const SLOT_DISPLAY: Record<FigureSlotId, { label: string; hint: string }> = {
  variant: { label: "形体", hint: "切换角色主轮廓和比例" },
  face: { label: "表情", hint: "调整眼睛和嘴部情绪" },
  head: { label: "头部", hint: "切换头饰、耳型、角型" },
  body: { label: "服装", hint: "切换身体外观和衣装" },
  arms: { label: "姿态", hint: "切换手臂动作和姿势" },
  back: { label: "背饰", hint: "切换背部装饰和尾部" },
  prop: { label: "道具", hint: "切换手持物和配件" },
  finish: { label: "材质", hint: "切换表面质感与涂装" },
};

const CHARACTER_DISPLAY: Record<string, CharacterDisplay> = {
  "veil-nun": {
    name: "面纱修女",
    badge: "哥特人形",
    family: "长比例角色",
    intro: "冷静、克制、雕塑感强，偏高端展陈人形。",
  },
  "bubble-diver": {
    name: "泡泡潜航员",
    badge: "海洋主题",
    family: "软萌生物",
    intro: "透明感和气泡元素为主，整体圆润轻盈。",
  },
  "post-dog": {
    name: "邮差布偶犬",
    badge: "缝线玩偶",
    family: "布艺宠物",
    intro: "布偶缝线和邮差配件结合，陪伴感强。",
  },
  "tin-wolf": {
    name: "巡逻铁狼",
    badge: "机械守卫",
    family: "机甲异兽",
    intro: "硬边金属结构，偏未来巡逻风格。",
  },
  "dune-tortle": {
    name: "沙丘龟甲兽",
    badge: "荒漠遗物",
    family: "异兽收藏",
    intro: "低重心、厚壳比例，强调砂砾与风化感。",
  },
  "mirror-snake": {
    name: "镜池灵蛇",
    badge: "灵体饰品",
    family: "幻想异兽",
    intro: "环绕曲线与镜面反光结合，精致神秘。",
  },
  "frost-penguin": {
    name: "霜糖企鹅",
    badge: "甜点玩偶",
    family: "萌系动物",
    intro: "糖霜色块和圆润体量，偏甜品橱窗风。",
  },
  "cloud-jelly": {
    name: "云海水母",
    badge: "漂浮系",
    family: "空灵生物",
    intro: "半透明漂浮体，强调轻雾和发光边缘。",
  },
  "spore-bear": {
    name: "孢子熊",
    badge: "森林采集",
    family: "毛绒系",
    intro: "蘑菇与孢子细节丰富，暖色系耐看。",
  },
  "scrap-crow": {
    name: "废土鸦",
    badge: "拼装机械",
    family: "废土主题",
    intro: "碎片拼装感强，金属部件层次明显。",
  },
  "sugar-lamb": {
    name: "铃铛绵羊",
    badge: "节日款",
    family: "软萌动物",
    intro: "毛绒和铃饰结合，节日氛围突出。",
  },
  "porcelain-deer": {
    name: "瓷庭鹿灵",
    badge: "高定雕塑",
    family: "长比例角色",
    intro: "修长体态和雕塑站姿，偏艺术收藏线。",
  },
};

const THEME_DISPLAY: Record<string, ThemeDisplay> = {
  "veil-nun": {
    title: "静廊圣堂",
    atmosphere: "高定雕塑氛围，线条细长、情绪克制。",
    effectLabel: "碎光环 + 柔雾体积光",
    keywords: ["雕塑感", "静谧", "哥特"],
  },
  "bubble-diver": {
    title: "海底玩具舱",
    atmosphere: "通透、圆润、带微微梦幻海洋感。",
    effectLabel: "气泡群 + 体积雾",
    keywords: ["海洋", "透明", "软萌"],
  },
  "post-dog": {
    title: "邮路玩偶店",
    atmosphere: "布艺质感突出，偏治愈收藏氛围。",
    effectLabel: "票签拖尾 + 缝线粒子",
    keywords: ["布艺", "治愈", "收藏"],
  },
  "tin-wolf": {
    title: "巡逻机库",
    atmosphere: "机械硬朗，偏未来巡检感。",
    effectLabel: "扫描线 + 环形雷达",
    keywords: ["机甲", "冷光", "硬核"],
  },
  "dune-tortle": {
    title: "沙海遗址",
    atmosphere: "低饱和沙色，强调厚重与时间感。",
    effectLabel: "砂粒环 + 风痕雾",
    keywords: ["荒漠", "遗物", "厚重"],
  },
  "mirror-snake": {
    title: "镜池回廊",
    atmosphere: "反光与流线并存，神秘感强。",
    effectLabel: "镜轨环 + 悬浮珠",
    keywords: ["镜面", "流线", "神秘"],
  },
  "frost-penguin": {
    title: "甜点陈列台",
    atmosphere: "糖霜与奶油色阶，明快可爱。",
    effectLabel: "糖粒闪点 + 柔光片",
    keywords: ["甜点", "可爱", "明亮"],
  },
  "cloud-jelly": {
    title: "云幕漂浮台",
    atmosphere: "轻雾包裹，透明体量更空灵。",
    effectLabel: "雾团 + 漂浮星点",
    keywords: ["空灵", "漂浮", "半透明"],
  },
  "spore-bear": {
    title: "菌林采集站",
    atmosphere: "暖调毛绒，森林盲盒质感。",
    effectLabel: "孢子漂点 + 叶影",
    keywords: ["森林", "毛绒", "细节"],
  },
  "scrap-crow": {
    title: "废土码头",
    atmosphere: "碎片拼装，偏工业收藏感。",
    effectLabel: "金属碎片 + 钥环拖影",
    keywords: ["废土", "拼装", "工业"],
  },
  "sugar-lamb": {
    title: "冬日礼盒台",
    atmosphere: "温暖柔和，节日陈列感明显。",
    effectLabel: "铃光粒子 + 绒圈",
    keywords: ["节日", "温暖", "萌系"],
  },
  "porcelain-deer": {
    title: "瓷庭长廊",
    atmosphere: "高定展陈气质，造型修长优雅。",
    effectLabel: "瓷光环 + 轮廓背光",
    keywords: ["高定", "优雅", "展陈"],
  },
};

const FINISH_DISPLAY: Record<string, FinishDisplay> = {
  "porcelain-bloom": { label: "瓷白花奶", blurb: "柔和奶油质感" },
  "glass-mint": { label: "玻璃薄荷", blurb: "通透清爽质感" },
  "nocturne-plum": { label: "夜雾梅紫", blurb: "低光暗夜质感" },
  "moss-felt": { label: "苔绿绒感", blurb: "毛绒磨砂质感" },
  "candy-icing": { label: "糖霜珊瑚", blurb: "高彩甜品质感" },
  "brass-core": { label: "黄铜机芯", blurb: "金属机甲质感" },
};

const TOKEN_DISPLAY: Record<string, string> = {
  alert: "警觉",
  antler: "鹿角",
  arch: "拱背",
  armor: "铠甲",
  array: "阵列",
  bag: "邮包",
  basket: "竹篮",
  basketprop: "篮包",
  bead: "珠饰",
  bell: "铃铛",
  bellback: "铃饰",
  bend: "弯身",
  blade: "刃角",
  bloom: "花冠",
  bounce: "弹跳",
  bow: "蝴蝶结",
  brace: "护臂",
  bubble: "气泡",
  canopy: "蘑伞",
  cap: "帽饰",
  capeback: "披肩",
  carry: "抱持",
  cage: "笼架",
  cherry: "樱桃",
  chip: "芯片",
  cloak: "斗篷",
  coil: "盘绕",
  cone: "甜筒",
  core: "核心",
  coral: "珊瑚",
  crack: "裂纹",
  crest: "冠羽",
  cross: "十字",
  crown: "王冠",
  curl: "卷毛",
  curve: "弧摆",
  dagger: "短匕",
  dig: "刨沙",
  dozy: "困倦",
  dome: "穹顶",
  dream: "梦游",
  dual: "双目",
  ears: "竖耳",
  fan: "扇尾",
  feather: "羽片",
  fin: "鳍片",
  flip: "摆鳍",
  float: "浮圈",
  fleece: "绒毛",
  flop: "垂耳",
  fog: "雾尾",
  fold: "抱臂",
  frame: "外框",
  frost: "霜壳",
  fur: "毛绒",
  glaze: "糖釉",
  grin: "咧笑",
  halo: "光环",
  hat: "帽檐",
  hold: "持握",
  hood: "兜帽",
  hook: "挂钩",
  horns: "羊角",
  hover: "悬浮",
  icing: "糖霜",
  key: "钥匙",
  lamp: "提灯",
  lantern: "灯笼",
  layer: "层裙",
  lean: "前倾",
  letter: "信件",
  lift: "托举",
  loaf: "团身",
  long: "长型",
  low: "低伏",
  mask: "面罩",
  mirror: "镜壳",
  moss: "苔饰",
  none: "留白",
  open: "展开",
  orb: "灵珠",
  orbit: "轨环",
  pack: "背包",
  patch: "补丁",
  pearl: "珍珠",
  periscope: "潜望镜",
  plate: "金属片",
  plateprop: "铁片",
  point: "指向",
  pounce: "扑击",
  prick: "竖耳",
  prance: "跃步",
  propeller: "螺旋桨",
  pulse: "脉冲",
  radar: "雷达",
  rattle: "响尾",
  rest: "静置",
  rib: "肋板",
  ribbon: "丝带",
  ridge: "背脊",
  rings: "环饰",
  rise: "上扬",
  ribbed: "筋纹",
  robe: "长袍",
  round: "圆润",
  run: "奔跑",
  scan: "扫描",
  scanner: "探测器",
  shell: "外壳",
  shellrim: "壳沿",
  shield: "护盾",
  short: "短型",
  sleep: "闭眼",
  slim: "修长",
  slit: "竖瞳",
  smile: "微笑",
  soft: "柔和",
  spoon: "甜勺",
  spores: "孢子囊",
  sprint: "冲刺",
  staff: "法杖",
  stand: "站姿",
  star: "星纹",
  stalk: "潜行",
  step: "迈步",
  stick: "糖杖",
  stump: "树桩",
  suit: "潜航服",
  sway: "摇摆",
  syrup: "糖浆",
  tailblade: "尾刃",
  tailcloth: "尾披",
  tailpearl: "尾珠",
  tablet: "石板",
  tanks: "背罐",
  ticket: "票签",
  tilt: "歪头",
  torpedo: "流线",
  tower: "高盘",
  trail: "拖尾",
  tray: "托盘",
  tread: "履带",
  valve: "阀门",
  vest: "马甲",
  visor: "目镜",
  wafer: "薄脆",
  watch: "凝视",
  wave: "挥手",
  weep: "垂泪",
  wide: "宽体",
  wobble: "摇摆",
};

const SLOT_BADGE: Record<FigureSlotId, string> = {
  variant: "形体",
  face: "表情",
  head: "头部",
  body: "服装",
  arms: "姿态",
  back: "背饰",
  prop: "道具",
  finish: "材质",
};

const SLOT_SUFFIX: Record<FigureSlotId, string> = {
  variant: "形体",
  face: "表情",
  head: "头饰",
  body: "装束",
  arms: "动作",
  back: "背饰",
  prop: "道具",
  finish: "材质",
};

function titleCase(value: string): string {
  return value
    .split("-")
    .filter(Boolean)
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(" ");
}

export function getCharacterDisplay(id: string, fallbackEnglish: string): CharacterDisplay {
  return (
    CHARACTER_DISPLAY[id] ?? {
      name: fallbackEnglish || "未知角色",
      badge: "收藏款",
      family: "角色工坊",
      intro: "该角色文案未配置，使用默认展示。",
    }
  );
}

export function getThemeDisplay(id: string): ThemeDisplay {
  return (
    THEME_DISPLAY[id] ?? {
      title: "主题舞台",
      atmosphere: "当前为默认舞台氛围。",
      effectLabel: "默认效果",
      keywords: ["主题", "收藏", "展示"],
    }
  );
}

export function getFinishDisplay(id: string): FinishDisplay {
  return FINISH_DISPLAY[id] ?? { label: titleCase(id), blurb: "默认材质" };
}

export function getOptionDisplay(slot: FigureSlotId, option: FigureOption, index: number) {
  const token = option.id.slice(option.id.lastIndexOf("-") + 1);
  const tokenLabel = TOKEN_DISPLAY[token] ?? titleCase(token);
  const fallbackLabel = `${SLOT_DISPLAY[slot].label} ${index + 1}`;
  const semanticLabel = slot === "finish" ? tokenLabel : `${tokenLabel}${SLOT_SUFFIX[slot]}`;

  return {
    label: semanticLabel || fallbackLabel,
    badge: SLOT_BADGE[slot],
    blurb: SLOT_DISPLAY[slot].hint,
    rawId: option.id,
  };
}
