import AccountSettings from '@components/AccountSettings'
import LinkedAccounts from '@components/LinkedAccounts'
import { Button, Card, Divider, SimpleGrid, Stack } from '@mantine/core'
import { openContextModal } from '@mantine/modals'
import { IconNotesOff, IconUnlink, IconUserOff } from '@tabler/icons'
import type { NextPage } from 'next'
import Head from 'next/head'

const AccountPage: NextPage = () => {
	return (
		<Stack>
			<Head>
				<title>account | shurl</title>
			</Head>

			<AccountSettings />
			<LinkedAccounts />

			<Divider color="red" size="sm" label="danger zone" labelProps={{ size: 'lg' }} labelPosition="center" />
			<Card shadow="md" id="delete">
				<SimpleGrid
					cols={3}
					breakpoints={[
						{ maxWidth: 'xs', cols: 1 },
						{ maxWidth: 'sm', cols: 2 },
					]}
				>
					<Button
						color="red"
						variant="light"
						leftIcon={<IconUnlink size={18} />}
						onClick={() =>
							openContextModal({
								modal: 'unlinkShurlsConfirm',
								title: 'unlink shurls',
								centered: true,
								innerProps: {},
							})
						}
					>
						unlink shurls
					</Button>
					<Button
						color="red"
						variant="light"
						leftIcon={<IconNotesOff size={18} />}
						onClick={() =>
							openContextModal({
								modal: 'deleteShurlsConfirm',
								title: 'delete shurls',
								centered: true,
								innerProps: {},
							})
						}
					>
						delete shurls
					</Button>
					<Button
						color="red"
						variant="light"
						leftIcon={<IconUserOff size={18} />}
						onClick={() =>
							openContextModal({
								modal: 'deleteAccountConfirm',
								title: 'delete account',
								centered: true,
								innerProps: {},
							})
						}
					>
						delete account
					</Button>
				</SimpleGrid>
			</Card>
		</Stack>
	)
}

export { getServerSideProps } from '@server/utils'

export default AccountPage
