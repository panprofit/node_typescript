'use strict';
module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define(
		'User',
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			username: { type: DataTypes.STRING, unique: true, allowNull: false },
			email: { type: DataTypes.STRING, unique: true, allowNull: false },
			password: { type: DataTypes.STRING, allowNull: false }
		},
		{
			timestamps: false
		}
	);
	User.associate = function(models) {
		// associations can be defined here
	};
	return User;
};
