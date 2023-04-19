import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Job extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number;
  @column()
  public title: string;
  @column()
  public images: string;
  @column()
  public categories: string;
  @column()
  public description: string;
  @column()
  public bid: string;
  @column()
  public price: number;
  @column()
  public hiring_status: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
