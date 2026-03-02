import { Config } from '@stencil/core';
import { reactOutputTarget } from '@stencil/react-output-target';
import { angularOutputTarget } from '@stencil/angular-output-target';

export const config: Config = {
  namespace: 'accretion',
  srcDir: 'src',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader'
    },
    {
      type: 'dist-custom-elements',
      customElementsExportBehavior: 'single-export-module',
      generateTypeDeclarations: true
    },
    reactOutputTarget({
      outDir: '../react/src/generated',
      stencilPackageName: '@accretion/core',
      customElementsDir: 'dist/components'
    }),
    angularOutputTarget({
      componentCorePackage: '@accretion/core',
      directivesProxyFile: '../angular/src/lib/stencil-generated/components.ts',
      directivesArrayFile: '../angular/src/lib/stencil-generated/index.ts',
      outputType: 'component'
    }),
    {
      type: 'docs-readme'
    }
  ]
};
