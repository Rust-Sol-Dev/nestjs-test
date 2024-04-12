import { Test } from "@nestjs/testing";
import { CatsController } from "./cats.controller";
import { CatsService } from "./cats.service";
import { CatsRepository } from "./cats.repository";
import { Cat } from "./cats.entity";

describe("CatsController", () => {
  let catsController: CatsController;
  let catsService: CatsService;
  let catsRepository: CatsRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CatsController],
      providers: [CatsService, CatsRepository],
    }).compile();

    catsService = moduleRef.get<CatsService>(CatsService);
    catsController = moduleRef.get<CatsController>(CatsController);
    catsRepository = moduleRef.get<CatsRepository>(CatsRepository);
  });

  describe("findAll", () => {
    it("should return an array of cats", async () => {
      const result: Cat[] = [
        {
          id: 0,
          age: 2,
          breed: "Bombay",
          name: "Pixel",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      jest.spyOn(catsService, "findAll").mockImplementation(async () => result);

      expect(await catsController.findAll()).toBe(result);
    });
  });
});
