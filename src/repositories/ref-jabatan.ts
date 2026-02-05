import { RefJabatan } from "@/models";
import { BaseRepository } from "./base-repository";

export class RefJabatanRepository extends BaseRepository<RefJabatan> {
  constructor() {
    super(RefJabatan);
  }
}
