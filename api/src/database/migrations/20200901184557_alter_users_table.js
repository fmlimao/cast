module.exports = {

    up: function (knex) {
        return knex.schema.alterTable('users', function (table) {
            table.integer('role_id').defaultTo(0).after('user_id');
        });
    },

    down: async function (knex) {
        return knex.schema.table('users', function (table) {
            table.dropColumn('role_id');
        });
    },

};
