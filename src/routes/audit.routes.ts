import { AuditController } from '../controllers/audit.controller';
import { AuditService } from '../services/AuditService';
import { AuditRepository } from '../repositories/AuditRepository';
import { AuthService } from '../services/AuthService';
import { ApiKeyRepository } from '../repositories/ApiKeyRepository';

export async function auditRoutes(fastify: any) {
  const auditRepository = new AuditRepository();
  const apiKeyRepository = new ApiKeyRepository();
  const auditService = new AuditService(auditRepository);
  const authService = new AuthService(apiKeyRepository);
  const auditController = new AuditController(auditService, authService);

  fastify.get(
  '/audits',
  {
    schema: {
      description: 'Get audit logs with pagination and filtering',
      tags: ['Audit Logs'],
      summary: 'Fetch audit logs',
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'string', description: 'Page number (default: 1)' },
          limit: { type: 'string', description: 'Limit per page (default: 100)' },
          clientId: { type: 'string', description: 'Client ID' },
          userId: { type: 'string', description: 'User ID' },
          recordId: { type: 'string', description: 'Record ID' },
          domain: { type: 'string', description: 'Domain name' },
          operation: { type: 'string', description: 'Operation performed' },
          scope: { type: 'string', description: 'Scope of the operation' },
          startDate: { type: 'string', format: 'date-time', description: 'Start date in ISO format' },
          endDate: { type: 'string', format: 'date-time', description: 'End date in ISO format' },
        },
        required: [], // Add required query parameters if needed
      },
    },
  },
  auditController.getAuditRecords.bind(auditController)
);

  fastify.post('/audits', {
      schema: {
        description: 'Create a new audit record',
        tags: ['Audit'],
        security: [{ ApiKeyAuth: [] }], // Add x-api-key security
        body: {
          type: 'object',
          required: ['clientId', 'userId', 'recordId', 'domain', 'operation', 'scope', 'newValue'],
          properties: {
            clientId: { 
              type: 'string',
              default: 'client-123'  // Default value for clientId
            },
            userId: { 
              type: 'string',
              default: 'user-456'  // Default value for userId
            },
            recordId: { 
              type: 'string',
              default: 'record-789'  // Default value for recordId
            },
            domain: { 
              type: 'string',
              default: 'example.com'  // Default value for domain
            },
            operation: { 
              type: 'string',
              default: 'POST'  // Default value for operation
            },
            scope: { 
              type: 'string',
              default: '444'  // Default value for scope
            },
            message: { 
              type: 'string',
              default: 'Audit log created'  // Default value for message
            },
            oldValue: { 
              type: 'object',
              nullable: true,
              default: null  // Default value for oldValue
            },
            newValue: { 
              type: 'object',
              default: { "field": "new value" }  // Default value for newValue
            },
          },
        },
        response: {
          201: {
            description: 'Audit record created successfully',
            type: 'object',
            properties: {
              clientId: { type: 'string' },
              userId: { type: 'string' },
              recordId: { type: 'string' },
              domain: { type: 'string' },
              operation: { type: 'string' },
              scope: { type: 'string' },
              date: { type: 'string', format: 'date-time' }
            }
          }
        }
      },
      handler: auditController.createAuditRecord.bind(auditController)
    });
  fastify.post('/api-key', auditController.createApiKey.bind(auditController));
}
