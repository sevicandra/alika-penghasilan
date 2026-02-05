import { FindOptions } from "sequelize";
import { ViewGaji } from "@/models";
import { sequelize } from "@/models";
import { BaseRepository } from "./base-repository";

export class ViewGajiRepository extends BaseRepository<ViewGaji> {
  constructor() {
    super(ViewGaji);
  }

  async getRekap(options?: Omit<FindOptions<ViewGaji>, "attributes">) {
    return await this.findOne({
      ...options,
      attributes: [
        [sequelize.fn("SUM", sequelize.col("netto")), "netto"],
        [sequelize.fn("SUM", sequelize.col("bruto")), "bruto"],
      ],
    });
  }
}
