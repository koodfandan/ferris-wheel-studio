import { type StudioSlotId } from "./studio-data";

type CharacterCopy = {
  name: string;
  english: string;
  badge: string;
  family: string;
  intro: string;
};

type SlotCopy = {
  label: string;
  hint: string;
};

const CHARACTER_PREFIXES = [
  "maskling",
  "bloom-witch",
  "candle-kid",
  "tri-eye-rabbit",
  "mushroom-bear",
  "doubletail-hound",
  "long-ear-fish",
  "ragbug",
  "shell-dragon",
  "owl-deer",
  "night-fox",
  "cloud-hedgehog",
] as const;

const CHARACTER_COPY: Record<(typeof CHARACTER_PREFIXES)[number], CharacterCopy> = {
  maskling: {
    name: "面罩童",
    english: "Maskling",
    badge: "裂面系",
    family: "怪奇人形",
    intro: "旧布料、瓷面具和提灯做成的静默角色。",
  },
  "bloom-witch": {
    name: "花帽巫",
    english: "Bloom Witch",
    badge: "花冠系",
    family: "森林人形",
    intro: "像从花盆里长出来的小巫师，轮廓轻软，帽型夸张。",
  },
  "candle-kid": {
    name: "烛芯孩",
    english: "Candle Kid",
    badge: "烛焰系",
    family: "怪奇人形",
    intro: "躯体像蜡烛一样往下垂，头顶有稳定的发光芯。",
  },
  "tri-eye-rabbit": {
    name: "三眼兔",
    english: "Tri-Eye Rabbit",
    badge: "洞穴系",
    family: "怪奇萌宠",
    intro: "三只眼睛和超长耳朵让它看起来又乖又古怪。",
  },
  "mushroom-bear": {
    name: "蘑菇熊",
    english: "Mushroom Bear",
    badge: "菌菇系",
    family: "森林萌宠",
    intro: "毛茸茸的熊体叠着蘑菇伞，像会发孢子的玩偶。",
  },
  "doubletail-hound": {
    name: "双尾犬",
    english: "Doubletail Hound",
    badge: "巡游系",
    family: "怪奇萌宠",
    intro: "躯体低矮，尾巴像会分叉发光的玩具构件。",
  },
  "long-ear-fish": {
    name: "长耳鱼",
    english: "Long-Ear Fish",
    badge: "水母系",
    family: "漂浮萌宠",
    intro: "把鱼鳍、耳朵和软胶脸融合在一起的漂浮角色。",
  },
  ragbug: {
    name: "布偶虫",
    english: "Ragbug",
    badge: "缝补系",
    family: "手作萌宠",
    intro: "像针线盒里跑出来的布偶虫，身上带针脚和布片。",
  },
  "shell-dragon": {
    name: "贝壳龙",
    english: "Shell Dragon",
    badge: "海壳系",
    family: "异兽收藏",
    intro: "龙的轮廓里塞进贝壳、珍珠和珊瑚语言。",
  },
  "owl-deer": {
    name: "鸮鹿机",
    english: "Owl Deer",
    badge: "守望系",
    family: "机械异兽",
    intro: "把夜枭和鹿角拼成一只守望型机体角色。",
  },
  "night-fox": {
    name: "夜巡狐",
    english: "Night Fox",
    badge: "潜行系",
    family: "机械异兽",
    intro: "低趴的潜行机狐，五官像冷光面罩一样利落。",
  },
  "cloud-hedgehog": {
    name: "云刺猬",
    english: "Cloud Hedgehog",
    badge: "浮核系",
    family: "机械异兽",
    intro: "一团会漂浮的刺球核心，背刺能做成光环或阵列。",
  },
};

export const SLOT_COPY: Record<StudioSlotId, SlotCopy> = {
  variant: { label: "形态", hint: "先切主轮廓" },
  face: { label: "脸部", hint: "调整神情和眼型" },
  head: { label: "头部", hint: "帽子、耳朵、头冠" },
  body: { label: "身体", hint: "主体外壳和服装" },
  arms: { label: "姿态", hint: "前肢和动作方向" },
  back: { label: "背饰", hint: "尾巴、翅片、背包" },
  prop: { label: "手持", hint: "道具和配件" },
  finish: { label: "材质", hint: "表面颜色和光感" },
};

const FINISH_LABELS: Record<string, { label: string; blurb: string }> = {
  "porcelain-cream": { label: "骨瓷奶油", blurb: "偏软胶收藏感" },
  "ink-plum": { label: "墨梅夜雾", blurb: "深夜感更强" },
  "sea-glass": { label: "海盐玻璃", blurb: "更通透更轻" },
  "moss-dust": { label: "苔雾尘土", blurb: "像森林旧玩具" },
  "candy-coral": { label: "糖焰珊瑚", blurb: "甜感高、颜色更亮" },
  "oxide-core": { label: "铜绿机核", blurb: "机械角色更合适" },
};

const TOKEN_LABELS: Record<string, string> = {
  alert: "警觉",
  apron: "围裙版",
  armor: "轻甲体",
  array: "阵列",
  ash: "灰痕脸",
  badge: "徽章",
  banner: "旗帘",
  bark: "树皮体",
  basket: "小篮",
  bell: "铃帽",
  bloom: "绽放顶",
  bone: "骨棒",
  bow: "蝴蝶结",
  bowl: "小碗",
  branch: "枝角",
  bubble: "泡泡版",
  bubbles: "泡泡背",
  burrow: "洞穴版",
  button: "纽扣脸",
  buttonprop: "纽扣件",
  calm: "安静脸",
  cap: "帽顶",
  cape: "披风体",
  caphead: "伞帽头",
  carrot: "玩具萝卜",
  carry: "抱持",
  cast: "施法手",
  chip: "芯片牌",
  clasp: "合爪",
  cloak: "斗篷体",
  cloth: "破布背",
  coat: "长外套",
  coral: "珊瑚背",
  core: "核心件",
  corebody: "核心体",
  coreprop: "微型核心",
  crack: "裂纹脸",
  crown: "花冠",
  dagger: "短匕",
  dangle: "垂挂",
  dim: "低亮脸",
  doubletail: "双尾",
  drape: "垂落体",
  dream: "梦游脸",
  drip: "滴蜡版",
  drop: "垂手",
  drowse: "困倦脸",
  ears: "立耳",
  fan: "风扇顶",
  fin: "鱼鳍件",
  float: "漂浮版",
  floatarms: "漂浮手",
  flop: "垂耳",
  fold: "抱臂",
  fur: "毛绒体",
  gather: "收手",
  grin: "咧嘴脸",
  guard: "守卫版",
  halo: "光环",
  heavy: "厚壳版",
  hook: "钩爪",
  hop: "抬爪",
  hover: "悬浮版",
  hoverarms: "悬浮手",
  hull: "机身壳",
  hunched: "蜷身版",
  hunt: "猎行版",
  jar: "玻璃罐",
  key: "钥匙",
  lamp: "提灯",
  lantern: "灯笼",
  leaf: "叶片背",
  loaf: "团趴版",
  log: "木桩版",
  low: "低伏版",
  mantle: "菌伞披肩",
  match: "火柴",
  moss: "苔藓顶",
  narrow: "细腰版",
  needle: "针刺版",
  none: "留白",
  open: "张开",
  pack: "背包",
  panel: "护板",
  patch: "补丁版",
  paw: "垂爪",
  pearl: "珍珠脸",
  pearlprop: "珍珠件",
  pelt: "毛皮体",
  petal: "花瓣裙",
  petalback: "花瓣背",
  pin: "别针",
  plush: "绒感体",
  pocket: "口袋版",
  pocketback: "口袋背",
  pod: "舱体",
  pounce: "扑跃",
  prick: "竖耳",
  proud: "昂首版",
  puff: "绒球顶",
  pulse: "脉冲脸",
  quill: "云刺",
  rag: "布袍体",
  reach: "伸手",
  rest: "静置",
  ribbon: "丝带",
  ridge: "背脊体",
  ring: "环冠",
  robe: "长袍体",
  root: "根须版",
  rootdress: "根须裙",
  round: "圆团版",
  runner: "疾行版",
  scale: "鳞片体",
  scan: "扫描脸",
  scissor: "小剪",
  scout: "侦查版",
  seed: "种子瓶",
  shadow: "潜影版",
  shadowbody: "潜行体",
  sharp: "锋亮脸",
  shell: "外壳体",
  shellprop: "贝壳件",
  short: "短耳版",
  shovel: "小铲",
  sleep: "睡意脸",
  slim: "纤长版",
  smile: "微笑脸",
  smoke: "烟尾",
  soft: "柔和脸",
  spine: "脊刺",
  split: "裂面版",
  spoon: "搅拌勺",
  spore: "孢子脸",
  sporeback: "孢囊背",
  spores: "孢子背",
  spread: "展刺版",
  sprint: "冲刺版",
  stare: "凝视脸",
  step: "迈步",
  stitch: "缝线脸",
  stream: "流线版",
  tag: "编号牌",
  tail: "尾饰",
  tall: "高挑版",
  thread: "线环背",
  tunic: "短衣体",
  vest: "背心体",
  wave: "挥手",
  wick: "烛芯",
  wink: "眨眼脸",
};

function fallbackLabel(token: string) {
  return token
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getToken(optionId: string) {
  const prefix = [...CHARACTER_PREFIXES].find((item) => optionId.startsWith(`${item}-`));
  if (!prefix) return optionId;
  return optionId.slice(prefix.length + 1);
}

export function getCharacterCopy(id: string) {
  return CHARACTER_COPY[id as keyof typeof CHARACTER_COPY] ?? {
    name: "未知角色",
    english: "Unknown",
    badge: "实验体",
    family: "角色工坊",
    intro: "这个角色还没有接入展示文案。",
  };
}

export function getOptionLabel(optionId: string) {
  const token = getToken(optionId);
  return TOKEN_LABELS[token] ?? fallbackLabel(token);
}

export function getOptionMeta(optionId: string, slot: StudioSlotId) {
  return {
    label: getOptionLabel(optionId),
    badge: SLOT_COPY[slot].label,
    blurb: `${SLOT_COPY[slot].label}切换项`,
  };
}

export function getFinishCopy(id: string) {
  return (
    FINISH_LABELS[id] ?? {
      label: "默认材质",
      blurb: "通用收藏质感",
    }
  );
}
