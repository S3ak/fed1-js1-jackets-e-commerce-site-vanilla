import { describe, it, expect, vi } from "vitest";
import { decreaseQuantity, calcTotal } from "./utils.mjs";

describe("calcTotal", () => {
  it("should return 0 if no items are provided", () => {
    const result = calcTotal([]);
    expect(result).toBe("0.00");
  });

  it("should calculate the total price of items correctly", () => {
    const items = [
      { quantity: 2, price: 10 },
      { quantity: 1, price: 20 },
    ];
    const result = calcTotal(items);
    expect(result).toBe("40.00");
  });

  it("should handle items with zero quantity", () => {
    const items = [
      { quantity: 0, price: 10 },
      { quantity: 1, price: 20 },
    ];
    const result = calcTotal(items);
    expect(result).toBe("20.00");
  });

  it("should handle items with zero price", () => {
    const items = [
      { quantity: 2, price: 0 },
      { quantity: 1, price: 20 },
    ];
    const result = calcTotal(items);
    expect(result).toBe("20.00");
  });

  it("should return the total formatted to two decimal places", () => {
    const items = [
      { quantity: 1, price: 10.123 },
      { quantity: 1, price: 20.456 },
    ];
    const result = calcTotal(items);
    expect(result).toBe("30.58");
  });
});

describe("decreaseQuantity", () => {
  it("should decrease the quantity of the item by 1", () => {
    const items = [{ id: 1, quantity: 2, price: 10 }];
    const updateComponentStateCB = vi.fn();

    decreaseQuantity(items, 1, updateComponentStateCB);

    expect(updateComponentStateCB).toHaveBeenCalledWith([
      { id: 1, quantity: 1, price: 10 },
    ]);
  });

  it("should remove the item if the quantity reaches 0", () => {
    const items = [{ id: 1, quantity: 1, price: 10 }];
    const updateComponentStateCB = vi.fn();

    decreaseQuantity(items, 1, updateComponentStateCB);

    expect(updateComponentStateCB).toHaveBeenCalledWith([]);
  });

  it("should not change the items if the item is not found", () => {
    const items = [{ id: 1, quantity: 2, price: 10 }];
    const updateComponentStateCB = vi.fn();

    decreaseQuantity(items, 2, updateComponentStateCB);

    expect(updateComponentStateCB).not.toHaveBeenCalled();
  });

  it("should handle an empty items array", () => {
    const items = [];
    const updateComponentStateCB = vi.fn();

    decreaseQuantity(items, 1, updateComponentStateCB);

    expect(updateComponentStateCB).not.toHaveBeenCalled();
  });
});
