import { createFileRoute } from "@tanstack/react-router";
import {
  Bell,
  Check,
  Laptop,
  Monitor,
  Moon,
  Palette,
  Shield,
  Smartphone,
  Sun,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { GlassPanel, IconTile, PageHeader, SectionTitle } from "@/components/nexus/glass";
import { useLayoutPreview, type LayoutPreview } from "@/components/nexus/layout-provider";
import { useTheme, type ThemePreference } from "@/components/nexus/theme-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Nexus AI OS" },
      {
        name: "description",
        content:
          "Manage your Nexus profile, appearance, layout preview and notification preferences.",
      },
      { property: "og:title", content: "Settings — Nexus AI OS" },
      {
        property: "og:description",
        content: "Profile, appearance, layout preview and notification preferences for Nexus.",
      },
    ],
  }),
  component: SettingsPage,
});

const themeOptions: { value: ThemePreference; label: string; hint: string; icon: typeof Moon }[] = [
  { value: "dark", label: "Dark", hint: "The default Nexus surface", icon: Moon },
  { value: "light", label: "Light", hint: "Bright paper glass", icon: Sun },
  { value: "system", label: "System", hint: "Follow your device", icon: Laptop },
];

const layoutOptions: { value: LayoutPreview; label: string; hint: string; icon: typeof Monitor }[] =
  [
    { value: "desktop", label: "Desktop", hint: "Full sidebar composition", icon: Monitor },
    { value: "mobile", label: "Mobile", hint: "Preview the mobile shell", icon: Smartphone },
  ];

function OptionCard({
  active,
  label,
  hint,
  icon: Icon,
  onSelect,
}: {
  active: boolean;
  label: string;
  hint: string;
  icon: typeof Moon;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={cn(
        "glass glass-hover group relative flex items-start gap-3 rounded-2xl p-4 text-left",
        active && "border-glass-highlight bg-glass-strong shadow-[var(--shadow-float)]",
      )}
    >
      <IconTile tone={active ? "violet" : "azure"} className="h-9 w-9">
        <Icon className="h-4 w-4" />
      </IconTile>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium">{label}</span>
        <span className="mt-0.5 block text-xs text-muted-foreground">{hint}</span>
      </span>
      {active ? <Check className="mt-1 h-4 w-4 shrink-0 text-violet" /> : null}
    </button>
  );
}

function ToggleRow({
  title,
  description,
  defaultChecked,
}: {
  title: string;
  description: string;
  defaultChecked?: boolean;
}) {
  const [checked, setChecked] = useState(Boolean(defaultChecked));
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-t border-hairline py-4 first:border-t-0 first:pt-0">
      <div className="min-w-0">
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={(value) => {
          setChecked(value);
          toast(`${title} ${value ? "enabled" : "disabled"}`);
        }}
      />
    </div>
  );
}

function SettingsPage() {
  const { preference, setPreference } = useTheme();
  const { preview, setPreview } = useLayoutPreview();

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        eyebrow="SYSTEM"
        title="Settings"
        description="Tune how Nexus looks, behaves and notifies you. Preferences are stored on this device."
      />

      <Tabs defaultValue="appearance" className="space-y-6">
        <TabsList className="glass h-auto rounded-xl p-1">
          <TabsTrigger value="appearance" className="rounded-lg px-4 py-2 text-sm">
            <Palette className="mr-2 h-4 w-4" /> Appearance
          </TabsTrigger>
          <TabsTrigger value="profile" className="rounded-lg px-4 py-2 text-sm">
            <User className="mr-2 h-4 w-4" /> Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-lg px-4 py-2 text-sm">
            <Bell className="mr-2 h-4 w-4" /> Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="appearance" className="space-y-6">
          <GlassPanel strong className="@container p-6">
            <SectionTitle title="Theme" />
            <p className="mt-1 text-sm text-muted-foreground">
              Dark is the canonical Nexus environment. Light is a separately designed bright glass
              surface.
            </p>
            <div className="mt-5 grid gap-3 @md:grid-cols-3">
              {themeOptions.map((option) => (
                <OptionCard
                  key={option.value}
                  active={preference === option.value}
                  label={option.label}
                  hint={option.hint}
                  icon={option.icon}
                  onSelect={() => setPreference(option.value)}
                />
              ))}
            </div>
          </GlassPanel>

          <GlassPanel strong className="@container p-6">
            <SectionTitle title="View & layout" />
            <p className="mt-1 text-sm text-muted-foreground">
              Switch the shell between the desktop composition and the mobile layout to inspect both
              experiences.
            </p>
            <div className="mt-5 grid gap-3 @md:grid-cols-2">
              {layoutOptions.map((option) => (
                <OptionCard
                  key={option.value}
                  active={preview === option.value}
                  label={option.label}
                  hint={option.hint}
                  icon={option.icon}
                  onSelect={() => setPreview(option.value)}
                />
              ))}
            </div>
          </GlassPanel>

          <GlassPanel className="p-6">
            <SectionTitle title="Interface density" />
            <div className="mt-4">
              <ToggleRow
                title="Reduced motion"
                description="Minimise page and panel transitions across Nexus."
              />
              <ToggleRow
                title="Atmospheric background"
                description="Show the cinematic backdrop behind glass surfaces."
                defaultChecked
              />
            </div>
          </GlassPanel>
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <GlassPanel strong className="p-6">
            <SectionTitle title="Profile" />
            <div className="mt-5 flex items-center gap-4">
              <span className="brand-gradient grid h-14 w-14 shrink-0 place-items-center rounded-full text-base font-semibold text-primary-foreground">
                AS
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">Aarav Sharma</p>
                <p className="truncate text-xs text-muted-foreground">Nexus Pro workspace owner</p>
              </div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" defaultValue="Aarav Sharma" className="bg-glass" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" defaultValue="aarav@nexus.ai" className="bg-glass" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" defaultValue="Head of Product" className="bg-glass" />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button
                onClick={() => toast("Profile saved locally", {
                  description: "Persistence arrives with the Nexus backend.",
                })}
                className="brand-gradient rounded-xl border border-glass-border text-primary-foreground hover:opacity-90"
              >
                Save changes
              </Button>
            </div>
          </GlassPanel>

          <GlassPanel className="p-6">
            <SectionTitle title="Security" />
            <div className="mt-4">
              <ToggleRow
                title="Two-factor authentication"
                description="Require a second factor when signing in."
                defaultChecked
              />
              <ToggleRow
                title="Device sessions"
                description="Keep this device signed in for 30 days."
                defaultChecked
              />
            </div>
            <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-3.5 w-3.5 text-mint" />
              Authentication will be connected in a later release.
            </div>
          </GlassPanel>
        </TabsContent>

        <TabsContent value="notifications">
          <GlassPanel strong className="p-6">
            <SectionTitle title="Notifications" />
            <p className="mt-1 text-sm text-muted-foreground">
              Choose what Nexus surfaces to you and when.
            </p>
            <div className="mt-4">
              <ToggleRow
                title="Task reminders"
                description="Nudge me before a task is due."
                defaultChecked
              />
              <ToggleRow
                title="Calendar alerts"
                description="Notify me 10 minutes before meetings."
                defaultChecked
              />
              <ToggleRow
                title="Automation reports"
                description="Send a daily summary of automation runs."
              />
              <ToggleRow
                title="Weekly digest"
                description="A Monday morning overview of your workspaces."
                defaultChecked
              />
            </div>
          </GlassPanel>
        </TabsContent>
      </Tabs>
    </div>
  );
}
