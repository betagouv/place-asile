import { describe, it, expect } from "vitest";
import { createMocks } from "node-mocks-http";
import { POST } from "@/app/api/structures/route";
import { createStructure } from "../../test-utils/structure.factory";

// TODO : implémenter ces tests
describe.skip("API Route: /api/structures", () => {
  it("should return 400 when given an empty JSON", async () => {
    const { req, res } = createMocks({
      method: "POST",
    });

    req.body = {
      data: {},
    };

    await POST(req);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual({ error: "Le code DNA est requis" });
  });

  it("should return 201 and when given a correct structure", async () => {
    const { req, res } = createMocks({
      method: "POST",
    });

    req.body = {
      data: createStructure({}),
    };

    await POST(req);

    expect(res._getStatusCode()).toBe(201);
    expect(res._getJSONData()).toEqual({});
  });
});
