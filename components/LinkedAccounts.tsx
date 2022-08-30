import { Grid, LoadingOverlay } from '@mantine/core'
import { trpc } from '@utils/trpc'
import React from 'react'
import CardWithTitle from './CardWithTitle'
import LinkAccount from './LinkAccount'

export default function LinkedAccounts() {
	const { data, isLoading } = trpc.useQuery(['user.providers'])

	return (
		<CardWithTitle title="linked social accounts">
			<LoadingOverlay visible={isLoading} />

			<Grid align="center">
				<LinkAccount type="discord" color="#5865ED" isLinked={data?.includes('discord')} />
				<LinkAccount type="facebook" color="#3B5998" isLinked={data?.includes('facebook')} />
				<LinkAccount type="google" color="#EA4335" isLinked={data?.includes('google')} />
				<LinkAccount type="github" color="#1B1F22" isLinked={data?.includes('github')} />
				<LinkAccount type="reddit" color="#FF4500" isLinked={data?.includes('reddit')} />
				<LinkAccount type="spotify" color="#1DB954" isLinked={data?.includes('spotify')} disabled />
				<LinkAccount type="twitch" color="#9146FF" isLinked={data?.includes('twitch')} disabled />
				<LinkAccount type="twitter" color="#1DA1F2" isLinked={data?.includes('twitter')} disabled />
			</Grid>
		</CardWithTitle>
	)
}
