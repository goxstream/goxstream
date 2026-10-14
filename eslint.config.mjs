import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

const eslintConfig = [
	{
		ignores: [
			"**/node_modules/**",
			"**/.next/**",
			"**/.turbo/**",
			"**/.wrangler/**",
			"**/.open-next/**",
			"**/.react-router/**",
			"**/build/**",
			"**/dist/**",
			"**/out/**",
			"**/coverage/**",
			"**/playwright-report/**",
			"**/test-results/**",
			"**/public/ffmpeg/**",
			"temp/**",
		],
	},
	...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
