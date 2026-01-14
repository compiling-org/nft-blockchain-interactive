import type { Meta, StoryObj } from '@storybook/react';
import { TypeGPUVisualizer } from './TypeGPUVisualizer';

const meta: Meta<typeof TypeGPUVisualizer> = {
    title: 'Sensors/TypeGPUVisualizer',
    component: TypeGPUVisualizer,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TypeGPUVisualizer>;

export const Calm: Story = {
    args: {
        emotionalState: {
            valence: 0.1,
            arousal: -0.8,
            dominance: 0.2,
        },
    },
};

export const Energetic: Story = {
    args: {
        emotionalState: {
            valence: 0.8,
            arousal: 0.9,
            dominance: 0.5,
        },
    },
};

export const Aggressive: Story = {
    args: {
        emotionalState: {
            valence: -0.5,
            arousal: 0.8,
            dominance: 0.9,
        },
    },
};
