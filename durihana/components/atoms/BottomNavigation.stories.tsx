import BottomNavigation from '@/components/atoms/BottomNavigation';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta: Meta = {
  title: 'atoms/BottomNavigation',
  component: BottomNavigation,
  tags: ['autodocs'],
};

type Story = StoryObj<typeof meta>;

export const HomeNavi: Story = {
  args: {
    selectedItem: 'home',
  },
};

export const StoreNavi: Story = {
  args: {
    selectedItem: 'store',
  },
};

export default meta;
