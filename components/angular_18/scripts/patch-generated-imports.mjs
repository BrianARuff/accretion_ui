import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const targetFile = resolve(process.cwd(), 'src/lib/stencil-generated/components.ts');

const replacements = [
  {
    from: /import type \{ AccordionItemElement as ([^}]+) \} from '@accretion_ui\/core\/dist\/components';/g,
    to: "import type { AccordionItemElement as $1 } from '@accretion_ui/core';"
  },
  {
    from: /import type \{ AccordionToggleRequestDetail as ([^}]+) \} from '@accretion_ui\/core\/dist\/components';/g,
    to: "import type { AccordionToggleRequestDetail as $1 } from '@accretion_ui/core';"
  },
  {
    from: /import type \{ AccordionFocusRequestDetail as ([^}]+) \} from '@accretion_ui\/core\/dist\/components';/g,
    to: "import type { AccordionFocusRequestDetail as $1 } from '@accretion_ui/core';"
  }
];

const current = readFileSync(targetFile, 'utf8');
const next = replacements.reduce((source, replacement) => source.replace(replacement.from, replacement.to), current);

if (next !== current) {
  writeFileSync(targetFile, next, 'utf8');
}
