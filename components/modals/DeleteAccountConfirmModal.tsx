import { Button, Group, LoadingOverlay } from '@mantine/core'
import { ContextModalProps } from '@mantine/modals'
import { ShortUrl } from '@prisma/client'
import { trpc } from '@utils/trpc'
import { signOut } from 'next-auth/react'

export default function DeleteAccountConfirmModal({ context, id }: ContextModalProps<ShortUrl>) {
	const { isLoading, mutate } = trpc.useMutation('user.deleteAccount', {
		onSuccess() {
			signOut()
			context.closeModal(id)
		},
	})

	return (
		<Group position="right">
			<LoadingOverlay visible={isLoading} radius="md" />
			<Button variant="default" data-autofocus onClick={() => context.closeModal(id)}>
				cancel
			</Button>
			<Button color="red" onClick={() => mutate()}>
				delete
			</Button>
		</Group>
	)
}
