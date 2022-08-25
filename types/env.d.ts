declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: 'development' | 'production' | 'test'
			VERCEL?: '1'
			TZ?: string

			DATABASE_URL: string
			NEXTAUTH_URL: string
			NEXTAUTH_SECRET: string
			EMAIL_SERVER_USER: string
			EMAIL_SERVER_PASSWORD: string
			EMAIL_SERVER_HOST: string
			EMAIL_SERVER_PORT: string
			EMAIL_FROM: string
			DISCORD_CLIENT_ID: string
			DISCORD_CLIENT_SECRET: string
			FACEBOOK_CLIENT_ID: string
			FACEBOOK_CLIENT_SECRET: string
			GITHUB_ID: string
			GITHUB_SECRET: string
			GOOGLE_CLIENT_ID: string
			GOOGLE_CLIENT_SECRET: string
			REDDIT_CLIENT_ID: string
			REDDIT_CLIENT_SECRET: string
		}
	}
}

export {}
