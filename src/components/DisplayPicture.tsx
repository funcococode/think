
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
interface DisplayPictureProps{
  src?: string | null,
  fallbackText?: string | null,
  className?: string
}
export default function DisplayPicture({src, fallbackText, className = ''}: DisplayPictureProps) {
  const displayName = fallbackText?.split(' ');
  const nameInitials = displayName?.map(item => item[0]).join('');
  return <Avatar className={className}>
    <AvatarImage src={src!} />
    <AvatarFallback className="bg-blue-100">{nameInitials}</AvatarFallback>
  </Avatar>
}
