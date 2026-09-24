import type { Metadata } from "next";
import { MessageCircle, Phone, Mail, MapPin } from "lucide-react";
import { getSettings } from "@/lib/repo/settings";

export const metadata: Metadata = { title: "Contact | Electro Project Items" };

export default async function ContactPage() {
  const settings = await getSettings();
  const waLink = `https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, "")}`;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Get in Touch</h1>
      <p className="mt-2 text-sm text-muted">
        Have a question about a component or bulk order? Reach out directly — we reply fastest on WhatsApp.
      </p>

      <div className="mt-8 space-y-4">
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 transition hover:border-primary/50"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <MessageCircle className="h-5 w-5" />
          </span>
          <div>
            <p className="font-semibold text-foreground">Chat on WhatsApp</p>
            <p className="text-sm text-muted">{settings.whatsapp_number}</p>
          </div>
        </a>

        {settings.phone && (
          <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Phone className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold text-foreground">Call Us</p>
              <p className="text-sm text-muted">{settings.phone}</p>
            </div>
          </div>
        )}

        {settings.email && (
          <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Mail className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold text-foreground">Email</p>
              <p className="text-sm text-muted">{settings.email}</p>
            </div>
          </div>
        )}

        {settings.address && (
          <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <MapPin className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold text-foreground">Address</p>
              <p className="text-sm text-muted">{settings.address}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
