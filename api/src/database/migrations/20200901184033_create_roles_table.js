module.exports = {

    up: function (knex) {
        return knex.schema.createTable('roles', table => {
            table.increments('role_id').primary();

            table.string('name').notNullable();
            table.string('key').notNullable();

            table.integer('active').notNullable().defaultTo(1);
            table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
            table.datetime('updated_at').notNullable().defaultTo(knex.fn.now());
            table.datetime('deleted_at');
        });
    },

    down: async function (knex) {
        return knex.schema.dropTable('roles');
    },

};
