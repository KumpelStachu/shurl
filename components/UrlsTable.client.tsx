import { Card, createStyles, Table, Text, Title, Tooltip } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { NextLink } from '@mantine/next'
import { ShortUrl } from '@prisma/client'
import { expired, formatDate, formatDateRelative } from '@utils/utils'

type Props = {
	title: string
	urls: ShortUrl[]
	visits?: boolean
}

const useStyles = createStyles(theme => ({
	root: {
		maxWidth: theme.breakpoints.xs / 4,
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
	},
}))

export default function UrlsTable({ title, urls, visits }: Props) {
	const { classes, theme } = useStyles()
	const large = useMediaQuery(theme.fn.largerThan('xs').slice(7), false)

	return (
		<Card>
			<Title order={2} mb="md">
				{title}
			</Title>
			<Table>
				<thead>
					<tr>
						<th>alias</th>
						{large && <th>url</th>}
						{visits && <th>clicks</th>}
						<th>expires</th>
						<th>created</th>
					</tr>
				</thead>
				<tbody>
					{urls.map(url => (
						<tr key={url.alias}>
							<td className={classes.root}>
								<Text variant="link" component={NextLink} href={url.alias}>
									{url.alias}
								</Text>
							</td>
							{large && (
								<td className={classes.root}>
									{url.password || expired(url) ? (
										<Tooltip
											label={url.password ? 'password' : 'expired'}
											color="red"
											position="left"
											transition="pop"
											withArrow
										>
											<Text color="red">******</Text>
										</Tooltip>
									) : (
										<Text variant="link" component={NextLink} href={url.url}>
											{url.url}
										</Text>
									)}
								</td>
							)}
							{visits && <td>{url.visits}</td>}
							<td className={classes.root}>
								{url.expires ? (
									<Tooltip
										label={formatDate(url.expires)}
										color="dark"
										position="top-start"
										transition="pop-bottom-left"
										withArrow
									>
										<Text>{formatDateRelative(url.expires)}</Text>
									</Tooltip>
								) : (
									'never'
								)}
							</td>
							<td className={classes.root}>
								<Tooltip
									label={formatDate(url.createdAt)}
									color="dark"
									position="top-start"
									transition="pop-bottom-left"
									withArrow
								>
									<Text>{formatDateRelative(url.createdAt)}</Text>
								</Tooltip>
							</td>
						</tr>
					))}
				</tbody>
			</Table>
		</Card>
	)
}
