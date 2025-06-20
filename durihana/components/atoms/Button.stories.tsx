import Button from '@/components/atoms/Button';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta: Meta = {
  title: 'atoms/Button',
  component: Button,
  tags: ['autodocs'],
};

type Story = StoryObj<typeof meta>;

export const PrimaryButton: Story = {
  args: {
    bgColor: 'bg-primarycolor',
    type: 'button',
    children: 'Primary Button',
  },
};

export const GrayButton: Story = {
  args: {
    bgColor: 'bg-buttongray',
    type: 'button',
    children: 'Gray Button',
  },
};

export default meta;
