import InputComponent from '@/components/atoms/InputComponent';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta: Meta = {
  title: 'atoms/InputComponent',
  component: InputComponent,
  tags: ['autodocs'],
};
type Story = StoryObj<typeof meta>;

export const DefaultInput: Story = {
  args: {
    placeholder: 'default input',
  },
};

export const PasswdInput: Story = {
  args: {
    type: 'password',
    placeholder: '비밀번호 입력',
  },
};

export default meta;
