import { Test, TestingModule } from '@nestjs/testing';
import { AdminPortalController } from './admin-portal.controller';

describe('AdminPortalController', () => {
  let controller: AdminPortalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminPortalController],
    }).compile();

    controller = module.get<AdminPortalController>(AdminPortalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
