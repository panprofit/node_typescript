const Sequelize = require('sequelize');

'use strict';
module.exports = (sequelize, DataTypes) => {
	const Token = sequelize.define(
		'Token',
		{
			userId: {
				type: DataTypes.INTEGER,
				references: {
          model: 'User',
          key: 'id'
				},
				primaryKey: true
			},
			uuid: {
		    type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV1
			}
		},
		{
			timestamps: false
		}
	);
	Token.associate = function(models) {
		// associations can be defined here
	};
	return Token;
};
