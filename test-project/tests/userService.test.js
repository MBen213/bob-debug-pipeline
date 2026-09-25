const { getUserById } = require("../src/userService");

describe("getUserById", () => {
  test("should return a user when the ID exists", () => {
    const user = getUserById(1);

    expect(user).toEqual({
      id: 1,
      name: "Mohamed",
      email: "mohamed@example.com"
    });
  });

  test("should return null when the ID does not exist", () => {
    const user = getUserById(999);

    expect(user).toBeNull();
  });
});