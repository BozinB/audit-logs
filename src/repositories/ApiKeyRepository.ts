import { ApiKey, IApiKey } from '../models/ApiKey';

export class ApiKeyRepository {
  async findByApiKey(apiKey: string): Promise<IApiKey | null> {
    return await ApiKey.findOne({ apiKey });
  }

  async createApiKey(data: { domain: string; apiKey: string }): Promise<IApiKey> {
    return await ApiKey.create(data);
  }
}
