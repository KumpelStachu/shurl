import UrlsTable from '@components/UrlsTable'
import type { ShortUrl } from '@prisma/client'
import { prisma } from '@utils/prisma'
import { transformShurls } from '@utils/utils'
import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'

type Props = {
	shurls: ShortUrl[]
}

const RecentPage: NextPage<Props> = ({ shurls }) => {
	return (
		<>
			<Head>
				<title>recent | shurl</title>
			</Head>
			<UrlsTable title="recent shurls" urls={shurls} />
		</>
	)
}

export const getStaticProps: GetStaticProps<Props> = async () => {
	const recent = await prisma.shortUrl.findMany({
		orderBy: {
			createdAt: 'desc',
		},
		where: {
			public: true,
		},
		take: 15,
	})

	return {
		props: {
			shurls: transformShurls(recent),
		},
		revalidate: 300,
	}
}

export default RecentPage
