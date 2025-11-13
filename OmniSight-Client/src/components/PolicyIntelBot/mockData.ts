
import { v4 as uuidv4 } from 'uuid';
import { PolicyUpdate, Department } from './types';

const generateRandomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const now = new Date();
const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
const futureDate = new Date(now.getFullYear(), now.getMonth() + 3, now.getDate());

export const mockPolicyUpdates: PolicyUpdate[] = [
  {
    id: uuidv4(),
    title: "SEC Climate Disclosure Requirements Update",
    summary: "The Securities and Exchange Commission has issued new climate-related disclosure requirements for public companies.",
    fullContent: "The SEC has adopted rules requiring registrants to include certain climate-related information in their registration statements and annual reports. These rules require information about climate-related risks that are reasonably likely to have a material impact on their business, results of operations, or financial condition.\n\nThe rules also require disclosure of a registrant's greenhouse gas emissions, which have become a commonly used metric to assess a company's exposure to such risks.",
    datePublished: generateRandomDate(sixMonthsAgo, now),
    effectiveDate: generateRandomDate(now, futureDate),
    categories: ['finance', 'legal'],
    priority: 'high',
    source: 'sec',
    sourceName: 'Securities and Exchange Commission',
    sourceUrl: 'https://www.sec.gov/rules/final/2023/33-11275.pdf',
    requiredActions: [
      "Update climate risk assessment procedures",
      "Implement greenhouse gas emission tracking",
      "Prepare disclosure templates for upcoming reports",
      "Train finance and legal teams on new requirements"
    ],
    departmentalImpact: {
      'Finance': 'Significant impact. Need to develop new financial reporting processes to capture and report climate-related financial risks.',
      'Legal': 'High impact. Need to review and update disclosure procedures and ensure compliance with new regulations.',
      'Operations': 'Moderate impact. May need to adjust operational tracking to capture climate-related metrics.',
      'IT': 'Medium impact. Will need to implement systems to track and report emissions data.',
      'Human Resources': 'Low impact. May need to support training initiatives.'
    },
    viewed: false
  },
  {
    id: uuidv4(),
    title: "GDPR Enforcement Updates",
    summary: "The European Data Protection Board has issued new guidelines on GDPR enforcement, focusing on cross-border processing activities.",
    fullContent: "The European Data Protection Board (EDPB) has published updated guidance on consistent enforcement of the General Data Protection Regulation (GDPR) with respect to cross-border processing activities. The guidance clarifies the responsibilities of controllers operating across multiple EU member states and provides examples of what constitutes effective cooperation with supervisory authorities.",
    datePublished: generateRandomDate(sixMonthsAgo, now),
    categories: ['legal', 'it'],
    priority: 'medium',
    source: 'gdpr',
    sourceName: 'European Data Protection Board',
    sourceUrl: 'https://edpb.europa.eu/our-work-tools/general-guidance/guidelines-recommendations-best-practices_en',
    requiredActions: [
      "Review data processing activities across EU member states",
      "Update data protection impact assessments",
      "Notify affected business units of new requirements"
    ],
    departmentalImpact: {
      'Legal': 'High impact. Need to review and update compliance procedures.',
      'IT': 'Significant impact. Data systems may need to be updated to ensure compliance.',
      'Customer Service': 'Medium impact. May need to adjust customer data handling procedures.',
      'Marketing': 'Medium impact. May affect data collection and processing practices.',
      'Human Resources': 'Low impact. May affect employee data processing across EU borders.'
    },
    viewed: false
  },
  {
    id: uuidv4(),
    title: "Federal Procurement Policy on Supply Chain Security",
    summary: "New federal guidelines on supply chain security for government contractors have been released, affecting vendor verification requirements.",
    datePublished: generateRandomDate(sixMonthsAgo, now),
    categories: ['procurement', 'it'],
    priority: 'medium',
    source: 'government',
    sourceName: 'Office of Federal Procurement Policy',
    requiredActions: [
      "Update vendor verification process",
      "Conduct security assessments of current supply chain",
      "Implement new documentation requirements for vendors"
    ],
    departmentalImpact: {
      'Procurement': 'High impact. Need to implement new vendor verification procedures.',
      'IT': 'Medium impact. Will need to assess security implications.',
      'Legal': 'Medium impact. Contracts with vendors may need to be updated.',
      'Operations': 'Medium impact. Supply chain processes may need adjustments.'
    },
    viewed: true
  },
  {
    id: uuidv4(),
    title: "Critical Tax Legislation Changes for Corporate Reporting",
    summary: "New tax legislation includes significant changes to corporate reporting requirements and international tax provisions.",
    fullContent: "The new tax legislation introduces sweeping changes to corporate tax regulations, particularly affecting multinational corporations with international operations. Key provisions include adjustments to transfer pricing rules, changes to foreign income reporting, and new requirements for digital services taxation. These changes are expected to have significant impact on tax planning strategies and financial reporting obligations.",
    datePublished: generateRandomDate(sixMonthsAgo, now),
    effectiveDate: generateRandomDate(now, futureDate),
    categories: ['finance', 'legal'],
    priority: 'critical',
    source: 'government',
    sourceName: 'Department of Treasury',
    sourceUrl: 'https://www.treasury.gov/',
    requiredActions: [
      "Complete impact assessment on current tax positions",
      "Update financial reporting procedures",
      "Revise tax planning strategies",
      "Train finance team on new requirements",
      "Schedule consultation with tax advisors"
    ],
    departmentalImpact: {
      'Finance': 'Critical impact. Will require significant changes to tax reporting and planning.',
      'Legal': 'High impact. Need to ensure compliance with new tax laws.',
      'Accounting': 'Major impact. Will affect financial statements and reporting practices.',
      'International Operations': 'Significant impact. New transfer pricing rules will affect cross-border transactions.',
      'Executive Leadership': 'High impact. May affect strategic decisions and financial forecasts.'
    },
    viewed: false
  },
  {
    id: uuidv4(),
    title: "Industry Association Updates Cybersecurity Standards",
    summary: "The industry association has published updated cybersecurity standards that will become requirements for certification.",
    datePublished: generateRandomDate(sixMonthsAgo, now),
    categories: ['it', 'general'],
    priority: 'low',
    source: 'industry',
    sourceName: 'Industry Security Association',
    requiredActions: [
      "Review updated standards",
      "Conduct gap analysis against current practices",
      "Develop implementation plan for necessary changes"
    ],
    departmentalImpact: {
      'IT': 'Medium impact. May require updates to security protocols.',
      'Compliance': 'Medium impact. Will need to ensure alignment with new standards.',
      'Operations': 'Low impact. Minor adjustments to operational security may be needed.'
    },
    viewed: true
  },
  {
    id: uuidv4(),
    title: "DOL Updates to Employee Classification Guidelines",
    summary: "The Department of Labor has issued new guidelines on employee vs. contractor classification, affecting gig economy workers.",
    datePublished: generateRandomDate(sixMonthsAgo, now),
    categories: ['hr', 'legal'],
    priority: 'high',
    source: 'government',
    sourceName: 'Department of Labor',
    requiredActions: [
      "Audit current worker classifications",
      "Update contractual agreements as needed",
      "Train HR and management on new guidelines"
    ],
    departmentalImpact: {
      'Human Resources': 'High impact. Will need to review all worker classifications.',
      'Legal': 'High impact. Employment contracts may need revision.',
      'Finance': 'Medium impact. May affect tax withholding and benefits costs.',
      'Operations': 'Medium impact. Could affect staffing models.'
    },
    viewed: true
  },
  {
    id: uuidv4(),
    title: "Updated HIPAA Compliance Requirements",
    summary: "HHS has released updated HIPAA compliance requirements focusing on telehealth and digital health information exchange.",
    datePublished: generateRandomDate(sixMonthsAgo, now),
    categories: ['legal', 'it', 'hr'],
    priority: 'medium',
    source: 'government',
    sourceName: 'Department of Health and Human Services',
    requiredActions: [
      "Review telehealth procedures",
      "Update data sharing protocols",
      "Conduct staff training on new requirements"
    ],
    departmentalImpact: {
      'Legal': 'High impact. Need to ensure compliance with updated regulations.',
      'IT': 'High impact. Systems handling health information may need updates.',
      'Human Resources': 'Medium impact. Employee health information handling procedures may need revision.',
      'Customer Service': 'Low impact. May affect handling of customer health data if applicable.'
    },
    viewed: true
  }
];

export const mockDepartments: Department[] = [
  {
    id: uuidv4(),
    name: 'Finance',
    description: 'Manages financial planning, reporting, and compliance',
    policies: mockPolicyUpdates
      .filter(p => p.categories.includes('finance'))
      .map(p => p.id)
  },
  {
    id: uuidv4(),
    name: 'Legal',
    description: 'Handles legal compliance and regulatory affairs',
    policies: mockPolicyUpdates
      .filter(p => p.categories.includes('legal'))
      .map(p => p.id)
  },
  {
    id: uuidv4(),
    name: 'IT',
    description: 'Manages information technology infrastructure and security',
    policies: mockPolicyUpdates
      .filter(p => p.categories.includes('it'))
      .map(p => p.id)
  },
  {
    id: uuidv4(),
    name: 'Human Resources',
    description: 'Manages employee relations, benefits, and workforce compliance',
    policies: mockPolicyUpdates
      .filter(p => p.categories.includes('hr'))
      .map(p => p.id)
  },
  {
    id: uuidv4(),
    name: 'Procurement',
    description: 'Manages vendor relationships and purchasing compliance',
    policies: mockPolicyUpdates
      .filter(p => p.categories.includes('procurement'))
      .map(p => p.id)
  },
  {
    id: uuidv4(),
    name: 'Operations',
    description: 'Manages day-to-day business operations and processes',
    policies: mockPolicyUpdates
      .filter(p => p.departmentalImpact && p.departmentalImpact['Operations'])
      .map(p => p.id)
  }
];
