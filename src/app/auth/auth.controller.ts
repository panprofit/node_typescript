import { Request, Response, NextFunction } from 'express';
import IRequestWithUser from '../common/interfaces/request-with-user.interface';
import TokenService from '../common/services/token.service';
import CatchAsync from '../common/decorators/catch-async.decorator';
const model = require('../../models/index');

class AuthController {
	constructor() {}

	@CatchAsync
	async login(req: Request, res: Response): Promise<void> {
		const { username, password } = req.body;
		const user = await model.User.findOne({ where: { username, password } });
		let token;
		if (user) {
			const { id, email } = user.toJSON();
			token = await TokenService.setToken(id);
			res.json({
				error: false,
				username,
				email,
				token
			});
		} else {
			res.json({
				error: true,
				message: 'Wrong credentials!'
			});
		}
	}

	@CatchAsync
	async logout(req: Request, res: Response): Promise<void> {
		const token = req.get('X-Token');
		const id = await TokenService.getUserIdByToken(token);
		if (id) {
			await TokenService.removeToken(id);
			res.status(302);
		}
		res.end();
	}

	@CatchAsync
	async signup(req: Request, res: Response): Promise<void> {
		const { username, email, password } = req.body;
		const user = await model.User.findOne({ where: { $or: [{ username }, { email }] } });
		if (user) {
			res.json({
				error: true,
				message: 'User is already exist'
			});
		} else {
			await model.User.create({ username, email, password });
			res.json({
				error: false,
				message: 'User successfully created',
				username,
				email
			});
		}
	}

	@CatchAsync
	async guard(req: IRequestWithUser, res: Response, next: NextFunction): Promise<void> {
		const token = req.get('X-Token');
		const id = await TokenService.getUserIdByToken(token);
		if (!id) {
			res.status(302).end();
		} else {
			req.user = await model.User.findOne({ where: { id } });
			if (!req.user) {
				res.json({
					error: true,
					message: 'Wrong credentials!'
				});
			} else {
				next();
			}
		}
	}
}

export default new AuthController();
