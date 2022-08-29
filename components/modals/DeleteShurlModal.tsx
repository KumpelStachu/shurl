import { Anchor, Button, FocusTrap, Group, LoadingOverlay, Stack } from '@mantine/core'
import { ContextModalProps } from '@mantine/modals'
import { NextLink } from '@mantine/next'
import { ShortUrl } from '@prisma/client'
import { trpc } from '@utils/trpc'

export default function DeleteShurlModal({ context, id, innerProps: shurl }: ContextModalProps<ShortUrl>) {
	const utils = trpc.useContext()
	const deleteShurl = trpc.useMutation(['shurl.delete'], {
		onSuccess() {
			utils.refetchQueries(['user.shurls'])
			context.closeModal(id)
		},
	})

	return (
		<Stack>
			<LoadingOverlay visible={deleteShurl.isLoading} radius="md" />
			<Group>
				<Anchor component={NextLink} href={shurl.url}>
					{shurl.url}
				</Anchor>
			</Group>
			<Group position="right">
				<Button variant="default" data-autofocus onClick={() => context.closeModal(id)}>
					cancel
				</Button>
				<Button color="red" onClick={() => deleteShurl.mutate(shurl.id)}>
					delete
				</Button>
			</Group>
		</Stack>
	)
}
