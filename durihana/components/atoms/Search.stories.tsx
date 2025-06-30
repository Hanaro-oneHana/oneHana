import Search from '@/components/atoms/Search';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta: Meta = {
  title: 'atoms/Search',
  component: Search,
  tags: ['autodocs'],
};
type Story = StoryObj<typeof meta>;

export const DefaultSrch: Story = {
  args: {
    onSearch: () => {
      alert('검색 버튼 제출');
    },
  },
};

export default meta;
