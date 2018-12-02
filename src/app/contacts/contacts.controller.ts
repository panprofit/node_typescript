import { Request, Response } from 'express';
import CatchAsync from '../common/decorators/catch-async.decorator';
const model = require('../../models/index');

class ContactsController {
	constructor() {}

	@CatchAsync
	async getContacts(req: Request, res: Response): Promise<void> {
		const contacts = await model.Contact.findAll({});
		res.json({
			error: false,
			data: contacts
		});
	}

	@CatchAsync
	async getContact(req: Request, res: Response): Promise<void> {
		const { identify } = req.params;
		const contact = await model.Contact.findOne({ where: { identify } });
		if (!contact) {
			res.status(404).json({
				error: true,
				message: 'Contact is not found'
			});
		} else {
			const { name, identify } = contact.toJSON();
			res.json({
				error: false,
				identify,
				name
			});
		}
	}

	@CatchAsync
	async createContact(req: Request, res: Response): Promise<void> {
		const { identify, name } = req.body;
		const contact = await model.Contact.findOne({ where: { identify } });
		if (contact) {
			res.status(422).json({
				error: true,
				message: 'Contact is already created',
				identify
			});
		} else {
			await model.Contact.create({ identify, name });
			res.json({
				error: false,
				message: 'Contact successfully created',
				identify,
				name
			});
		}
	}

	@CatchAsync
	async updateContact(req: Request, res: Response): Promise<void> {
		const { identify } = req.params;
		const { name } = req.body;
		const contact = await model.Contact.findOne({ where: { identify } });
		if (!contact) {
			res.status(404).json({
				error: true,
				message: 'Contact is not found!'
			});
		} else {
			await contact.updateAttributes({ name });
			res.json({
				error: false,
				message: 'Contact successfully updated!',
				name
			});
		}
	}

	@CatchAsync
	async removeContact(req: Request, res: Response): Promise<void> {
		const { identify } = req.params;
		const contact = await model.Contact.findOne({ where: { identify } });
		if (!contact) {
			res.status(404).json({
				error: true,
				message: 'Contact is not found!'
			});
		} else {
			await contact.destroy();
			res.json({
				error: false,
				message: 'Contact removed successfully!'
			});
		}
	}
}

export default new ContactsController();
