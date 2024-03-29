import { InitialModal } from "@/components/modals/initial-modal";
import { initialProfile } from "@/lib/inital-profile";
import { prismadb } from "@/lib/prismadb";
import { redirect } from "next/navigation";

const SetupPage = async () => {
  const profile = await initialProfile();
  const server = await prismadb.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id
        }
      }
    }
  })

  if (server) {
    return redirect(`/servers/${server.id}`)
  }

  return (
    <InitialModal />
  )
}

export default SetupPage;
