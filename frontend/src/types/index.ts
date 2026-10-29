export interface Property {
  _id: string;
  referenceCode: string;
  title: string;
  subtitle: string;
  description: string;
  community: string;
  developer: string;
  propertyType: string;
  listingType: 'Off-Plan' | 'Secondary / Ready' | 'Luxury Rental';
  status: 'Available' | 'Reserved' | 'Sold' | 'Rented' | 'Under Offer';
  priceAED: number;
  bedrooms: number;
  bathrooms: number;
  areaSqFt: number;
  roiEstimate: number;
  rentalYieldPercent: number;
  completionYear: string;
  paymentPlan: {
    downPayment: number;
    duringConstruction: number;
    onHandover: number;
    postHandover: number;
    summary: string;
  };
  goldenVisaEligible: boolean;
  dldPermitNumber: string;
  featured: boolean;
  exclusiveMGN: boolean;
  amenities: string[];
  images: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  assignedAgentName: string;
  assignedAgentPhone: string;
  viewsCount: number;
  inquiriesCount: number;
  createdAt?: string;
}

export type ClientIntentType =
  | 'Buy Property'
  | 'Sell Property (Owner)'
  | 'Rent a Property (Tenant)'
  | 'Rent Out Property (Landlord)';

export interface Lead {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  nationality: string;
  budgetAED: number;
  clientIntent?: ClientIntentType | string;
  propertyCategory?: string;
  bedroomsRequirement?: string;
  furnishingPreference?: string;
  moveInTimeline?: string;
  rentFrequency?: string;
  titleDeedOrOqoodNumber?: string;
  interestedCommunity: string;
  interestedPropertyId?: string;
  interestedPropertyTitle: string;
  purpose: string;
  paymentPreference: string;
  source: string;
  stage: 'New Inquiry' | 'Contacted' | 'Viewing Scheduled' | 'Negotiation' | 'SPA Signed / Closed' | 'Lost';
  priority: 'VIP / High' | 'Medium' | 'Low';
  assignedAgent: string;
  notes: string;
  lastContactedAt?: string;
  createdAt?: string;
}

export interface Deal {
  _id: string;
  dealCode: string;
  propertyTitle: string;
  community: string;
  developer: string;
  buyerName: string;
  buyerNationality: string;
  agentName: string;
  dealType: string;
  saleValueAED: number;
  commissionPercent: number;
  grossCommissionAED: number;
  agentSplitPercent: number;
  mgnNetRevenueAED: number;
  dldFeeStatus: string;
  status: string;
  closingDate?: string;
  createdAt?: string;
}

export interface Agent {
  _id: string;
  fullName: string;
  role: string;
  reraBrn: string;
  email: string;
  phone: string;
  whatsapp: string;
  specialization: string;
  languages: string[];
  avatar: string;
  totalSalesVolumeAED: number;
  dealsClosed: number;
  activeListings: number;
  rating: number;
  status: string;
}

export interface Campaign {
  _id: string;
  campaignName: string;
  channel: string;
  targetCommunity: string;
  targetAudience: string;
  status: string;
  budgetAED: number;
  spendAED: number;
  impressions: number;
  clicks: number;
  leadsGenerated: number;
  dealsAttributed: number;
  revenueAttributedAED: number;
}

export interface Viewing {
  _id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  propertyTitle: string;
  community: string;
  agentName: string;
  viewingType: string;
  scheduledDate: string;
  scheduledTime: string;
  status: string;
  notes: string;
}

export interface OverviewAnalytics {
  kpis: {
    totalProperties: number;
    availableProperties: number;
    totalPortfolioValueAED: number;
    totalLeads: number;
    vipLeadsCount: number;
    totalPipelineBudgetAED: number;
    totalDeals: number;
    totalSalesClosedAED: number;
    totalGrossCommissionAED: number;
    totalMgnNetRevenueAED: number;
    totalAgents: number;
    activeCampaigns: number;
    totalMarketingSpendAED: number;
    totalMarketingRevenueAED: number;
    marketingRoas: number;
    upcomingViewings: number;
  };
  communityBreakdown: {
    community: string;
    count: number;
    totalValueAED: number;
    avgRoi: number;
  }[];
  stageCounts: Record<string, number>;
}
