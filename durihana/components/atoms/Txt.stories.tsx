import Txt from '@/components/atoms/Txt';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta: Meta = {
  title: 'atoms/Txt',
  component: Txt,
  tags: ['autodocs'],
};

type Story = StoryObj<typeof meta>;

export const DefaultTxt: Story = {
  args: { children: 'default txt' },
};

export const BoldTxt: Story = {
  args: { weight: 'font-[500]', children: 'bold txt' },
};

export const PrimaryTxt: Story = {
  args: {
    weight: 'font-[500]',
    children: 'PrimaryColor txt',
    size: 'text-[20px]',
    color: 'text-primarycolor',
  },
};

export default meta;
