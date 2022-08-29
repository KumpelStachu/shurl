import CardWithTitle from '@components/CardWithTitle'
import UrlsTable from '@components/UrlsTable'
import { LoadingOverlay } from '@mantine/core'
import { trpc } from '@utils/trpc'
import type { NextPage } from 'next'
import Head from 'next/head'

const TopPage: NextPage = () => {
	const query = trpc.useQuery(['shurl.top'])

	return (
		<CardWithTitle title="top shurls">
			<LoadingOverlay visible={query.isLoading} />
			<Head>
				<title>top | shurl</title>
			</Head>

			<UrlsTable urls={query.data} withClicks />
		</CardWithTitle>
	)
}

export default TopPage
