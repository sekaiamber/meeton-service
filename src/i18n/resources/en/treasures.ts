const rawTreasures = [
  [
    'I001',
    'Ether Crystal',
    'A crystal-clear Ether Crystal Stone with a faint glow.',
  ],
  [
    'I002',
    'Telegram Starmap',
    'An interstellar map recorded by Telegram, marking some of the star systems MeeTon has explored.',
  ],
  [
    'I003',
    'Mystery Ore',
    'A mysterious ore that is said to be used to create advanced exploration equipment.',
  ],
  [
    'I004',
    'Commemorative Medal',
    "A special medallion commemorating Telegram's space expeditions with the image of MeeTon and the spacecraft.",
  ],
  [
    'I005',
    'Bitcoin Crystal',
    'A crystal clear piece of Bitcoin crystal stone with a faint glow.',
  ],
  [
    'I006',
    'Mars Meteorite',
    'A meteorite that landed on Earth from Mars and has a very high scientific value.',
  ],
  [
    'I007',
    'Space Amulet',
    'A mysterious amulet that protects the user from danger and harm in space.',
  ],
  [
    'I008',
    'Stellar Fragment',
    'a piece of fragment from a star broken out, with strong radiation energy.',
  ],
  [
    'I009',
    'Mini Statue',
    "a beautiful MeeTon mini statue, is a must-have collector's item.",
  ],
  [
    'I010',
    'Model Rocket',
    'A beautiful model of a rocket, a must-have for space adventure enthusiasts.',
  ],
  [
    'I011',
    'Starburst flower',
    "a flower blooming with galactic starbursts, which can increase MeeTon's energy value and vitality.",
  ],
  [
    'I012',
    'Space Submarine',
    'A space submarine made by future technology, which can travel between the stars and discover the secrets hidden in the galaxy.',
  ],
  [
    'I013',
    'Giant Diamond',
    'A giant diamond that seems to have supernatural powers.',
  ],
  [
    'I014',
    'Dimensional Mirror',
    'a mirror made of unknown material that allows MeeTon to observe the scene in other dimensions.',
  ],
  [
    'I015',
    'Space Amulet',
    'an amulet with space elements that can protect explorers from dangers in space.',
  ],
  [
    'I016',
    'Space Clock',
    'a high-tech clock that can display the time in space, is the necessary equipment for explorers.',
  ],
  [
    'I017',
    'Space Watch',
    'a beautiful space watch, able to function properly in the space environment.',
  ],
  [
    'I018',
    'Planet Specimens',
    'some specimens from planets in the solar system, can be used to study their ecology and civilization.',
  ],
  [
    'I019',
    'Starship Wreck',
    'Some wrecks from warships in interstellar wars that can be used to make advanced space ships.',
  ],
  [
    'I020',
    'Bitcoin Silver Brick',
    'A beautiful bitcoin silver brick that shines mesmerizingly.',
  ],
  [
    'I021',
    'Star Crystal',
    'A mysterious crystal that can be used to create advanced space ships and weapons.',
  ],
  [
    'I022',
    'MeeTon Crystal Ball',
    'A mysterious MeeTon crystal ball that can predict future events and trends.',
  ],
  [
    'I023',
    'Nebula Map',
    'A map of nebulae that marks hundreds of unknown galaxies and planets.',
  ],
  [
    'I024',
    'Microgravity Plant',
    'This is a rare plant that only grows in the universe. It can be grown inside a spacecraft to provide oxygen and food for astronauts. This NFT treasure represents a rare microgravity plant that is growing and can provide useful resources.',
  ],
  [
    'I025',
    'Tusk of Cosmic Beast',
    'This is a tooth from the most powerful beast in the universe. This NFT treasure represents the most precious tooth of this giant beast, which has powerful energy and strong vitality that can help users be more brave and determined in their space adventure.',
  ],
  [
    'I026',
    'Space Antique Skeleton',
    'A mysterious skeleton from an ancient era, said to be the remains of a creature from a distant galaxy. This skeleton has been certified by MeeTon scientists as an extremely rare and valuable space antique.',
  ],
  [
    'I027',
    'Stellar Storm Debris',
    'Some debris from an interstellar storm with peculiar patterns on the surface.',
  ],
  [
    'I028',
    'Black Hole Heart',
    'A piece of matter obtained from the central region of a black hole with extremely strong gravitational force.',
  ],
  [
    'I029',
    'Cosmic Eye',
    'A mysterious device that can observe various invisible energy fluctuations in the universe.',
  ],
  [
    'I030',
    'Star Explorer Medal',
    'a medal of honor, awarded to warriors who successfully complete interstellar expeditions.',
  ],
  [
    'I031',
    'Star Empire Treasure',
    'A group of legendary treasures, said to be buried in a galaxy by the ruler of the Star Empire.',
  ],
  [
    'I032',
    'Star Heart',
    'A heart-shaped jewel containing the power and wisdom of the entire universe, only a very few people can be recognized by it.',
  ],
  [
    'I033',
    'Unicorn Horn',
    "A horn from a unicorn, a mysterious creature that is said to only appear on extremely pure planets. This unicorn's horn is crystal clear and is known as one of the most perfect gems.",
  ],
  [
    'I034',
    'Cataclysm Prophecy',
    'An ancient prophecy from an unknown galaxy that is said to record the truth about the cosmic cataclysm and the prophecy of the end of the world. Although the authenticity of the prophecy is highly questionable, the value of this prophecy is considered unparalleled in the metaverse.',
  ],
  [
    'I035',
    'Aurora Nebula',
    'An NFT that shows the beauty of the Aurora Nebula has an unparalleled aesthetic value.',
  ],
  [
    'I036',
    'BitTorrent Vision',
    'An NFT that shows the vagaries of the Bitcoin market and has unparalleled artistic value.',
  ],
  [
    'I037',
    'Burning Sun',
    'An NFT showing the burning sun, with unparalleled aesthetic value.',
  ],
  [
    'I038',
    'Ether Pantheon',
    'An NFT showing the pantheon of the Ether, with unparalleled artistic value.',
  ],
  [
    'I039',
    'Eye of Unknown',
    'An eye of a mysterious creature that is said to be able to see through the mysteries of the universe and the future direction, and only those who are destined to receive its favor.',
  ],
]

interface TreasureI18nData {
  name: string
  description: string
}

const treasuresI18n: { [key: string]: TreasureI18nData } = {}

rawTreasures.forEach((t) => {
  treasuresI18n[t[0]] = {
    name: t[1],
    description: t[2],
  }
})

export default treasuresI18n
