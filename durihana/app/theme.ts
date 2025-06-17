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
  'mainwhite',
  'mainblack',
  'pink',
  'skyblue',
  'lime',
  'navy',
  'textgray',
  'buttongray',
  'red',
  'icongray',
] as const;

export type Color = (typeof colors)[number];
