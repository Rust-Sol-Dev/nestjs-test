import { Injectable, Logger } from "@nestjs/common";
import { CatsRepository } from "./cats.repository";
import { Cat } from "./cats.entity";
import { CreateCatDto } from "./dto/create-cat.dto";

@Injectable()
export class CatsService {
  private logger: Logger;

  constructor(private readonly catsRepository: CatsRepository) {
    this.logger = new Logger(CatsService.name);
  }

  async findById(id: number): Promise<Cat> {
    return this.catsRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<Cat[]> {
    return this.catsRepository.find();
  }

  async update(id: number, body: CreateCatDto): Promise<Cat> {
    await this.catsRepository.update(
      { id },
      this.catsRepository.create({ ...body })
    );

    return this.findById(id);
  }

  async create(body: CreateCatDto): Promise<Cat> {
    const catEntity: Partial<Cat> = {
      ...this.catsRepository.create(body),
    };

    const cat = await this.catsRepository.save(catEntity, { reload: false });

    return this.findById(cat.id);
  }

  async delete(id: number): Promise<Cat> {
    const cat = await this.findById(id);
    await this.catsRepository.delete(id);

    return cat;
  }
}
