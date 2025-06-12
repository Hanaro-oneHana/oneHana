export const colors = [
  'primarycolor',
  'secondarycolor',
  'background',
  'mint',
  'lightmint',
  'icon',
  'iconselect',
  'purple',
  'lightpurple',
  'mainWhite',
  'mainBlack',
  'pink',
  'skyblue',
  'lime',
  'navy',
  'textgray',
  'buttongray',
] as const;

export type Color = (typeof colors)[number];
