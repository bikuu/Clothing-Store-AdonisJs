import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "workfolios";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").unique();
      table.integer("user_id").unsigned().references("id").inTable("users");
      table.string("skill", 100).notNullable();
      table.json("images");
      table.json("categories").notNullable();
      table.string("description").notNullable();
      table.string("experience");
      table.integer("price");
      table.timestamp("created_at", { useTz: true });
      table.timestamp("updated_at", { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
