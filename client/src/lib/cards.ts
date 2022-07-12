export function getRandomCard(): string {
  const suits = Array.from("CDHS");
  const ranks = Array.from("A23456789TJQK");
  const s = suits[Math.floor(Math.random() * suits.length)];
  const r = ranks[Math.floor(Math.random() * ranks.length)];

  return s + r;
}
