import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { User } from '@prisma/client'
import { prisma } from '@server/prisma'
import { verify } from 'argon2'
import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import DiscordProvider from 'next-auth/providers/discord'
import EmailProvider from 'next-auth/providers/email'
import FacebookProvider from 'next-auth/providers/facebook'
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import RedditProvider from 'next-auth/providers/reddit'

export const nextAuthOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma),
	providers: [
		RedditProvider({
			clientId: process.env.REDDIT_CLIENT_ID,
			clientSecret: process.env.REDDIT_CLIENT_SECRET,
			authorization: {
				params: {
					duration: 'permanent',
				},
			},
			profile(profile) {
				return {
					id: profile.id,
					name: profile.name,
					email: null,
					image: profile.icon_img.split('?')?.[0] ?? null,
				}
			},
		}),
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		}),
		GitHubProvider({
			clientId: process.env.GITHUB_ID,
			clientSecret: process.env.GITHUB_SECRET,
		}),
		FacebookProvider({
			clientId: process.env.FACEBOOK_CLIENT_ID,
			clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
		}),
		DiscordProvider({
			clientId: process.env.DISCORD_CLIENT_ID,
			clientSecret: process.env.DISCORD_CLIENT_SECRET,
		}),
		EmailProvider({
			server: {
				host: process.env.EMAIL_SERVER_HOST,
				port: process.env.EMAIL_SERVER_PORT,
				auth: {
					user: process.env.EMAIL_SERVER_USER,
					pass: process.env.EMAIL_SERVER_PASSWORD,
				},
			},
			from: process.env.EMAIL_FROM,
		}),
		CredentialsProvider({
			credentials: {
				username: { label: 'username' },
				password: { label: 'password' },
			},
			async authorize(credentials) {
				if (!credentials?.username || !credentials?.password) return null

				const account = await prisma.account.findFirst({
					where: {
						provider: 'credentials',
						OR: [{ user: { email: credentials.username } }, { providerAccountId: credentials.username }],
					},
					select: {
						user: true,
						access_token: true,
					},
				})

				if (!account?.access_token) return null
				if (await verify(account.access_token, credentials.password)) return account.user

				return null
			},
		}),
	],
	callbacks: {
		session({ session, user }) {
			session.user = user as User
			return session
		},
	},
	pages: {
		newUser: '/auth/signup',
		signIn: '/auth/signin',
	},
	secret: process.env.NEXTAUTH_SECRET,
	// debug: true,
}

export default NextAuth(nextAuthOptions)
