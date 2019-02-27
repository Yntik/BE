const auth0_Options = {
	expressJwtSecret: {
		cache: true,
		rateLimit: true,
		jwksRequestsPerMinute: 5,
		jwksUri: 'https://clockware.eu.auth0.com/.well-known/jwks.json'
	},
	audience: 'https://bc33edb6.ngrok.io/',
	issuer: 'https://clockware.eu.auth0.com/',
	algorithms: ['RS256']
};

module.exports = auth0_Options;