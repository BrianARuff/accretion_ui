import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageDir = dirname(dirname(fileURLToPath(import.meta.url)));
const distDir = join(packageDir, 'dist');
const distPackagePath = join(distDir, 'package.json');
const sourceCssPath = join(packageDir, 'predefine.css');
const distCssPath = join(distDir, 'predefine.css');
const runtimeInputFieldsByClass = {
  AccretionAccordion: ['collapsible', 'disabled', 'focusLoop', 'loop', 'orientation', 'sizeVariant', 'type'],
  AccretionAccordionHeader: ['level'],
  AccretionAccordionItem: ['disabled', 'open', 'value'],
  AccretionAccordionPanel: ['hiddenUntilFound', 'keepMounted'],
  AccretionAccordionTrigger: ['disabled'],
  AccretionButton: ['disabled', 'variant']
};

if (!existsSync(distPackagePath)) {
  throw new Error(`Missing Angular dist package.json at ${distPackagePath}`);
}

const stripRuntimeInputFields = (source) =>
  Object.entries(runtimeInputFieldsByClass).reduce((currentSource, [className, fieldNames]) => {
    const classPattern = new RegExp(`(let ${className} = class ${className} \\{\\n)([\\s\\S]*?)(\\n    constructor\\()`, 'g');

    return currentSource.replace(classPattern, (match, classStart, classBody, constructorStart) => {
      const filteredClassBody = classBody
        .split('\n')
        .filter((line) => !fieldNames.some((fieldName) => line.trim() === `${fieldName};`))
        .join('\n');

      const nextClassSource = `${classStart}${filteredClassBody}${constructorStart}`;

      return nextClassSource === match ? match : nextClassSource;
    });
  }, source);

const patchCompiledRuntime = (filePath) => {
  if (!existsSync(filePath)) {
    return;
  }

  const current = readFileSync(filePath, 'utf8');
  const next = stripRuntimeInputFields(current);

  if (next !== current) {
    writeFileSync(filePath, next, 'utf8');
  }
};

mkdirSync(distDir, { recursive: true });
cpSync(sourceCssPath, distCssPath);

const packageJson = JSON.parse(readFileSync(distPackagePath, 'utf8'));
packageJson.exports = {
  ...(packageJson.exports ?? {}),
  './predefine.css': {
    default: './predefine.css'
  }
};

writeFileSync(distPackagePath, `${JSON.stringify(packageJson, null, 2)}\n`);

patchCompiledRuntime(join(distDir, packageJson.main));
patchCompiledRuntime(join(distDir, 'esm2022/lib/stencil-generated/components.mjs'));
