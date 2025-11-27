import { Test, TestingModule } from '@nestjs/testing';
import { RiderController } from './rider.controller';

describe('RiderController', () => {
  let controller: RiderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RiderController],
      providers: [
        {
          provide: RiderController,
          useValue: {}, // Mock service, can add methods if needed
        },
      ],
    }).compile();

    controller = module.get<RiderController>(RiderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
