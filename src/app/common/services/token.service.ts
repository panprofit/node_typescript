const Sequelize = require('sequelize');
const model = require('../../../models/index');

class TokenService {
	constructor () {}

	async setToken(userId: string): Promise<string> {
		const [token, created] = await model.Token.findOrCreate({where: {userId}});
		if (!created) {
			token.uuid = Sequelize.Utils.generateUUID();
			await token.save()
		}
		return token.uuid;
	}

	async getUserIdByToken(uuid: string): Promise<string> {
		const token = await model.Token.findOne({where: {uuid}});
		return token? token.userId: null;
	}


	async removeToken(userId: string): Promise<string> {
		const token = await model.Token.findOne({where: {userId}});
		if (token) {
			token.destroy();
		}
		return token.uuid;
	}

}

export default new TokenService()