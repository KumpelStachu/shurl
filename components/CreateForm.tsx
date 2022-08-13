import useAsync from '@hooks/useAsync'
import {
	ActionIcon,
	Button,
	Card,
	Checkbox,
	Group,
	LoadingOverlay,
	PasswordInput,
	Stack,
	Switch,
	Text,
	TextInput,
	Title,
	useMantineTheme,
} from '@mantine/core'
import { DatePicker, TimeInput } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { useMediaQuery } from '@mantine/hooks'
import { NextLink } from '@mantine/next'
import { showNotification } from '@mantine/notifications'
import { ShortUrl } from '@prisma/client'
import { IconArrowsShuffle } from '@tabler/icons'
import { randomAlias } from '@utils/utils'
import { useState } from 'react'
import superjson from 'superjson'

type Props = {
	onCreated(url: ShortUrl): void
}

export default function CreateForm({ onCreated }: Props) {
	const theme = useMantineTheme()
	const large = useMediaQuery(theme.fn.largerThan('xs').slice(7), false)
	const [loading, setLoading] = useState(false)
	const form = useForm({
		validateInputOnChange: true,
		initialValues: {
			url: '',
			alias: randomAlias(),
			public: true,
			usePassword: false,
			password: '',
			expires: null,
		},
		validate: {
			url(value) {
				try {
					new URL(value)
				} catch {
					return 'invalid url'
				}
			},
		},
	})

	function randomize() {
		form.setValues({ ...form.values, alias: randomAlias() })
	}

	async function handleSubmit({ usePassword, ...values }: typeof form.values) {
		setLoading(true)
		try {
			const res = await fetch('/api/create', {
				method: 'POST',
				body: superjson.stringify({
					...values,
					password: usePassword ? values.password : null,
				}),
			})
			if (res.status !== 200) throw await res.json()

			onCreated(values as ShortUrl)
			showNotification({
				color: 'green',
				title: 'created shurl',
				message: (
					<Text variant="link" component={NextLink} href={`/${values.alias}`}>
						{location.origin}/{values.alias}
					</Text>
				),
				autoClose: 10000,
			})
		} catch (error) {
			showNotification({
				color: 'red',
				title:
					{
						P2002: 'alias already exists',
					}[(error as any)?.code as string] ?? 'unknown error',
				message: `error ${(error as any)?.code}`,
				autoClose: 2000,
			})
		}
		setLoading(false)
	}

	return (
		<Card sx={{ position: 'relative' }}>
			<Title order={2} mb="md">
				create new shurl
			</Title>

			<LoadingOverlay visible={loading} />
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Stack spacing="xs">
					<TextInput required label="url" placeholder="https://shurl.ovh" {...form.getInputProps('url')} />

					<Group align="end" spacing="sm">
						<TextInput required sx={{ flex: 1 }} label="alias" {...form.getInputProps('alias')} />
						{large ? (
							<Button onClick={randomize} variant="light" rightIcon={<IconArrowsShuffle />}>
								randomize
							</Button>
						) : (
							<ActionIcon onClick={randomize} variant="light" color={theme.primaryColor} size="lg">
								<IconArrowsShuffle />
							</ActionIcon>
						)}
					</Group>

					<Group grow align="end" spacing="xs">
						<DatePicker
							excludeDate={date => new Date().getTime() > date.getTime()}
							label="expires"
							placeholder="never"
							clearable
							{...form.getInputProps('expires')}
						/>
						<TimeInput
							description={!form.values.expires && 'never'}
							disabled={!form.values.expires}
							{...form.getInputProps('expires')}
						/>
					</Group>

					{/* <Group align="end" spacing="xs">
						<Checkbox mb="xs" {...form.getInputProps('usePassword', { type: 'checkbox' })} />
						<PasswordInput
							sx={{ flex: 1 }}
							label="password"
							autoComplete="new-password"
							required={form.values.usePassword}
							disabled={!form.values.usePassword}
							{...form.getInputProps('password')}
						/>
					</Group> */}

					<Group mt="xs" position="apart" align="start">
						<Checkbox label="public" {...form.getInputProps('public', { type: 'checkbox' })} />
						<Button type="submit">create</Button>
					</Group>
				</Stack>
			</form>
		</Card>
	)
}
