import {
	ActionIcon,
	Button,
	Card,
	Checkbox,
	Group,
	LoadingOverlay,
	Stack,
	Text,
	TextInput,
	Title,
	useMantineTheme,
} from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { useMediaQuery } from '@mantine/hooks'
import { NextLink } from '@mantine/next'
import { showNotification } from '@mantine/notifications'
import { IconAlphabetLatin, IconArrowsShuffle, IconCalendar, IconMoodHappy } from '@tabler/icons'
import { randomAlias } from '@utils/utils'
import dayjs from 'dayjs'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import superjson from 'superjson'

const HomePage: NextPage = () => {
	const theme = useMantineTheme()
	const large = useMediaQuery(theme.fn.largerThan('xs').slice(7), false)
	const [loading, setLoading] = useState(false)
	const [emoji, setEmoji] = useState(false)

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
			alias: value => decodeURI(value).includes('/'),
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
		form.setValues({ ...form.values, alias: randomAlias(emoji) })
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

			showNotification({
				color: 'green',
				title: 'created shurl',
				message: (
					<Text variant="link" component={NextLink} href={`/${values.alias}`}>
						{location.origin}/{values.alias}
					</Text>
				),
				autoClose: 5000,
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
		<>
			<Head>
				<title>create | shurl</title>
			</Head>
			<Card sx={{ position: 'relative' }}>
				<Title order={2} mb="md">
					create new shurl
				</Title>

				<LoadingOverlay visible={loading} />
				<form onSubmit={form.onSubmit(handleSubmit)}>
					<Stack spacing="xs">
						<TextInput required label="url" placeholder="https://shurl.ovh" {...form.getInputProps('url')} />

						<Group align="end" spacing="xs">
							<TextInput
								sx={{ flex: 1 }}
								label="alias"
								placeholder="random alias"
								{...form.getInputProps('alias')}
							/>
							<Button
								onClick={randomize}
								variant="light"
								rightIcon={<IconArrowsShuffle />}
								px="sm"
								styles={{
									rightIcon: {
										marginLeft: large ? undefined : 0,
									},
								}}
								aria-label="randomize"
							>
								{large && 'randomize'}
							</Button>
							<ActionIcon
								onClick={() => setEmoji(e => !e)}
								aria-label="randomize"
								size="lg"
								color=""
								variant="light"
								sx={{ marginLeft: -theme.spacing.xs / 2 }}
							>
								{emoji ? <IconMoodHappy /> : <IconAlphabetLatin />}
							</ActionIcon>
						</Group>

						{/* <Group grow align="end" spacing="xs"> */}
						<DatePicker
							icon={<IconCalendar size={20} />}
							excludeDate={date => dayjs(date).isBefore(new Date())}
							label="expires"
							placeholder="never"
							clearable
							{...form.getInputProps('expires')}
						/>
						{/* <TimeInput
							icon={<IconClock size={20} />}
							description={!form.values.expiresDate && 'never'}
							disabled={!form.values.expiresDate}
							withSeconds
							{...form.getInputProps('expiresTime')}
						/> */}
						{/* </Group> */}

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
		</>
	)
}

export default HomePage
