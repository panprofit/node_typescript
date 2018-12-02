import { Request, Response } from 'express';
import CatchAsync from '../common/decorators/catch-async.decorator';
const model = require('../../models/index');

class UsersController {
	constructor() {}

	@CatchAsync
	async getUsers(req: Request, res: Response): Promise<void> {
		const users = await model.User.findAll({});
		res.json({
			error: false,
			data: users
		});
	}
}

export default new UsersController();
