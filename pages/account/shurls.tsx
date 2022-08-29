import UrlsTable from '@components/UrlsTable'
import {
	ActionIcon,
	Anchor,
	Box,
	Button,
	Card,
	Center,
	Collapse,
	Divider,
	Group,
	LoadingOverlay,
	SegmentedControl,
	Stack,
	Text,
	TextInput,
	Title,
	useMantineTheme,
} from '@mantine/core'
import { DateRangePicker } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { useDebouncedValue, useDisclosure, useMediaQuery } from '@mantine/hooks'
import { openContextModal } from '@mantine/modals'
import { NextLink } from '@mantine/next'
import {
	IconCalendarMinus,
	IconCalendarPlus,
	IconEdit,
	IconKey,
	IconKeyOff,
	IconLock,
	IconLockOpen,
	IconMinus,
	IconSearch,
	IconSearchOff,
	IconTrash,
} from '@tabler/icons'
import { trpc } from '@utils/trpc'
import type { NextPage } from 'next'

const MyShurlsPage: NextPage = () => {
	const theme = useMantineTheme()
	const large = useMediaQuery(theme.fn.largerThan('xs').slice(7), true)
	const [showSearch, { toggle }] = useDisclosure(false)
	const form = useForm({
		validateInputOnChange: true,
		initialValues: {
			url: '',
			alias: '',
			public: 'null' as 'null' | 'true' | 'false',
			password: 'null' as 'null' | 'true' | 'false',
			expires: [null, null] as [Date | null, Date | null],
			created: [null, null] as [Date | null, Date | null],
		},
	})
	const [formValues] = useDebouncedValue(form.values, 200)
	const recent = trpc.useQuery([
		'user.shurls',
		{
			size: 10,
			search: {
				...formValues,
				public: JSON.parse(formValues.public),
				password: JSON.parse(formValues.password),
			},
		},
	])

	return (
		<Card shadow="md">
			<Group position="apart" mb="xs">
				<Title order={2}>my shurls</Title>
				<Button
					variant="light"
					onClick={toggle}
					leftIcon={showSearch ? <IconSearchOff size={18} /> : <IconSearch size={18} />}
				>
					{showSearch ? 'hide' : 'show'}
					{large && ` search`}
				</Button>
			</Group>

			<Collapse in={showSearch} sx={{ position: 'relative' }}>
				<LoadingOverlay visible={recent.isLoading} />
				<form>
					<Stack spacing="xs">
						<TextInput
							type="url"
							label="url"
							placeholder="https://shurl.ovh"
							{...form.getInputProps('url')}
						/>

						<TextInput
							sx={{ flex: 1 }}
							label="alias"
							placeholder="BYdFwrU4"
							{...form.getInputProps('alias')}
						/>

						<DateRangePicker
							icon={<IconCalendarMinus size={20} />}
							label="expires"
							placeholder="never"
							clearable
							{...form.getInputProps('expires')}
						/>

						<DateRangePicker
							icon={<IconCalendarPlus size={20} />}
							label="created"
							placeholder="any"
							clearable
							{...form.getInputProps('created')}
						/>

						<SegmentedControl
							color={{ null: '', true: 'green', false: 'red' }[form.values.password]}
							data={[
								{
									value: 'null',
									label: (
										<Center>
											<IconMinus size={16} />
											<Box ml="xs">any</Box>
										</Center>
									),
								},
								{
									value: 'true',
									label: (
										<Center>
											<IconKey size={16} />
											<Box ml="xs">password</Box>
										</Center>
									),
								},
								{
									value: 'false',
									label: (
										<Center>
											<IconKeyOff size={16} />
											<Box ml="xs">no password</Box>
										</Center>
									),
								},
							]}
							{...form.getInputProps('password')}
						/>
						<Group position="apart">
							<SegmentedControl
								sx={{ flex: large ? 1 : '100%' }}
								color={{ null: '', true: 'green', false: 'red' }[form.values.public]}
								data={[
									{
										value: 'null',
										label: (
											<Center>
												<IconMinus size={16} />
												<Box ml="xs">any</Box>
											</Center>
										),
									},
									{
										value: 'true',
										label: (
											<Center>
												<IconLockOpen size={16} />
												<Box ml="xs">public</Box>
											</Center>
										),
									},
									{
										value: 'false',
										label: (
											<Center>
												<IconLock size={16} />
												<Box ml="xs">private</Box>
											</Center>
										),
									},
								]}
								{...form.getInputProps('public')}
							/>
						</Group>
					</Stack>
				</form>
				<Divider my="md" />
				<Title order={3}>results ({recent.data?.length ?? 0})</Title>
			</Collapse>

			<UrlsTable
				withClicks
				withExpires
				urls={recent.data}
				actions={shurl => (
					<Group spacing="xs">
						<ActionIcon
							color="green"
							variant="light"
							onClick={() =>
								openContextModal({
									modal: 'editShurl',
									innerProps: shurl,
									centered: true,
									title: (
										<Text weight="bold">
											edit shurl&nbsp;
											<Anchor component={NextLink} href={`/${shurl.alias}`} weight="normal">
												{shurl.alias}
											</Anchor>
										</Text>
									),
								})
							}
						>
							<IconEdit size={16} />
						</ActionIcon>
						<ActionIcon
							color="red"
							variant="light"
							onClick={() =>
								openContextModal({
									modal: 'deleteShurl',
									innerProps: shurl,
									centered: true,
									title: (
										<Text weight="bold">
											delete shurl&nbsp;
											<Anchor component={NextLink} href={`/${shurl.alias}`} weight="normal">
												{shurl.alias}
											</Anchor>
										</Text>
									),
								})
							}
						>
							<IconTrash size={16} />
						</ActionIcon>
					</Group>
				)}
			/>
		</Card>
	)
}

export default MyShurlsPage
