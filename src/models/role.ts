import sequelize from './db/index';
import { DataTypes, Model } from 'sequelize';
import User from './user';


class Role extends Model {
    declare id: number;
    declare name: string;
    declare can_moderate: boolean;
};

Role.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(64),
            allowNull: false
        },
        can_moderate: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        }
    },
    { sequelize }
);

class UserRole extends Model {
    declare id: number;
    declare user_id: number;
    declare role_id: number;
}

UserRole.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id'
            }
        },
        role_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Role,
                key: 'id'
            }
        }
    },
    { sequelize }
);

export { Role, UserRole };