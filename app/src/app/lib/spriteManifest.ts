export type SpriteAnimation = "idle" | "happy" | "sad" | "thinking";

export const SPRITE_FRAMES: Record<number, Record<SpriteAnimation, string[]>> = {
  0: {
    idle: ["/sprites/monster0/idle-1.svg", "/sprites/monster0/idle-2.svg", "/sprites/monster0/idle-3.svg"],
    happy: ["/sprites/monster0/happy-1.svg", "/sprites/monster0/happy-2.svg", "/sprites/monster0/happy-3.svg"],
    sad: ["/sprites/monster0/sad-1.svg", "/sprites/monster0/sad-2.svg", "/sprites/monster0/sad-3.svg"],
    thinking: ["/sprites/monster0/thinking-1.svg", "/sprites/monster0/thinking-2.svg", "/sprites/monster0/thinking-3.svg"],
  },
  1: {
    idle: ["/sprites/monster1/idle-1.svg", "/sprites/monster1/idle-2.svg", "/sprites/monster1/idle-3.svg"],
    happy: ["/sprites/monster1/happy-1.svg", "/sprites/monster1/happy-2.svg", "/sprites/monster1/happy-3.svg"],
    sad: ["/sprites/monster1/sad-1.svg", "/sprites/monster1/sad-2.svg", "/sprites/monster1/sad-3.svg"],
    thinking: ["/sprites/monster1/thinking-1.svg", "/sprites/monster1/thinking-2.svg", "/sprites/monster1/thinking-3.svg"],
  },
  2: {
    idle: ["/sprites/monster2/idle-1.svg", "/sprites/monster2/idle-2.svg", "/sprites/monster2/idle-3.svg"],
    happy: ["/sprites/monster2/happy-1.svg", "/sprites/monster2/happy-2.svg", "/sprites/monster2/happy-3.svg"],
    sad: ["/sprites/monster2/sad-1.svg", "/sprites/monster2/sad-2.svg", "/sprites/monster2/sad-3.svg"],
    thinking: ["/sprites/monster2/thinking-1.svg", "/sprites/monster2/thinking-2.svg", "/sprites/monster2/thinking-3.svg"],
  },
  3: {
    idle: ["/sprites/monster3/idle-1.svg", "/sprites/monster3/idle-2.svg", "/sprites/monster3/idle-3.svg"],
    happy: ["/sprites/monster3/happy-1.svg", "/sprites/monster3/happy-2.svg", "/sprites/monster3/happy-3.svg"],
    sad: ["/sprites/monster3/sad-1.svg", "/sprites/monster3/sad-2.svg", "/sprites/monster3/sad-3.svg"],
    thinking: ["/sprites/monster3/thinking-1.svg", "/sprites/monster3/thinking-2.svg", "/sprites/monster3/thinking-3.svg"],
  },
};
