export type TenderStatus = 'new' | 'parsed' | 'failed';

export interface Tender {
  id: string;
  source: string;
  externalId: string;
  title: string;
  authority?: string;
  city?: string;
  amountEstimate?: number;
  naceCode?: string;
  deadline?: Date;
  documentUrl?: string;
  documentPath?: string;
  documentHash?: string;
  metadata: Record<string, unknown>;
  status: TenderStatus;
  createdAt: Date;
}