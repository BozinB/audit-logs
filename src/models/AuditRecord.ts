import { Schema, model, Document } from 'mongoose';

export interface IAuditRecord extends Document {
  clientId: string;
  userId: string;
  recordId: string;
  domain: string;
  scope: string;
  operation: string;
  message: string;
  oldValue: any;
  newValue: any;
  date: Date;
}

const AuditRecordSchema = new Schema<IAuditRecord>({
  clientId: { type: String, required: true },
  userId: { type: String, required: true },
  recordId: { type: String, required: true },
  domain: { type: String, required: true },
  scope: { type: String, required: true },
  operation: { type: String, required: true },
  message: { type: String, required: true },
  oldValue: { type: Schema.Types.Mixed, default: null },
  newValue: { type: Schema.Types.Mixed, required: true },
  date: { type: Date, default: Date.now, index: true },
});

export const AuditRecord = model<IAuditRecord>('AuditRecord', AuditRecordSchema);
