import { RefPangkat } from "@/models";
import { BaseRepository } from "./base-repository";

export class RefPangkatRepository extends BaseRepository<RefPangkat> {
  constructor() {
    super(RefPangkat);
  }
}
