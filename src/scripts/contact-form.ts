export interface ContactFormLike {
  action: string;
  reset(): void;
}

export interface FormStatusElement {
  textContent: string;
  dataset: { state?: string };
}

export async function submitContactForm(
  formData: FormData,
  form: ContactFormLike,
  status: FormStatusElement,
  fetchImpl: typeof fetch
): Promise<void> {
  status.textContent = "Sending…";
  status.dataset.state = "pending";

  try {
    const response = await fetchImpl(form.action, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    });

    if (response.ok) {
      status.textContent = "Thanks — your message has been sent. I'll reply within 1–2 business days.";
      status.dataset.state = "success";
      form.reset();
    } else {
      status.textContent = "Something went wrong sending that. Please try emailing directly instead.";
      status.dataset.state = "error";
    }
  } catch {
    status.textContent = "Something went wrong sending that. Please try emailing directly instead.";
    status.dataset.state = "error";
  }
}
