import { NextRequest, NextResponse } from 'next/server';
import { memoryStore } from '@/lib/fallbackStore';

export async function GET(req: NextRequest) {
  const { pathname } = new URL(req.url);
  const segments = pathname.replace(/^\/api\/?/, '').split('/').filter(Boolean);

  if (segments[0] === 'health') {
    return NextResponse.json({
      status: 'operational',
      company: 'MGN Marketing Dubai Real Estate LLC',
      timestamp: new Date().toISOString(),
    });
  }

  if (segments[0] === 'properties') {
    return NextResponse.json({
      success: true,
      count: memoryStore.properties.length,
      data: memoryStore.properties,
    });
  }

  if (segments[0] === 'leads') {
    return NextResponse.json({
      success: true,
      count: memoryStore.leads.length,
      data: memoryStore.leads,
    });
  }

  if (segments[0] === 'operations') {
    const sub = segments[1];
    if (sub === 'deals') {
      return NextResponse.json({ success: true, data: memoryStore.deals });
    }
    if (sub === 'agents') {
      return NextResponse.json({ success: true, data: memoryStore.agents });
    }
    if (sub === 'campaigns') {
      return NextResponse.json({ success: true, data: memoryStore.campaigns });
    }
    if (sub === 'viewings') {
      return NextResponse.json({ success: true, data: memoryStore.viewings });
    }
    if (sub === 'overview') {
      const properties = memoryStore.properties as Record<string, number & string>[];
      const leads = memoryStore.leads as Record<string, number & string>[];
      const deals = memoryStore.deals as Record<string, number & string>[];
      const agents = memoryStore.agents as Record<string, number & string>[];
      const campaigns = memoryStore.campaigns as Record<string, number & string>[];
      const viewings = memoryStore.viewings as Record<string, number & string>[];

      const totalPortfolioValueAED = properties.reduce((s, p) => s + (Number(p.priceAED) || 0), 0);
      const totalSalesClosedAED = deals.reduce((s, d) => s + (Number(d.saleValueAED) || 0), 0);
      const totalGrossCommissionAED = deals.reduce((s, d) => s + (Number(d.grossCommissionAED) || 0), 0);
      const totalMgnNetRevenueAED = deals.reduce((s, d) => s + (Number(d.mgnNetRevenueAED) || 0), 0);
      const totalPipelineBudgetAED = leads
        .filter((l) => l.stage !== 'Lost')
        .reduce((s, l) => s + (Number(l.budgetAED) || 0), 0);
      const totalMarketingSpendAED = campaigns.reduce((s, c) => s + (Number(c.spendAED) || 0), 0);
      const totalMarketingRevenueAED = campaigns.reduce((s, c) => s + (Number(c.revenueAttributedAED) || 0), 0);

      const communityMap: Record<string, { community: string; count: number; totalValueAED: number; avgRoi: number }> = {};
      properties.forEach((p) => {
        const comm = String(p.community || 'Downtown Dubai');
        if (!communityMap[comm]) {
          communityMap[comm] = { community: comm, count: 0, totalValueAED: 0, avgRoi: 0 };
        }
        communityMap[comm].count += 1;
        communityMap[comm].totalValueAED += Number(p.priceAED) || 0;
        communityMap[comm].avgRoi += Number(p.roiEstimate) || 8;
      });

      const communityBreakdown = Object.values(communityMap).map((item) => ({
        ...item,
        avgRoi: Number((item.avgRoi / item.count).toFixed(1)),
      }));

      const stageCounts: Record<string, number> = {
        'New Inquiry': 0,
        Contacted: 0,
        'Viewing Scheduled': 0,
        Negotiation: 0,
        'SPA Signed / Closed': 0,
        Lost: 0,
      };
      leads.forEach((l) => {
        const st = String(l.stage || 'New Inquiry');
        if (stageCounts[st] !== undefined) stageCounts[st] += 1;
      });

      return NextResponse.json({
        success: true,
        data: {
          kpis: {
            totalProperties: properties.length,
            availableProperties: properties.filter((p) => p.status === 'Available').length,
            totalPortfolioValueAED,
            totalLeads: leads.length,
            vipLeadsCount: leads.filter((l) => l.priority === 'VIP / High').length,
            totalPipelineBudgetAED,
            totalDeals: deals.length,
            totalSalesClosedAED,
            totalGrossCommissionAED,
            totalMgnNetRevenueAED,
            totalAgents: agents.length,
            activeCampaigns: campaigns.filter((c) => c.status === 'Active').length,
            totalMarketingSpendAED,
            totalMarketingRevenueAED,
            marketingRoas:
              totalMarketingSpendAED > 0
                ? Number((totalMarketingRevenueAED / totalMarketingSpendAED).toFixed(1))
                : 0,
            upcomingViewings: viewings.filter((v) => v.status === 'Confirmed').length,
          },
          communityBreakdown,
          stageCounts,
        },
      });
    }
  }

  return NextResponse.json({ success: false, message: 'Endpoint not found' }, { status: 404 });
}

export async function POST(req: NextRequest) {
  const { pathname } = new URL(req.url);
  const segments = pathname.replace(/^\/api\/?/, '').split('/').filter(Boolean);
  const body = await req.json();

  if (segments[0] === 'properties') {
    const newItem = {
      _id: `prop-${Date.now()}`,
      referenceCode: body.referenceCode || `MGN-DXB-${100 + memoryStore.properties.length + 1}`,
      status: 'Available',
      ...body,
    };
    memoryStore.properties.unshift(newItem);
    return NextResponse.json({ success: true, data: newItem }, { status: 201 });
  }

  if (segments[0] === 'leads') {
    const newLead = {
      _id: `lead-${Date.now()}`,
      stage: 'New Inquiry',
      priority: 'VIP / High',
      nationality: 'UAE',
      assignedAgent: 'Tariq Al Maktoum',
      ...body,
    };
    memoryStore.leads.unshift(newLead);
    return NextResponse.json({ success: true, data: newLead }, { status: 201 });
  }

  if (segments[0] === 'operations') {
    const sub = segments[1];
    if (sub === 'deals') {
      const saleValueAED = Number(body.saleValueAED) || 0;
      const commissionPercent = Number(body.commissionPercent) || 4;
      const agentSplitPercent = Number(body.agentSplitPercent) || 50;
      const grossCommissionAED = (saleValueAED * commissionPercent) / 100;
      const mgnNetRevenueAED = (grossCommissionAED * (100 - agentSplitPercent)) / 100;
      const newDeal = {
        _id: `deal-${Date.now()}`,
        dealCode: `MGN-DEAL-${8800 + memoryStore.deals.length + 1}`,
        ...body,
        saleValueAED,
        commissionPercent,
        agentSplitPercent,
        grossCommissionAED,
        mgnNetRevenueAED,
      };
      memoryStore.deals.unshift(newDeal);
      return NextResponse.json({ success: true, data: newDeal }, { status: 201 });
    }
    if (sub === 'campaigns') {
      const newCamp = { _id: `camp-${Date.now()}`, status: 'Active', ...body };
      memoryStore.campaigns.unshift(newCamp);
      return NextResponse.json({ success: true, data: newCamp }, { status: 201 });
    }
    if (sub === 'viewings') {
      const newView = { _id: `view-${Date.now()}`, status: 'Confirmed', ...body };
      memoryStore.viewings.unshift(newView);
      return NextResponse.json({ success: true, data: newView }, { status: 201 });
    }
  }

  return NextResponse.json({ success: false, message: 'Not supported' }, { status: 400 });
}

export async function PUT(req: NextRequest) {
  const { pathname } = new URL(req.url);
  const segments = pathname.replace(/^\/api\/?/, '').split('/').filter(Boolean);
  const body = await req.json();

  if (segments[0] === 'properties' && segments[1]) {
    const idx = memoryStore.properties.findIndex((p) => p._id === segments[1]);
    if (idx !== -1) {
      memoryStore.properties[idx] = { ...memoryStore.properties[idx], ...body };
      return NextResponse.json({ success: true, data: memoryStore.properties[idx] });
    }
  }

  if (segments[0] === 'leads' && segments[1]) {
    const idx = memoryStore.leads.findIndex((l) => l._id === segments[1]);
    if (idx !== -1) {
      memoryStore.leads[idx] = { ...memoryStore.leads[idx], ...body };
      return NextResponse.json({ success: true, data: memoryStore.leads[idx] });
    }
  }

  return NextResponse.json({ success: false, message: 'Item not found' }, { status: 404 });
}

export async function DELETE(req: NextRequest) {
  const { pathname } = new URL(req.url);
  const segments = pathname.replace(/^\/api\/?/, '').split('/').filter(Boolean);

  if (segments[0] === 'properties' && segments[1]) {
    memoryStore.properties = memoryStore.properties.filter((p) => p._id !== segments[1]);
    return NextResponse.json({ success: true });
  }

  if (segments[0] === 'leads' && segments[1]) {
    memoryStore.leads = memoryStore.leads.filter((l) => l._id !== segments[1]);
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: true });
}
