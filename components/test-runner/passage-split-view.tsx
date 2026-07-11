import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import type { PassageBlock } from "@/lib/data/types"

/** Passage(s) on the left, arbitrary content (questions) on the right — resizable split on desktop, stacked on mobile. Shared by the timed test runner and the untimed practice view so both look identical. */
export function PassageSplitView({ passages, children }: { passages: PassageBlock[]; children: React.ReactNode }) {
  return (
    <>
      <div className="hidden lg:block">
        <ResizablePanelGroup direction="horizontal" className="min-h-[420px] rounded-2xl border border-border/60">
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="flex h-full flex-col gap-4 overflow-y-auto p-4">
              {passages.map((passage) => (
                <div key={passage.id}>
                  {passage.title ? <h3 className="mb-1 text-sm font-medium">{passage.title}</h3> : null}
                  <p className="text-pretty text-sm leading-7 text-muted-foreground">{passage.body}</p>
                </div>
              ))}
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full overflow-y-auto p-4">{children}</div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      <div className="flex flex-col gap-4 lg:hidden">
        {passages.map((passage) => (
          <div key={passage.id} className="rounded-2xl border border-border/60 bg-card p-4">
            {passage.title ? <h3 className="mb-1 text-sm font-medium">{passage.title}</h3> : null}
            <p className="text-pretty text-sm leading-7 text-muted-foreground">{passage.body}</p>
          </div>
        ))}
        {children}
      </div>
    </>
  )
}
