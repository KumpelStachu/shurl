import { Button, Group, LoadingOverlay, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { IconAt } from '@tabler/icons'
import { signIn } from 'next-auth/react'
import { useState } from 'react'

type Props = {
	callbackUrl?: string
}

export default function EmailSignin({ callbackUrl }: Props) {
	const [state, setState] = useState(false)
	const form = useForm({
		initialValues: {
			email: '',
		},
	})

	async function handleSubmit({ email }: typeof form.values) {
		setState(true)
		const res = await signIn('email', {
			redirect: false,
			callbackUrl,
			email,
		})
		if (res?.ok) {
			showNotification({
				title: 'check your email',
				message: 'a sign in link has been sent',
			})
		} else {
			showNotification({
				color: 'red',
				title: 'error',
				message: res?.error,
			})
		}

		setState(false)
	}

	return (
		<form onSubmit={form.onSubmit(handleSubmit)}>
			<LoadingOverlay visible={state} />
			<Group align="end">
				<TextInput
					required
					sx={{ flex: 1 }}
					type="email"
					label="email"
					placeholder="email"
					icon={<IconAt size={20} />}
					{...form.getInputProps('email')}
				/>
				<Button type="submit">send email</Button>
			</Group>
		</form>
	)
}
