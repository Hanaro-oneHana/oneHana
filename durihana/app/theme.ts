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

export const fontWeights = {
  light: 300,
  regular: 400,
  medium: 500,
  bold: 600,
  heavy: 800,
};
