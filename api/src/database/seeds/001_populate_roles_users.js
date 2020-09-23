
exports.seed = async function (knex) {

    // 1 - System Owner
    // 2 - Tenant Owner
    // 3 - Tenant Admin
    // 4 - Client Owner
    // 5 - Client Admin
    // 6 - Cast
    await knex('roles').insert([
        {
            name: 'System Owner',
            key: 'system-owner',
        },
        {
            name: 'Tenant Owner',
            key: 'tenant-owner',
        },
        {
            name: 'Tenant Admin',
            key: 'tenant-admin',
        },
        {
            name: 'Client Owner',
            key: 'client-owner',
        },
        {
            name: 'Client Admin',
            key: 'client-admin',
        },
        {
            name: 'Cast',
            key: 'cast',
        },
    ]);



    // 1 - System Owner
    // 2 - Tenant Owner
    // 3 - Tenant Admin
    // 4 - Client Owner
    // 5 - Client Admin
    // 6 - Cast
    await knex('users').insert([
        // 1 - System Owner
        {
            role_id: 1,
            name: 'Leandro Macedo System Owner',
            email: 'fmlimao@gmail.com',
            password: '$2b$10$Vl/VPcAGUwW0JzW4p3r5cegLmnrHaLiaCspb1r8408iAgXA3vAewW',
            salt: '$2b$10$Vl/VPcAGUwW0JzW4p3r5ce',
        },
        // 1 - System Owner
        {
            role_id: 1,
            name: 'Paolo Melo System Owner',
            email: 'paolorbmelo@gmail.com',
            password: '$2b$10$Vl/VPcAGUwW0JzW4p3r5cegLmnrHaLiaCspb1r8408iAgXA3vAewW',
            salt: '$2b$10$Vl/VPcAGUwW0JzW4p3r5ce',
        },
        // 2 - Tenant Owner
        {
            role_id: 2,
            name: 'Usuário Tenant Owner',
            email: 'usu.tenant.owner@email.com',
            password: '$2b$10$Vl/VPcAGUwW0JzW4p3r5cegLmnrHaLiaCspb1r8408iAgXA3vAewW',
            salt: '$2b$10$Vl/VPcAGUwW0JzW4p3r5ce',
        },
        // 3 - Tenant Admin
        {
            role_id: 3,
            name: 'Usuário Tenant Admin',
            email: 'usu.tenant.admin@email.com',
            password: '$2b$10$Vl/VPcAGUwW0JzW4p3r5cegLmnrHaLiaCspb1r8408iAgXA3vAewW',
            salt: '$2b$10$Vl/VPcAGUwW0JzW4p3r5ce',
        },
        // 6 - Cast
        {
            role_id: 6,
            name: 'Usuário Elenco 1',
            email: 'usu.cast.1@email.com',
            password: '$2b$10$Vl/VPcAGUwW0JzW4p3r5cegLmnrHaLiaCspb1r8408iAgXA3vAewW',
            salt: '$2b$10$Vl/VPcAGUwW0JzW4p3r5ce',
        },
        {
            role_id: 6,
            name: 'Usuário Elenco 2',
            email: 'usu.cast.2@email.com',
            password: '$2b$10$Vl/VPcAGUwW0JzW4p3r5cegLmnrHaLiaCspb1r8408iAgXA3vAewW',
            salt: '$2b$10$Vl/VPcAGUwW0JzW4p3r5ce',
        },
        {
            role_id: 6,
            name: 'Usuário Elenco 3',
            email: 'usu.cast.3@email.com',
            password: '$2b$10$Vl/VPcAGUwW0JzW4p3r5cegLmnrHaLiaCspb1r8408iAgXA3vAewW',
            salt: '$2b$10$Vl/VPcAGUwW0JzW4p3r5ce',
        },
    ]);



};
