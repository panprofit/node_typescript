import { Response } from 'express';
import RequestWithUser from '../common/interfaces/request-with-user.interface';
import CatchAsync from '../common/decorators/catch-async.decorator';

class ProfileController {
	constructor() {}

	@CatchAsync
	async getProfile(req: RequestWithUser, res: Response): Promise<void> {
		if (req.user) {
			const { username, email } = req.user.toJSON();
			res.json({
				error: false,
				username,
				email
			});
		}
	}

	@CatchAsync
	async changePassword(req: RequestWithUser, res: Response): Promise<void> {
		const { oldPassword, newPassword } = req.body;
		if (req.user) {
			const { password } = req.user.toJSON();
			if (password !== oldPassword) {
				res.json({
					error: true,
					message: 'Old password incorrect'
				});
			} else if (password === newPassword) {
				res.json({
					error: true,
					message: 'New Password can not be same as Old password'
				});
			} else {
				await req.user.updateAttributes({ password: newPassword });
				res.json({
					error: false,
					message: 'Password successfully updated'
				});
			}
		}
	}
}

export default new ProfileController();
