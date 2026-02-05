import { DataUnitPegawai } from "@/models";
import { BaseRepository } from "./base-repository";

export class DataUnitPegawaiRepository extends BaseRepository<DataUnitPegawai> {
  constructor() {
    super(DataUnitPegawai);
  }
}
