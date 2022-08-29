import UrlsTable from '@components/UrlsTable'
import useMobile from '@hooks/useMobile'
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
	Select,
	Stack,
	Text,
	TextInput,
	Title,
	useMantineTheme,
} from '@mantine/core'
import { DateRangePicker } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { useDebouncedValue, useDisclosure, useMediaQuery, useOs } from '@mantine/hooks'
import { openContextModal } from '@mantine/modals'
import { NextLink } from '@mantine/next'
import type { NextPageWithLayout } from '@pages/_app'
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
	IconSortAscending,
	IconSortAscending2,
	IconSortAscendingLetters,
	IconSortAscendingNumbers,
	IconSortDescending,
	IconSortDescendingLetters,
	IconSortDescendingNumbers,
	IconTrash,
} from '@tabler/icons'
import { inferQueryInput, trpc } from '@utils/trpc'
import Head from 'next/head'

const MyShurlsPage: NextPageWithLayout = () => {
	const theme = useMantineTheme()
	const large = useMediaQuery(theme.fn.largerThan('xs').slice(7), true)
	const mobile = useMobile()
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
			sort: 'createdAt desc' as Required<Required<inferQueryInput<'user.shurls'>>['search']>['sort'],
		},
	})
	const [formValues] = useDebouncedValue(form.values, 200)
	const recent = trpc.useQuery(
		[
			'user.shurls',
			{
				search: {
					...formValues,
					public: JSON.parse(formValues.public),
					password: JSON.parse(formValues.password),
				},
			},
		],
		{
			enabled:
				(formValues.expires[0] === formValues.expires[1] || formValues.expires[1] !== null) &&
				(formValues.created[0] === formValues.created[1] || formValues.created[1] !== null),
		}
	)

	return (
		<Card shadow="md">
			<LoadingOverlay visible={recent.isLoading} />
			<Head>
				<title>my shurls | shurl</title>
			</Head>

			<Group mb="xs">
				<Title order={2}>my shurls</Title>

				<Group ml="auto">
					<Select
						withinPortal
						sx={{ flex: 1 }}
						icon={
							form.values.sort.endsWith('asc') ? (
								form.values.sort.startsWith('url') || form.values.sort.startsWith('alias') ? (
									<IconSortAscendingLetters size={18} />
								) : (
									<IconSortAscendingNumbers size={18} />
								)
							) : form.values.sort.startsWith('url') || form.values.sort.startsWith('alias') ? (
								<IconSortDescendingLetters size={18} />
							) : (
								<IconSortDescendingNumbers size={18} />
							)
						}
						data={[
							{ group: 'created', label: 'created ascending', value: 'createdAt asc' },
							{ group: 'created', label: 'created descending', value: 'createdAt desc' },
							{ group: 'expires', label: 'expires ascending', value: 'expires asc' },
							{ group: 'expires', label: 'expires descending', value: 'expires desc' },
							{ group: 'visits', label: 'visits ascending', value: 'visits asc' },
							{ group: 'visits', label: 'visits descending', value: 'visits desc' },
							{ group: 'url', label: 'url ascending', value: 'url asc' },
							{ group: 'url', label: 'url descending', value: 'url desc' },
							{ group: 'alias', label: 'alias ascending', value: 'alias asc' },
							{ group: 'alias', label: 'alias descending', value: 'alias desc' },
						]}
						{...form.getInputProps('sort')}
					/>

					<Button
						variant="light"
						onClick={toggle}
						leftIcon={showSearch ? <IconSearchOff size={18} /> : <IconSearch size={18} />}
					>
						{showSearch ? 'hide' : 'show'}
						{false && ' search'}
					</Button>
				</Group>
			</Group>

			<Collapse in={showSearch} sx={{ position: 'relative' }}>
				<Stack spacing="xs">
					<TextInput type="url" label="url" placeholder="https://shurl.ovh" {...form.getInputProps('url')} />

					<TextInput sx={{ flex: 1 }} label="alias" placeholder="BYdFwrU4" {...form.getInputProps('alias')} />

					<DateRangePicker
						dropdownType={mobile ? 'modal' : 'popover'}
						icon={<IconCalendarMinus size={20} />}
						label="expires"
						placeholder="never"
						clearable
						{...form.getInputProps('expires')}
					/>

					<DateRangePicker
						dropdownType={mobile ? 'modal' : 'popover'}
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

export { getServerSideProps } from '@server/utils'

export default MyShurlsPage
