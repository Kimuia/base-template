import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { EmptyState } from './EmptyState';

const meta: Meta<typeof EmptyState> = {
  title: 'Shared/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDescription: Story = {
  args: {
    title: '검색 결과가 없습니다',
    description: '다른 검색어로 다시 시도해주세요',
  },
};

export const WithAction: Story = {
  render: () => (
    <EmptyState title="등록된 상품이 없습니다">
      <button className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
        상품 등록하기
      </button>
    </EmptyState>
  ),
};
