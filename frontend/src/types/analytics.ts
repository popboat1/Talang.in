export type HealthScore = {
  score: number;
  label: string;
};

export type Insight = {
  type: string;
  severity: string;
  message: string;
};

export type Recommendation = {
  type: string;
  message: string;
};

export type SpendingByCategory = {
  category: string;
  total: number;
};

export type SpendingByMember = {
  member_id: string;
  name: string;
  total_paid: number;
};

export type PaymentCount = {
  member_id: string;
  name: string;
  payment_count: number;
};

export type WeeklyTrend = {
  date: string;
  total: number;
};

export type AnalyticsResult = {
  summary: {
    total_spending: number;
    total_transactions: number;
  };
  health_score: HealthScore;
  insights: Insight[];
  recommendations: Recommendation[];
  charts: {
    spending_by_category: SpendingByCategory[];
    spending_by_member: SpendingByMember[];
    payment_count: PaymentCount[];
    weekly_trend: WeeklyTrend[];
  };
};