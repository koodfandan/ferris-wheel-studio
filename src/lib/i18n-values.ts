export type Locale = "zh" | "en";

const VALUE_ZH: Record<string, string> = {
  series: "系列",
  build: "拼装",
  inspect: "检视",
  shelf: "陈列",
  collection: "收藏",
  assemble: "拼装",

  human: "人物",
  animal: "动物",
  creature: "精灵",
  robot: "机械宠物",

  expression: "表情",
  silhouette: "轮廓",
  headpiece: "头饰",
  outfit: "服装",
  prop: "道具",
  frame: "外环",
  pods: "吊舱",
  base: "底座",
  palette: "配色",

  "vanilla-muse": "香草缪斯",
  "peach-fizz": "蜜桃汽泡",
  "mint-parade": "薄荷巡游",
  "midnight-jelly": "午夜果冻",

  "expression-smile": "微笑脸",
  "expression-sleepy": "困困脸",
  "expression-wink": "眨眼脸",
  "expression-led": "LED 面罩",
  "silhouette-bob": "圆波波头",
  "silhouette-curl": "糖果卷发",
  "silhouette-bunny": "兔耳毛绒",
  "silhouette-bear": "小熊毛绒",
  "silhouette-foam": "云泡头冠",
  "silhouette-shell": "头盔壳体",
  "headpiece-cloud": "云朵冠",
  "headpiece-bow": "珍珠蝴蝶结",
  "headpiece-halo": "月环",
  "headpiece-antenna": "双星天线",
  "outfit-pajama": "睡衣体",
  "outfit-fairdress": "游园裙",
  "outfit-plush": "毛绒体",
  "outfit-cape": "夜游披风",
  "outfit-pod": "舱体服",
  "prop-ticket": "票根",
  "prop-wand": "星星魔杖",
  "prop-lantern": "月灯",
  "prop-battery": "电池核心",
  "frame-classic": "经典环",
  "frame-candy": "糖果环",
  "frame-pearl": "珍珠月环",
  "frame-bulb": "灯泡网环",
  "pods-moon": "月亮吊舱",
  "pods-candy": "糖果吊舱",
  "pods-plush": "毛绒吊舱",
  "pods-pixel": "像素吊舱",
  "base-cloud": "云朵平台",
  "base-ticket": "售票亭台",
  "base-dock": "充能平台",

  classic: "经典",
  dreamy: "梦幻",
  hero: "主角",
  neo: "新潮",

  "Species switch": "切换物种",
  "Quick fix": "一键修复",
  "Blind Mix": "盲盒混搭",
  "Smart Match": "智能推荐",
  "Spatial registry active": "空间规则已启用",
};

const PHRASE_ZH: Record<string, string> = {
  "Spatial guard is active. Invalid stage combinations are disabled or auto-repaired.":
    "空间守卫已开启。冲突组合会被禁用或自动修复。",
  "Spatial guard blocked that combination and rolled back to the last safe build.":
    "空间守卫拦截了该组合，并回退到上一套安全搭配。",
  "Spatial check passed.":
    "空间检查通过。",
};

export function localizeValue(value: string, locale: Locale): string {
  if (locale === "en") return value;
  return VALUE_ZH[value] ?? value;
}

export function localizePhrase(value: string, locale: Locale): string {
  if (locale === "en") return value;
  return PHRASE_ZH[value] ?? VALUE_ZH[value] ?? value;
}
