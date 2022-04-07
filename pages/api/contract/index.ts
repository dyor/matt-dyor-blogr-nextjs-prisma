// pages/api/contract/index.ts

import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

// CONTRACT /api/contract
export default async function handle(req, res) {
  const { title, content, summary, firstPartyName, firstPartyEmail, secondPartyName, secondPartyEmail, firstPartySignDate, secondPartySignDate, isPublic, renderedContent, isTemplate, allowCustomContract, template, startDate, endDate, amount, showAmount, interestRate, showInterestRate } = req.body;
  const session = await getSession({ req });
  
  let sdt = new Date(startDate);
  let edt = new Date(endDate);
  const result = await prisma.contract.create({
    data: {
      title: title,
      firstPartyName: firstPartyName,
      firstPartyEmail: firstPartyEmail,
      secondPartyName: secondPartyName,
      secondPartyEmail: secondPartyEmail,
      firstPartySignDate: firstPartySignDate,
      secondPartySignDate: secondPartySignDate,
      isPublic: isPublic,
      summary: summary,
      content: content,
      renderedContent: renderedContent,
      isTemplate: isTemplate, 
      author: { connect: { email: session?.user?.email } },
      startDate:  sdt, 
      endDate: edt, 
      amount: amount, 
      showAmount: showAmount, 
      interestRate: interestRate, 
      showInterestRate: showInterestRate, 
      allowCustomContract: allowCustomContract, 
    },
  });

  res.json(result);

}