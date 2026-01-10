/**
 * Bitte AI Chat API Routes
 * Handles chat interactions with AI agents
 */

import { Request, Response } from 'express';

const BITTE_API_KEY = process.env.BITTE_API_KEY || 'test-api-key';
const BITTE_API_URL = process.env.BITTE_API_URL || 'https://wallet.bitte.ai/api/v1/chat';

export const chatHandler = async (req: Request, res: Response) => {
  try {
    const { messages, agentId, accountId, evmAddress, chainId, localAgent } = req.body;

    // Forward request to Bitte API
    const response = await fetch(BITTE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BITTE_API_KEY}`,
      },
      body: JSON.stringify({
        messages,
        agentId,
        accountId,
        evmAddress,
        chainId,
        localAgent,
        config: {
          mode: 'DEBUG'
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Bitte API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({
      error: 'Failed to process chat request',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const chatHistoryHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Chat ID is required' });
    }

    const response = await fetch(`${BITTE_API_URL}/history?id=${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${BITTE_API_KEY}`,
      }
    });

    if (!response.ok) {
      throw new Error(`Bitte API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Chat history API error:', error);
    res.status(500).json({
      error: 'Failed to fetch chat history',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};