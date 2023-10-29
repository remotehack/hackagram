console.log('Hello from worker!');

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
	'Access-Control-Max-Age': '86400',
	Allow: 'GET, HEAD, POST, OPTIONS',
};

export default {
	async fetch(request, env, ctx) {
		let name = 'Hackers!';

		const auth = request.headers.get('Authorization');
		if (auth) {
			const response = await fetch('https://dev-l2qhix4unqfdzpmz.uk.auth0.com/userinfo', {
				method: 'GET',
				headers: {
					Authorization: auth,
				},
			});
			const user = await response.json();
			console.log(user);
			name = user.name;
		} else {
			console.log('no auth');
		}

		return new Response(`Hello ${name}!!`, {
			headers: {
				...corsHeaders,
				'Access-Control-Allow-Headers': request.headers.get('Access-Control-Request-Headers'),
			},
		});
	},
};
