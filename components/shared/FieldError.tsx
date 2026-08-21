import { AlertCircle } from "lucide-react";

const FieldError = ({ id, message }: { id: string; message: string | undefined }) => {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600">
      
      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
      {message}
    </p>
  );
}

export default FieldError;