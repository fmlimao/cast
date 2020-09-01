module.exports = {

    up: function (knex) {
        return knex.schema.createTable('users', table => {
            table.increments('user_id').primary();

            table.string('name').notNullable();
            table.string('email').notNullable();
            table.string('password').notNullable();
            table.string('salt').notNullable();

            table.integer('active').notNullable().defaultTo(1);
            table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
            table.datetime('updated_at').notNullable().defaultTo(knex.fn.now());
            table.datetime('deleted_at');
        });
    },

    down: async function (knex) {
        return knex.schema.dropTable('users');
    },

};
