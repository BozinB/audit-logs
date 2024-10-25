import { FastifyReply, FastifyRequest } from 'fastify';
import { AuditService } from '../services/AuditService';
import { z } from 'zod';
import { AuthService } from '../services/AuthService';
import { AuditRecordSchema } from '../schemas/audit.schema';

// Validation schema for query parameters
const AuditQuerySchema = z.object({
  page: z.string().optional().default("1"), // Default to page 1
  limit: z.string().optional().default("100"), // Default limit is 100
  clientId: z.string().optional(),
  userId: z.string().optional(),
  recordId: z.string().optional(),
  domain: z.string().optional(),
  operation: z.string().optional(),
  scope: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export class AuditController {
  constructor(
    private auditService: AuditService,
    private authService: AuthService
  ) {}

  // Common method to authenticate the request
  private async authenticateRequest(request: FastifyRequest, reply: FastifyReply): Promise<boolean> {
    const isAuthenticated = await this.authService.authenticate(request);
    if (!isAuthenticated) {
      reply.status(401).send({ message: 'Unauthorized' });
      return false;
    }
    return true;
  }

  // Common method to handle errors
  private handleValidationError(reply: FastifyReply, error: any) {
    reply.status(400).send({ message: 'Invalid request parameters', errors: error.errors });
  }

  private handleServiceError(reply: FastifyReply, error: any) {
    reply.status(400).send({ message: error.message || 'An error occurred' });
  }

  async createAuditRecord(request: FastifyRequest, reply: FastifyReply) {
    if (!(await this.authenticateRequest(request, reply))) return;

    const parseResult = AuditRecordSchema.safeParse(request.body);
    if (!parseResult.success) {
      console.log(parseResult.error)
      return reply.status(400).send(parseResult.error);
    }

    const record = await this.auditService.createAuditRecord(
      parseResult.data as any
    );
    return reply.status(201).send(record);
  }

  // GET audit records with pagination, filtering, and validation
  async getAuditRecords(request: FastifyRequest, reply: FastifyReply) {
    if (!(await this.authenticateRequest(request, reply))) return;

    // Parse and validate query parameters using Zod
    const query = AuditQuerySchema.safeParse(request.query);
    if (!query.success) {
      return this.handleValidationError(reply, query.error);
    }

    try {
      // Fetch records from the service layer
      const records = await this.auditService.getAuditRecords({
        page: parseInt(query.data.page, 10),
        limit: parseInt(query.data.limit, 10),
        clientId: query.data.clientId,
        userId: query.data.userId,
        recordId: query.data.recordId,
        domain: query.data.domain,
        operation: query.data.operation,
        scope: query.data.scope,
        startDate: query.data.startDate,
        endDate: query.data.endDate,
      });

      return reply.send(records);
    } catch (error) {
      return this.handleServiceError(reply, error);
    }
  }

  // POST: Create API Key
  async createApiKey(request: FastifyRequest, reply: FastifyReply) {
    if (!(await this.authenticateRequest(request, reply))) return;

    const { domain } = request.body as { domain: string };
    if (!domain) {
      return reply.status(400).send({ message: 'Domain is required' });
    }

    try {
      const apiKeyData = await this.authService.createApiKey(domain);
      return reply.status(201).send(apiKeyData);
    } catch (error) {
      return this.handleServiceError(reply, error);
    }
  }
}
