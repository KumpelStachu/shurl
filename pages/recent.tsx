import CardWithTitle from '@components/CardWithTitle'
import UrlsTable from '@components/UrlsTable'
import { LoadingOverlay } from '@mantine/core'
import { trpc } from '@utils/trpc'
import type { NextPage } from 'next'
import Head from 'next/head'

const RecentPage: NextPage = () => {
	const query = trpc.useQuery(['shurl.recent'])

	return (
		<CardWithTitle title="recent shurls">
			<LoadingOverlay visible={query.isLoading} />
			<Head>
				<title>recent | shurl</title>
			</Head>

			<UrlsTable urls={query.data} />
		</CardWithTitle>
	)
}

export default RecentPage
