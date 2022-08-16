import UrlsTable from '@components/UrlsTable'
import { Card, LoadingOverlay, Title } from '@mantine/core'
import { appRouter } from '@server/routers/app'
import { createSSGHelpers } from '@trpc/react/ssg'
import { trpc } from '@utils/trpc'
import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'

const TopPage: NextPage = () => {
	const query = trpc.useQuery(['shurl.top'])

	return (
		<Card>
			<LoadingOverlay visible={query.status === 'loading'} />
			<Head>
				<title>top | shurl</title>
			</Head>

			<Title order={2} mb="md">
				top shurls
			</Title>
			<UrlsTable urls={query.data} withClicks />
		</Card>
	)
}

export const getStaticProps: GetStaticProps = async () => {
	const ssg = createSSGHelpers({
		router: appRouter,
		ctx: {},
	})

	await ssg.prefetchQuery('shurl.top')

	return {
		props: {
			trpcState: ssg.dehydrate(),
		},
		revalidate: 30,
	}
}

export default TopPage
