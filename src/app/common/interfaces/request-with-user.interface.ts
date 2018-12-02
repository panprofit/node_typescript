import { Request } from 'express';

interface IRequestWithUser extends Request {
	get(arg: string): any;
	user: any;
}

export default IRequestWithUser;