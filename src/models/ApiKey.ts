import { Schema, model, Document } from 'mongoose';

export interface IApiKey extends Document {
  domain: string;
  apiKey: string;
}

const ApiKeySchema = new Schema<IApiKey>({
  domain: { type: String, required: true, unique: true },
  apiKey: { type: String, required: true },
});

export const ApiKey = model<IApiKey>('ApiKey', ApiKeySchema);
