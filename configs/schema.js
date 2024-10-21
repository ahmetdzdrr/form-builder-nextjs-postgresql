const { text, serial } = require("drizzle-orm/pg-core");
const { pgTable } = require("drizzle-orm/pg-core");

export const JsonForms = pgTable('Forms', {
    id: serial('id').primaryKey(),
    jsonform: text('jsonform').notNull(),
});

export const Responses = pgTable('Responses', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    formValues: text('formValues').notNull(),
});