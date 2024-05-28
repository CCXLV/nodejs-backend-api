import bcrypt from 'bcrypt';

import sequelize from './db/index';
import { DataTypes, Model } from 'sequelize';

import { Role, UserRole } from './role';
import { UserData } from '../utils/interfaces';


class User extends Model {
    declare id: number;
    declare username: string;
    declare email: string;
    declare password: string;
    declare Roles?: Role[];

    static async getUserData(userId: number): Promise<UserData | null> {
        try {
            const user = await User.findByPk(userId, {
                include: Role
            });
            if (user) {
                const userData = {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    roles: user.Roles?.map(role => ({
                        name: role.name,
                        can_moderate: role.can_moderate
                    }))
                }
                
                return userData
            } else {    
                return null;
            }

        } catch (error) {
            return null;
        }
    }

    static async isAdmin(userId: number) {
        try {
            const user = await User.findByPk(userId, {
                include: Role
            });
            if (user) {
                return user.Roles?.some(role => role.name === 'moderator') === true;
            } else {    
                return null;
            }

        } catch (error) {
            return null;
        }
    }
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING(32),
            unique: true,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING(64),
            allowNull: false
        }
    },
    { 
        sequelize,
        hooks: {
            beforeCreate: async (user: User) => {
                const hashedPassword = await bcrypt.hash(user.password, 10);
                user.password = hashedPassword;
            }
        }
    }
);

User.belongsToMany(Role, { through: UserRole, foreignKey: 'user_id' });
Role.belongsToMany(User, { through: UserRole, foreignKey: 'role_id' });

export default User;