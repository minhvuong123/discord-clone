import { prismadb } from "./prismadb";

export const getOrCreateConversation = async (emberOneId: string, memberTwoId: string) => {
  let conversation = await findConversation(emberOneId, memberTwoId) || await findConversation(memberTwoId, emberOneId);

  if (!conversation) {
    conversation = await createNewConversation(emberOneId, memberTwoId);
  }

  return conversation;
}

const findConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    const conversation = await prismadb.conversation.findFirst({
      where: {
        AND: [
          { memberOneId: memberOneId },
          { memberTwoId: memberTwoId },
        ]
      },
      include: {
        memberOne: {
          include: {
            profile: true
          }
        },
        memberTwo: {
          include: {
            profile: true
          }
        }
      }
    })
  
    return conversation;
  } catch (error) {
    return null;
  }
}

const createNewConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    const conversation = prismadb.conversation.create({
      data: {
        memberOneId,
        memberTwoId
      },
      include: {
        memberOne: {
          include: {
            profile: true
          }
        },
        memberTwo: {
          include: {
            profile: true
          }
        }
      }
    })

    return conversation; 
  } catch (error) {
    return null;
  }
}