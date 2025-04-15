import { MeetingComparison } from "@/components/meeting-comparison"
import { Sidebar } from "@/components/sidebar"
import { meetings } from "@/data/meetings"
import { notFound } from "next/navigation"

export default async function MeetingPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id
  const meeting = meetings.find((m) => m.id === parseInt(id))

  if (!meeting) {
    return notFound()
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar meetings={meetings} />
      <main className="flex-1 overflow-auto p-6">
        <MeetingComparison meeting={meeting} />
      </main>
    </div>
  )
}
