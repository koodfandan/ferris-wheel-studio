export type StudioSlotId = "variant" | "face" | "head" | "body" | "arms" | "back" | "prop" | "finish";

export type StudioOption = {
  id: string;
  label: string;
  badge: string;
  blurb: string;
};

export type FinishPreset = {
  id: string;
  label: string;
  badge: string;
  swatch: string;
  pageTop: string;
  pageBottom: string;
  panel: string;
  line: string;
  ink: string;
  muted: string;
  stageTop: string;
  stageBottom: string;
  skin: string;
  shell: string;
  body: string;
  accent: string;
  accentSoft: string;
  prop: string;
  metal: string;
  glow: string;
  glowSoft: string;
};

export type CharacterRecipe = Record<StudioSlotId, string>;

export type CharacterDefinition = {
  id: string;
  name: string;
  english: string;
  badge: string;
  family: string;
  intro: string;
  stageScale: number;
  stageY: number;
  slots: Record<Exclude<StudioSlotId, "finish">, StudioOption[]>;
  defaultRecipe: CharacterRecipe;
};

function option(id: string, label: string, badge: string, blurb: string): StudioOption {
  return { id, label, badge, blurb };
}

export const SLOT_META: Array<{ id: StudioSlotId; label: string; hint: string }> = [
  { id: "variant", label: "形态", hint: "先切主轮廓" },
  { id: "face", label: "脸部", hint: "决定神情和眼型" },
  { id: "head", label: "头部", hint: "帽子、耳朵、冠饰" },
  { id: "body", label: "身体", hint: "主服装或主壳体" },
  { id: "arms", label: "手臂", hint: "动作和前肢造型" },
  { id: "back", label: "背饰", hint: "尾巴、翅膀、背包" },
  { id: "prop", label: "手持", hint: "配件和道具" },
  { id: "finish", label: "材质", hint: "颜色和表面气质" },
];

export const FINISH_PRESETS: FinishPreset[] = [
  {
    id: "porcelain-cream",
    label: "骨瓷奶油",
    badge: "Matte",
    swatch: "#f7dec9",
    pageTop: "#fff7ef",
    pageBottom: "#f6dfd0",
    panel: "rgba(255, 249, 243, 0.78)",
    line: "rgba(120, 88, 69, 0.14)",
    ink: "#372922",
    muted: "#756154",
    stageTop: "#fff5eb",
    stageBottom: "#ead2bf",
    skin: "#fff0e6",
    shell: "#fff7f1",
    body: "#f2d8c6",
    accent: "#d97b5c",
    accentSoft: "#ffd2be",
    prop: "#e2a35b",
    metal: "#ccae86",
    glow: "#ffd484",
    glowSoft: "#fff0c7",
  },
  {
    id: "ink-plum",
    label: "墨梅夜雾",
    badge: "Night",
    swatch: "#6d5f86",
    pageTop: "#f5f1fb",
    pageBottom: "#d8d1ea",
    panel: "rgba(248, 244, 253, 0.8)",
    line: "rgba(87, 73, 121, 0.16)",
    ink: "#2f2844",
    muted: "#67607c",
    stageTop: "#f1ecfb",
    stageBottom: "#cbc2df",
    skin: "#fff0ea",
    shell: "#f5f0ff",
    body: "#ddd6f1",
    accent: "#8d6ad7",
    accentSoft: "#ddd2ff",
    prop: "#7fa1ff",
    metal: "#b9afd6",
    glow: "#c4bbff",
    glowSoft: "#efecff",
  },
  {
    id: "sea-glass",
    label: "海盐玻璃",
    badge: "Clear",
    swatch: "#97d7ce",
    pageTop: "#f5fdfb",
    pageBottom: "#d8efea",
    panel: "rgba(246, 255, 252, 0.8)",
    line: "rgba(79, 116, 111, 0.14)",
    ink: "#23413d",
    muted: "#57746f",
    stageTop: "#effdfa",
    stageBottom: "#d0ece6",
    skin: "#fff4ed",
    shell: "#effaf7",
    body: "#cfe7e2",
    accent: "#5cbfaf",
    accentSoft: "#c8f3ea",
    prop: "#89cfff",
    metal: "#9bc3c7",
    glow: "#9deff2",
    glowSoft: "#defdff",
  },
  {
    id: "moss-dust",
    label: "苔雾尘土",
    badge: "Forest",
    swatch: "#a7b28f",
    pageTop: "#faf9f1",
    pageBottom: "#e6dfca",
    panel: "rgba(252, 250, 243, 0.8)",
    line: "rgba(111, 104, 79, 0.16)",
    ink: "#343026",
    muted: "#6f6751",
    stageTop: "#f7f4e8",
    stageBottom: "#ddd4b8",
    skin: "#fff1e8",
    shell: "#f7f2e5",
    body: "#d9d1b7",
    accent: "#94a06b",
    accentSoft: "#dfe6c0",
    prop: "#c49d62",
    metal: "#b9ad8d",
    glow: "#efe29a",
    glowSoft: "#fff6cb",
  },
  {
    id: "candy-coral",
    label: "糖焰珊瑚",
    badge: "Candy",
    swatch: "#ff9b89",
    pageTop: "#fff5f1",
    pageBottom: "#ffd9cd",
    panel: "rgba(255, 247, 243, 0.8)",
    line: "rgba(145, 89, 73, 0.14)",
    ink: "#4b2927",
    muted: "#8a6157",
    stageTop: "#fff2eb",
    stageBottom: "#ffd3c3",
    skin: "#fff1ea",
    shell: "#fff6f1",
    body: "#ffd1c6",
    accent: "#f06f5f",
    accentSoft: "#ffc8be",
    prop: "#ffba6e",
    metal: "#d9b27d",
    glow: "#ffc98a",
    glowSoft: "#ffe7c9",
  },
  {
    id: "oxide-core",
    label: "铜绿机核",
    badge: "Tech",
    swatch: "#6ab4a8",
    pageTop: "#f2faf9",
    pageBottom: "#d3e8e5",
    panel: "rgba(245, 253, 251, 0.8)",
    line: "rgba(67, 95, 100, 0.16)",
    ink: "#20353a",
    muted: "#587076",
    stageTop: "#edf8f7",
    stageBottom: "#c8dbda",
    skin: "#eaf2f4",
    shell: "#e7f1f0",
    body: "#c2d8d7",
    accent: "#4ea0a3",
    accentSoft: "#bee9e4",
    prop: "#8fb9ff",
    metal: "#8ca9ad",
    glow: "#84d9d7",
    glowSoft: "#d5ffff",
  },
];

export const CHARACTER_DEFINITIONS: CharacterDefinition[] = [
  {
    id: "maskling",
    name: "面罩童",
    english: "Maskling",
    badge: "裂面系",
    family: "人形异想",
    intro: "补丁、铃铛、裂面瓷感，像从旧玩具箱里醒来的孩子。",
    stageScale: 0.98,
    stageY: -0.9,
    slots: {
      variant: [
        option("maskling-hunched", "蜷身版", "Default", "肩膀内扣，整个人更像抱着秘密。"),
        option("maskling-tall", "长袍版", "Tall", "下摆拉长，人物更竖更静。"),
        option("maskling-split", "裂面版", "Sharp", "面具裂缝更明显，轮廓更锋利。"),
      ],
      face: [
        option("maskling-calm", "安静脸", "Soft", "双眼平静，像没睡醒。"),
        option("maskling-drowse", "困倦脸", "Dream", "眼皮更低，嘴更小。"),
        option("maskling-crack", "裂纹脸", "Odd", "脸部中央有更明显的裂痕。"),
      ],
      head: [
        option("maskling-bell", "铃帽", "Bell", "头顶有布缝帽和小铃铛。"),
        option("maskling-halo", "裂环", "Halo", "头后悬一圈断裂光环。"),
        option("maskling-pin", "缝针冠", "Pin", "头顶多了几枚斜插针。"),
      ],
      body: [
        option("maskling-coat", "补丁长衣", "Core", "宽身补丁长衣。"),
        option("maskling-tunic", "瓷面短衣", "Light", "上身更短更利落。"),
        option("maskling-cape", "罩袍", "Drape", "肩背像披了层旧布。"),
      ],
      arms: [
        option("maskling-rest", "垂手", "Still", "手臂自然下落。"),
        option("maskling-fold", "抱臂", "Closed", "前臂向内，情绪更收。"),
        option("maskling-open", "张手", "Open", "双手略向外张。"),
      ],
      back: [
        option("maskling-ribbon", "布带背饰", "Ribbon", "背后垂两条旧布带。"),
        option("maskling-banner", "裂布旗", "Flag", "后背挂裂开的旗布。"),
        option("maskling-none", "空背", "Clean", "不加背饰。"),
      ],
      prop: [
        option("maskling-lamp", "小夜灯", "Glow", "一盏提着的小灯。"),
        option("maskling-tag", "纸签", "Tag", "像旧手办附带的纸签。"),
        option("maskling-key", "发条钥匙", "Key", "旧机械钥匙。"),
      ],
    },
    defaultRecipe: {
      variant: "maskling-hunched",
      face: "maskling-calm",
      head: "maskling-bell",
      body: "maskling-coat",
      arms: "maskling-rest",
      back: "maskling-ribbon",
      prop: "maskling-lamp",
      finish: "porcelain-cream",
    },
  },
  {
    id: "bloom-witch",
    name: "花帽巫",
    english: "Bloom Witch",
    badge: "菌花系",
    family: "人形异想",
    intro: "像从花盆里长出来的小巫师，带卷发、花帽和弯弯裙壳。",
    stageScale: 1,
    stageY: -0.92,
    slots: {
      variant: [
        option("bloom-witch-round", "圆裙版", "Round", "下摆更鼓，更像菌盖。"),
        option("bloom-witch-narrow", "细腰版", "Slim", "腰更细，整体更高。"),
        option("bloom-witch-root", "根须版", "Root", "裙摆边缘带根须。"),
      ],
      face: [
        option("bloom-witch-smile", "甜笑脸", "Sweet", "亲近、柔和。"),
        option("bloom-witch-wink", "眨眼脸", "Play", "更像捣蛋角色。"),
        option("bloom-witch-spore", "孢子脸", "Odd", "眼下带小斑点。"),
      ],
      head: [
        option("bloom-witch-cap", "花菌帽", "Cap", "顶帽最大。"),
        option("bloom-witch-bow", "垂花结", "Bow", "帽下多一圈软带。"),
        option("bloom-witch-crown", "花冠", "Crown", "更像花冠而不是帽。"),
      ],
      body: [
        option("bloom-witch-petal", "花瓣裙", "Petal", "裙摆像叠花瓣。"),
        option("bloom-witch-rootdress", "根须裙", "Root", "裙边拉出根须。"),
        option("bloom-witch-cloak", "花斗篷", "Cloak", "外层像一件披斗篷。"),
      ],
      arms: [
        option("bloom-witch-gather", "收手", "Quiet", "手臂更贴身。"),
        option("bloom-witch-cast", "施法手", "Cast", "一只手抬起。"),
        option("bloom-witch-wave", "招手", "Wave", "手势更轻快。"),
      ],
      back: [
        option("bloom-witch-petalback", "花片背", "Petal", "背后加两片大花片。"),
        option("bloom-witch-sporeback", "孢囊背", "Spore", "背后鼓两个小囊包。"),
        option("bloom-witch-none", "空背", "Clean", "不加背饰。"),
      ],
      prop: [
        option("bloom-witch-spoon", "搅拌勺", "Mix", "像魔药勺。"),
        option("bloom-witch-seed", "种子瓶", "Seed", "透明种子瓶。"),
        option("bloom-witch-lantern", "花灯", "Glow", "柔和小灯。"),
      ],
    },
    defaultRecipe: {
      variant: "bloom-witch-round",
      face: "bloom-witch-wink",
      head: "bloom-witch-cap",
      body: "bloom-witch-petal",
      arms: "bloom-witch-cast",
      back: "bloom-witch-petalback",
      prop: "bloom-witch-seed",
      finish: "candy-coral",
    },
  },
  {
    id: "candle-kid",
    name: "烛芯孩",
    english: "Candle Kid",
    badge: "烛蜡系",
    family: "人形异想",
    intro: "身体像一根快融化的蜡烛，小孩站在冷焰里。",
    stageScale: 0.96,
    stageY: -0.9,
    slots: {
      variant: [
        option("candle-kid-slim", "细蜡版", "Slim", "整体更瘦更高。"),
        option("candle-kid-drip", "滴蜡版", "Drip", "衣摆像蜡滴。"),
        option("candle-kid-apron", "围裙版", "Apron", "胸前更像小围裙。"),
      ],
      face: [
        option("candle-kid-soft", "柔和脸", "Soft", "弱光下的微笑。"),
        option("candle-kid-sleep", "困倦脸", "Dream", "更像快睡着。"),
        option("candle-kid-ash", "灰痕脸", "Ash", "鼻梁和眼下更重。"),
      ],
      head: [
        option("candle-kid-wick", "烛芯冠", "Wick", "头顶一根高烛芯。"),
        option("candle-kid-halo", "火环", "Halo", "头后带一圈火环。"),
        option("candle-kid-ribbon", "灰带", "Ribbon", "烛芯边绑灰带。"),
      ],
      body: [
        option("candle-kid-robe", "长蜡袍", "Robe", "身形更像长袍。"),
        option("candle-kid-shell", "蜡衣壳", "Shell", "上半身更方整。"),
        option("candle-kid-drape", "垂蜡披", "Drape", "蜡液感更重。"),
      ],
      arms: [
        option("candle-kid-drop", "垂手", "Still", "安静站立。"),
        option("candle-kid-carry", "捧火", "Carry", "双手像捧着小火。"),
        option("candle-kid-reach", "伸手", "Reach", "一只手前探。"),
      ],
      back: [
        option("candle-kid-smoke", "烟尾", "Smoke", "背后有烟雾状拖尾。"),
        option("candle-kid-panel", "护背", "Panel", "背后是硬质护板。"),
        option("candle-kid-none", "空背", "Clean", "不加背饰。"),
      ],
      prop: [
        option("candle-kid-match", "火柴", "Match", "像点火前的火柴。"),
        option("candle-kid-bowl", "蜡碗", "Wax", "手里一只小碗。"),
        option("candle-kid-lamp", "灰灯", "Glow", "冷灰小灯。"),
      ],
    },
    defaultRecipe: {
      variant: "candle-kid-drip",
      face: "candle-kid-sleep",
      head: "candle-kid-wick",
      body: "candle-kid-robe",
      arms: "candle-kid-carry",
      back: "candle-kid-smoke",
      prop: "candle-kid-lamp",
      finish: "ink-plum",
    },
  },
  {
    id: "tri-eye-rabbit",
    name: "三眼兔",
    english: "Tri-Eye Rabbit",
    badge: "怪宠系",
    family: "怪奇萌宠",
    intro: "三只眼睛，长耳朵，洞穴里最胆小的一只。",
    stageScale: 1,
    stageY: -0.92,
    slots: {
      variant: [
        option("tri-eye-rabbit-short", "短耳版", "Short", "耳朵短一点，脸更圆。"),
        option("tri-eye-rabbit-tall", "高耳版", "Tall", "耳朵又高又细。"),
        option("tri-eye-rabbit-burrow", "洞穴版", "Burrow", "脚更短，身体更厚。"),
      ],
      face: [
        option("tri-eye-rabbit-smile", "温顺脸", "Soft", "三眼都柔和。"),
        option("tri-eye-rabbit-wink", "偏眼脸", "Odd", "上眼盯人，侧眼眨一下。"),
        option("tri-eye-rabbit-stare", "注视脸", "Stare", "中间那只眼更突出。"),
      ],
      head: [
        option("tri-eye-rabbit-puff", "尘团", "Puff", "耳间夹一团软绒。"),
        option("tri-eye-rabbit-bow", "小结", "Bow", "耳间一只小蝴蝶结。"),
        option("tri-eye-rabbit-halo", "耳环", "Halo", "耳后有圆环。"),
      ],
      body: [
        option("tri-eye-rabbit-plush", "毛绒体", "Plush", "圆嘟嘟的毛绒体。"),
        option("tri-eye-rabbit-pelt", "皮套体", "Pelt", "像穿了层毛皮。"),
        option("tri-eye-rabbit-shell", "洞穴壳", "Shell", "身体更像壳。"),
      ],
      arms: [
        option("tri-eye-rabbit-paw", "垂爪", "Still", "前爪安静垂着。"),
        option("tri-eye-rabbit-hop", "抬爪", "Hop", "一只爪抬起。"),
        option("tri-eye-rabbit-clasp", "抱爪", "Clasp", "前爪靠在一起。"),
      ],
      back: [
        option("tri-eye-rabbit-tail", "短尾", "Tail", "小球尾巴。"),
        option("tri-eye-rabbit-cloth", "洞布", "Cloth", "背后一块洞穴破布。"),
        option("tri-eye-rabbit-none", "空背", "Clean", "不加背饰。"),
      ],
      prop: [
        option("tri-eye-rabbit-carrot", "假胡萝卜", "Fake", "像玩具道具一样的胡萝卜。"),
        option("tri-eye-rabbit-lamp", "洞灯", "Glow", "小灯笼。"),
        option("tri-eye-rabbit-tag", "编号牌", "Tag", "挂了个小号牌。"),
      ],
    },
    defaultRecipe: {
      variant: "tri-eye-rabbit-tall",
      face: "tri-eye-rabbit-smile",
      head: "tri-eye-rabbit-puff",
      body: "tri-eye-rabbit-plush",
      arms: "tri-eye-rabbit-paw",
      back: "tri-eye-rabbit-tail",
      prop: "tri-eye-rabbit-lamp",
      finish: "porcelain-cream",
    },
  },
  {
    id: "mushroom-bear",
    name: "蘑菇熊",
    english: "Mushroom Bear",
    badge: "林野系",
    family: "怪奇萌宠",
    intro: "胖乎乎的熊背着大菌盖，像森林里最慢的搬运工。",
    stageScale: 1.04,
    stageY: -0.95,
    slots: {
      variant: [
        option("mushroom-bear-round", "团身版", "Round", "身体最圆。"),
        option("mushroom-bear-log", "木墩版", "Log", "更厚更重。"),
        option("mushroom-bear-cap", "大盖版", "Cap", "头顶菌盖更夸张。"),
      ],
      face: [
        option("mushroom-bear-sleep", "打盹脸", "Dream", "最慵懒。"),
        option("mushroom-bear-smile", "点头脸", "Soft", "嘴角更弯。"),
        option("mushroom-bear-button", "纽扣脸", "Odd", "眼更像纽扣。"),
      ],
      head: [
        option("mushroom-bear-moss", "苔帽", "Moss", "顶上有苔藓。"),
        option("mushroom-bear-caphead", "菌盖", "Cap", "单个大菌盖。"),
        option("mushroom-bear-bloom", "双盖", "Twin", "左右两个小菌盖。"),
      ],
      body: [
        option("mushroom-bear-vest", "菌背心", "Vest", "胸口有菌褶层次。"),
        option("mushroom-bear-bark", "树皮壳", "Bark", "像树皮装。"),
        option("mushroom-bear-mantle", "蘑披", "Mantle", "肩上有一层披壳。"),
      ],
      arms: [
        option("mushroom-bear-rest", "垂臂", "Still", "圆手安静垂着。"),
        option("mushroom-bear-carry", "抱物", "Carry", "双臂朝前。"),
        option("mushroom-bear-wave", "摆爪", "Wave", "一只手抬起。"),
      ],
      back: [
        option("mushroom-bear-spores", "孢囊", "Spore", "背后两个小孢囊。"),
        option("mushroom-bear-leaf", "叶背", "Leaf", "背后加叶片。"),
        option("mushroom-bear-none", "空背", "Clean", "不加背饰。"),
      ],
      prop: [
        option("mushroom-bear-basket", "提篮", "Carry", "装孢子的篮子。"),
        option("mushroom-bear-lantern", "林灯", "Glow", "森林小灯。"),
        option("mushroom-bear-shovel", "小铲", "Tool", "短柄小铲子。"),
      ],
    },
    defaultRecipe: {
      variant: "mushroom-bear-cap",
      face: "mushroom-bear-sleep",
      head: "mushroom-bear-caphead",
      body: "mushroom-bear-bark",
      arms: "mushroom-bear-rest",
      back: "mushroom-bear-spores",
      prop: "mushroom-bear-basket",
      finish: "moss-dust",
    },
  },
  {
    id: "doubletail-hound",
    name: "双尾犬",
    english: "Doubletail Hound",
    badge: "巡游系",
    family: "怪奇萌宠",
    intro: "像总在街角乱跑的小狗，但尾巴比它自己还热闹。",
    stageScale: 1,
    stageY: -0.94,
    slots: {
      variant: [
        option("doubletail-hound-sprint", "冲刺版", "Sprint", "前倾更明显。"),
        option("doubletail-hound-loaf", "趴团版", "Loaf", "整体更贴地。"),
        option("doubletail-hound-tall", "长身版", "Tall", "身形更长。"),
      ],
      face: [
        option("doubletail-hound-wink", "顽皮脸", "Play", "眨眼吐舌。"),
        option("doubletail-hound-soft", "乖巧脸", "Soft", "圆眼更讨喜。"),
        option("doubletail-hound-sleep", "打哈欠脸", "Dream", "眼半闭。"),
      ],
      head: [
        option("doubletail-hound-flop", "垂耳", "Ear", "两边垂耳。"),
        option("doubletail-hound-prick", "立耳", "Sharp", "立耳更精神。"),
        option("doubletail-hound-bow", "项圈结", "Bow", "脖间结上移。"),
      ],
      body: [
        option("doubletail-hound-fur", "长毛体", "Fur", "毛量更多。"),
        option("doubletail-hound-coat", "巡游衣", "Coat", "背上像穿了件衣服。"),
        option("doubletail-hound-shell", "硬壳体", "Shell", "腹部更像壳。"),
      ],
      arms: [
        option("doubletail-hound-step", "迈步", "Step", "前爪错步。"),
        option("doubletail-hound-wave", "招爪", "Wave", "一只爪抬起。"),
        option("doubletail-hound-rest", "并爪", "Rest", "四肢更整齐。"),
      ],
      back: [
        option("doubletail-hound-doubletail", "双尾", "Tail", "两条长尾巴。"),
        option("doubletail-hound-banner", "背旗", "Flag", "小背旗。"),
        option("doubletail-hound-none", "空背", "Clean", "不加背饰。"),
      ],
      prop: [
        option("doubletail-hound-bone", "玩具骨", "Toy", "假骨头。"),
        option("doubletail-hound-lamp", "路牌灯", "Glow", "街角小灯。"),
        option("doubletail-hound-badge", "巡游章", "Badge", "胸牌章。"),
      ],
    },
    defaultRecipe: {
      variant: "doubletail-hound-sprint",
      face: "doubletail-hound-wink",
      head: "doubletail-hound-flop",
      body: "doubletail-hound-fur",
      arms: "doubletail-hound-step",
      back: "doubletail-hound-doubletail",
      prop: "doubletail-hound-bone",
      finish: "candy-coral",
    },
  },
  {
    id: "long-ear-fish",
    name: "长耳鱼",
    english: "Long-Ear Fish",
    badge: "水灵系",
    family: "水域精怪",
    intro: "像会漂在空中的小鱼，耳朵却长得像两片半透明鳍。",
    stageScale: 1,
    stageY: -0.93,
    slots: {
      variant: [
        option("long-ear-fish-bubble", "泡泡版", "Bubble", "身体更圆。"),
        option("long-ear-fish-stream", "流线版", "Stream", "身体更细。"),
        option("long-ear-fish-float", "浮游版", "Float", "更轻更飘。"),
      ],
      face: [
        option("long-ear-fish-soft", "吞泡脸", "Soft", "嘴更圆。"),
        option("long-ear-fish-drowse", "发呆脸", "Dream", "眼更低。"),
        option("long-ear-fish-pearl", "珠点脸", "Pearl", "脸部多小珠点。"),
      ],
      head: [
        option("long-ear-fish-fin", "长鳍耳", "Fin", "两侧长鳍。"),
        option("long-ear-fish-halo", "水环", "Halo", "后方一圈水环。"),
        option("long-ear-fish-coral", "珊瑚冠", "Coral", "头顶像小珊瑚。"),
      ],
      body: [
        option("long-ear-fish-scale", "鳞衣", "Scale", "身体表面更有鳞片感。"),
        option("long-ear-fish-cape", "水披", "Cape", "下摆像披一圈水。"),
        option("long-ear-fish-shell", "泡壳", "Shell", "腹部有壳感。"),
      ],
      arms: [
        option("long-ear-fish-floatarms", "漂爪", "Float", "手臂像在水里。"),
        option("long-ear-fish-open", "开鳍", "Open", "手臂张开。"),
        option("long-ear-fish-fold", "收鳍", "Fold", "手臂收起。"),
      ],
      back: [
        option("long-ear-fish-tail", "鱼尾", "Tail", "后背连鱼尾。"),
        option("long-ear-fish-bubbles", "泡泡背", "Bubble", "背后漂泡泡。"),
        option("long-ear-fish-none", "空背", "Clean", "不加背饰。"),
      ],
      prop: [
        option("long-ear-fish-jar", "小水罐", "Jar", "透明水罐。"),
        option("long-ear-fish-lamp", "水母灯", "Glow", "像小水母。"),
        option("long-ear-fish-pearlprop", "单珠", "Pearl", "一颗珍珠。"),
      ],
    },
    defaultRecipe: {
      variant: "long-ear-fish-bubble",
      face: "long-ear-fish-drowse",
      head: "long-ear-fish-fin",
      body: "long-ear-fish-scale",
      arms: "long-ear-fish-floatarms",
      back: "long-ear-fish-bubbles",
      prop: "long-ear-fish-lamp",
      finish: "sea-glass",
    },
  },
  {
    id: "ragbug",
    name: "布偶虫",
    english: "Ragbug",
    badge: "缝补系",
    family: "布偶精怪",
    intro: "像用旧布、纽扣和别针缝出来的一只小虫玩偶。",
    stageScale: 1.02,
    stageY: -0.95,
    slots: {
      variant: [
        option("ragbug-pocket", "口袋版", "Pocket", "肚子更像小口袋。"),
        option("ragbug-patch", "补丁版", "Patch", "身体有更大补丁。"),
        option("ragbug-needle", "针脚版", "Needle", "线头和针感更重。"),
      ],
      face: [
        option("ragbug-stitch", "缝线脸", "Stitch", "嘴像一道缝线。"),
        option("ragbug-sleep", "打盹脸", "Dream", "线眼更低。"),
        option("ragbug-button", "纽扣脸", "Button", "眼像纽扣。"),
      ],
      head: [
        option("ragbug-pin", "针帽", "Pin", "头上几枚别针。"),
        option("ragbug-halo", "线环", "Loop", "后方线圈环。"),
        option("ragbug-puff", "棉球", "Puff", "顶上棉球。"),
      ],
      body: [
        option("ragbug-rag", "碎布衣", "Rag", "下摆像破布。"),
        option("ragbug-round", "鼓肚衣", "Round", "肚子更圆。"),
        option("ragbug-cloak", "披布衣", "Cloak", "上身更像披布。"),
      ],
      arms: [
        option("ragbug-dangle", "垂线手", "Loose", "手臂像线一样。"),
        option("ragbug-hook", "钩手", "Hook", "手臂末端勾起。"),
        option("ragbug-wave", "摆线手", "Wave", "更像摇摆。"),
      ],
      back: [
        option("ragbug-thread", "线团背", "Thread", "背后线团。"),
        option("ragbug-pocketback", "口袋背", "Pocket", "背后一个小兜。"),
        option("ragbug-none", "空背", "Clean", "不加背饰。"),
      ],
      prop: [
        option("ragbug-buttonprop", "纽扣串", "Button", "串着几颗纽扣。"),
        option("ragbug-scissor", "小剪", "Tool", "短柄小剪刀。"),
        option("ragbug-lamp", "针灯", "Glow", "像针线台灯。"),
      ],
    },
    defaultRecipe: {
      variant: "ragbug-pocket",
      face: "ragbug-stitch",
      head: "ragbug-pin",
      body: "ragbug-rag",
      arms: "ragbug-dangle",
      back: "ragbug-thread",
      prop: "ragbug-buttonprop",
      finish: "moss-dust",
    },
  },
  {
    id: "shell-dragon",
    name: "贝壳龙",
    english: "Shell Dragon",
    badge: "潮壳系",
    family: "海域幼龙",
    intro: "一只重心很低的小龙，背上背着壳，走路慢吞吞。",
    stageScale: 1,
    stageY: -0.94,
    slots: {
      variant: [
        option("shell-dragon-low", "低伏版", "Low", "身体更贴地。"),
        option("shell-dragon-proud", "昂首版", "Proud", "头更抬。"),
        option("shell-dragon-heavy", "厚壳版", "Heavy", "壳更大更重。"),
      ],
      face: [
        option("shell-dragon-soft", "柔和脸", "Soft", "更幼态。"),
        option("shell-dragon-sleep", "半睡脸", "Dream", "更慢。"),
        option("shell-dragon-grin", "露齿脸", "Grin", "带一点小凶。"),
      ],
      head: [
        option("shell-dragon-pearl", "珠冠", "Pearl", "额头一颗珠。"),
        option("shell-dragon-spine", "壳刺冠", "Spine", "头上短壳刺。"),
        option("shell-dragon-halo", "潮环", "Halo", "后方一圈潮环。"),
      ],
      body: [
        option("shell-dragon-shell", "主壳体", "Shell", "最像背了个大壳。"),
        option("shell-dragon-cloak", "潮披体", "Cloak", "肩背有披层。"),
        option("shell-dragon-ridge", "脊背体", "Ridge", "背脊更明显。"),
      ],
      arms: [
        option("shell-dragon-step", "踏步爪", "Step", "前爪迈出。"),
        option("shell-dragon-rest", "收爪", "Rest", "姿态更稳。"),
        option("shell-dragon-open", "张爪", "Open", "前爪打开。"),
      ],
      back: [
        option("shell-dragon-tail", "重尾", "Tail", "大尾巴。"),
        option("shell-dragon-coral", "珊瑚背", "Coral", "背上小珊瑚。"),
        option("shell-dragon-none", "空背", "Clean", "不加背饰。"),
      ],
      prop: [
        option("shell-dragon-pearlprop", "贝珠", "Pearl", "一颗大贝珠。"),
        option("shell-dragon-lamp", "潮灯", "Glow", "海蓝小灯。"),
        option("shell-dragon-shellprop", "小壳", "Shell", "手里一只小壳。"),
      ],
    },
    defaultRecipe: {
      variant: "shell-dragon-heavy",
      face: "shell-dragon-sleep",
      head: "shell-dragon-pearl",
      body: "shell-dragon-shell",
      arms: "shell-dragon-rest",
      back: "shell-dragon-tail",
      prop: "shell-dragon-pearlprop",
      finish: "sea-glass",
    },
  },
  {
    id: "owl-deer",
    name: "鸮鹿机",
    english: "Owl Deer",
    badge: "林机系",
    family: "机械异兽",
    intro: "像猫头鹰和小鹿拼在一起的机械守林员。",
    stageScale: 0.98,
    stageY: -0.92,
    slots: {
      variant: [
        option("owl-deer-guard", "守林版", "Guard", "胸口更厚，像护甲。"),
        option("owl-deer-runner", "奔袭版", "Run", "身形更轻。"),
        option("owl-deer-lantern", "灯笼版", "Glow", "眼灯更大。"),
      ],
      face: [
        option("owl-deer-scan", "扫描脸", "Scan", "双眼是宽扫描条。"),
        option("owl-deer-soft", "柔扫脸", "Soft", "眼条更圆。"),
        option("owl-deer-dim", "低电脸", "Dim", "亮度更低。"),
      ],
      head: [
        option("owl-deer-branch", "枝角", "Branch", "像树枝的角。"),
        option("owl-deer-halo", "雷达环", "Halo", "后方一圈雷达。"),
        option("owl-deer-array", "灯阵角", "Array", "角尖发光。"),
      ],
      body: [
        option("owl-deer-hull", "林壳体", "Hull", "圆鼓机壳。"),
        option("owl-deer-panel", "护板体", "Panel", "胸板更硬朗。"),
        option("owl-deer-shell", "流线体", "Flow", "整体更顺。"),
      ],
      arms: [
        option("owl-deer-rest", "收臂", "Rest", "姿态稳定。"),
        option("owl-deer-reach", "探臂", "Reach", "一侧前探。"),
        option("owl-deer-open", "展臂", "Open", "像准备起跳。"),
      ],
      back: [
        option("owl-deer-pack", "守林包", "Pack", "小背包。"),
        option("owl-deer-fin", "尾鳍", "Fin", "背后尾鳍。"),
        option("owl-deer-none", "空背", "Clean", "不加背饰。"),
      ],
      prop: [
        option("owl-deer-core", "能量芯", "Core", "小核心。"),
        option("owl-deer-lamp", "巡林灯", "Glow", "一盏灯。"),
        option("owl-deer-key", "调频匙", "Key", "像调频钥匙。"),
      ],
    },
    defaultRecipe: {
      variant: "owl-deer-lantern",
      face: "owl-deer-scan",
      head: "owl-deer-branch",
      body: "owl-deer-hull",
      arms: "owl-deer-rest",
      back: "owl-deer-pack",
      prop: "owl-deer-lamp",
      finish: "oxide-core",
    },
  },
  {
    id: "night-fox",
    name: "夜巡狐",
    english: "Night Fox",
    badge: "侦巡系",
    family: "机械异兽",
    intro: "轻、窄、快，像夜里只用一条光带看路的小狐机。",
    stageScale: 0.98,
    stageY: -0.94,
    slots: {
      variant: [
        option("night-fox-scout", "侦巡版", "Scout", "最轻的版型。"),
        option("night-fox-shadow", "暗影版", "Shadow", "更细更紧。"),
        option("night-fox-hunt", "追猎版", "Hunt", "前低后高。"),
      ],
      face: [
        option("night-fox-scan", "猎扫脸", "Scan", "细长扫描眼。"),
        option("night-fox-dim", "低亮脸", "Dim", "亮条更弱。"),
        option("night-fox-alert", "警觉脸", "Alert", "中间有强调灯。"),
      ],
      head: [
        option("night-fox-ears", "雷达耳", "Radar", "耳朵就是雷达。"),
        option("night-fox-crown", "针冠", "Pin", "上部短针列。"),
        option("night-fox-ring", "耳环", "Halo", "头后带环。"),
      ],
      body: [
        option("night-fox-pod", "侦巡壳", "Core", "标准机壳。"),
        option("night-fox-shadowbody", "潜行壳", "Stealth", "更收更贴。"),
        option("night-fox-armor", "护甲壳", "Armor", "胸甲更厚。"),
      ],
      arms: [
        option("night-fox-step", "迈步", "Step", "四肢错步。"),
        option("night-fox-rest", "并步", "Rest", "站姿整齐。"),
        option("night-fox-pounce", "扑跃", "Pounce", "前爪更冲。"),
      ],
      back: [
        option("night-fox-tail", "光尾", "Tail", "一条发光尾。"),
        option("night-fox-pack", "细背包", "Pack", "轻量背包。"),
        option("night-fox-none", "空背", "Clean", "不加背饰。"),
      ],
      prop: [
        option("night-fox-core", "电芯", "Core", "小方核心。"),
        option("night-fox-dagger", "短刃", "Blade", "玩具短刃。"),
        option("night-fox-lamp", "侦测灯", "Glow", "细长小灯。"),
      ],
    },
    defaultRecipe: {
      variant: "night-fox-shadow",
      face: "night-fox-scan",
      head: "night-fox-ears",
      body: "night-fox-shadowbody",
      arms: "night-fox-step",
      back: "night-fox-tail",
      prop: "night-fox-core",
      finish: "ink-plum",
    },
  },
  {
    id: "cloud-hedgehog",
    name: "云刺猬",
    english: "Cloud Hedgehog",
    badge: "悬浮系",
    family: "机械异兽",
    intro: "像会悬浮的圆球玩具，背上一圈都是雾状刺。",
    stageScale: 1,
    stageY: -0.96,
    slots: {
      variant: [
        option("cloud-hedgehog-round", "圆球版", "Round", "最接近圆球。"),
        option("cloud-hedgehog-spread", "展刺版", "Spread", "背刺张得更开。"),
        option("cloud-hedgehog-hover", "悬浮版", "Hover", "下部更像悬浮核心。"),
      ],
      face: [
        option("cloud-hedgehog-pulse", "脉冲脸", "Pulse", "双眼像脉冲。"),
        option("cloud-hedgehog-dream", "雾眠脸", "Dream", "眼条更柔。"),
        option("cloud-hedgehog-sharp", "尖亮脸", "Sharp", "中部更亮。"),
      ],
      head: [
        option("cloud-hedgehog-ring", "环刺", "Ring", "头周一圈环刺。"),
        option("cloud-hedgehog-array", "火花阵", "Array", "顶上小阵列。"),
        option("cloud-hedgehog-fan", "小风扇", "Fan", "两侧像风扇。"),
      ],
      body: [
        option("cloud-hedgehog-puff", "雾绒体", "Puff", "身体更软。"),
        option("cloud-hedgehog-corebody", "核心体", "Core", "下腹更机械。"),
        option("cloud-hedgehog-armor", "轻甲体", "Armor", "表面更硬。"),
      ],
      arms: [
        option("cloud-hedgehog-rest", "收手", "Rest", "四肢更短。"),
        option("cloud-hedgehog-open", "张手", "Open", "向外打开。"),
        option("cloud-hedgehog-hoverarms", "悬手", "Hover", "略微悬起。"),
      ],
      back: [
        option("cloud-hedgehog-quill", "云刺", "Quill", "整圈雾刺。"),
        option("cloud-hedgehog-halo", "雾环", "Halo", "一圈光环。"),
        option("cloud-hedgehog-none", "空背", "Clean", "不加背饰。"),
      ],
      prop: [
        option("cloud-hedgehog-coreprop", "微型核心", "Core", "小核心球。"),
        option("cloud-hedgehog-lamp", "漂灯", "Glow", "漂浮小灯。"),
        option("cloud-hedgehog-chip", "芯片牌", "Chip", "一块芯片牌。"),
      ],
    },
    defaultRecipe: {
      variant: "cloud-hedgehog-hover",
      face: "cloud-hedgehog-pulse",
      head: "cloud-hedgehog-ring",
      body: "cloud-hedgehog-corebody",
      arms: "cloud-hedgehog-hoverarms",
      back: "cloud-hedgehog-quill",
      prop: "cloud-hedgehog-coreprop",
      finish: "oxide-core",
    },
  },
];

export function getCharacterDefinition(id: string) {
  return CHARACTER_DEFINITIONS.find((item) => item.id === id) ?? CHARACTER_DEFINITIONS[0];
}

export function buildDefaultRecipe(character: CharacterDefinition): CharacterRecipe {
  return { ...character.defaultRecipe };
}

export function randomizeRecipe(character: CharacterDefinition): CharacterRecipe {
  return {
    variant: pick(character.slots.variant),
    face: pick(character.slots.face),
    head: pick(character.slots.head),
    body: pick(character.slots.body),
    arms: pick(character.slots.arms),
    back: pick(character.slots.back),
    prop: pick(character.slots.prop),
    finish: pick(FINISH_PRESETS),
  };
}

export function getFinishPreset(id: string) {
  return FINISH_PRESETS.find((item) => item.id === id) ?? FINISH_PRESETS[0];
}

function pick<T extends { id: string }>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)]?.id ?? "";
}
