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
  }
  else if (req.method === 'PUT') {
    const contractId = req.query.id;
    console.log('ding'); 
    console.log(req.body);
    const contract = await prisma.contract.update({
      where: { id: Number(contractId) },
      data: { 
        title: req.body.title, 
        summary: req.body.summary, 
        content: req.body.content, 
        firstPartyName: req.body.firstPartyName, 
        firstPartyEmail: req.body.firstPartyEmail, 
        secondPartyName: req.body.secondPartyName, 
        secondPartyEmail: req.body.secondPartyEmail, 
        renderedContent: req.body.renderedContent, 
        isTemplate: Boolean(req.body.isTemplate),
        isPublished: Boolean(req.body.isPublished), 
        // isPUblic: req.body.isPublic, 

      },

    });
    res.json(contract);
  }
  else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`,
    );
  }
}