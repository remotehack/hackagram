console.log('Hello from worker!');
import * as jose from 'jose';

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
	'Access-Control-Max-Age': '86400',
	Allow: 'GET, HEAD, POST, OPTIONS',
};

const config = {
	audience: 'https://hackergram.benfoxall.workers.dev',
	issuerBaseURL: 'https://dev-l2qhix4unqfdzpmz.uk.auth0.com/',
	tokenSigningAlg: 'RS256',
};

const JWKS = jose.createRemoteJWKSet(new URL('https://dev-l2qhix4unqfdzpmz.uk.auth0.com/.well-known/jwks.json'));

export default {
	async fetch(request, env, ctx) {
		console.log(jose);

		const auth = request.headers.get('Authorization');
		if (auth) {
			const jwt = auth.split(' ')[1];

			console.log('JTW', jwt);

			const { payload, protectedHeader } = await jose.jwtVerify(jwt, JWKS, {
				issuer: config.issuerBaseURL,
				audience: config.audience,
				algorithms: [config.tokenSigningAlg],
			});
			console.log(protectedHeader);
			console.log(payload);
		} else {
			console.log('no auth');
		}

		return new Response('Hello Hackers1!!', {
			headers: {
				...corsHeaders,
				'Access-Control-Allow-Headers': request.headers.get('Access-Control-Request-Headers'),
			},
		});
	},
};
