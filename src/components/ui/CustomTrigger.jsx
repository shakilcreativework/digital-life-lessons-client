
import { authClient } from "@/lib/auth-client";
import { ArrowRightFromSquare} from "@gravity-ui/icons";
import { Avatar, Dropdown, Label } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function CustomTrigger() {
    const { data: session } = authClient.useSession();
    // console.log(session?.user);
    const isAdmin = session?.user?.role === "admin";

    const router = useRouter();
    const logOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/login");
                }
            }
        });
    };

    return (
        <Dropdown>
            <Dropdown.Trigger className="rounded-full">
                <Avatar>
                    <Avatar.Image
                        referrerPolicy="no-referrer"
                        alt={session?.user?.name || "User Name"}
                        src={session?.user?.image || "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/orange.jpg"}
                    />
                    <Avatar.Fallback delayMs={600}>JD</Avatar.Fallback>
                </Avatar>
            </Dropdown.Trigger>
            <Dropdown.Popover className={'w-65 max-w-[90vw]'}>
                <div className="px-3 pt-3 pb-1">
                    <div className="flex items-center gap-2">
                        <Avatar size="sm">
                            <Avatar.Image
                                referrerPolicy="no-referrer"
                                alt={session?.user?.name || "User Name"}
                                src={session?.user?.image || "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/orange.jpg"}
                            />
                            <Avatar.Fallback delayMs={600}>JD</Avatar.Fallback>
                        </Avatar>
                        <div className="flex flex-col gap-0">
                            <p className="text-sm leading-5 font-medium text-foreground">{session?.user?.name}</p>
                            <p className="text-xs leading-none text-muted">{session?.user?.email}</p>
                        </div>
                    </div>
                </div>
                <Dropdown.Menu>
                    <Dropdown.Item
                        id="profile"
                        textValue="Profile"
                        as={Link}
                        href={`${isAdmin ? '/dashboard/admin/profile' : '/dashboard/profile'}`}
                    >
                        <Label className="text-muted">Profile</Label>
                    </Dropdown.Item>
                    <Dropdown.Item
                        id="dashboard"
                        textValue="Dashboard"
                        as={Link}
                        href={`${isAdmin ? '/dashboard/admin' : '/dashboard'}`}
                    >
                        <Label className="text-muted">Dashboard</Label>
                    </Dropdown.Item>
                    <Dropdown.Item id="logout" textValue="Logout" variant="danger">
                        <div onClick={logOut} className="flex w-full items-center justify-between gap-2">
                            <Label>Log Out</Label>
                            <ArrowRightFromSquare className="size-3.5 text-danger" />
                        </div>
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown.Popover>
        </Dropdown>
    );
}