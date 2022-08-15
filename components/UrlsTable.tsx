import { Card, createStyles, Table, Text, Title, Tooltip } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { NextLink } from '@mantine/next'
import { ShortUrl } from '@prisma/client'
import { expired, formatDate, formatDateRelative } from '@utils/utils'

type Props = {
	title: string
	urls: ShortUrl[]
}

const useStyles = createStyles(theme => ({
	grow: {
		maxWidth: theme.breakpoints.xs / 4,
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
	},
	shrink: {
		maxWidth: theme.breakpoints.xs / 4,
		width: '1%',
		whiteSpace: 'nowrap',
	},
	clicks: {
		width: '1%',
		textAlign: 'right',
	},
}))

export default function UrlsTable({ title, urls }: Props) {
	const { classes, theme } = useStyles()
	const small = useMediaQuery(theme.fn.smallerThan('xs').slice(7), false)

	return (
		<Card>
			<Title order={2} mb="md">
				{title}
			</Title>

			<Table>
				<thead>
					<tr>
						<th>alias</th>
						{!small && <th>url</th>}
						<th className={classes.shrink}>clicks</th>
						<th className={classes.shrink}>expires</th>
						<th className={classes.shrink}>created</th>
					</tr>
				</thead>

				<tbody>
					{urls.map(url => (
						<tr key={url.alias}>
							<td className={classes.grow}>
								<Text variant="link" component={NextLink} href={url.alias}>
									{url.alias}
								</Text>
							</td>
							{!small && (
								<td className={classes.grow}>
									{url.password || expired(url) ? (
										<Tooltip
											label={url.password ? 'password' : 'expired'}
											color="red"
											position="left-start"
											transition="pop"
											withArrow
										>
											<Text color="red" sx={{ cursor: 'not-allowed', width: 'min-content' }}>
												******
											</Text>
										</Tooltip>
									) : (
										<Text variant="link" component={NextLink} href={url.url}>
											{url.url}
										</Text>
									)}
								</td>
							)}
							<td className={classes.clicks}>{url.visits}</td>
							<td>
								{url.expires ? (
									<Tooltip
										label={formatDate(url.expires)}
										color="dark"
										position="top-start"
										transition="pop-bottom-left"
										withArrow
									>
										<Text className={classes.shrink}>{formatDateRelative(url.expires)}</Text>
									</Tooltip>
								) : (
									'never'
								)}
							</td>
							<td>
								<Tooltip
									label={formatDate(url.createdAt)}
									color="dark"
									position="top-start"
									transition="pop-bottom-left"
									withArrow
								>
									<Text className={classes.shrink}>{formatDateRelative(url.createdAt)}</Text>
								</Tooltip>
							</td>
						</tr>
					))}
				</tbody>
			</Table>
		</Card>
	)
}
