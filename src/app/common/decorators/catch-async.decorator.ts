function CatchAsync(target, key, descriptor) {
	const originalMethod = descriptor.value;

	descriptor.value = async function(...args) {
		try {
			return await originalMethod.apply(this, args);
		} catch (error) {
			const [req, res] = args;
			console.warn(error.message || error);
			res.json({
				error: true,
				error_message: error.message || error
			});
		}
	};

	return descriptor;
}

export default CatchAsync;
