import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ErrorMessage } from './ErrorMessage';

const meta: Meta<typeof ErrorMessage> = {
  title: 'Shared/ErrorMessage',
  component: ErrorMessage,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithCustomMessage: Story = {
  args: {
    message: '네트워크 오류가 발생했습니다.',
  },
};

export const WithRetry: Story = {
  args: {
    onRetry: () => alert('재시도'),
  },
};
