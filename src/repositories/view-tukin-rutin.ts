import { FindOptions } from "sequelize";
import { ViewTukinRutin } from "@/models";
import { sequelize } from "@/models";
import { BaseRepository } from "./base-repository";

export class ViewTukinRutinRepository extends BaseRepository<ViewTukinRutin> {
  constructor() {
    super(ViewTukinRutin);
  }

  async getRekap(options?: Omit<FindOptions<ViewTukinRutin>, "attributes">) {
    return await this.findOne({
      ...options,
      attributes: [
        [sequelize.fn("SUM", sequelize.col("netto")), "netto"],
        [sequelize.fn("SUM", sequelize.col("bruto")), "bruto"],
      ],
    });
  }
}
