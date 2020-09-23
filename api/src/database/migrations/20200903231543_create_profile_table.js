module.exports = {

    up: function (knex) {
        return knex.schema.createTable('profiles', table => {
            table.increments('profile_id').primary();

            table.integer('user_id');

            table.string('avatar');
            table.string('description');

            table.integer('active').notNullable().defaultTo(1);
            table.dateTime('created_at').notNullable().defaultTo(knex.fn.now());
            table.dateTime('updated_at').notNullable().defaultTo(knex.fn.now());
            table.dateTime('deleted_at');
        });
    },

    down: async function (knex) {
        return knex.schema.dropTable('profiles');
    },

};
