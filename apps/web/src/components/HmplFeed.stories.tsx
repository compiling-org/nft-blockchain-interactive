import type { Meta, StoryObj } from '@storybook/react';
import { HmplFeed } from './HmplFeed';

const meta: Meta<typeof HmplFeed> = {
    title: 'Integrations/HmplFeed',
    component: HmplFeed,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof HmplFeed>;

export const Default: Story = {
    args: {},
};
