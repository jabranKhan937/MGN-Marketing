import {
  initialProperties,
  initialAgents,
  initialLeads,
  initialDeals,
  initialCampaigns,
  initialViewings,
} from './dubaiData';

const withIds = <T extends Record<string, unknown>>(items: T[], prefix: string) =>
  items.map((item, idx) => ({
    _id: `${prefix}-${idx + 1}`,
    ...item,
  }));

// Global in-memory store for serverless fallback when MONGODB_URI is not set
const globalStore = globalThis as unknown as {
  __mgnFallbackStore?: {
    properties: Record<string, unknown>[];
    agents: Record<string, unknown>[];
    leads: Record<string, unknown>[];
    deals: Record<string, unknown>[];
    campaigns: Record<string, unknown>[];
    viewings: Record<string, unknown>[];
  };
};

if (!globalStore.__mgnFallbackStore) {
  globalStore.__mgnFallbackStore = {
    properties: withIds(initialProperties, 'prop'),
    agents: withIds(initialAgents, 'agent'),
    leads: withIds(initialLeads, 'lead'),
    deals: withIds(initialDeals, 'deal'),
    campaigns: withIds(initialCampaigns, 'camp'),
    viewings: withIds(initialViewings, 'view'),
  };
}

export const memoryStore = globalStore.__mgnFallbackStore;
