import useSession from '@hooks/useSession'
import { Avatar, Button, Menu } from '@mantine/core'
import { useElementSize } from '@mantine/hooks'
import { NextLink } from '@mantine/next'
import { IconLogin, IconLogout, IconNotes, IconUser, IconUserPlus } from '@tabler/icons'
import { signOut } from 'next-auth/react'

export default function NavbarUser() {
	const { session, status } = useSession()
	const { ref, width } = useElementSize()

	return (
		<Menu
			width={session ? 200 : 150}
			position="bottom-end"
			transition="pop-top-right"
			withinPortal
			withArrow
			shadow="md"
			offset={10}
			styles={{
				arrow: {
					right: `${width / 2 + 6}px !important`,
				},
			}}
		>
			<Menu.Target>
				<Button
					ref={ref}
					variant="light"
					px="xs"
					loading={status === 'loading'}
					styles={{
						leftIcon: {
							width: 24,
							justifyContent: 'center',
							marginInline: 0,
						},
					}}
				>
					{status !== 'loading' && <IconUser />}
				</Button>
			</Menu.Target>
			{session ? (
				<Menu.Dropdown>
					<Menu.Label mt="xs">
						<Avatar src={session.user.image} size={100} mx="auto" color="primary" />
					</Menu.Label>
					<Menu.Label sx={{ overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'center' }}>
						{session.user.name}
					</Menu.Label>

					<Menu.Divider />

					<Menu.Item component={NextLink} href="/account" icon={<IconUser size={18} />}>
						my account
					</Menu.Item>
					<Menu.Item component={NextLink} href="/account/shurls" icon={<IconNotes size={18} />}>
						my shurls
					</Menu.Item>

					<Menu.Divider />

					<Menu.Item onClick={() => signOut()} icon={<IconLogout size={18} />}>
						sign out
					</Menu.Item>
				</Menu.Dropdown>
			) : (
				<Menu.Dropdown>
					<Menu.Label>not logged in</Menu.Label>

					<Menu.Divider />

					<Menu.Item component={NextLink} href="/auth/signin" icon={<IconLogin size={18} />}>
						sign in
					</Menu.Item>
					<Menu.Item component={NextLink} href="/auth/signup" icon={<IconUserPlus size={18} />}>
						sign up
					</Menu.Item>
				</Menu.Dropdown>
			)}
		</Menu>
	)
}
