export type CampaignStatus = 'active' | 'inactive' | 'deleted';

export interface Campaign {
  _id: string;
  name: string;
  description: string;
  status: CampaignStatus;
  leads: string[];
  accountIDs: string[];
}