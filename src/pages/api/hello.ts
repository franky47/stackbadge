// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { process } from '../../modules/engine'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const data = await process('47ng/fastify-micro')
  res.status(200).json(data)
}
