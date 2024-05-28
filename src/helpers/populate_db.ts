import sequelize from '../models/db';

import { User, Role, UserRole } from '../models';

const USERS = [
    {username: 'test2', email: 'test2@gmail.com', password: 'test123'},
]

const ROLES = [
    {name: 'moderator', can_moderate: true},
    {name: 'default', can_moderate: false}
]

async function populateDB() {
    console.log('Database is being populated');
    await sequelize.sync({ force: true });

    for (const r of ROLES) {
        await Role.create({ name: r.name, can_moderate: r.can_moderate });
    }

    for (const u of USERS) {
        await User.create({ username: u.username, email: u.email, password: u.password });
    }

    await UserRole.create({ user_id: 1, role_id: 1 });

    console.log('Database was populated');
}

populateDB();