import type { GetServerSideProps, NextPage } from 'next'
import { prisma } from '@utils/prisma'
import { expired } from '@utils/utils'

const RedirectPage: NextPage = () => {
	return null
}

export const getServerSideProps: GetServerSideProps = async ctx => {
	const found = await prisma.shortUrl.findUnique({
		where: {
			alias: ctx.query.alias as string,
		},
	})

	if (!found)
		return {
			redirect: {
				destination: '/?error=notfound',
				permanent: true,
			},
		}

	await prisma.shortUrl.update({
		data: {
			visits: {
				increment: 1,
			},
		},
		where: {
			id: found.id,
		},
	})

	return {
		redirect: {
			destination: expired(found) ? '/?error=expired' : found.url,
			permanent: true,
		},
	}
}

export default RedirectPage
