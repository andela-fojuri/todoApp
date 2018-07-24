import bcrypt from 'bcryptjs';

export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {});
  User.associate = (models) => {
    User.hasMany(models.Todo, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
  };

  const hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
  };

  User.beforeCreate((user) => {
    const hash = hashPassword(user.password);
    if (hash) {
      user.password = hash;
    }
  });

  User.beforeUpdate((user) => {
    const hash = hashPassword(user.password);
    if (hash) {
      user.password = hash;
    }
  });

  return User;
};
