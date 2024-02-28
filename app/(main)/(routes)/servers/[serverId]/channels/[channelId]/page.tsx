import { ChatHeader } from "@/components/chat/chat-header";
import { currentProfile } from "@/lib/current-profile";
import { prismadb } from "@/lib/prismadb";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface ChannelIdPageProps {
  params: {
    serverId: string;
    channelId: string;
  }
}

const ChannelIdPage = async ({
  params
}: ChannelIdPageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const channel = await prismadb.channel.findUnique({
    where: {
      id: params.channelId
    }
  })

  const member = await prismadb.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id
    }
  })

  if (!channel || !member) {
    redirect("/");
  }

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader 
        name={channel.name}
        serverId={channel.serverId}
        type="channel"
      />
    </div>
  )
} 

export default ChannelIdPage;