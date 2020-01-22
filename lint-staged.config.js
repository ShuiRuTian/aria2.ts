// Configuration for git hook tool -- husky
module.exports = {
  "**/*.{js,jsx,ts,tsx}": [
    "eslint --fix", "git add",
  ],
};
