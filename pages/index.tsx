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
import { trpc } from '@utils/trpc'
import { randomAlias } from '@utils/utils'
import dayjs from 'dayjs'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import superjson from 'superjson'

const HomePage: NextPage = () => {
	const theme = useMantineTheme()
	const large = useMediaQuery(theme.fn.largerThan('xs').slice(7), false)
	const [emoji, setEmoji] = useState(false)
	const create = trpc.useMutation(['shurl.create'], {
		onSuccess(values) {
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

	const form = useForm({
		validateInputOnChange: true,
		initialValues: {
			url: '',
			alias: randomAlias(),
			public: true,
			usePassword: false,
			password: '',
			expires: null as Date | null,
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

	return (
		<Card>
			<Head>
				<title>create | shurl</title>
			</Head>

			<Title order={2} mb="md">
				create new shurl
			</Title>

			<LoadingOverlay visible={create.status === 'loading'} />
			<form onSubmit={form.onSubmit(v => create.mutate(v))}>
				<Stack spacing="xs">
					<TextInput
						required
						type="url"
						label="url"
						placeholder="https://shurl.ovh"
						{...form.getInputProps('url')}
					/>

					<Group align="end" spacing="xs">
						<TextInput
							sx={{ flex: 1 }}
							label="alias"
							placeholder="random alias"
							{...form.getInputProps('alias')}
						/>
						<Button
							onClick={() => form.setFieldValue('alias', randomAlias(emoji))}
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
	)
}

export default HomePage
