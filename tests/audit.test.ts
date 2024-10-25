import { AuditService } from '../src/services/AuditService';
import { AuditRepository } from '../src/repositories/AuditRepository';

test('AuditService should create an audit record', async () => {
  const auditRepository = new AuditRepository();
  auditRepository.create = jest.fn().mockResolvedValue({ id: '1' });

  const auditService = new AuditService(auditRepository as any);
  const record = await auditService.createAuditRecord({} as any);

  expect(record).toEqual({ id: '1' });
  expect(auditRepository.create).toHaveBeenCalledTimes(1);
});
