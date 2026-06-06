import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Changelog",
  description:
    "Recent updates and improvements to ShipSaaS. New features, fixes, and security patches.",
};

type ChangeGroup = {
  title: string;
  items: string[];
};

type Release = {
  version: string;
  date: string;
  isUnreleased: boolean;
  groups: ChangeGroup[];
};

const GROUP_ORDER = ["Added", "Changed", "Fixed", "Removed", "Security", "Deprecated"];

function parseChangelog(markdown: string): Release[] {
  const releases: Release[] = [];
  const lines = markdown.split("\n");

  let current: Release | null = null;
  let currentGroup: ChangeGroup | null = null;

  for (const raw of lines) {
    const line = raw.trimEnd();

    const releaseMatch = line.match(
      /^## \[(?<version>[^\]]+)\](?:\s*-\s*(?<date>\d{4}-\d{2}-\d{2}))?/,
    );
    if (releaseMatch?.groups) {
      if (current) releases.push(current);
      const { version, date } = releaseMatch.groups;
      current = {
        version: version.trim(),
        date: date?.trim() ?? "",
        isUnreleased: version.trim().toLowerCase() === "unreleased",
        groups: [],
      };
      currentGroup = null;
      continue;
    }

    if (!current) continue;

    const groupMatch = line.match(/^### (?<title>[A-Za-z]+)/);
    if (groupMatch?.groups) {
      currentGroup = { title: groupMatch.groups.title, items: [] };
      current.groups.push(currentGroup);
      continue;
    }

    const itemMatch = line.match(/^[-*]\s+(?<item>.+)$/);
    if (itemMatch?.groups && currentGroup) {
      currentGroup.items.push(itemMatch.groups.item.trim());
    }
  }

  if (current) releases.push(current);

  return releases;
}

function orderGroups(groups: ChangeGroup[]): ChangeGroup[] {
  return [...groups].sort((a, b) => {
    const ai = GROUP_ORDER.indexOf(a.title);
    const bi = GROUP_ORDER.indexOf(b.title);
    if (ai === -1 && bi === -1) return 0;
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}

function formatDate(date: string): string {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ChangelogPage() {
  const markdown = readFileSync(
    join(process.cwd(), "CHANGELOG.md"),
    "utf-8",
  );
  const releases = parseChangelog(markdown);

  return (
    <div className="bg-background min-h-screen">
      <Navbar />

      <main>
        <section className="border-border border-b">
          <div className="mx-auto w-full max-w-3xl px-6 pt-32 pb-16 md:pt-40 md:pb-20">
            <p className="eyebrow">Changelog</p>
            <h1 className="text-display-xl text-balance text-foreground mt-4">
              What&rsquo;s new.
            </h1>
            <p className="text-foreground/70 mt-6 text-lg leading-relaxed md:text-xl">
              Recent updates and improvements. New features, fixes, and
              security patches — kept in plain English.
            </p>
          </div>
        </section>

        <section>
          <div className="mx-auto w-full max-w-3xl px-6 py-20 md:py-28">
            <ol className="space-y-16">
              {releases.map((release) => (
                <li key={release.version}>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h2 className="text-foreground text-2xl font-semibold tracking-tight">
                      {release.isUnreleased
                        ? "Unreleased"
                        : `v${release.version}`}
                    </h2>
                    {!release.isUnreleased && release.date && (
                      <time
                        dateTime={release.date}
                        className="text-muted-foreground text-sm"
                      >
                        {formatDate(release.date)}
                      </time>
                    )}
                    {release.isUnreleased && (
                      <span className="text-muted-foreground text-sm">
                        In progress
                      </span>
                    )}
                  </div>

                  <div className="mt-8 space-y-8">
                    {orderGroups(release.groups).map((group) => (
                      <div key={group.title}>
                        <h3 className="eyebrow">{group.title}</h3>
                        <ul className="mt-3 space-y-2 text-sm md:text-base">
                          {group.items.map((item, i) => (
                            <li
                              key={i}
                              className="text-foreground/85 leading-relaxed"
                            >
                              {renderItem(item)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function renderItem(item: string) {
  const parts: React.ReactNode[] = [];
  const regex = /\*\*([^*]+)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(item)) !== null) {
    if (match.index > lastIndex) {
      parts.push(item.slice(lastIndex, match.index));
    }
    parts.push(
      <strong key={key++} className="text-foreground font-semibold">
        {match[1]}
      </strong>,
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < item.length) {
    parts.push(item.slice(lastIndex));
  }

  return <>{parts}</>;
}
