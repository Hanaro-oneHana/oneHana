import Header from '@/components/atoms/Header';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta: Meta = {
  title: 'atoms/Header',
  component: Header,
  tags: ['autodocs'],
};

type Story = StoryObj<typeof meta>;

export const DefaultHeader: Story = {
  args: {
    title: '계좌 개설',
    leftIcon: 'back',
    rightIcon: 'close',
    onLeftClick: () => {
      alert('뒤로가기 클릭');
    },
    onRightClick: () => {
      alert('닫기 클릭');
    },
  },
};

export const LoginHeader: Story = {
  args: {
    leftIcon: 'my',
    rightIcon: 'bell',
    onLeftClick: () => {
      alert('내 정보 클릭');
    },
    onRightClick: () => {
      alert('알림 클릭');
    },
  },
};

export default meta;
