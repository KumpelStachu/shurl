import CardWithTitle from '@components/CardWithTitle'
import UrlsTable from '@components/UrlsTable'
import {
	ActionIcon,
	Button,
	Checkbox,
	Group,
	LoadingOverlay,
	PasswordInput,
	Stack,
	Text,
	TextInput,
	useMantineTheme,
} from '@mantine/core'
import { DatePicker, TimeInput } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { useDisclosure, useLocalStorage, useMediaQuery } from '@mantine/hooks'
import { NextLink } from '@mantine/next'
import { showNotification } from '@mantine/notifications'
import { ShortUrl } from '@prisma/client'
import { IconAlphabetLatin, IconArrowsShuffle, IconCalendar, IconClock, IconMoodHappy } from '@tabler/icons'
import { trpc } from '@utils/trpc'
import { isValidUrl, mergeDateTime, randomAlias } from '@utils/utils'
import dayjs from 'dayjs'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect } from 'react'
import superjson from 'superjson'

const HomePage: NextPage = () => {
	const [recentLocal, setRecentLocal] = useLocalStorage<ShortUrl[]>({
		key: 'RECENT_SHURLS',
		deserialize: v => superjson.parse(v ?? '[]'),
		serialize: v => (console.log(v), superjson.stringify(v)),
	})
	const theme = useMantineTheme()
	const large = useMediaQuery(theme.fn.largerThan('xs').slice(7), false)
	const [emoji, { toggle }] = useDisclosure(false)
	const create = trpc.useMutation(['shurl.create'], {
		onSuccess(data) {
			form.reset()
			setRecentLocal(prev => [data, ...prev])
			showNotification({
				color: 'green',
				title: 'created shurl',
				message: (
					<Text variant="link" component={NextLink} href={`/${data.alias}`}>
						{location.origin}/{data.alias}
					</Text>
				),
				autoClose: 5000,
			})
		},
		onError(error) {
			console.table(error)
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
			expiresDate: null as Date | null,
			expiresTime: null as Date | null,
		},
		validate: {
			alias: value => decodeURI(value).includes('/'),
			url: value => !isValidUrl(value) && 'invalid url',
			expiresTime: (value: Date | null, { expiresDate }: { expiresDate: Date | null }) =>
				!dayjs().isBefore(expiresDate) && dayjs().isAfter(value ?? expiresDate),
		},
	})

	useEffect(() => {
		form.setFieldError('expiresDate', form.validateField('expiresTime').hasError)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [form.values.expiresDate])

	return (
		<Stack>
			<Head>
				<title>create | shurl</title>
			</Head>

			<CardWithTitle title="create new shurl">
				<LoadingOverlay visible={create.status === 'loading'} />
				<form
					onSubmit={form.onSubmit(v =>
						create.mutate({ ...v, expires: mergeDateTime(v.expiresDate, v.expiresTime) })
					)}
				>
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
								onClick={toggle}
								aria-label="randomize"
								size="lg"
								color=""
								variant="light"
								sx={{ marginLeft: -theme.spacing.xs / 2 }}
							>
								{emoji ? <IconMoodHappy /> : <IconAlphabetLatin />}
							</ActionIcon>
						</Group>

						<Group grow align="end" spacing="xs">
							<DatePicker
								icon={<IconCalendar size={20} />}
								excludeDate={date => dayjs(date).isBefore(new Date().setHours(0, 0, 0, 0))}
								label="expires"
								placeholder="never"
								clearable
								{...form.getInputProps('expiresDate')}
							/>
							{form.values.expiresDate && (
								<TimeInput
									icon={<IconClock size={20} />}
									description={!form.values.expiresDate && 'never'}
									disabled={!form.values.expiresDate}
									{...form.getInputProps('expiresTime')}
								/>
							)}
						</Group>

						<Group align="end" spacing="xs">
							<Checkbox mb="xs" {...form.getInputProps('usePassword', { type: 'checkbox' })} />
							<PasswordInput
								sx={{ flex: 1 }}
								label="password"
								autoComplete="new-password"
								required={form.values.usePassword}
								disabled={!form.values.usePassword}
								{...form.getInputProps('password')}
							/>
						</Group>

						<Group mt="xs" position="apart" align="start">
							<Checkbox label="public" {...form.getInputProps('public', { type: 'checkbox' })} />
							<Button type="submit">create</Button>
						</Group>
					</Stack>
				</form>
			</CardWithTitle>

			{recentLocal.length > 0 && (
				<CardWithTitle title="last created" order={3}>
					<UrlsTable urls={recentLocal} />
				</CardWithTitle>
			)}
		</Stack>
	)
}

export default HomePage
