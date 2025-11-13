
import { InsightData, InsightType, InsightSeverity, Department, MetricCategory } from './types';

// Helper function to generate random date within range
const getRandomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
};

// Mock data for insights
export const generateMockInsights = (): InsightData[] => {
  const now = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(now.getMonth() - 1);

  return [
    {
      id: "insight-001",
      title: "Revenue Drop in Western Region",
      description: "Revenue in the Western region decreased by 15% compared to last month. Primary factor appears to be the delayed launch of the summer promotion campaign.",
      type: "anomaly",
      severity: "high",
      department: "sales",
      metricCategory: "revenue",
      timestamp: getRandomDate(oneMonthAgo, now),
      confidence: 87,
      chartData: {
        type: "line",
        data: [
          { month: "Jan", value: 125000 },
          { month: "Feb", value: 128000 },
          { month: "Mar", value: 124000 },
          { month: "Apr", value: 135000 },
          { month: "May", value: 114750 },
        ]
      },
      recommendations: [
        "Accelerate summer promotion in Western region",
        "Offer exclusive deals to top 50 customers in affected area",
        "Increase digital ad spend by 10% for Western region"
      ],
      relatedMetrics: ["Marketing Spend", "Customer Acquisition Cost", "Sales Cycle Duration"]
    },
    {
      id: "insight-002",
      title: "Increasing Customer Acquisition Cost",
      description: "Customer acquisition cost has risen 23% over the past quarter while conversion rates have remained stable, indicating decreasing marketing efficiency.",
      type: "trend",
      severity: "medium",
      department: "marketing",
      metricCategory: "costs",
      timestamp: getRandomDate(oneMonthAgo, now),
      confidence: 92,
      chartData: {
        type: "bar",
        data: [
          { quarter: "Q1 2023", value: 105 },
          { quarter: "Q2 2023", value: 110 },
          { quarter: "Q3 2023", value: 118 },
          { quarter: "Q4 2023", value: 125 },
          { quarter: "Q1 2024", value: 129 },
        ]
      },
      recommendations: [
        "Review channel performance and reallocate budget",
        "A/B test new campaign creative",
        "Refine audience targeting parameters"
      ],
      relatedMetrics: ["Conversion Rate", "Marketing ROI", "Customer Lifetime Value"]
    },
    {
      id: "insight-003",
      title: "Q3 Revenue Forecast Exceeds Target",
      description: "Based on current pipeline and sales velocity, Q3 revenue is projected to exceed targets by 8-12%. Growth is primarily driven by the new enterprise product line.",
      type: "forecast",
      severity: "info",
      department: "finance",
      metricCategory: "revenue",
      timestamp: getRandomDate(oneMonthAgo, now),
      confidence: 78,
      chartData: {
        type: "area",
        data: [
          { month: "Jul", actual: 0, forecast: 1450000, target: 1350000 },
          { month: "Aug", actual: 0, forecast: 1520000, target: 1400000 },
          { month: "Sep", actual: 0, forecast: 1490000, target: 1380000 },
        ]
      },
      recommendations: [
        "Prepare inventory for increased demand",
        "Consider incentive plan adjustments for sales team",
        "Confirm production capacity can meet projected demand"
      ],
      relatedMetrics: ["Sales Pipeline", "Average Deal Size", "Win Rate"]
    },
    {
      id: "insight-004",
      title: "Employee Turnover Spike in Engineering",
      description: "Engineering department has experienced 15% turnover in the last quarter, significantly above the company average of 7%. Exit interviews indicate compensation and work-life balance as key factors.",
      type: "anomaly",
      severity: "critical",
      department: "hr",
      metricCategory: "retention",
      timestamp: getRandomDate(oneMonthAgo, now),
      confidence: 95,
      chartData: {
        type: "line",
        data: [
          { quarter: "Q2 2023", engineering: 5, companyAvg: 7 },
          { quarter: "Q3 2023", engineering: 7, companyAvg: 7 },
          { quarter: "Q4 2023", engineering: 9, companyAvg: 8 },
          { quarter: "Q1 2024", engineering: 15, companyAvg: 7 },
        ]
      },
      recommendations: [
        "Conduct compensation benchmarking study",
        "Review project workload and team capacity",
        "Implement stay interviews with key talent"
      ],
      relatedMetrics: ["Employee Satisfaction", "Time to Hire", "Recruitment Costs"]
    },
    {
      id: "insight-005",
      title: "Inventory Optimization Opportunity",
      description: "Inventory levels for 12 SKUs are consistently above optimal levels, resulting in approximately $245,000 in excess carrying costs annually.",
      type: "root-cause",
      severity: "medium",
      department: "operations",
      metricCategory: "costs",
      timestamp: getRandomDate(oneMonthAgo, now),
      confidence: 89,
      chartData: {
        type: "bar",
        data: [
          { category: "Electronics", optimal: 125000, actual: 187500 },
          { category: "Furniture", optimal: 85000, actual: 93500 },
          { category: "Office Supplies", optimal: 65000, actual: 110500 },
          { category: "Apparel", optimal: 95000, actual: 118750 },
        ]
      },
      recommendations: [
        "Implement just-in-time ordering for high-excess SKUs",
        "Negotiate consignment terms with suppliers for seasonal items",
        "Run promotion to reduce excess inventory"
      ],
      relatedMetrics: ["Days of Supply", "Inventory Turnover", "Carrying Cost"]
    },
    {
      id: "insight-006",
      title: "Website Conversion Rate Improvement",
      description: "A/B testing of the new product page design shows a 28% increase in conversion rate compared to the original design.",
      type: "correlation",
      severity: "low",
      department: "marketing",
      metricCategory: "conversion",
      timestamp: getRandomDate(oneMonthAgo, now),
      confidence: 91,
      chartData: {
        type: "bar",
        data: [
          { version: "Original", conversionRate: 2.8 },
          { version: "Variation A", conversionRate: 3.1 },
          { version: "Variation B", conversionRate: 3.6 },
        ]
      },
      recommendations: [
        "Roll out new design across all product pages",
        "Apply similar design principles to category pages",
        "Document findings for future UX improvements"
      ],
      relatedMetrics: ["Page Views", "Bounce Rate", "Average Order Value"]
    },
    {
      id: "insight-007",
      title: "Support Ticket Resolution Time Decreasing",
      description: "Average ticket resolution time has decreased by 32% in the past 60 days, coinciding with the implementation of the new knowledge base and chatbot.",
      type: "trend",
      severity: "info",
      department: "operations",
      metricCategory: "productivity",
      timestamp: getRandomDate(oneMonthAgo, now),
      confidence: 85,
      chartData: {
        type: "line",
        data: [
          { week: "Week 1", hours: 24 },
          { week: "Week 3", hours: 22 },
          { week: "Week 5", hours: 19 },
          { week: "Week 7", hours: 16 },
          { week: "Week 9", hours: 14 },
        ]
      },
      recommendations: [
        "Expand knowledge base with articles on common issues",
        "Share successful automation approach with other departments",
        "Consider additional self-service options"
      ],
      relatedMetrics: ["Customer Satisfaction", "First Contact Resolution", "Support Costs"]
    },
  ];
};
