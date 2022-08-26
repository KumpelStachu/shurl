import { createStyles, Table, Text, Tooltip } from '@mantine/core'
import { useForceUpdate, useInterval, useMediaQuery } from '@mantine/hooks'
import { NextLink } from '@mantine/next'
import { ShortUrl } from '@prisma/client'
import { expired, formatDate, formatDateRelative } from '@utils/utils'
import { useEffect } from 'react'
import ClientOnly from './ClientOnly'

type Props = {
	urls?: ShortUrl[]
	withClicks?: boolean
}

const useStyles = createStyles(theme => ({
	grow: {
		// maxWidth: theme.breakpoints.xs / 4,
		// textOverflow: 'ellipsis',
		// whiteSpace: 'nowrap',
		// overflow: 'hidden',
	},
}))

export default function UrlsTable({ urls, withClicks }: Props) {
	const forceUpdate = useForceUpdate()
	const { classes, theme } = useStyles()
	const small = useMediaQuery(theme.fn.smallerThan('xs').slice(7), false)
	const interval = useInterval(forceUpdate, 1000)

	useEffect(() => {
		interval.start()
		return interval.stop
	}, [interval])

	return (
		<Table highlightOnHover striped>
			<thead>
				<tr>
					<th>alias</th>
					{!small && <th>url</th>}
					{withClicks && <th>clicks</th>}
					<th>expires</th>
					<th>created</th>
				</tr>
			</thead>

			<tbody>
				{urls?.map(url => (
					<tr key={url.alias}>
						<td className={classes.grow}>
							<Text variant="link" component={NextLink} href={url.alias}>
								{url.alias}
							</Text>
						</td>
						{!small && (
							<td className={classes.grow}>
								{url.url === '******' && (url.password || expired(url)) ? (
									<Tooltip
										label={url.password ? 'password' : 'expired'}
										color="red"
										position="left-start"
										transition="pop"
										withArrow
										events={{ focus: false, hover: true, touch: true }}
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
						{withClicks && <td>{url.visits}</td>}
						<td>
							{url.expires ? (
								<Tooltip
									label={formatDate(url.expires)}
									color="dark"
									position="top-start"
									transition="pop"
									withArrow
									events={{ focus: false, hover: true, touch: true }}
								>
									<Text>
										<ClientOnly>{formatDateRelative(url.expires)}</ClientOnly>
									</Text>
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
								transition="pop"
								withArrow
								events={{ focus: false, hover: true, touch: true }}
							>
								<Text>
									<ClientOnly>{formatDateRelative(url.createdAt)}</ClientOnly>
								</Text>
							</Tooltip>
						</td>
					</tr>
				))}
			</tbody>
		</Table>
	)
}
