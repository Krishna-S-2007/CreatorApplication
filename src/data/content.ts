export type Quote = { id: number; text: string; author: string; role: string }

export const quotes: Quote[] = [
  {
    id: 1,
    text: "Success is no accident. It is hard work, perseverance, learning, studying, sacrifice and most of all, love of what you are doing.",
    author: "Pelé",
    role: "Three-time World Cup winner",
  },
  {
    id: 2,
    text: "You have to fight to reach your dream. You have to sacrifice and work hard for it.",
    author: "Lionel Messi",
    role: "World Cup winner",
  },
  {
    id: 3,
    text: "Talent without working hard is nothing.",
    author: "Cristiano Ronaldo",
    role: "Five-time Ballon d'Or winner",
  },
  {
    id: 4,
    text: "Quality without results is pointless. Results without quality is boring.",
    author: "Johan Cruyff",
    role: "Total Football pioneer",
  },
  {
    id: 5,
    text: "I learned all about life with a ball at my feet.",
    author: "Ronaldinho",
    role: "Ballon d'Or winner",
  },
]

export type Member = { name: string; role: string; handle: string; number: string }

export const crew: Member[] = [
  { name: "Ryan", role: "Captain / Editor", handle: "@ryan", number: "01" },
  { name: "Jordan", role: "Playmaker / Voice", handle: "@jordan", number: "02" },
  { name: "Emedic", role: "Squad member / Creator", handle: "@emedic", number: "03" },
  { name: "CyanDragon", role: "Squad member / Creator", handle: "@cyandragon", number: "04" },
  { name: "aka JB", role: "Squad member / Creator", handle: "@akajb", number: "05" },
]

export const featured = [
  { n: "01", title: "Ranked grind", copy: "Late nights, tight lobbies and clutch rounds. Five friends climbing the ladder together." },
  { n: "02", title: "Squad stories", copy: "Highlights and moments from the crew, from the first drop to the last-second win." },
  { n: "03", title: "Legends speak", copy: "Words from the greatest to ever play, built to fire you up before every match." },
]
