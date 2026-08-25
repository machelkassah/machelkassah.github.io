import { describe, it, expect, vi } from "vitest";
import { submitContactForm } from "../src/scripts/contact-form";

function makeStatus() {
  return { textContent: "", dataset: {} as { state?: string } };
}

function makeForm() {
  return { action: "https://api.web3forms.com/submit", reset: vi.fn() };
}

describe("submitContactForm", () => {
  it("shows a success message and resets the form on a 200 response", async () => {
    const status = makeStatus();
    const form = makeForm();
    const fetchImpl = vi.fn().mockResolvedValue({ ok: true });

    await submitContactForm(new FormData(), form, status, fetchImpl as unknown as typeof fetch);

    expect(status.dataset.state).toBe("success");
    expect(status.textContent).toContain("sent");
    expect(form.reset).toHaveBeenCalledOnce();
  });

  it("shows an error message and does not reset the form on a non-ok response", async () => {
    const status = makeStatus();
    const form = makeForm();
    const fetchImpl = vi.fn().mockResolvedValue({ ok: false });

    await submitContactForm(new FormData(), form, status, fetchImpl as unknown as typeof fetch);

    expect(status.dataset.state).toBe("error");
    expect(form.reset).not.toHaveBeenCalled();
  });

  it("shows an error message when fetch rejects (network failure)", async () => {
    const status = makeStatus();
    const form = makeForm();
    const fetchImpl = vi.fn().mockRejectedValue(new Error("network down"));

    await submitContactForm(new FormData(), form, status, fetchImpl as unknown as typeof fetch);

    expect(status.dataset.state).toBe("error");
  });

  it("calls fetch with the form's action, POST, and Accept: application/json", async () => {
    const status = makeStatus();
    const form = makeForm();
    const fetchImpl = vi.fn().mockResolvedValue({ ok: true });
    const formData = new FormData();

    await submitContactForm(formData, form, status, fetchImpl as unknown as typeof fetch);

    expect(fetchImpl).toHaveBeenCalledWith(
      form.action,
      expect.objectContaining({
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      })
    );
  });
});
