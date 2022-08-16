import UrlsTable from '@components/UrlsTable'
import { Card, LoadingOverlay, Title } from '@mantine/core'
import { appRouter } from '@server/routers/app'
import { createSSGHelpers } from '@trpc/react/ssg'
import { trpc } from '@utils/trpc'
import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'

const RecentPage: NextPage = () => {
	const query = trpc.useQuery(['shurl.recent'])

	return (
		<Card>
			<LoadingOverlay visible={query.status === 'loading'} />
			<Head>
				<title>recent | shurl</title>
			</Head>

			<Title order={2} mb="md">
				recent shurls
			</Title>
			<UrlsTable urls={query.data} />
		</Card>
	)
}

export const getStaticProps: GetStaticProps = async () => {
	const ssg = createSSGHelpers({
		router: appRouter,
		ctx: {},
	})

	await ssg.prefetchQuery('shurl.recent')

	return {
		props: {
			trpcState: ssg.dehydrate(),
		},
		revalidate: 600,
	}
}

export default RecentPage
