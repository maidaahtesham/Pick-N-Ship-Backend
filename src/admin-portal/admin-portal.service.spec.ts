import { Test, TestingModule } from '@nestjs/testing';
import { AdminPortalService } from './admin-portal.service';

describe('AdminPortalService', () => {
  let service: AdminPortalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminPortalService],
    }).compile();

    service = module.get<AdminPortalService>(AdminPortalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
