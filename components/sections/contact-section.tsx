"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SuccessBurst } from "@/components/ui/success-burst";
import { ArrowRight, Lock, Mail, MapPin, MessageCircle, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Field, fieldInputClass } from "@/components/ui/field";
import { Button, LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const schema = z.object({
  name: z.string().min(2, "Enter your full name"),
  whatsapp: z.string().min(7, "Enter a valid WhatsApp number"),
  qualification: z.string().min(2, "Required"),
  fieldOfStudy: z.string().min(2, "Required"),
  score: z.string().min(1, "Required"),
  degree: z.enum(["Bachelor", "Master", "PhD"]),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

type ContactCard = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; href: string };
};

// TODO: client to provide the real email and office address (see docs/04-tech-stack.md).
const CONTACT_CARDS: ContactCard[] = [
  {
    icon: MessageCircle,
    title: "WhatsApp",
    description: "Fastest way to start a conversation.",
    action: { label: "Open WhatsApp", href: buildWhatsAppLink() },
  },
  {
    icon: Mail,
    title: "Email",
    description: "hello@germanychalo.com",
  },
  {
    icon: MapPin,
    title: "Office",
    description: "Address to be added once confirmed.",
  },
];

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { degree: "Master" },
  });

  function onSubmit(data: FormValues) {
    const message = [
      "Hi GermanyChalo! I'd like to talk about my Germany plan.",
      "",
      `Name: ${data.name}`,
      `Qualification: ${data.qualification}`,
      `Field of Study: ${data.fieldOfStudy}`,
      `CGPA / Percentage: ${data.score}`,
      `Desired Degree: ${data.degree}`,
      `WhatsApp: ${data.whatsapp}`,
      data.message ? `Message: ${data.message}` : undefined,
    ]
      .filter(Boolean)
      .join("\n");

    setSubmitted(true);
    window.open(buildWhatsAppLink(message), "_blank", "noopener,noreferrer");
  }

  return (
    <section className="bg-paper pb-24">
      <div className="mx-auto grid max-w-6xl gap-6 px-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-4">
          {CONTACT_CARDS.map((card, index) => {
            const Icon = card.icon;
            return (
              <Reveal key={card.title} delay={index * 0.06}>
                <Card hover className="group">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brick/15 to-gold/10 text-brick ring-1 ring-inset ring-brick/10 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold text-ink">{card.title}</h3>
                  <p className="mt-1 text-sm text-ink-muted">{card.description}</p>
                  {card.action && (
                    <LinkButton href={card.action.href} variant="secondary" className="mt-4 w-full">
                      {card.action.label}
                    </LinkButton>
                  )}
                </Card>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.1}>
          <Card className="p-8 sm:p-10">
            {submitted ? (
              <SuccessBurst />
            ) : (
              <form onSubmit={handleSubmit(onSubmit)}>
                <p className="text-xs font-bold uppercase tracking-wide text-brick">
                  Free Profile Evaluation
                </p>
                <h2 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl">
                  Tell us about yourself.
                </h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <Field label="Name" error={errors.name?.message}>
                    <input className={fieldInputClass} placeholder="Your full name" {...register("name")} />
                  </Field>
                  <Field label="WhatsApp" error={errors.whatsapp?.message}>
                    <input
                      className={fieldInputClass}
                      placeholder="+92 3xx xxxxxxx"
                      {...register("whatsapp")}
                    />
                  </Field>
                  <Field label="Qualification" error={errors.qualification?.message}>
                    <input
                      className={fieldInputClass}
                      placeholder="e.g. BS Physics"
                      {...register("qualification")}
                    />
                  </Field>
                  <Field label="CGPA / Percentage" error={errors.score?.message}>
                    <input className={fieldInputClass} placeholder="e.g. 3.2 / 75%" {...register("score")} />
                  </Field>
                  <Field label="Desired Degree" error={errors.degree?.message}>
                    <select className={fieldInputClass} {...register("degree")}>
                      <option value="Bachelor">Bachelor</option>
                      <option value="Master">Master</option>
                      <option value="PhD">PhD</option>
                    </select>
                  </Field>
                  <Field label="Field of Study" error={errors.fieldOfStudy?.message}>
                    <input
                      className={fieldInputClass}
                      placeholder="e.g. Computer Science"
                      {...register("fieldOfStudy")}
                    />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="Message">
                      <textarea
                        rows={4}
                        className={fieldInputClass}
                        placeholder="Tell us what you need help with"
                        {...register("message")}
                      />
                    </Field>
                  </div>
                </div>
                <Button type="submit" disabled={isSubmitting} className="mt-6 w-full">
                  Submit My Profile <ArrowRight size={16} />
                </Button>
                <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-ink-muted">
                  <Lock size={12} /> Your information stays private.
                </p>
              </form>
            )}
          </Card>
        </Reveal>
      </div>
    </section>
  );
}
