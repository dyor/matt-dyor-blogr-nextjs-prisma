// pages/api/contract/index.ts

import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

// CONTRACT /api/contract
// Required fields in body: title
// Optional fields in body: content
export default async function handle(req, res) {
  const { title, content, summary, firstPartyName, firstPartyEmail, secondPartyName, secondPartyEmail, firstPartySignDate, secondPartySignDate, isPublic, renderedContent, isTemplate, template } = req.body;
  const session = await getSession({ req });


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
    },
  });

  res.json(result);
}