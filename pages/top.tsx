import UrlsTable from '@components/UrlsTable'
import type { ShortUrl } from '@prisma/client'
import { prisma } from '@utils/prisma'
import { transformShurls } from '@utils/utils'
import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'

type Props = {
	shurls: ShortUrl[]
}

const TopPage: NextPage<Props> = ({ shurls }) => {
	return (
		<>
			<Head>
				<title>top | shurl</title>
			</Head>
			<UrlsTable title="top shurls" urls={shurls} withClicks />
		</>
	)
}

export const getStaticProps: GetStaticProps<Props> = async () => {
	const top = await prisma.shortUrl.findMany({
		orderBy: {
			visits: 'desc',
		},
		where: {
			public: true,
		},
		take: 10,
	})

	return {
		props: {
			shurls: transformShurls(top),
		},
		revalidate: 15,
	}
}

export default TopPage
