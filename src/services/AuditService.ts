import { AuditRepository } from '../repositories/AuditRepository';

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

export class AuditService {
  constructor(private auditRepository: AuditRepository) {}

  async getAuditRecords(options: IAuditSearchOptions) {
    console.log('tuka 111111111111 --------------------------------')
    if (options.startDate && options.endDate) {
      const start = new Date(options.startDate);
      const end = new Date(options.endDate);
      const diffInMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
      if (diffInMonths > 3) {
        throw new Error('Search period cannot exceed 3 months.');
      }
    }
    
    console.log('tuka 222222222222222222 --------------------------------')
    // Fetch records and total from the repository
    const { result, total } = await this.auditRepository.findWithFilters(options);
    console.log('tuka 3333333333333333333333 --------------------------------')

    // Calculate the max number of pages
    const maxPages = Math.ceil(total / options.limit);

    // Ensure the current page does not exceed max pages
    const currentPage = Math.min(options.page, maxPages);

    // Return the results, current page, and total pages
    return {
      result,
      currentPage,
      maxPages,
      totalRecords: total
    };
  }

  async createAuditRecord(record: any) {
    return await this.auditRepository.create(record);
  }
}
