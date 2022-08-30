import { Anchor, ScrollArea, Table, Text, Tooltip, useMantineTheme } from '@mantine/core'
import { useForceUpdate, useInterval, useMediaQuery } from '@mantine/hooks'
import { NextLink } from '@mantine/next'
import { ShortUrl } from '@prisma/client'
import { expired, formatDate, formatDateRelative } from '@utils/utils'
import { useEffect, useMemo } from 'react'
import ClientOnly from './ClientOnly'

type Props = {
	urls?: ShortUrl[]
	withVisits?: true
	withExpires?: true
	actions?(shurl: ShortUrl): React.ReactNode
}

export default function UrlsTable({ urls, withVisits, withExpires, actions }: Props) {
	const forceUpdate = useForceUpdate()
	const theme = useMantineTheme()
	const interval = useInterval(forceUpdate, 1000)
	const showExpires = useMemo(() => withExpires || !!urls?.some(v => v.expires !== null), [withExpires, urls])

	useEffect(() => {
		interval.start()
		return interval.stop
	}, [interval])

	return (
		<ScrollArea type="auto" pb="xs">
			<Table
				highlightOnHover
				sx={{
					minWidth: 'max-content',
					whiteSpace: 'nowrap',
					'tr>:nth-of-type(2)': {
						textOverflow: 'ellipsis',
						overflow: 'hidden',
						maxWidth: 500,
					},
					'tbody>tr:hover>.actions': {
						backgroundColor: theme.fn.themeColor(theme.colorScheme === 'dark' ? 'dark.5' : 'gray.1'),
					},
					'.actions': {
						backgroundColor: theme.colorScheme === 'dark' ? theme.fn.themeColor('dark.6') : 'white',
						position: 'sticky',
						right: 0, //small ? -48 : 0,
					},
				}}
			>
				<thead>
					<tr>
						<th>alias</th>
						<th>url</th>
						{withVisits && <th>visits</th>}
						{showExpires && <th>expires</th>}
						<th>created</th>
						{actions && <th className="actions">actions</th>}
					</tr>
				</thead>
				<tbody>
					{urls?.map(url => (
						<tr key={url.alias}>
							<td>
								<Anchor component={NextLink} href={`/${url.alias}`}>
									{url.alias}
								</Anchor>
							</td>
							<td>
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
									<Anchor component={NextLink} href={url.url}>
										{url.url}
									</Anchor>
								)}
							</td>
							{withVisits && <td>{url.visits}</td>}
							{showExpires && (
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
							)}
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
							{actions && <td className="actions">{actions(url)}</td>}
						</tr>
					))}
				</tbody>
			</Table>
		</ScrollArea>
	)
}
