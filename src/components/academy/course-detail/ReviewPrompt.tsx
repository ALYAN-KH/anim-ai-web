"use client";

import { useState } from "react";

/** The review dialog needs Higgsfield's account backend, which is not connected here, so nothing is submitted. */
export function ReviewPrompt() {
  const [note, setNote] = useState(false);
  return <>
    <p>Help us improve Higgsfield Academy <button type="button" className="rounded-q-100 text-q-text-brand focus-visible:outline-2 focus-visible:outline-q-border-focus" aria-expanded={note} onClick={() => setNote(value => !value)}>Leave review</button></p>
    {note && <p role="status">Reviews are not available in this build yet.</p>}
  </>;
}
