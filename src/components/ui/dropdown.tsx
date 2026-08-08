import * as React from "react"
import { ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export interface DropdownOption<T extends string | number> {
  value: T
  label: React.ReactNode
  disabled?: boolean
}

export interface DropdownProps<T extends string | number> {
  value: T
  onChange: (value: T) => void
  options: ReadonlyArray<DropdownOption<T>>
  label?: string
  align?: "start" | "center" | "end"
  trigger?: (open: boolean) => React.ReactNode
  triggerClassName?: string
  contentClassName?: string
}

export function Dropdown<T extends string | number>({
  value,
  onChange,
  options,
  label,
  align = "end",
  trigger,
  triggerClassName,
  contentClassName,
}: DropdownProps<T>) {
  const [open, setOpen] = React.useState(false)
  const selected = options.find(o => o.value === value)

  const defaultTrigger = (isOpen: boolean) => (
    <button
      type="button"
      aria-label={typeof selected?.label === "string" ? `Select ${selected.label}` : "Dropdown"}
      className={cn(
        "flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold transition-colors",
        "border-border bg-background text-foreground hover:bg-accent",
        isOpen && "bg-accent",
        triggerClassName,
      )}
    >
      <span>{selected ? selected.label : ""}</span>
      <ChevronDown className="h-3 w-3 opacity-60" />
    </button>
  )

  const triggerNode = trigger ?? defaultTrigger

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>{triggerNode(open)}</DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        sideOffset={6}
        collisionPadding={8}
        className={cn("max-h-72 overflow-y-auto p-1", contentClassName)}
      >
        {label ? <DropdownMenuLabel>{label}</DropdownMenuLabel> : null}
        <DropdownMenuRadioGroup
          value={String(value)}
          onValueChange={v => {
            onChange(v as T)
            setOpen(false)
          }}
        >
          {options.map(opt => (
            <DropdownMenuRadioItem
              key={String(opt.value)}
              value={String(opt.value)}
              disabled={opt.disabled}
            >
              {opt.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}