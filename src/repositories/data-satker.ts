import { DataSatker } from "@/models";
import { BaseRepository } from "./base-repository";

export class DataSatkerRepository extends BaseRepository<DataSatker> {
  constructor() {
    super(DataSatker);
  }
}
