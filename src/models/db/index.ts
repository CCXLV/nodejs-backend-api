import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.db',
    logging: false
});

(async () => {
    await sequelize.sync();
    console.log('Models synchronized with the database');
})();

export default sequelize;