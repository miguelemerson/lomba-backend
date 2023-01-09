export const configEnv = () => {
	return {
		NODE_ENV: process.env.NODE_ENV ? process.env.NODE_ENV : 'development',
		PORT: process.env.PORT ? process.env.PORT : 4000,
		MONGODB_URL: process.env.MONGODB_URL ? process.env.MONGODB_URL : '', 
		SECRET_KEY: process.env.SECRET_KEY ? process.env.SECRET_KEY : '',
		TOKEN_EXP: process.env.TOKEN_EXP ? process.env.TOKEN_EXP : 3600
	};
};