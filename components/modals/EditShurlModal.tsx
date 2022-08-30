import useMobile from '@hooks/useMobile'
import {
	ActionIcon,
	Button,
	Checkbox,
	Group,
	LoadingOverlay,
	PasswordInput,
	Stack,
	TextInput,
	useMantineTheme,
} from '@mantine/core'
import { DatePicker, TimeInput } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { ContextModalProps } from '@mantine/modals'
import { ShortUrl } from '@prisma/client'
import { IconAlphabetLatin, IconArrowsShuffle, IconCalendar, IconClock, IconMoodHappy } from '@tabler/icons'
import { trpc } from '@utils/trpc'
import { isValidUrl, mergeDateTime, randomAlias } from '@utils/utils'
import dayjs from 'dayjs'

export default function EditShurlModal({ context, id, innerProps: shurl }: ContextModalProps<ShortUrl>) {
	const utils = trpc.useContext()
	const editShurl = trpc.useMutation('shurl.edit', {
		onSuccess() {
			utils.refetchQueries(['user.shurls'])
			context.closeModal(id)
		},
	})
	const theme = useMantineTheme()
	const large = useMediaQuery(theme.fn.largerThan('xs').slice(7), true)
	const [emoji, { toggle }] = useDisclosure(false)
	const mobile = useMobile()
	const form = useForm({
		validateInputOnChange: true,
		initialValues: {
			url: shurl.url,
			alias: shurl.alias,
			public: shurl.public,
			usePassword: shurl.password !== null,
			password: shurl.password ?? '',
			expiresDate: shurl.expires,
			expiresTime: shurl.expires,
		},
		validate: {
			alias: value => decodeURI(value).includes('/'),
			url: value => !isValidUrl(value) && 'invalid url',
		},
	})

	return (
		<>
			<LoadingOverlay visible={editShurl.isLoading} radius="md" />

			<form
				onSubmit={form.onSubmit(v =>
					editShurl.mutate({ ...v, id: shurl.id, expires: mergeDateTime(v.expiresDate, v.expiresTime) })
				)}
			>
				<Stack spacing="xs">
					<TextInput
						data-autofocus
						required
						type="url"
						label="url"
						placeholder="https://shurl.ovh"
						{...form.getInputProps('url')}
					/>

					<Group align="end" spacing="xs">
						<TextInput
							required
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

					<Stack spacing="xs" mx="-md" px="md" mb="-xs" pb="xs" sx={{ position: 'relative' }}>
						<Group grow align="end" spacing="xs">
							<DatePicker
								dropdownType={mobile ? 'modal' : 'popover'}
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
					</Stack>

					<Group mt="xs" position="apart" align="start">
						<Checkbox label="public" {...form.getInputProps('public', { type: 'checkbox' })} />
						<Group>
							<Button variant="default" onClick={() => context.closeModal(id)}>
								cancel
							</Button>
							<Button type="submit">save</Button>
						</Group>
					</Group>
				</Stack>
			</form>
		</>
	)
}
