import { DateTime } from "luxon";
import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class JobsQuotation extends BaseModel {
  @column({ isPrimary: true })
  public id: number;
  @column()
  public maker_id: number;
  @column()
  public job_id: number;
  @column()
  public consumer_id: number;
  @column()
  public content: string;
  @column()
  public hiring_status: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
