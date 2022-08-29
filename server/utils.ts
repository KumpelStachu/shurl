import { nextAuthOptions } from '@pages/api/auth/[...nextauth]'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { unstable_getServerSession } from 'next-auth'

export const ssrAuth =
	(destination: string = '', auth: boolean = true) =>
	async (ctx: GetServerSidePropsContext) => {
		const session = await unstable_getServerSession(ctx.req, ctx.res, nextAuthOptions)

		return !session === auth
			? {
					redirect: {
						destination: destination || `/auth/signin?next=${ctx.req.url}`,
						permanent: false,
					},
			  }
			: { props: {} }
	}

export const getServerSideProps: GetServerSideProps = ssrAuth()
