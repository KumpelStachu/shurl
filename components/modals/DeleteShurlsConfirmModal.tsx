import { Button, Group, LoadingOverlay } from '@mantine/core'
import { ContextModalProps } from '@mantine/modals'
import { ShortUrl } from '@prisma/client'
import { trpc } from '@utils/trpc'

export default function DeleteShurlsConfirmModal({ context, id }: ContextModalProps<ShortUrl>) {
	const { isLoading, mutate } = trpc.useMutation('user.deleteShurls', {
		onSuccess() {
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
