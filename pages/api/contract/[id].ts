// pages/api/contract/[id].ts

import prisma from '../../../lib/prisma';

// DELETE /api/contract/:id
export default async function handle(req, res) {
  const contractId = req.query.id;
  if (req.method === 'DELETE') {
    const contract = await prisma.contract.delete({
      where: { id: Number(contractId) },
    });
    res.json(contract);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`,
    );
  }
}