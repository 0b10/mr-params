import compose from "../../..";
import { composeFactory } from "./helpers";

describe("factory", () => {
  it("should be defined", () => {
    expect(typeof compose).toBe("function");
  });

  it("should return a function", () => {
    expect(typeof composeFactory()).toBe("function");
  });
});
