import nextConfig from "eslint-config-next";

export default [
  {
    ignores: ["node_modules", ".next", "dist", "out"]
  },
  ...nextConfig,
  {
    rules: {
      "react/no-unescaped-entities": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/purity": "off",
      "react-hooks/static-components": "off",
      "import/no-anonymous-default-export": "off"
    }
  }
];

