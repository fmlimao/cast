exports.seed = async function (knex) {

  await knex('profiles').insert([
      {
          user_id: 5,
      },
      {
          user_id: 6,
      },
      {
          user_id: 7,
      },
  ]);

};
