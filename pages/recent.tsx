import UrlsTable from '@components/UrlsTable'
import type { ShortUrl } from '@prisma/client'
import { prisma } from '@utils/prisma'
import { transformShurls } from '@utils/utils'
import type { GetStaticProps, NextPage } from 'next'

type Props = {
	shurls: ShortUrl[]
}

const RecentPage: NextPage<Props> = ({ shurls }) => {
	return <UrlsTable title="recent shurls" urls={shurls} />
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
	}
}

export default RecentPage
