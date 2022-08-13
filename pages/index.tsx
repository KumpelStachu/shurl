import ClientOnly from '@components/ClientOnly'
import CreateForm from '@components/CreateForm'
import UrlsTable from '@components/UrlsTable.client'
import { Card, Container, Stack, Tabs } from '@mantine/core'
import { ShortUrl } from '@prisma/client'
import prisma from '@utils/prisma'
import { expired } from '@utils/utils'
import type { NextPage } from 'next'
import { GetServerSideProps } from 'next'
import { useState } from 'react'

type Props = {
	recent: ShortUrl[]
	top: ShortUrl[]
}

const HomePage: NextPage<Props> = ({ recent: recentSSR, top }) => {
	const [recent, setRecent] = useState(recentSSR)

	return (
		<Container size="sm" my="xl">
			<Stack spacing="xl">
				<CreateForm onCreated={url => setRecent(prev => [url, ...prev])} />

				<ClientOnly>
					<UrlsTable title="top shurls" urls={top} visits />
					<UrlsTable title="recent shurls" urls={recent} />
				</ClientOnly>
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
		take: 25 - top.length,
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
