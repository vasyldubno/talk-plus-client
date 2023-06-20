/* eslint-disable no-param-reassign */
import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

interface ICredentials {
	userId: string
	accessToken: string
}

const authOptions: NextAuthOptions = {
	session: {
		strategy: 'jwt',
		maxAge: 30 * 24 * 60 * 60,
		updateAge: 0,
	},
	providers: [
		CredentialsProvider({
			type: 'credentials',
			credentials: {},
			async authorize(credentials, req) {
				const { userId, accessToken } = credentials as ICredentials

				return { id: userId, name: accessToken }
			},
		}),
	],
	pages: {
		signIn: '/login',
	},
	callbacks: {
		session(params) {
			params.session.user.id = params.token.sub
			return params.session
		},
	},
}

export default NextAuth(authOptions)
