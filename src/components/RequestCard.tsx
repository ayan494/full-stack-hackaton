import { Request, User } from "@/lib/store";
import { Link } from "react-router-dom";

interface Props {
  request: Request;
  author?: User;
}

const urgencyClass: Record<string, string> = {
  High: "bg-rose-100 text-rose-700",
  Medium: "bg-amber-100 text-amber-800",
  Low: "bg-sky-100 text-sky-700",
};

const statusClass: Record<string, string> = {
  Open: "bg-accent text-accent-foreground",
  Solved: "bg-emerald-100 text-emerald-700",
};

export default function RequestCard({ request, author }: Props) {
  return (
    <article className="surface-card p-6 flex flex-col gap-4 hover:-translate-y-0.5 transition-transform">
      <div className="flex flex-wrap gap-2">
        <span className="chip">{request.category}</span>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${urgencyClass[request.urgency]}`}>{request.urgency}</span>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusClass[request.status]}`}>{request.status}</span>
      </div>
      <h3 className="font-display text-xl leading-tight">{request.title}</h3>
      <p className="text-sm text-muted-foreground line-clamp-3">{request.description}</p>
      {request.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {request.tags.map((t) => (
            <span key={t} className="chip">{t}</span>
          ))}
        </div>
      )}
      <div className="flex items-end justify-between mt-auto pt-2 border-t border-border/60">
        <div>
          <p className="font-semibold text-sm">{author?.name ?? "Member"}</p>
          <p className="text-xs text-muted-foreground">{author?.location} • {request.helpersInterested.length} helper{request.helpersInterested.length === 1 ? "" : "s"} interested</p>
        </div>
        <Link to={`/request/${request._id}`} className="inline-flex items-center px-4 py-2 rounded-full bg-background border border-border text-sm font-medium hover:bg-accent transition-colors">
          Open details
        </Link>
      </div>
    </article>
  );
}
