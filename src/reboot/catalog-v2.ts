export type FigureSlotId = "variant" | "face" | "head" | "body" | "arms" | "back" | "prop" | "finish";

export type FigureOption = {
  id: string;
  label: string;
  badge: string;
  blurb: string;
};

export type SlotCopy = {
  label: string;
  hint: string;
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

export type FigureRecipe = Record<FigureSlotId, string>;

export type FigureDefinition = {
  id: string;
  name: string;
  english: string;
  badge: string;
  family: string;
  intro: string;
  stageScale: number;
  stageY: number;
  slotMeta: Record<Exclude<FigureSlotId, "finish">, SlotCopy>;
  slots: Record<Exclude<FigureSlotId, "finish">, FigureOption[]>;
  defaultRecipe: FigureRecipe;
};

const option = (id: string, label: string, badge: string, blurb: string): FigureOption => ({
  id,
  label,
  badge,
  blurb,
});

const slot = (label: string, hint: string): SlotCopy => ({ label, hint });

export const EDITABLE_SLOTS: FigureSlotId[] = ["variant", "face", "head", "body", "arms", "back", "prop", "finish"];

export const FINISH_PRESETS: FinishPreset[] = [
  {
    id: "porcelain-bloom",
    label: "骨瓷花奶",
    badge: "Soft",
    swatch: "#f2d8cb",
    pageTop: "#fff8f4",
    pageBottom: "#f4ddd0",
    panel: "rgba(255, 249, 244, 0.78)",
    line: "rgba(104, 73, 58, 0.12)",
    ink: "#352622",
    muted: "#7a6258",
    stageTop: "#fff6ef",
    stageBottom: "#ead3c8",
    skin: "#fff0e8",
    shell: "#fff8f2",
    body: "#efd3c6",
    accent: "#df7862",
    accentSoft: "#ffd7cb",
    prop: "#e7b06e",
    metal: "#ccb39a",
    glow: "#ffd19a",
    glowSoft: "#fff0d5",
  },
  {
    id: "glass-mint",
    label: "玻璃薄荷",
    badge: "Clear",
    swatch: "#9bd8cf",
    pageTop: "#f4fffd",
    pageBottom: "#d8efea",
    panel: "rgba(245, 255, 252, 0.8)",
    line: "rgba(70, 109, 103, 0.14)",
    ink: "#25413d",
    muted: "#5b7873",
    stageTop: "#eefdfa",
    stageBottom: "#cfeae4",
    skin: "#fff3ec",
    shell: "#f0fbf9",
    body: "#cfe9e3",
    accent: "#58baa8",
    accentSoft: "#cdf6ef",
    prop: "#83d1ff",
    metal: "#99bfc2",
    glow: "#9bf0ec",
    glowSoft: "#ddffff",
  },
  {
    id: "nocturne-plum",
    label: "夜雾墨梅",
    badge: "Night",
    swatch: "#7a6e98",
    pageTop: "#f4f0fb",
    pageBottom: "#d6cee7",
    panel: "rgba(248, 244, 253, 0.78)",
    line: "rgba(82, 70, 118, 0.14)",
    ink: "#2d2641",
    muted: "#6e6781",
    stageTop: "#f0ebfb",
    stageBottom: "#c8bfdc",
    skin: "#fff1eb",
    shell: "#f5f0ff",
    body: "#ddd5f0",
    accent: "#8665d5",
    accentSoft: "#ddd3ff",
    prop: "#8aa4ff",
    metal: "#b6aed0",
    glow: "#c7bbff",
    glowSoft: "#f0edff",
  },
  {
    id: "moss-felt",
    label: "苔雾毡绒",
    badge: "Plush",
    swatch: "#abb693",
    pageTop: "#faf9f2",
    pageBottom: "#e4ddc8",
    panel: "rgba(252, 250, 243, 0.8)",
    line: "rgba(111, 104, 79, 0.15)",
    ink: "#343026",
    muted: "#6f6750",
    stageTop: "#f7f4e8",
    stageBottom: "#dcd3b6",
    skin: "#fff2e9",
    shell: "#f7f3e7",
    body: "#d7cfb6",
    accent: "#95a26c",
    accentSoft: "#e2e8c5",
    prop: "#c59e62",
    metal: "#b8ad8d",
    glow: "#eee4a4",
    glowSoft: "#fff6d0",
  },
  {
    id: "candy-icing",
    label: "糖霜果釉",
    badge: "Candy",
    swatch: "#ffa08f",
    pageTop: "#fff6f1",
    pageBottom: "#ffd6c7",
    panel: "rgba(255, 247, 242, 0.8)",
    line: "rgba(146, 90, 74, 0.14)",
    ink: "#492b28",
    muted: "#8a6259",
    stageTop: "#fff2eb",
    stageBottom: "#ffd0bf",
    skin: "#fff1ea",
    shell: "#fff7f2",
    body: "#ffd0c6",
    accent: "#f36d5e",
    accentSoft: "#ffc9bf",
    prop: "#ffbd73",
    metal: "#d8b17f",
    glow: "#ffc990",
    glowSoft: "#ffe7cb",
  },
  {
    id: "brass-core",
    label: "黄铜机芯",
    badge: "Mech",
    swatch: "#79b4aa",
    pageTop: "#f3faf9",
    pageBottom: "#d5e8e4",
    panel: "rgba(245, 253, 251, 0.8)",
    line: "rgba(70, 96, 101, 0.15)",
    ink: "#21363b",
    muted: "#587177",
    stageTop: "#edf8f7",
    stageBottom: "#cadcda",
    skin: "#eaf1f3",
    shell: "#e8f1f0",
    body: "#c3d8d7",
    accent: "#4ea1a2",
    accentSoft: "#c0ece6",
    prop: "#8fbaff",
    metal: "#8aa8ad",
    glow: "#86ddd9",
    glowSoft: "#d8ffff",
  },
];

export const FIGURE_DEFINITIONS: FigureDefinition[] = [
  {
    id: "veil-nun",
    name: "面具修女",
    english: "Veil Nun",
    badge: "哥特人形",
    family: "高挑人形",
    intro: "细长、克制、像展柜里的一尊瓷雕，不再是圆头玩偶路线。",
    stageScale: 1,
    stageY: -1.02,
    slotMeta: {
      variant: slot("轮廓", "修女的整体姿态"),
      face: slot("面具", "决定五官和裂纹"),
      head: slot("头纱", "头冠、兜帽、纱幕"),
      body: slot("长袍", "主裙体和外披层"),
      arms: slot("袖姿", "袖口的动作方向"),
      back: slot("背幕", "拖纱或背饰"),
      prop: slot("圣物", "提灯、书板、长杖"),
    },
    slots: {
      variant: [
        option("veil-nun-column", "直立柱身", "Tall", "最像一尊细长雕塑。"),
        option("veil-nun-bow", "低头祈祷", "Bow", "上身略微前倾，更安静。"),
        option("veil-nun-split", "双层裙摆", "Split", "裙摆下缘像被切成两层。"),
      ],
      face: [
        option("veil-nun-plain", "白瓷面", "Calm", "只有窄眼和小嘴。"),
        option("veil-nun-crack", "裂痕面", "Crack", "从额头到嘴角有一条裂线。"),
        option("veil-nun-weep", "落泪面", "Tear", "双眼下有垂落泪滴。"),
      ],
      head: [
        option("veil-nun-veil", "垂纱头", "Veil", "两侧垂下长纱。"),
        option("veil-nun-hood", "厚兜帽", "Hood", "头顶更厚更包裹。"),
        option("veil-nun-halo", "断环冠", "Halo", "头后悬一圈断开的环。"),
      ],
      body: [
        option("veil-nun-robe", "修身长袍", "Core", "最干净的修女体。"),
        option("veil-nun-layer", "双层披袍", "Layer", "肩部多一层布披。"),
        option("veil-nun-ribbon", "束带长袍", "Ribbon", "腰部会被一圈丝带收紧。"),
      ],
      arms: [
        option("veil-nun-fold", "抱袖", "Fold", "双手藏在袖内。"),
        option("veil-nun-open", "开袖", "Open", "袖口向两侧打开。"),
        option("veil-nun-lift", "抬袖", "Lift", "右袖向上举。"),
      ],
      back: [
        option("veil-nun-trail", "长纱拖尾", "Trail", "背后有两条垂纱。"),
        option("veil-nun-cross", "十字背片", "Cross", "背后像一块交叉骨片。"),
        option("veil-nun-none", "净背", "Clean", "不加背饰。"),
      ],
      prop: [
        option("veil-nun-lantern", "蜡灯", "Light", "像教堂里的小灯。"),
        option("veil-nun-staff", "细杖", "Staff", "一根竖直长杖。"),
        option("veil-nun-tablet", "祈文板", "Tablet", "一块扁平板片。"),
      ],
    },
    defaultRecipe: {
      variant: "veil-nun-column",
      face: "veil-nun-plain",
      head: "veil-nun-veil",
      body: "veil-nun-robe",
      arms: "veil-nun-fold",
      back: "veil-nun-trail",
      prop: "veil-nun-lantern",
      finish: "porcelain-bloom",
    },
  },
  {
    id: "bubble-diver",
    name: "泡泡潜水员",
    english: "Bubble Diver",
    badge: "潜水玩具",
    family: "圆润短身",
    intro: "大头盔、短手短脚、像老式潜水玩具，和高挑人形完全不是一类。",
    stageScale: 0.98,
    stageY: -0.98,
    slotMeta: {
      variant: slot("舱型", "决定头盔和整体体积"),
      face: slot("观察窗", "面罩里的眼睛状态"),
      head: slot("顶帽", "头顶气阀和小装置"),
      body: slot("潜水服", "身体外壳和前胸结构"),
      arms: slot("动作", "手和脚蹼的姿态"),
      back: slot("背罐", "氧气罐和推进器"),
      prop: slot("海底件", "海螺灯、抓钩、珊瑚仪"),
    },
    slots: {
      variant: [
        option("bubble-diver-round", "圆舱", "Round", "头盔最圆，像玻璃球。"),
        option("bubble-diver-wide", "宽舱", "Wide", "身体更扁更宽。"),
        option("bubble-diver-torpedo", "鱼雷舱", "Torpedo", "整体更长，像一截潜航器。"),
      ],
      face: [
        option("bubble-diver-soft", "温吞眼", "Soft", "两只圆眼贴在面罩里。"),
        option("bubble-diver-scan", "扫描眼", "Scan", "像小仪表盘。"),
        option("bubble-diver-star", "惊喜眼", "Star", "眼睛更亮更夸张。"),
      ],
      head: [
        option("bubble-diver-valve", "气阀帽", "Valve", "头顶一颗小阀门。"),
        option("bubble-diver-periscope", "潜望镜", "Scope", "头顶竖起短镜筒。"),
        option("bubble-diver-coral", "珊瑚帽", "Coral", "长出软珊瑚装饰。"),
      ],
      body: [
        option("bubble-diver-suit", "标准潜水服", "Core", "最经典的短胖体。"),
        option("bubble-diver-ribbed", "分层服", "Rib", "胸腹分成好几层。"),
        option("bubble-diver-shell", "壳式潜具", "Shell", "更像带前甲的潜航舱。"),
      ],
      arms: [
        option("bubble-diver-flip", "外摆脚蹼", "Flip", "脚蹼向外撑开。"),
        option("bubble-diver-tread", "划水式", "Swim", "双手更前伸。"),
        option("bubble-diver-hover", "漂浮式", "Hover", "脚和手都微微离体。"),
      ],
      back: [
        option("bubble-diver-tanks", "双气罐", "Tank", "背后双罐最厚。"),
        option("bubble-diver-propeller", "推进器", "Jet", "背后是小推进器。"),
        option("bubble-diver-float", "浮漂背包", "Float", "更像救生浮漂。"),
      ],
      prop: [
        option("bubble-diver-shell", "海螺灯", "Lamp", "一盏软壳海螺灯。"),
        option("bubble-diver-hook", "抓钩", "Hook", "像玩具抓钩。"),
        option("bubble-diver-scanner", "珊瑚仪", "Scan", "扁平扫描器。"),
      ],
    },
    defaultRecipe: {
      variant: "bubble-diver-round",
      face: "bubble-diver-soft",
      head: "bubble-diver-valve",
      body: "bubble-diver-suit",
      arms: "bubble-diver-flip",
      back: "bubble-diver-tanks",
      prop: "bubble-diver-shell",
      finish: "glass-mint",
    },
  },
  {
    id: "post-dog",
    name: "布偶邮差犬",
    english: "Post Dog",
    badge: "布偶四足",
    family: "四足布偶",
    intro: "横向身体、四条腿、布耳和邮包，是一只完整的四足角色。",
    stageScale: 0.96,
    stageY: -1.02,
    slotMeta: {
      variant: slot("体态", "站、趴、奔跑"),
      face: slot("口鼻", "决定表情和鼻吻"),
      head: slot("耳帽", "耳朵和头顶小帽"),
      body: slot("布壳", "身体的拼布结构"),
      arms: slot("步态", "四肢动作"),
      back: slot("邮包", "背上的袋子和挂件"),
      prop: slot("递送件", "信件、铃铛、票牌"),
    },
    slots: {
      variant: [
        option("post-dog-stand", "站立", "Stand", "四足站定，最稳。"),
        option("post-dog-loaf", "团趴", "Loaf", "像毛绒玩具团起来。"),
        option("post-dog-run", "奔跑", "Run", "身体前倾，像正在送信。"),
      ],
      face: [
        option("post-dog-smile", "笑脸口鼻", "Smile", "嘴角更圆。"),
        option("post-dog-sniff", "闻嗅口鼻", "Sniff", "鼻头更长更前探。"),
        option("post-dog-dozy", "困脸口鼻", "Dozy", "眼皮更垂。"),
      ],
      head: [
        option("post-dog-flop", "垂耳", "Flop", "两侧耳朵垂下。"),
        option("post-dog-prick", "竖耳", "Prick", "耳朵立起更机灵。"),
        option("post-dog-cap", "邮差帽", "Cap", "头顶多一个小帽。"),
      ],
      body: [
        option("post-dog-plush", "棉布体", "Plush", "最软的布偶感。"),
        option("post-dog-patch", "拼布体", "Patch", "身上有几块补丁。"),
        option("post-dog-coat", "外套体", "Coat", "躯干像穿了小外套。"),
      ],
      arms: [
        option("post-dog-step", "迈步", "Step", "前爪一前一后。"),
        option("post-dog-bounce", "小跳", "Bounce", "身体略微腾起。"),
        option("post-dog-rest", "收爪", "Rest", "四肢更短更静。"),
      ],
      back: [
        option("post-dog-bag", "侧邮包", "Bag", "单边大邮包。"),
        option("post-dog-doublebag", "双邮包", "Twin", "左右各一个小包。"),
        option("post-dog-blanket", "邮毯", "Wrap", "像背了一块邮毯。"),
      ],
      prop: [
        option("post-dog-letter", "信件", "Mail", "嘴边或爪边带信封。"),
        option("post-dog-bell", "铃铛", "Bell", "小铃铛最像宠物项圈。"),
        option("post-dog-ticket", "票牌", "Tag", "一块编号牌。"),
      ],
    },
    defaultRecipe: {
      variant: "post-dog-stand",
      face: "post-dog-smile",
      head: "post-dog-flop",
      body: "post-dog-plush",
      arms: "post-dog-step",
      back: "post-dog-bag",
      prop: "post-dog-letter",
      finish: "moss-felt",
    },
  },
  {
    id: "tin-wolf",
    name: "锡皮巡狼",
    english: "Tin Wolf",
    badge: "机械四足",
    family: "锋利机兽",
    intro: "完全走硬边金属语言，跟布偶犬是两个物种、两种材质、两种结构。",
    stageScale: 1,
    stageY: -1.04,
    slotMeta: {
      variant: slot("机身", "机狼的整体站姿"),
      face: slot("目镜", "灯眼和面罩"),
      head: slot("耳天线", "顶部尖耳或感应件"),
      body: slot("装甲", "胸甲和机壳结构"),
      arms: slot("步进", "四肢的运动感"),
      back: slot("背模组", "电池包或导流鳍"),
      prop: slot("前装件", "核心、短刃、灯条"),
    },
    slots: {
      variant: [
        option("tin-wolf-guard", "警戒机身", "Guard", "抬头站定。"),
        option("tin-wolf-stalk", "潜行机身", "Stalk", "前低后高，更像猎行。"),
        option("tin-wolf-sprint", "冲刺机身", "Sprint", "身体拉长。"),
      ],
      face: [
        option("tin-wolf-visor", "横向目镜", "Visor", "一条发光横眼。"),
        option("tin-wolf-dual", "双目灯", "Dual", "两颗分离灯眼。"),
        option("tin-wolf-radar", "雷达眼", "Radar", "中间像一颗扫描芯。"),
      ],
      head: [
        option("tin-wolf-ears", "尖耳", "Ear", "标准尖耳轮廓。"),
        option("tin-wolf-array", "天线阵", "Array", "头顶变成机械阵列。"),
        option("tin-wolf-fin", "背鳍角", "Fin", "更像流线背鳍。"),
      ],
      body: [
        option("tin-wolf-armor", "重甲壳", "Armor", "胸腹最硬朗。"),
        option("tin-wolf-rib", "肋骨甲", "Rib", "身体分段更明显。"),
        option("tin-wolf-core", "核心壳", "Core", "中间留出发光芯。"),
      ],
      arms: [
        option("tin-wolf-brace", "撑地步态", "Brace", "四肢更稳。"),
        option("tin-wolf-step", "迈步步态", "Step", "前肢有一只抬起。"),
        option("tin-wolf-pounce", "扑击步态", "Pounce", "更前冲。"),
      ],
      back: [
        option("tin-wolf-pack", "电池背包", "Pack", "背后加一块厚模组。"),
        option("tin-wolf-tailblade", "尾刃", "Blade", "长尾更锋利。"),
        option("tin-wolf-fan", "导流鳍", "Fan", "背部插出鳍片。"),
      ],
      prop: [
        option("tin-wolf-core", "前置核心", "Core", "口边悬一个小核。"),
        option("tin-wolf-dagger", "短刃", "Blade", "嘴边或前爪带短刃。"),
        option("tin-wolf-lamp", "信标灯", "Lamp", "一枚小灯条。"),
      ],
    },
    defaultRecipe: {
      variant: "tin-wolf-guard",
      face: "tin-wolf-visor",
      head: "tin-wolf-ears",
      body: "tin-wolf-armor",
      arms: "tin-wolf-brace",
      back: "tin-wolf-tailblade",
      prop: "tin-wolf-core",
      finish: "brass-core",
    },
  },
  {
    id: "dune-tortle",
    name: "沙丘龟龙",
    english: "Dune Tortle",
    badge: "甲壳异兽",
    family: "低趴爬行",
    intro: "壳体压得很低，头尾更像爬行动物，是另一套完全横向的轮廓。",
    stageScale: 0.98,
    stageY: -1.06,
    slotMeta: {
      variant: slot("壳型", "整体高低和前后比例"),
      face: slot("嘴鼻", "龙头的表情"),
      head: slot("额角", "壳角和额冠"),
      body: slot("主壳", "壳面纹理"),
      arms: slot("前爪", "前肢开合状态"),
      back: slot("脊背", "背刺或旗鳍"),
      prop: slot("宝件", "珍珠、石板、灯芯"),
    },
    slots: {
      variant: [
        option("dune-tortle-low", "低伏壳", "Low", "像压在沙地里。"),
        option("dune-tortle-arch", "拱壳", "Arch", "背部更高更饱满。"),
        option("dune-tortle-long", "长躯壳", "Long", "身体向后拖长。"),
      ],
      face: [
        option("dune-tortle-soft", "温吞嘴", "Soft", "嘴角平和。"),
        option("dune-tortle-grin", "咧嘴嘴", "Grin", "略有坏笑。"),
        option("dune-tortle-sleep", "困脸嘴", "Sleep", "眼睛更窄。"),
      ],
      head: [
        option("dune-tortle-horn", "短额角", "Horn", "额角更短。"),
        option("dune-tortle-crown", "壳冠", "Crown", "额头像壳片开花。"),
        option("dune-tortle-shellrim", "边壳帽", "Rim", "头顶多一圈边壳。"),
      ],
      body: [
        option("dune-tortle-shell", "龟壳体", "Shell", "主壳最完整。"),
        option("dune-tortle-ridge", "脊纹壳", "Ridge", "背壳起一道道棱。"),
        option("dune-tortle-cloth", "披布壳", "Cloth", "壳上搭布片。"),
      ],
      arms: [
        option("dune-tortle-rest", "收爪", "Rest", "爪子更贴地。"),
        option("dune-tortle-step", "迈爪", "Step", "前爪一只抬起。"),
        option("dune-tortle-dig", "拨沙爪", "Dig", "前爪更往外掀。"),
      ],
      back: [
        option("dune-tortle-spikes", "背刺", "Spike", "一排背刺。"),
        option("dune-tortle-fin", "旗鳍", "Fin", "后背像沙鳍。"),
        option("dune-tortle-none", "净壳", "Clean", "壳面更纯。"),
      ],
      prop: [
        option("dune-tortle-pearl", "沙珠", "Pearl", "一颗带光的沙珠。"),
        option("dune-tortle-tablet", "石板", "Tablet", "一块小石板。"),
        option("dune-tortle-lamp", "沙灯", "Lamp", "暖色小灯。"),
      ],
    },
    defaultRecipe: {
      variant: "dune-tortle-low",
      face: "dune-tortle-soft",
      head: "dune-tortle-horn",
      body: "dune-tortle-shell",
      arms: "dune-tortle-rest",
      back: "dune-tortle-spikes",
      prop: "dune-tortle-pearl",
      finish: "moss-felt",
    },
  },
  {
    id: "mirror-snake",
    name: "镜面蛇灵",
    english: "Mirror Snake",
    badge: "盘绕灵体",
    family: "蛇形悬绕",
    intro: "直接从站立角色切到盘绕角色，底部是多圈蛇身，上面才是头部。",
    stageScale: 1,
    stageY: -1.02,
    slotMeta: {
      variant: slot("盘绕", "决定蛇身卷起的方式"),
      face: slot("眼面", "蛇眼和嘴部"),
      head: slot("额冠", "头顶冠饰"),
      body: slot("鳞躯", "鳞片或镜壳"),
      arms: slot("颈姿", "上半身昂起姿态"),
      back: slot("尾端", "尾巴的光件"),
      prop: slot("灵珠", "嘴边或尾边的小物"),
    },
    slots: {
      variant: [
        option("mirror-snake-coil", "双层盘绕", "Coil", "两圈最稳。"),
        option("mirror-snake-tower", "高塔盘绕", "Tower", "底盘更高。"),
        option("mirror-snake-sway", "偏摆盘绕", "Sway", "上半身略向一侧。"),
      ],
      face: [
        option("mirror-snake-soft", "柔眼", "Soft", "眼睛更圆。"),
        option("mirror-snake-slit", "竖瞳", "Slit", "更像蛇。"),
        option("mirror-snake-grin", "亮嘴", "Grin", "嘴角带笑。"),
      ],
      head: [
        option("mirror-snake-crown", "镜冠", "Crown", "额头像一片玻璃冠。"),
        option("mirror-snake-horns", "短双角", "Horn", "头两侧出角。"),
        option("mirror-snake-halo", "月弧环", "Halo", "头后有月形环。"),
      ],
      body: [
        option("mirror-snake-mirror", "镜鳞体", "Mirror", "表面更像镜壳。"),
        option("mirror-snake-pearl", "珍珠体", "Pearl", "身体更圆润。"),
        option("mirror-snake-ribbon", "丝带体", "Ribbon", "躯干更细更飘。"),
      ],
      arms: [
        option("mirror-snake-rise", "直升颈", "Rise", "上半身直直抬起。"),
        option("mirror-snake-curve", "弯颈", "Curve", "脖子弯成 S 形。"),
        option("mirror-snake-watch", "回望颈", "Watch", "头更偏向侧后。"),
      ],
      back: [
        option("mirror-snake-tailpearl", "尾珠", "Pearl", "尾端带光珠。"),
        option("mirror-snake-rattle", "尾铃", "Bell", "尾端像玩具铃。"),
        option("mirror-snake-fog", "尾雾", "Fog", "尾部拖一点雾。"),
      ],
      prop: [
        option("mirror-snake-orb", "悬浮灵珠", "Orb", "悬在嘴边。"),
        option("mirror-snake-lamp", "小月灯", "Lamp", "一枚月灯。"),
        option("mirror-snake-key", "镜匙", "Key", "细长钥匙。"),
      ],
    },
    defaultRecipe: {
      variant: "mirror-snake-coil",
      face: "mirror-snake-slit",
      head: "mirror-snake-crown",
      body: "mirror-snake-mirror",
      arms: "mirror-snake-rise",
      back: "mirror-snake-tailpearl",
      prop: "mirror-snake-orb",
      finish: "nocturne-plum",
    },
  },
  {
    id: "frost-penguin",
    name: "糖霜企鹅",
    english: "Frost Penguin",
    badge: "甜品玩偶",
    family: "蛋形玩具",
    intro: "主体像一枚甜品企鹅，完全不是怪诞系，而是甜品收藏路线。",
    stageScale: 0.98,
    stageY: -1,
    slotMeta: {
      variant: slot("蛋形", "身体胖瘦和站姿"),
      face: slot("奶油脸", "眼睛和嘴型"),
      head: slot("糖帽", "顶帽和糖壳"),
      body: slot("甜点体", "腹部和外壳"),
      arms: slot("小翅", "翅膀和脚的动作"),
      back: slot("托盘", "背后或身后的甜点件"),
      prop: slot("点心", "手里的甜点和灯片"),
    },
    slots: {
      variant: [
        option("frost-penguin-round", "圆蛋体", "Round", "最饱满的一颗。"),
        option("frost-penguin-tall", "高糖体", "Tall", "竖向更高。"),
        option("frost-penguin-wobble", "晃身体", "Wobble", "整体微微偏斜。"),
      ],
      face: [
        option("frost-penguin-soft", "奶油脸", "Soft", "圆眼小嘴。"),
        option("frost-penguin-smile", "笑嘴脸", "Smile", "嘴角更甜。"),
        option("frost-penguin-sleep", "困奶脸", "Sleep", "眼睛更眯。"),
      ],
      head: [
        option("frost-penguin-icing", "挤花帽", "Icing", "头顶像一圈奶油花。"),
        option("frost-penguin-cherry", "樱桃帽", "Cherry", "上面多一颗球。"),
        option("frost-penguin-cone", "脆筒帽", "Cone", "一只小脆筒。"),
      ],
      body: [
        option("frost-penguin-glaze", "果釉外壳", "Glaze", "表面更亮。"),
        option("frost-penguin-wafer", "威化裙边", "Wafer", "腰边多一圈薄片。"),
        option("frost-penguin-syrup", "糖浆流边", "Syrup", "身体有下垂糖浆。"),
      ],
      arms: [
        option("frost-penguin-rest", "小翅贴身", "Rest", "标准站姿。"),
        option("frost-penguin-wave", "小翅招手", "Wave", "一侧翅膀抬起。"),
        option("frost-penguin-tray", "托盘姿", "Tray", "双翅像端东西。"),
      ],
      back: [
        option("frost-penguin-tray", "甜点托盘", "Tray", "背后多一层盘。"),
        option("frost-penguin-ribbon", "包装丝带", "Ribbon", "像礼物绑带。"),
        option("frost-penguin-none", "净背", "Clean", "什么都不加。"),
      ],
      prop: [
        option("frost-penguin-cupcake", "纸杯蛋糕", "Cake", "一枚小甜点。"),
        option("frost-penguin-spoon", "金勺", "Spoon", "像甜品勺。"),
        option("frost-penguin-lamp", "糖灯", "Lamp", "发光的糖片灯。"),
      ],
    },
    defaultRecipe: {
      variant: "frost-penguin-round",
      face: "frost-penguin-soft",
      head: "frost-penguin-icing",
      body: "frost-penguin-glaze",
      arms: "frost-penguin-rest",
      back: "frost-penguin-tray",
      prop: "frost-penguin-cupcake",
      finish: "candy-icing",
    },
  },
  {
    id: "cloud-jelly",
    name: "云团水母",
    english: "Cloud Jelly",
    badge: "透明漂浮",
    family: "伞形悬浮",
    intro: "它没有腿，主结构是伞帽、内核和垂下的触须，和陆生角色彻底分开。",
    stageScale: 0.98,
    stageY: -0.94,
    slotMeta: {
      variant: slot("伞帽", "顶部外轮廓"),
      face: slot("内核", "中心发光表情"),
      head: slot("顶环", "伞帽上的环冠"),
      body: slot("腔体", "透明层和内芯"),
      arms: slot("触须", "下垂触须结构"),
      back: slot("外雾", "周围漂浮气团"),
      prop: slot("伴星", "旁边漂浮的小件"),
    },
    slots: {
      variant: [
        option("cloud-jelly-dome", "圆伞", "Dome", "像圆顶果冻。"),
        option("cloud-jelly-bell", "钟伞", "Bell", "下沿更收。"),
        option("cloud-jelly-star", "星伞", "Star", "边缘更起伏。"),
      ],
      face: [
        option("cloud-jelly-soft", "柔光核", "Soft", "双眼小而柔。"),
        option("cloud-jelly-pulse", "脉冲核", "Pulse", "中心更亮。"),
        option("cloud-jelly-dream", "梦游核", "Dream", "眼睛更闭合。"),
      ],
      head: [
        option("cloud-jelly-ring", "环冠", "Ring", "伞顶一圈光环。"),
        option("cloud-jelly-crown", "花冠", "Crown", "伞顶有一圈小片。"),
        option("cloud-jelly-orbit", "轨道圈", "Orbit", "更像行星轨道。"),
      ],
      body: [
        option("cloud-jelly-clear", "透明腔体", "Clear", "更像玻璃冻。"),
        option("cloud-jelly-core", "双层腔体", "Core", "内外两层明显。"),
        option("cloud-jelly-frost", "雾化腔体", "Frost", "表面更朦胧。"),
      ],
      arms: [
        option("cloud-jelly-short", "短触须", "Short", "下方更利落。"),
        option("cloud-jelly-long", "长触须", "Long", "像多条丝带垂下。"),
        option("cloud-jelly-bead", "珠串触须", "Bead", "一颗颗小球。"),
      ],
      back: [
        option("cloud-jelly-fog", "云雾圈", "Fog", "周身环一圈雾。"),
        option("cloud-jelly-bubble", "泡泡群", "Bubble", "旁边有泡泡。"),
        option("cloud-jelly-none", "留白", "Clean", "只保留主体。"),
      ],
      prop: [
        option("cloud-jelly-orb", "伴星球", "Orb", "旁边悬一个小球。"),
        option("cloud-jelly-lamp", "月灯", "Lamp", "一盏小月灯。"),
        option("cloud-jelly-chip", "薄片星", "Chip", "几片漂浮薄片。"),
      ],
    },
    defaultRecipe: {
      variant: "cloud-jelly-dome",
      face: "cloud-jelly-soft",
      head: "cloud-jelly-ring",
      body: "cloud-jelly-clear",
      arms: "cloud-jelly-long",
      back: "cloud-jelly-fog",
      prop: "cloud-jelly-orb",
      finish: "glass-mint",
    },
  },
  {
    id: "spore-bear",
    name: "菌棚熊",
    english: "Spore Bear",
    badge: "森林毛绒",
    family: "茸感收藏",
    intro: "是毛茸茸熊体加一整片大菌棚，不再只是普通圆熊头。",
    stageScale: 0.98,
    stageY: -1,
    slotMeta: {
      variant: slot("熊体", "决定胖瘦和体块"),
      face: slot("眼鼻", "熊的情绪"),
      head: slot("菌棚", "头顶伞棚和苔藓"),
      body: slot("毛壳", "身体的绒感层"),
      arms: slot("熊掌", "前掌动作"),
      back: slot("背篮", "背后载具和孢子"),
      prop: slot("采集件", "篮子、铲子、灯"),
    },
    slots: {
      variant: [
        option("spore-bear-round", "圆团熊", "Round", "最软最圆。"),
        option("spore-bear-stump", "树桩熊", "Stump", "身体更短更厚。"),
        option("spore-bear-tall", "高蘑熊", "Tall", "下身略拉长。"),
      ],
      face: [
        option("spore-bear-smile", "松弛脸", "Smile", "像暖乎乎的熊。"),
        option("spore-bear-button", "纽扣脸", "Button", "眼睛像纽扣。"),
        option("spore-bear-sleep", "睡脸", "Sleep", "眼睛更闭。"),
      ],
      head: [
        option("spore-bear-canopy", "大菌棚", "Canopy", "像树冠一样盖在头顶。"),
        option("spore-bear-moss", "苔帽", "Moss", "更像苔藓小山。"),
        option("spore-bear-bloom", "花菌帽", "Bloom", "边缘更开花。"),
      ],
      body: [
        option("spore-bear-fur", "长绒体", "Fur", "绒感最重。"),
        option("spore-bear-vest", "背心体", "Vest", "胸前像穿背心。"),
        option("spore-bear-bark", "树皮体", "Bark", "身体更偏树皮。"),
      ],
      arms: [
        option("spore-bear-rest", "收掌", "Rest", "最稳的站姿。"),
        option("spore-bear-carry", "抱篮掌", "Carry", "双掌像抱着东西。"),
        option("spore-bear-wave", "挥掌", "Wave", "一只掌抬起。"),
      ],
      back: [
        option("spore-bear-basket", "背篮", "Basket", "背后有小竹篮。"),
        option("spore-bear-spores", "孢子包", "Spore", "背后冒几颗孢子。"),
        option("spore-bear-leaf", "叶披", "Leaf", "背后搭一片叶。"),
      ],
      prop: [
        option("spore-bear-basketprop", "采菌篮", "Basket", "手边小篮。"),
        option("spore-bear-shovel", "小铲", "Tool", "像采集工具。"),
        option("spore-bear-lamp", "林灯", "Lamp", "暖色蘑菇灯。"),
      ],
    },
    defaultRecipe: {
      variant: "spore-bear-round",
      face: "spore-bear-smile",
      head: "spore-bear-canopy",
      body: "spore-bear-fur",
      arms: "spore-bear-rest",
      back: "spore-bear-basket",
      prop: "spore-bear-lamp",
      finish: "moss-felt",
    },
  },
  {
    id: "scrap-crow",
    name: "废土乌鸦",
    english: "Scrap Crow",
    badge: "拾荒鸟形",
    family: "瘦长鸟类",
    intro: "尖喙、披片、长腿、背包，直接切到鸟形角色，不共享熊犬那种结构。",
    stageScale: 1,
    stageY: -1.02,
    slotMeta: {
      variant: slot("站姿", "站立、偏头、俯冲"),
      face: slot("喙面", "喙和眼神"),
      head: slot("头冠", "羽冠或破帽"),
      body: slot("披片", "胸背的披片结构"),
      arms: slot("翅姿", "翅片开合"),
      back: slot("背具", "背包和收纳件"),
      prop: slot("拾荒件", "钥匙、灯、铁片"),
    },
    slots: {
      variant: [
        option("scrap-crow-stand", "直立站姿", "Stand", "最像一只守在边上的乌鸦。"),
        option("scrap-crow-tilt", "偏头站姿", "Tilt", "头向一侧偏。"),
        option("scrap-crow-lean", "前探站姿", "Lean", "身体更向前。"),
      ],
      face: [
        option("scrap-crow-sharp", "尖喙脸", "Sharp", "眼神更锐。"),
        option("scrap-crow-soft", "温吞喙", "Soft", "鸟喙更短。"),
        option("scrap-crow-mask", "面罩喙", "Mask", "眼周像套了一层面罩。"),
      ],
      head: [
        option("scrap-crow-crest", "羽冠", "Crest", "头顶一束硬羽。"),
        option("scrap-crow-hat", "破帽", "Hat", "像旧帽子。"),
        option("scrap-crow-halo", "钩环", "Halo", "头后一个钩形环。"),
      ],
      body: [
        option("scrap-crow-feather", "羽披", "Feather", "层叠羽片。"),
        option("scrap-crow-plate", "铁披", "Plate", "更像一片片金属。"),
        option("scrap-crow-cloak", "长披", "Cloak", "整体更像小斗篷。"),
      ],
      arms: [
        option("scrap-crow-fold", "收翅", "Fold", "两翅收紧。"),
        option("scrap-crow-open", "半开翅", "Open", "左右半开。"),
        option("scrap-crow-point", "指向翅", "Point", "一侧翅片向外。"),
      ],
      back: [
        option("scrap-crow-pack", "拾荒背包", "Pack", "一只旧包。"),
        option("scrap-crow-cage", "笼背", "Cage", "像挂着小笼架。"),
        option("scrap-crow-none", "净背", "Clean", "不挂东西。"),
      ],
      prop: [
        option("scrap-crow-key", "铁钥匙", "Key", "一把旧钥匙。"),
        option("scrap-crow-lamp", "路灯", "Lamp", "细长提灯。"),
        option("scrap-crow-plateprop", "铁片牌", "Plate", "一块铁片。"),
      ],
    },
    defaultRecipe: {
      variant: "scrap-crow-stand",
      face: "scrap-crow-sharp",
      head: "scrap-crow-crest",
      body: "scrap-crow-feather",
      arms: "scrap-crow-fold",
      back: "scrap-crow-pack",
      prop: "scrap-crow-key",
      finish: "nocturne-plum",
    },
  },
  {
    id: "sugar-lamb",
    name: "雪糖羊羔",
    english: "Sugar Lamb",
    badge: "绒球动物",
    family: "蓬松圆团",
    intro: "它是毛团和卷角的组合，视觉重点是绒球和铃铛，不再是熊或企鹅语言。",
    stageScale: 0.96,
    stageY: -1.02,
    slotMeta: {
      variant: slot("羊体", "决定绒球体积"),
      face: slot("小脸", "鼻眼和嘴型"),
      head: slot("卷角", "角和发冠"),
      body: slot("绒层", "身体毛团结构"),
      arms: slot("蹄姿", "四肢动作"),
      back: slot("披围", "背上的披风或毛围"),
      prop: slot("铃饰", "铃铛、糖签、灯球"),
    },
    slots: {
      variant: [
        option("sugar-lamb-puff", "蓬蓬羊", "Puff", "最圆的一只。"),
        option("sugar-lamb-curl", "卷卷羊", "Curl", "绒团更卷。"),
        option("sugar-lamb-prance", "跳步羊", "Prance", "站姿更轻快。"),
      ],
      face: [
        option("sugar-lamb-soft", "奶脸", "Soft", "眼睛最柔。"),
        option("sugar-lamb-smile", "笑脸", "Smile", "嘴角更甜。"),
        option("sugar-lamb-sleep", "困脸", "Sleep", "眼睛闭上。"),
      ],
      head: [
        option("sugar-lamb-horns", "双卷角", "Horn", "左右各一圈角。"),
        option("sugar-lamb-crown", "绒冠", "Crown", "角之间一团绒冠。"),
        option("sugar-lamb-ribbon", "丝带角", "Ribbon", "角边绑丝带。"),
      ],
      body: [
        option("sugar-lamb-fleece", "标准绒层", "Fleece", "最像棉花糖。"),
        option("sugar-lamb-cape", "披肩绒层", "Cape", "背部多一圈围层。"),
        option("sugar-lamb-shell", "糖壳绒层", "Shell", "外面一层亮糖壳。"),
      ],
      arms: [
        option("sugar-lamb-rest", "站立", "Rest", "四蹄稳稳站着。"),
        option("sugar-lamb-step", "迈步", "Step", "前蹄抬起。"),
        option("sugar-lamb-bow", "低头", "Bow", "头更低。"),
      ],
      back: [
        option("sugar-lamb-capeback", "围巾披背", "Cape", "背后一片围巾。"),
        option("sugar-lamb-bellback", "铃串背", "Bell", "背后一串铃。"),
        option("sugar-lamb-none", "净背", "Clean", "不加背饰。"),
      ],
      prop: [
        option("sugar-lamb-bell", "大铃铛", "Bell", "金属铃最醒目。"),
        option("sugar-lamb-stick", "糖签", "Stick", "一根甜品签。"),
        option("sugar-lamb-lamp", "雪灯", "Lamp", "小光球。"),
      ],
    },
    defaultRecipe: {
      variant: "sugar-lamb-puff",
      face: "sugar-lamb-soft",
      head: "sugar-lamb-horns",
      body: "sugar-lamb-fleece",
      arms: "sugar-lamb-rest",
      back: "sugar-lamb-capeback",
      prop: "sugar-lamb-bell",
      finish: "candy-icing",
    },
  },
  {
    id: "porcelain-deer",
    name: "骨瓷鹿人",
    english: "Porcelain Deer",
    badge: "雕塑人形",
    family: "长腿人像",
    intro: "长腿、鹿角、细手杖，是另一个人形方向，但和修女是两套骨架。",
    stageScale: 1.02,
    stageY: -1.06,
    slotMeta: {
      variant: slot("站位", "长腿姿态"),
      face: slot("脸面", "眼睛和面部切法"),
      head: slot("鹿角", "不同类型的角"),
      body: slot("躯壳", "胸腹和披层"),
      arms: slot("手势", "手臂动作"),
      back: slot("披尾", "背后垂片"),
      prop: slot("杖饰", "手杖、环片、珠核"),
    },
    slots: {
      variant: [
        option("porcelain-deer-stand", "直立长腿", "Stand", "最像一尊瓷像。"),
        option("porcelain-deer-cross", "交腿站", "Cross", "双腿略交错。"),
        option("porcelain-deer-bend", "弯膝站", "Bend", "膝部更有动势。"),
      ],
      face: [
        option("porcelain-deer-calm", "平面脸", "Calm", "脸最干净。"),
        option("porcelain-deer-mask", "局部面罩", "Mask", "上半脸像面罩。"),
        option("porcelain-deer-crack", "裂瓷脸", "Crack", "有细裂线。"),
      ],
      head: [
        option("porcelain-deer-antler", "分枝角", "Antler", "更像鹿角。"),
        option("porcelain-deer-crown", "环冠角", "Crown", "角和环连在一起。"),
        option("porcelain-deer-blade", "刃角", "Blade", "角更锐。"),
      ],
      body: [
        option("porcelain-deer-slim", "修长躯壳", "Slim", "最显腿长。"),
        option("porcelain-deer-cloak", "长披层", "Cloak", "腰后有长披。"),
        option("porcelain-deer-armor", "瓷甲层", "Armor", "胸前更硬。"),
      ],
      arms: [
        option("porcelain-deer-rest", "垂手", "Rest", "安静收藏姿势。"),
        option("porcelain-deer-open", "开手", "Open", "手向外。"),
        option("porcelain-deer-hold", "持杖手", "Hold", "更像展陈。"),
      ],
      back: [
        option("porcelain-deer-tailcloth", "披尾", "Tail", "身后垂一片。"),
        option("porcelain-deer-rings", "背环", "Ring", "背后悬几个小环。"),
        option("porcelain-deer-none", "净背", "Clean", "只留主体。"),
      ],
      prop: [
        option("porcelain-deer-staff", "细手杖", "Staff", "最像收藏雕塑。"),
        option("porcelain-deer-orb", "瓷珠", "Orb", "手边一颗瓷珠。"),
        option("porcelain-deer-frame", "环片", "Frame", "几何环片。"),
      ],
    },
    defaultRecipe: {
      variant: "porcelain-deer-stand",
      face: "porcelain-deer-calm",
      head: "porcelain-deer-antler",
      body: "porcelain-deer-slim",
      arms: "porcelain-deer-hold",
      back: "porcelain-deer-tailcloth",
      prop: "porcelain-deer-staff",
      finish: "porcelain-bloom",
    },
  },
];

export function getFigureDefinition(id: string) {
  return FIGURE_DEFINITIONS.find((item) => item.id === id) ?? FIGURE_DEFINITIONS[0];
}

export function buildDefaultRecipe(character: FigureDefinition): FigureRecipe {
  return { ...character.defaultRecipe };
}

export function randomizeRecipe(character: FigureDefinition): FigureRecipe {
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
