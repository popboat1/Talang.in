import groupAnalyticsData from "../data/group_analytics_data.json";
import type { AnalyticsResult } from "../types/analytics";

export async function getGroupAnalytics(groupId: string): Promise<AnalyticsResult> {
  console.log("Loading analytics for group:", groupId);

  return groupAnalyticsData as AnalyticsResult;
}