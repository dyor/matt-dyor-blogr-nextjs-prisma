// pages/api/publish/[id].ts

import prisma from '../../../lib/prisma';

// PUT /api/publish/:id
export default async function handle(req, res) {
  const contractId = req.query.id;
  const contract = await prisma.contract.update({
    where: { id: Number(contractId) },
    data: { isPublished: true },
  });
  res.json(contract);
}