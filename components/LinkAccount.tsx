import { Button, Grid, LoadingOverlay, Text, useMantineTheme } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconLink, IconUnlink } from '@tabler/icons'
import { trpc } from '@utils/trpc'
import { s } from '@utils/utils'
import { signIn } from 'next-auth/react'

type Props = {
	type: string
	color: `#${string}`
	isLinked?: boolean
	disabled?: boolean
}

export default function LinkAccount({ type, color, isLinked, disabled }: Props) {
	const theme = useMantineTheme()
	const large = useMediaQuery(theme.fn.largerThan('xs').slice(7), true)
	const utils = trpc.useContext()
	const unlink = trpc.useMutation('user.unlinkAccount', {
		onSuccess() {
			utils.invalidateQueries('user.providers')
		},
	})

	if (disabled) return null

	return (
		<>
			<LoadingOverlay visible={unlink.isLoading} />

			<Grid.Col span={4} xs={3}>
				<Text weight="bold" align="right" size="xl">
					{type}
				</Text>
			</Grid.Col>
			{(large || !isLinked) && (
				<Grid.Col span={8} xs={isLinked ? 4 : 5}>
					<Button
						sx={s([color])}
						onClick={() => signIn(type)}
						fullWidth
						disabled={isLinked || disabled}
						leftIcon={<IconLink size={18} />}
					>
						{isLinked ? 'linked' : 'link'}
					</Button>
				</Grid.Col>
			)}
			{(large || isLinked) && (
				<Grid.Col span={8} xs={isLinked ? 5 : 4}>
					<Button
						color="red"
						onClick={() => unlink.mutate(type)}
						fullWidth
						disabled={!isLinked || disabled}
						leftIcon={<IconUnlink size={18} />}
					>
						{isLinked ? 'unlink' : 'not linked'}
					</Button>
				</Grid.Col>
			)}
		</>
	)
}
