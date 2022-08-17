import { Card, TypographyStylesProvider } from '@mantine/core'
import { readFileSync } from 'fs'
import { marked } from 'marked'
import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import { join } from 'path'

type Props = {
	content: string
}

const TodoPage: NextPage<Props> = ({ content }) => {
	return (
		<Card>
			<Head>
				<title>todo | shurl</title>
			</Head>
			<TypographyStylesProvider>
				<div
					dangerouslySetInnerHTML={{
						__html: content,
					}}
				/>
			</TypographyStylesProvider>
		</Card>
	)
}

export const getStaticProps: GetStaticProps<Props> = async () => {
	const todo = readFileSync(join(process.cwd(), 'TODO.md'))

	return {
		props: {
			content: marked(todo.toString()),
		},
	}
}

export default TodoPage
