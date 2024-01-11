module.exports = {
	'src/**/*.{js,jsx,ts,tsx}': ['prettier --write'],
	'{!(package)*.json,*.code-snippets,.!(browserslist)*rc}': ['prettier --write--parser json'],
	'package.json': ['prettier --write'],
	'src/**/*.{scss,less,html}': ['prettier --write'],
	'*.md': ['prettier --write']
};
