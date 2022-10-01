import { Anchor, ScrollArea, Table, Text, Tooltip, useMantineTheme } from '@mantine/core'
import { useForceUpdate, useInterval, useMediaQuery } from '@mantine/hooks'
import { NextLink } from '@mantine/next'
import { ShortUrl } from '@prisma/client'
import { expired, formatDate, formatDateRelative } from '@utils/utils'
import { useEffect, useMemo } from 'react'
import ClientOnly from './ClientOnly'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { IconLock } from '@tabler/icons'

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
	const small = useMediaQuery(theme.fn.smallerThan('xs').slice(7), false)
	const [animateRef] = useAutoAnimate<HTMLTableSectionElement>()

	useEffect(() => {
		interval.start()
		return interval.stop
	}, [interval])

	return (
		<ScrollArea
			type="auto"
			pb="xs"
			styles={{
				root: {
					'--radix-scroll-area-corner-height': 0,
				},
				scrollbar: {
					'&[data-orientation="vertical"]': {
						display: 'none',
					},
				},
				corner: {
					display: 'none',
				},
			}}
		>
			<Table
				highlightOnHover
				sx={{
					minWidth: 'max-content',
					whiteSpace: 'nowrap',
					'tr>:nth-of-type(2)': {
						textOverflow: 'ellipsis',
						overflow: 'hidden',
						maxWidth: 300,
						display: small ? 'none' : '',
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
				<tbody ref={animateRef}>
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
										position="top-start"
										transition="pop"
										withArrow
										withinPortal
										events={{ focus: false, hover: true, touch: true }}
									>
										<Text color="red" sx={{ cursor: 'not-allowed', width: 'min-content' }}>
											<IconLock size={16} />
											*****
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
											withinPortal
											events={{ focus: false, hover: true, touch: true }}
										>
											<Text sx={{ cursor: 'help' }}>
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
									withinPortal
									events={{ focus: false, hover: true, touch: true }}
								>
									<Text sx={{ cursor: 'help' }}>
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
