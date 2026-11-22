import { describe, expect, it } from "vitest";
import { contactSchema } from "@/lib/validation/contact";

describe("contactSchema", () => {
  it("accepts a valid bilingual contact inquiry", () => {
    const result = contactSchema.safeParse({
      name: "سارة المنصور",
      email: "sara@company.sa",
      company: "نوفا التقنية",
      message: "نرغب في بناء منصة حجوزات متكاملة بالعربية والإنجليزية.",
      website: "",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("سارة المنصور");
      expect(result.data.email).toBe("sara@company.sa");
      expect(result.data.company).toBe("نوفا التقنية");
    }
  });

  it("defaults optional company to empty string", () => {
    const result = contactSchema.safeParse({
      name: "Tariq Ali",
      email: "tariq@example.com",
      message: "Looking for a bilingual Next.js marketing and product platform.",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.company).toBe("");
    }
  });

  it("rejects invalid emails and short messages", () => {
    const result = contactSchema.safeParse({
      name: "A",
      email: "not-an-email",
      message: "Too short",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.name).toBeDefined();
      expect(errors.email).toBeDefined();
      expect(errors.message).toBeDefined();
    }
  });
});
