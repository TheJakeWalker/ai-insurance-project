import { matchInsuredName } from "@/lib/match";

describe("matchInsuredName", () => {
  it("should match exact name", () => {
    const result = matchInsuredName("Acme Holdings");
    expect(result.match?.internalId).toBe("a1");
    expect(result.confidence).toBeGreaterThanOrEqual(0.8);
  });

  it("should match with variations (case, suffix)", () => {
    const result = matchInsuredName("acme holdings llc");
    expect(result.match?.internalId).toBe("a1");
    expect(result.confidence).toBeGreaterThanOrEqual(0.8);
  });

  it("should return no match if below confidence threshold", () => {
    const result = matchInsuredName("Some Random Company");
    expect(result.match).toBeNull();
    expect(result.confidence).toBe(0);
  });
});
