import { DataCetak } from "@/models";
import { BaseRepository } from "./base-repository";

export class DataCetakRepository extends BaseRepository<DataCetak> {
  constructor() {
    super(DataCetak);
  }
}
