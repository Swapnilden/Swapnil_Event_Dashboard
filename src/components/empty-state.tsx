import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <Icon size={48} className="mx-auto text-slate-300 mb-3" />
      <p className="text-slate-500 font-medium">{title}</p>
      <p className="text-slate-400 text-sm">{description}</p>
    </div>
  )
}