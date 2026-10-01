import { Test, TestingModule } from '@nestjs/testing';
import { PhdServiceController } from './phd-service.controller.js';
import { PhdServiceService } from './phd-service.service.js';

describe('PhdServiceController', () => {
  let phdServiceController: PhdServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PhdServiceController],
      providers: [PhdServiceService],
    }).compile();

    phdServiceController = app.get<PhdServiceController>(PhdServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(phdServiceController.getHello()).toBe('Hello World!');
    });
  });
});
