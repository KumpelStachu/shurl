import CardWithTitle from '@components/CardWithTitle'
import UrlsTable from '@components/UrlsTable'
import { LoadingOverlay } from '@mantine/core'
import { createContext } from '@server/context'
import { appRouter } from '@server/routers/_app'
import { createSSGHelpers } from '@trpc/react/ssg'
import { trpc } from '@utils/trpc'
import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'

const TopPage: NextPage = () => {
	const query = trpc.useQuery(['shurl.top'])

	return (
		<CardWithTitle title="top shurls">
			<LoadingOverlay visible={query.status === 'loading'} />
			<Head>
				<title>top | shurl</title>
			</Head>

			<UrlsTable urls={query.data} withClicks />
		</CardWithTitle>
	)
}

// export const getStaticProps: GetStaticProps = async () => {
// 	const ssg = createSSGHelpers({
// 		router: appRouter,
// 		ctx: await createContext(),
// 	})

// 	await ssg.prefetchQuery('shurl.top')

// 	return {
// 		props: {
// 			trpcState: ssg.dehydrate(),
// 		},
// 		revalidate: 30,
// 	}
// }

export default TopPage
