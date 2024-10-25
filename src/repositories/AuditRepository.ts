import { AuditRecord, IAuditRecord } from '../models/AuditRecord';

interface IAuditSearchOptions {
  page: number;
  limit: number;
  clientId?: string;
  userId?: string;
  recordId?: string;
  domain?: string;
  operation?: string;
  scope?: string;
  startDate?: string;
  endDate?: string;
}

export class AuditRepository {
  async findWithFilters(options: IAuditSearchOptions): Promise<{ result: IAuditRecord[], total: number }> {
    const { page, limit, clientId, userId, recordId, operation, domain, scope, startDate, endDate } = options;

    const filters: any = {};

    // Apply filters based on search query parameters
    if (clientId) filters.clientId = clientId;
    if (userId) filters.userId = userId;
    if (recordId) filters.recordId = recordId;
    if (domain) filters.domain = domain;
    if (operation) filters.operation = operation;
    if (scope) filters.scope = scope;

    // Date range filter
    if (startDate && endDate) {
      filters.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    // Get total number of matching records
    const total = await AuditRecord.countDocuments(filters);

    // Calculate max pages
    const maxPages = Math.max(Math.ceil(total / limit), 1); 

    const currentPage = Math.min(Math.max(page, 1), maxPages);

    // Select only necessary fields for the result to optimize performance
    const result = await AuditRecord.find(filters)
      .select('clientId userId recordId domain operation scope message date') // Limit the fields returned
      .sort({ date: -1 }) // Sort by date in descending order
      .skip((currentPage - 1) * limit) // Apply pagination
      .limit(limit) // Limit the results per page
      .lean(); // Return plain JavaScript objects

    return { result, total };
  }

  async create(record: IAuditRecord): Promise<IAuditRecord> {
    return await AuditRecord.create(record);
  }

  async findAll(): Promise<IAuditRecord[]> {
    return await AuditRecord.find().lean();
  }
}
