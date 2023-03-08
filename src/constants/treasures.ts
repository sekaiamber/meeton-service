/* eslint-disable prettier/prettier */
const treasures: Array<[string, number, number, string]> = [
  ['I001', 1, 1, '以太水晶石,一块晶莹剔透的以太坊水晶石，闪烁着微弱的光芒。'],
  ['I002', 1, 2, 'Telegram星图,一份由Telegram记录的星际地图，标注了一些MeeTon曾经探索过的星系。'],
  ['I003', 1, 2, '神秘矿石,一块神秘的矿石，据说可以用来制造高级探险装备。'],
  ['I004', 1, 2, '纪念章,一枚纪念Telegram太空探险活动的特别章，上面印有MeeTon和太空船的形象。'],
  ['I005', 1, 2, '比特币水晶石,一块晶莹剔透的比特币水晶石，闪烁着微弱的光芒。'],
  ['I006', 1, 3, '火星陨石,一块从火星降落在地球上的陨石，具有非常高的科学价值。'],
  ['I007', 1, 3, '太空护身符,一件神秘的护身符，能够保护使用者在太空中免受危险和伤害。'],
  ['I008', 1, 3, '恒星碎片,一块从恒星碎裂出来的碎片，带有强烈的辐射能量。'],
  ['I009', 1, 4, '迷你雕像,一件精美的MeeTon迷你雕像，是收藏家们必备的珍品。'],
  ['I010', 1, 5, '火箭模型,一枚火箭的精美模型，是太空探险爱好者的必备之物。'],
  ['I011', 2, 1, '银河星芒花,一朵绽放着银河星芒的花朵，可以增加MeeTon的能量值和生命力。'],
  ['I012', 2, 2, '太空潜艇,一艘由未来科技制造的太空潜艇，可以在星际之间穿梭，并发现隐藏在星系中的秘密。'],
  ['I013', 2, 2, '巨型钻石,一颗巨大的钻石，似乎具有超自然的力量。'],
  ['I014', 2, 3, '次元镜子,一面由未知物质制成的镜子，可以让MeeTon观察到其他次元中的景象。'],
  ['I015', 2, 4, '太空护身符,一枚带有太空元素的护身符，可以保护探险者在太空中免受危险的侵袭。'],
  ['I016', 2, 4, '太空时钟,一枚能够显示太空时间的高科技时钟，是探险家们必备的装备。'],
  ['I017', 2, 5, '太空手表,一只精美的太空手表，能够在太空环境中正常运行。'],
  ['I018', 2, 5, '太阳系星球标本,一些来自太阳系中的星球的标本，可以用于研究它们的生态和文明。'],
  ['I019', 3, 1, '星际战舰残骸,一些来自于星际战争中的战舰残骸，可以用于制造高级的太空船。'],
  ['I020', 3, 2, '比特币白银砖,一块精美的比特币白银砖，闪闪发光，令人心醉神迷。'],
  ['I021', 3, 2, '星际晶体,一种神秘的晶体，可以用于制造高级的太空船和武器。'],
  ['I022', 3, 3, 'MeeTon水晶球,一枚神秘的MeeTon水晶球，能够预测未来的事件和趋势。'],
  ['I023', 3, 3, '星云图,一张星云的地图，标记了数百个未知的星系和行星。'],
  ['I024', 3, 4, '微重力植物,这是一种罕见的植物，只在宇宙中生长。它可以在太空船内生长，为宇航员提供氧气和食物。这个NFT宝物代表着一棵罕见的微重力植物，它正在生长，并能够提供有用的资源。'],
  ['I025', 3, 5, '宇宙巨兽之牙,这是一根来自宇宙中最强大的巨兽的牙齿。这个NFT宝物代表着这个巨兽最珍贵的牙齿，它具有强大的能量和强烈的生命力，可以帮助用户在太空探险中更加勇敢和坚定。'],
  ['I026', 3, 5, '太空古董骨骼,一副远古时代的神秘骨骼，据说是来自遥远星系的一种生物的遗骸。这副骨骼已经被MeeTon科学家们认证为极其稀有和珍贵的太空古董。'],
  ['I027', 4, 2, '星际风暴残骸,一些来自于星际风暴中的残骸，表面带有奇特的纹路。'],
  ['I028', 4, 3, '黑洞心脏,一颗从黑洞中心区域获取的物质，带有极强的引力。'],
  ['I029', 4, 4, '宇宙之眼,一件神秘的装置，可以观测到宇宙中各种不可见的能量波动。'],
  ['I030', 4, 4, '星际探险家勋章,一枚荣誉勋章，颁发给成功完成星际探险任务的勇士。'],
  ['I031', 4, 5, '星际帝国宝藏,一批传说中的宝藏，据说被星际帝国的统治者埋藏在某个星系中。'],
  ['I032', 4, 5, '星际之心,一颗心形的宝石，蕴含着整个宇宙的力量和智慧，只有极少数人才能得到它的认可。'],
  ['I033', 5, 5, '独角兽之角,一根来自独角兽的角，据说这种神秘生物只会出现在极其纯净的星球上。这根独角兽之角通体晶莹剔透，被誉为最完美的宝石之一。'],
  ['I034', 5, 5, '天体浩劫预言,一份来自未知星系的古老预言，据说记录着宇宙浩劫的真相和世界末日的预言。虽然预言的真实性备受质疑，但是在元宇宙中，这份预言的价值却被认为是无与伦比的。'],
  ['I035', 5, 5, '极光星云,一张能展现极光星云美景的NFT，拥有无与伦比的美学价值。'],
  ['I036', 5, 5, '比特幻象,一张能展现比特币市场变幻的NFT，拥有无与伦比的艺术价值。'],
  ['I037', 5, 5, '燃烧太阳,一张能展现燃烧太阳景象的NFT，拥有无与伦比的美学价值。'],
  ['I038', 5, 5, '以太神殿,一张能展现以太坊神殿的NFT，拥有无与伦比的艺术价值。'],
  ['I039', 5, 5, '未知生物之眼,一只神秘生物的眼睛，据说可以看穿宇宙的奥秘和未来的发展方向，只有有缘人才能得到它的眷顾。'],
]

export interface TreasureRawData {
  level: number
  rarity: number
  key: string
  description: string
}

const treasuresRawData: TreasureRawData[] = treasures.map((t) => ({
  key: t[0],
  level: t[1] - 1,
  rarity: t[2] - 1,
  description: t[3],
}))

export { treasuresRawData }

const treasuresRawDataMap: { [key: string]: TreasureRawData } = {}
treasuresRawData.forEach((t) => {
  treasuresRawDataMap[t.key] = t
})

export default treasuresRawDataMap