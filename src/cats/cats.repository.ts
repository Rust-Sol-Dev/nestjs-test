import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Cat } from "./cats.entity";

@Injectable()
export class CatsRepository extends Repository<Cat> {
  constructor(private readonly dataSource: DataSource) {
    super(Cat, dataSource.manager);
  }
}
