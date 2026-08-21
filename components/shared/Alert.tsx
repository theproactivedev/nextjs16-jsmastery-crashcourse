import { AlertCircleIcon } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

function AlertBox({ title, content, variant, className } : { title: string; content: string; variant?: "default" | "destructive" | null | undefined, className: string }) {
  return (
    <Alert variant={variant} className={`max-w-md ${className}`}>
      <AlertCircleIcon />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        {content}
      </AlertDescription>
    </Alert>
  )
}

export default AlertBox;
