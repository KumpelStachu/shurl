import { Card, Title, TitleOrder } from '@mantine/core'

type Props = {
	title: string
	order?: TitleOrder
	children: React.ReactNode
}

export default function CardWithTitle({ title, order = 2, children }: Props) {
	return (
		<Card shadow="md">
			<Title order={order} mb="sm">
				{title}
			</Title>
			{children}
		</Card>
	)
}
