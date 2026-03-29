export type SubscriptionStatus = 'active' | 'inactive' | 'cancelled' | 'lapsed';
export type PlanType = 'monthly' | 'yearly';
export type DrawType = 'random' | 'algorithm';
export type PaymentStatus = 'pending' | 'paid' | 'rejected';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  subscription_status: SubscriptionStatus;
  plan_type: PlanType | null;
  renewal_date: string | null;
  charity_id: string | null;
  contribution_percentage: number;
  is_admin: boolean;
  created_at: string;
}

export interface Score {
  id: string;
  user_id: string;
  score: number;
  date: string;
  created_at: string;
}

export interface Draw {
  id: string;
  numbers: number[];
  type: DrawType;
  result_date: string;
  published: boolean;
  jackpot_amount: number;
  total_pool: number;
  created_at: string;
}

export interface DrawResult {
  id: string;
  draw_id: string;
  user_id: string;
  matches: number;
  prize_amount: number;
  payment_status: PaymentStatus;
  proof_url: string | null;
  verified: boolean;
  created_at: string;
}

export interface Charity {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  featured: boolean;
  total_raised: number;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_type: PlanType;
  status: SubscriptionStatus;
  amount: number;
  charity_contribution: number;
  prize_pool_contribution: number;
  start_date: string;
  renewal_date: string;
  cancelled_at: string | null;
}