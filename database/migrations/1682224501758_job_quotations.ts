import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "jobs_quotations";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").primary().unique();

      table.integer("maker_id").unsigned().references("id").inTable("users");
      table.integer("consumer_id").unsigned().references("id").inTable("users");
      table.integer("job_id").unsigned().references("id").inTable("jobs");
      table.string("content").notNullable();
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
