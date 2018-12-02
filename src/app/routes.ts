import AuthController from './auth/auth.controller';
import ProfileController from './profile/profile.controller';
import ContactsController from './contacts/contacts.controller';
import UsersController from './users/users.controller';

export class Routes {
	public routes(app): void {
		app.route('/contacts').get(ContactsController.getContacts);

		app.route('/contacts').post(ContactsController.createContact);

		app.route('/contacts/:identify').put(ContactsController.updateContact);

		app.route('/contacts/:identify').get(ContactsController.getContact);

		app.route('/contacts/:identify').delete(ContactsController.removeContact);

		app.route('/users').get(UsersController.getUsers);

		app.route('/signup').post(AuthController.signup);

		app.route('/login').post(AuthController.login);

		app.route('/logout').post(AuthController.logout);

		app.route('/profile').get(AuthController.guard, ProfileController.getProfile);

		app.route('/profile/change-password').post(AuthController.guard, ProfileController.changePassword);
	}
}
