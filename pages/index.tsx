import CreateForm from '@components/CreateForm'
import UrlsTable from '@components/UrlsTable.client'
import { Container, Stack } from '@mantine/core'
import { ShortUrl } from '@prisma/client'
import prisma from '@utils/prisma'
import { expired } from '@utils/utils'
import type { NextPage } from 'next'
import { GetServerSideProps } from 'next'

type Props = {
	recent: ShortUrl[]
	top: ShortUrl[]
}

const HomePage: NextPage<Props> = ({ recent, top }) => {
	return (
		<Container size="sm" my="xl">
			<Stack spacing="xl">
				<CreateForm />

				<UrlsTable title="top shurls" urls={top} visits />
				<UrlsTable title="recent shurls" urls={recent} />
			</Stack>
		</Container>
	)
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
	const top = await prisma.shortUrl.findMany({
		orderBy: {
			visits: 'desc',
		},
		where: {
			public: true,
		},
		take: 5,
	})

	const recent = await prisma.shortUrl.findMany({
		orderBy: {
			createdAt: 'desc',
		},
		where: {
			public: true,
		},
		take: 20 - top.length,
	})

	return {
		props: {
			recent: transform(recent),
			top: transform(top),
		},
	}
}

const transform = (a: ShortUrl[]) =>
	a.map(v => (v.password || expired(v) ? { ...v, url: '******', password: v.password ? '******' : null } : v))

export default HomePage
