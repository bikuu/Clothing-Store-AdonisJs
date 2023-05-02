import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "jobs";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").unique();
      table.integer("user_id").unsigned().references("id").inTable("users");
      table.string("title", 100).notNullable();
      table.string("posted_by", 100).notNullable();
      table.specificType("images", "text[]");
      table.specificType("categories", "text[]").notNullable();
      table.string("description").notNullable();
      table.string("price");
      table.json("location").notNullable();

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
