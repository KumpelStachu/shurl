import { NextApiHandler } from 'next'
import superjson from 'superjson'
import prisma from '@utils/prisma'

const handler: NextApiHandler = async (req, res) => {
	if (req.method !== 'POST') {
		return res.status(405).send('Method Not Allowed')
	}

	const { visits, ...data } = superjson.parse<{
		url: string
		alias: string
		public: boolean
		password: string
		expires: Date | null
		visits?: number
	}>(req.body)

	try {
		const created = await prisma.shortUrl.create({ data })
		res.status(200).json(created)
	} catch (error) {
		res.status(500).json(error)
	}
}

export default handler
