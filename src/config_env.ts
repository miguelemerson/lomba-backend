export const configEnv = () => {
	return {
		NODE_ENV: process.env.NODE_ENV ? process.env.NODE_ENV : 'development',
		PORT: process.env.PORT ? process.env.PORT : 4000,
		MONGODB_URL: process.env.MONGODB_URL ? process.env.MONGODB_URL : '' 
	};
};