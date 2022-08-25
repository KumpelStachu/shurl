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
			<LoadingOverlay visible={query.status === 'loading'} />
			<Head>
				<title>recent | shurl</title>
			</Head>

			<UrlsTable urls={query.data} />
		</CardWithTitle>
	)
}

// export const getStaticProps: GetStaticProps = async () => {
// 	const ssg = createSSGHelpers({
// 		router: appRouter,
// 		ctx: await createContext(),
// 	})

// 	await ssg.prefetchQuery('shurl.recent')

// 	return {
// 		props: {
// 			trpcState: ssg.dehydrate(),
// 		},
// 		revalidate: 600,
// 	}
// }

export default RecentPage
