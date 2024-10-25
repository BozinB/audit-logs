import { FastifyRequest, FastifyReply } from 'fastify';
import { ApiKeyRepository } from '../repositories/ApiKeyRepository';
import { randomBytes } from 'crypto';

export class AuthService {
  constructor(private apiKeyRepository: ApiKeyRepository) {}

  async authenticate(request: FastifyRequest): Promise<boolean> {
    const apiKey = request.headers['x-api-key'] as string;
    if (!apiKey) return false;

    const apiKeyRecord = await this.apiKeyRepository.findByApiKey(apiKey);
    return !!apiKeyRecord;
  }

  async createApiKey(domain: string): Promise<{ domain: string; apiKey: string }> {
    const apiKey = randomBytes(20).toString('hex');
    await this.apiKeyRepository.createApiKey({ domain, apiKey });
    return { domain, apiKey };
  }
}
