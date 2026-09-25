const users = [
  { id: 1, name: "Mohamed", email: "mohamed@example.com" },
  { id: 2, name: "Alice", email: "alice@example.com" },
  { id: 3, name: "Bob", email: "bob@example.com" }
];

function getUserById(id) {
  return users.find(user => user.id === id);
}

module.exports = {
  getUserById
};