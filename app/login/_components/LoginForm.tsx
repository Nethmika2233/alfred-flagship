"use client";

import React, { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { loginAction, type FormState } from "@/app/login/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="relative w-full bg-black text-white text-xs font-bold uppercase tracking-[0.2em] py-4 border border-black hover:bg-zinc-900 transition-colors disabled:opacity-60"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={pending ? "pending" : "idle"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="block"
        >
          {pending ? "Signing In…" : "Sign In"}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

export default function LoginForm({ callbackUrl }: { callbackUrl?: string }) {
  const [state, formAction] = useActionState<FormState | undefined, FormData>(loginAction, undefined);

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="w-full max-w-sm"
    >
      <motion.div variants={fadeUp} className="mb-10 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-2">Alfred Clothing</p>
        <h1 className="font-display text-2xl font-semibold uppercase tracking-[0.05em] text-zinc-900">Sign In</h1>
      </motion.div>

      <form action={formAction} className="space-y-5">
        {callbackUrl && <input type="hidden" name="callbackUrl" value={callbackUrl} />}

        <motion.div variants={fadeUp}>
          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-2">Email</label>
          <input
            type="email"
            name="email"
            required
            className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
          />
        </motion.div>

        <motion.div variants={fadeUp}>
          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-2">Password</label>
          <input
            type="password"
            name="password"
            required
            className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
          />
        </motion.div>

        <AnimatePresence>
          {state?.error && (
            <motion.p
              initial={{ opacity: 0, x: 0 }}
              animate={{ opacity: 1, x: [0, -6, 6, -4, 4, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="text-xs text-red-500"
            >
              {state.error}
            </motion.p>
          )}
        </AnimatePresence>

        <motion.div variants={fadeUp}>
          <SubmitButton />
        </motion.div>
      </form>

      <motion.p variants={fadeUp} className="mt-8 text-center text-xs uppercase tracking-widest text-zinc-400">
        New here?{" "}
        <Link href="/signup" className="text-zinc-900 underline hover:text-black">
          Create an account
        </Link>
      </motion.p>
    </motion.div>
  );
}
