import { currentProfile } from "@/lib/current-profile";
import { prismadb } from "@/lib/prismadb";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface InviteCodePage {
  params: {
    inviteCode: string;
  }
}

const InviteCodePage = async ({
  params
}: InviteCodePage) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  if (!params.inviteCode) {
    return redirect("/");
  }

  const existingServer = await prismadb.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: profile.id
        }
      }
    }
  })

  if (existingServer) {
    return redirect(`/servers/${existingServer.id}`);
  }

  const server = await prismadb.server.update({
    where: {
      inviteCode: params.inviteCode,
    },
    data: {
      members: {
        create: [
          { profileId: profile.id }
        ]
      }
    }
  })

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return (
    <div>
      Hello Invite
    </div>
  )
}

export default InviteCodePage;