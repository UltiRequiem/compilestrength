import { CheckCircle, User } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getGravatarUrl } from "@/lib/gravatar";

interface ProfileSectionProps {
	userName: string;
	userEmail: string;
}

export default function ProfileSection({
	userName,
	userEmail,
}: ProfileSectionProps) {
	return (
		<Card className="border-primary/20">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<User className="h-5 w-5" />
					Profile
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex items-center gap-4">
					<Image
						src={getGravatarUrl(userEmail, 80)}
						alt={`${userName}'s avatar`}
						width={80}
						height={80}
						className="rounded-full"
					/>
					<div className="space-y-2">
						<Button variant="outline" size="sm">
							Change Avatar
						</Button>
						<p className="text-xs text-muted-foreground">
							Profile picture from{" "}
							<a
								href="https://gravatar.com"
								target="_blank"
								rel="noopener noreferrer"
								className="text-primary hover:underline"
							>
								Gravatar
							</a>
						</p>
					</div>
				</div>

				<div className="grid gap-4 md:grid-cols-2">
					<div className="space-y-2">
						<Label>Full Name</Label>
						<Input defaultValue={userName} />
					</div>
					<div className="space-y-2">
						<Label>Username</Label>
						<Input
							defaultValue={userEmail.split("@")[0]}
							placeholder="username"
						/>
					</div>
				</div>

				<div className="space-y-2">
					<Label>Email</Label>
					<div className="flex gap-2">
						<Input value={userEmail} readOnly />
						<Badge variant="secondary" className="flex items-center gap-1">
							<CheckCircle className="h-3 w-3" />
							Verified
						</Badge>
					</div>
				</div>

				<div className="space-y-2">
					<Label>Bio</Label>
					<textarea
						className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
						placeholder="Tell us about yourself..."
						defaultValue=""
					/>
				</div>

				<Button>Save Changes</Button>
			</CardContent>
		</Card>
	);
}
