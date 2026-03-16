export const MOCK_PROJECTS = [
  {
    id: '1',
    name: 'Project Alpha: Cloud Migration',
    goal: 'Migrate all legacy on-premise databases to AWS Aurora by Q3.',
    description: 'A comprehensive migration of our legacy Oracle databases to AWS Aurora PostgreSQL. This involves schema conversion, data migration, and extensive testing.',
    deadline: '2026-09-30',
    budget: 150000,
    spent: 45000,
    status: 'Active',
    pulseStatus: 'HEALTHY',
    ownerId: 'manager-1',
    observers: ['Alice (Director)', 'Bob (VP Engineering)'],
    tasks: [
      { id: 't1', name: 'Schema Conversion', completed: true, assignee: 'Charlie' },
      { id: 't2', name: 'Data Migration', completed: false, assignee: 'Dave' },
      { id: 't3', name: 'Integration Testing', completed: false, assignee: 'Eve' }
    ],
    weeklyReports: [
      {
        id: 'r1',
        weekNumber: 12,
        timestamp: new Date().toISOString(),
        managerNotes: 'Successfully completed the schema conversion for the HR database. Testing phase begins next week.',
        aiAuditSummary: 'Velocity: On track. Schema conversion completed as planned. Accuracy: High. Pulse: HEALTHY.',
      }
    ]
  },
  {
    id: '2',
    name: 'Project Beta: AI Customer Support',
    goal: 'Implement Bedrock-powered chatbot for tier 1 customer support tickets.',
    description: 'Integrating a GenAI chatbot into our Zendesk support portal to handle common tier 1 inquiries and reduce human agent load by 30%.',
    deadline: '2026-06-15',
    budget: 85000,
    spent: 80000,
    status: 'At Risk',
    pulseStatus: 'WARNING',
    ownerId: 'manager-2',
    observers: ['Frank (VP Support)'],
    tasks: [
      { id: 't4', name: 'Zendesk API Integration', completed: false, assignee: 'Grace' },
      { id: 't5', name: 'Prompt Engineering', completed: true, assignee: 'Heidi' }
    ],
    weeklyReports: [
      {
        id: 'r2',
        weekNumber: 12,
        timestamp: new Date(Date.now() - 86400000 * 7).toISOString(),
        managerNotes: 'Integration with Zendesk is delayed due to API rate limits. Working with support to increase quotas.',
        aiAuditSummary: 'Velocity: Delayed. Zendesk integration blocked by API limits. Accuracy: Moderate. Pulse: WARNING.',
      }
    ]
  },
  {
    id: '3',
    name: 'Project Gamma: Mobile App V2',
    goal: 'Launch the completely redesigned mobile app with new authentication flow.',
    description: 'A ground-up rewrite of the iOS and Android applications using React Native, featuring a new biometric authentication flow.',
    deadline: '2026-04-01',
    budget: 200000,
    spent: 195000,
    status: 'Planning',
    pulseStatus: 'CRITICAL',
    ownerId: 'manager-3',
    observers: ['Ivan (CPO)'],
    tasks: [
      { id: 't6', name: 'Auth Flow Rewrite', completed: false, assignee: 'Judy' },
      { id: 't7', name: 'Security Audit', completed: false, assignee: 'Mallory' }
    ],
    weeklyReports: [
      {
        id: 'r3',
        weekNumber: 12,
        timestamp: new Date(Date.now() - 86400000 * 14).toISOString(),
        managerNotes: 'The new auth flow is failing security audits. We need to rewrite the token handling logic entirely. Launch will be delayed by at least 3 weeks.',
        aiAuditSummary: 'Velocity: Severely delayed. Security audit failure requires rewrite. Accuracy: Low. Pulse: CRITICAL.',
      }
    ]
  },
  {
    id: '4',
    name: 'Project Delta: Q1 Marketing Campaign',
    goal: 'Execute the Q1 digital marketing campaign across all major social channels.',
    description: 'A multi-channel marketing campaign targeting new enterprise customers in the EMEA region.',
    deadline: '2026-03-31',
    budget: 50000,
    spent: 50000,
    status: 'Completed',
    pulseStatus: 'HEALTHY',
    ownerId: 'manager-4',
    observers: ['Karen (CMO)'],
    tasks: [
      { id: 't8', name: 'Ad Copy Creation', completed: true, assignee: 'Leo' },
      { id: 't9', name: 'Campaign Launch', completed: true, assignee: 'Mia' }
    ],
    weeklyReports: []
  }
];
