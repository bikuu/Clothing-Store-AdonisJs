import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "jobs";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").unique();
      table.integer("userId");
      table.string("title", 100).notNullable();
      table.string("images");
      table.string("categories", 80).notNullable();
      table.string("description").notNullable();
      table.string("price");
      table.integer("bid");
      table
        .enu("hiring_status", ["pending", "interviewing", "hired", "declined"])
        .defaultTo("pending");
      table.timestamp("created_at", { useTz: true });
      table.timestamp("updated_at", { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
