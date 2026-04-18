// HelpHub AI demo data + LocalStorage-backed store

export type Role = "Need Help" | "Can Help" | "Both";
export type Urgency = "High" | "Medium" | "Low";
export type Status = "Open" | "Solved";

export interface User {
  id: string;
  name: string;
  email: string;
  location: string;
  skills: string[];
  interests: string[];
  badges: string[];
  trust: number;
  contributions: number;
  initials: string;
  color: string;
}

export interface Request {
  id: string;
  title: string;
  description: string;
  category: string;
  urgency: Urgency;
  status: Status;
  tags: string[];
  authorId: string;
  helpersInterested: string[];
  createdAt: number;
}

export interface Message {
  id: string;
  fromId: string;
  toId: string;
  body: string;
  time: string;
}

export interface Notification {
  id: string;
  title: string;
  type: "Status" | "Match" | "Request" | "Reputation" | "Insight";
  when: string;
  read: boolean;
}

const KEY = "helphub_ai_v1";

const seedUsers: User[] = [
  { id: "u1", name: "Ayesha Khan", email: "ayesha@helphub.ai", location: "Karachi", skills: ["Figma", "UI/UX", "HTML/CSS", "Career Guidance"], interests: ["Hackathons", "UI/UX", "Community Building"], badges: ["Design Ally", "Fast Responder", "Top Mentor"], trust: 100, contributions: 35, initials: "AK", color: "from-amber-400 to-rose-400" },
  { id: "u2", name: "Hassan Ali", email: "hassan@helphub.ai", location: "Lahore", skills: ["JavaScript", "React", "Git/GitHub"], interests: ["Open Source", "DevTools"], badges: ["Code Rescuer", "Bug Hunter"], trust: 88, contributions: 24, initials: "HA", color: "from-slate-700 to-slate-900" },
  { id: "u3", name: "Sara Noor", email: "sara@helphub.ai", location: "Karachi", skills: ["Python", "Data Analysis"], interests: ["AI", "Research"], badges: ["Community Voice"], trust: 74, contributions: 11, initials: "SN", color: "from-orange-400 to-red-500" },
  { id: "u4", name: "Bilal Tariq", email: "bilal@helphub.ai", location: "Islamabad", skills: ["Product", "Writing"], interests: ["Storytelling"], badges: ["Helper"], trust: 62, contributions: 6, initials: "BT", color: "from-emerald-500 to-teal-600" },
];

const seedRequests: Request[] = [
  { id: "r1", title: "Need help", description: "helpn needed", category: "Web Development", urgency: "High", status: "Solved", tags: ["Web Development"], authorId: "u1", helpersInterested: ["u2"], createdAt: Date.now() - 1000 * 60 * 60 * 6 },
  { id: "r2", title: "Need help making my portfolio responsive before demo day", description: "My HTML/CSS portfolio breaks on tablets and I need layout guidance before tomorrow evening.", category: "Web Development", urgency: "High", status: "Solved", tags: ["HTML/CSS", "Responsive", "Portfolio"], authorId: "u3", helpersInterested: ["u1"], createdAt: Date.now() - 1000 * 60 * 60 * 12 },
  { id: "r3", title: "Looking for Figma feedback on a volunteer event poster", description: "I have a draft poster for a campus community event and want sharper hierarchy, spacing, and CTA copy.", category: "Design", urgency: "Medium", status: "Open", tags: ["Figma", "Poster", "Design Review"], authorId: "u1", helpersInterested: ["u4"], createdAt: Date.now() - 1000 * 60 * 60 * 18 },
  { id: "r4", title: "Need mock interview support for internship applications", description: "Applying to frontend internships and need someone to practice behavioral and technical interview questions with me.", category: "Career", urgency: "Low", status: "Solved", tags: ["Interview Prep", "Career", "Frontend"], authorId: "u3", helpersInterested: ["u1", "u2"], createdAt: Date.now() - 1000 * 60 * 60 * 30 },
];

const seedMessages: Message[] = [
  { id: "m1", fromId: "u1", toId: "u3", body: "I checked your portfolio request. Share the breakpoint screenshots and I can suggest fixes.", time: "09:45 AM" },
  { id: "m2", fromId: "u2", toId: "u1", body: "Your event poster concept is solid. I would tighten the CTA and reduce the background texture.", time: "11:10 AM" },
];

const seedNotifications: Notification[] = [
  { id: "n1", title: '"Need help" was marked as solved', type: "Status", when: "Just now", read: false },
  { id: "n2", title: 'Ayesha Khan offered help on "Need help"', type: "Match", when: "Just now", read: false },
  { id: "n3", title: 'Your request "Need help" is now live in the community feed', type: "Request", when: "Just now", read: false },
  { id: "n4", title: 'New helper matched to your responsive portfolio request', type: "Match", when: "12 min ago", read: false },
  { id: "n5", title: "Your trust score increased after a solved request", type: "Reputation", when: "1 hr ago", read: false },
  { id: "n6", title: "AI Center detected rising demand for interview prep", type: "Insight", when: "Today", read: true },
];

interface Store {
  users: User[];
  requests: Request[];
  messages: Message[];
  notifications: Notification[];
  session: { userId: string | null; role: Role };
}

const defaultStore: Store = {
  users: seedUsers,
  requests: seedRequests,
  messages: seedMessages,
  notifications: seedNotifications,
  session: { userId: "u1", role: "Both" },
};

export function loadStore(): Store {
  if (typeof window === "undefined") return defaultStore;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      localStorage.setItem(KEY, JSON.stringify(defaultStore));
      return defaultStore;
    }
    const parsed = JSON.parse(raw);
    return { ...defaultStore, ...parsed };
  } catch {
    return defaultStore;
  }
}

export function saveStore(s: Store) {
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function getUser(s: Store, id: string | null) {
  return s.users.find((u) => u.id === id) ?? s.users[0];
}
