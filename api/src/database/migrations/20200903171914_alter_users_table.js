module.exports = {

    up: function (knex) {
        return knex.schema.alterTable('users', function (table) {
            table.string('password_reset_hash').after('salt');
            table.dateTime('password_reset_date').after('password_reset_hash');
            table.integer('request_password_change').defaultTo(0).after('password_reset_date');
            table.integer('canDelete').defaultTo(1).after('request_password_change');
        });
    },

    down: async function (knex) {
        return knex.schema.table('users', function (table) {
            table.dropColumn('password_reset_hash');
            table.dropColumn('password_reset_date');
            table.dropColumn('request_password_change');
            table.dropColumn('canDelete');
        });
    },

};
