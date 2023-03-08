import { OptionQuestion } from '../../../bot/utils/replyOptionQuestions'

const rawQuestions = [
  [
    "Hello! Mammals with upright legs! I'm MeeTon!",
    'Hello cute little thing.',
    'Hello, fat furball with a strange name.',
  ],
  [
    "Nice to meet you! I hear you're interested in us creatures.",
    'Yes, I am very interested in you guys.',
    "No, I'm not interested in you.",
  ],
  [
    'We can do many interesting things in space, would you like to explore with us?',
    'Of course, I would love to go on an adventure with you guys!',
    "No, I don't want to go on an adventure with you guys.",
  ],
  [
    'Can I tell you a secret?',
    "sure! I'm interested in secrets.",
    "No, I don't want to know any secrets.",
  ],
  [
    'Did you know? Our race really enjoys collecting all kinds of different NFT items.',
    'Wow, I love collecting NFTs too! Can you help me find some valuable items?',
    'What are NFTs? Sounds boring.',
  ],
  [
    'You can get a lot of useful information and skills by communicating with us.',
    'Great, I want to learn more knowledge and skills.',
    "I don't need your help, I can learn by myself.",
  ],
  [
    'We need constant communication and exchange to build deep relationships.',
    'I totally agree that we should communicate more.',
    "I'm not interested in a relationship with you, we can do without communication.",
  ],
  [
    'Did you know that we can find hidden treasures through space exploration.',
    "Really? That's so cool, I'd love to go on an adventure together!",
    "I don't believe in these superstitious legends, and I won't go looking for the so-called `treasure`.",
  ],
  [
    'We need to be well equipped to survive and explore in space.',
    'I will prepare all the necessary equipment for you to explore safely.',
    "I don't care if you survive or not, just give me money.",
  ],
  [
    'What do you think about interstellar exploration?',
    'I really want to join the interstellar adventure and see what other mysterious places in the universe.',
    "I think interstellar exploration is dangerous and I don't want to take risks.",
  ],
  [
    'Do you know the dangers in space?',
    "Yes, I've heard there are many dangers. You must be more careful.",
    'No, I think space is peaceful and safe.',
  ],
  [
    'Do you think our MeeTons are the cutest creatures in space?',
    'Yes, you guys are so cute!',
    "No, I've seen cuter creatures.",
  ],
  [
    'Do you want to know what our MeeTon home in space looks like?',
    "certainly! I'm curious.",
    'No, I think your homeland is similar to the one on Earth.',
  ],
  [
    'Do you know what we do at MeeTon every day?',
    "I don't know, can you tell me?",
    'not interested.',
  ],
  [
    'We at MeeTon like to try different kinds of food, do you want to taste with us?',
    'certainly! I love trying new things.',
    'No, I think what you eat might be weird.',
  ],
  [
    'Do you know how strong the vitality of our MeeTon is?',
    "I don't know, can you tell me?",
    'not interested',
  ],
  [
    "During our expedition, I'll send you back postcard NFTs from all over space. Really been waiting! I'm going to collect them all.",
    'Excited to collect postcard NFTs',
    'Not interested in postcards',
  ],
  [
    'I like to eat energy fruit, can you give me some to increase my energy value?',
    'Will prepare energy fruits for them',
    'Encourages them to buy it themselves',
  ],
  [
    'How do you feel about my intimacy with you?',
    'Feels intimacy is high',
    'Thinks intimacy needs strengthening',
  ],
]

const questions: OptionQuestion[] = rawQuestions.map((r) => ({
  question: r[0],
  options: [
    {
      label: r[1],
      value: '+',
    },
    {
      label: r[2],
      value: '-',
    },
  ],
}))

export default questions
