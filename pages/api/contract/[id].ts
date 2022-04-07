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
    let myData = {};
    
    if (req.body.firstParty) {
      myData = {firstParty: {connect: {email: req.body.firstParty.email}}}; 
    }
    else if (req.body.secondParty) {
      myData = {secondParty: {connect: {email: req.body.secondParty.email}}}; 
    }
    else if (req.body.firstPartySignDate) {
      myData = {firstPartySignDate: new Date()}; 
    }
    else if (req.body.secondPartySignDate) {
      myData = {secondPartySignDate: new Date()}; 
    }
    else {

      myData = {
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
        startDate: req.body.startDate, 
        endDate: req.body.endDate, 
        amount: req.body.amount, 
        showAmount: Boolean(req.body.showAmount),
        interestRate: req.body.interestRate, 
        showInterestRate: Boolean(req.body.showInterestRate),
        allowCustomContract: Boolean(req.body.allowCustomContract), 
      }
      
    }
    const contract = await prisma.contract.update({
      where: { id: Number(contractId) },
      data: myData,
      },
    );
    res.json(contract);
    console.log(contract);
  }
  else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`,
    );
  }
}