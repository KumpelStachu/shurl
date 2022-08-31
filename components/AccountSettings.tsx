import useSession from '@hooks/useSession'
import {
	Avatar,
	Button,
	Divider,
	Group,
	HoverCard,
	LoadingOverlay,
	Stack,
	Text,
	TextInput,
} from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { useShallowEffect } from '@mantine/hooks'
import { showNotification } from '@mantine/notifications'
import { IconEye } from '@tabler/icons'
import { inferMutationInput, trpc } from '@utils/trpc'
import deepEqual from 'deep-equal'
import { z } from 'zod'
import CardWithTitle from './CardWithTitle'

export default function AccountSettings() {
	const { session, status, invalidate } = useSession<true>()
	const create = trpc.useMutation('user.updateAccount', {
		onSuccess() {
			invalidate()
			showNotification({
				title: 'success',
				message: 'account settings updated successfuly',
				color: 'green',
			})
		},
		onError(error) {
			showNotification({
				color: 'red',
				title: error.message,
				message: `error ${error.data?.code}`,
				autoClose: 2000,
			})
		},
	})
	const form = useForm<inferMutationInput<'user.updateAccount'>>({
		validateInputOnChange: true,
		initialValues: {
			email: '',
			name: '',
			image: '',
		},
		validate: zodResolver(
			z.object({
				email: z
					.string()
					.refine(s => s === (session?.user.email ?? ''), { message: 'email is required' })
					.or(z.string().email({ message: 'invalid email' })),
				name: z.string().min(1, { message: 'name is required' }),
				image: z.string().url({ message: 'invalid url' }).or(z.literal('')),
			})
		),
	})

	useShallowEffect(() => {
		if (!session?.user) return
		form.setValues({
			email: session.user.email ?? '',
			image: session.user.image ?? '',
			name: session.user.name!,
		})
	}, [session?.user])

	return (
		<CardWithTitle title="account settings">
			<LoadingOverlay visible={status === 'loading' || create.isLoading} />

			<form onSubmit={form.onSubmit(v => create.mutate(v))}>
				<Stack spacing="xs">
					<TextInput
						required
						type="text"
						label="username"
						placeholder={session?.user.name}
						{...form.getInputProps('name')}
					/>

					<TextInput
						required={!!session?.user.email}
						type="email"
						label="email"
						placeholder={session?.user.email}
						{...form.getInputProps('email')}
					/>

					<Group spacing="xs" align="end">
						<TextInput
							sx={{ flex: 1 }}
							type="url"
							label="image url"
							placeholder={session?.user.image ?? 'https://cdn.discordapp.com/avatars/642753383668645899.png'}
							{...form.getInputProps('image')}
						/>
						<HoverCard shadow="md" position="top-end" closeDelay={500} withinPortal>
							<HoverCard.Target>
								<Button variant="light" leftIcon={<IconEye size={18} />}>
									preview
								</Button>
							</HoverCard.Target>
							<HoverCard.Dropdown>
								<Group>
									<Stack spacing="xs">
										<Avatar src={session?.user.image} size={128} />
										<Text align="center" weight="bold">
											old
										</Text>
									</Stack>
									<Divider orientation="vertical" my="-sm" />
									<Stack spacing="xs">
										<Avatar src={form.values.image} size={128} color="primary" />
										<Text align="center" weight="bold">
											new
										</Text>
									</Stack>
								</Group>
							</HoverCard.Dropdown>
						</HoverCard>
					</Group>

					<Group mt="xs" position="right">
						<Button
							variant="default"
							onClick={() =>
								form.setValues({
									email: session?.user.email ?? '',
									image: session?.user.image ?? '',
									name: session?.user.name!,
								})
							}
						>
							reset values
						</Button>
						<Button
							type="submit"
							disabled={
								status === 'loading' ||
								deepEqual(
									{
										email: session?.user.email ?? '',
										image: session?.user.image ?? '',
										name: session?.user.name,
									},
									form.values
								)
							}
						>
							update
						</Button>
					</Group>
				</Stack>
			</form>
		</CardWithTitle>
	)
}
