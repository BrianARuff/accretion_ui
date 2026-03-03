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
      stencilPackageName: '@accretion_ui/core',
      customElementsDir: 'dist/components'
    }),
    angularOutputTarget({
      componentCorePackage: '@accretion_ui/core',
      directivesProxyFile: '../angular/src/lib/stencil-generated/components.ts',
      directivesArrayFile: '../angular/src/lib/stencil-generated/index.ts',
      outputType: 'standalone',
      customElementsDir: 'dist/components'
    }),
    angularOutputTarget({
      componentCorePackage: '@accretion_ui/core',
      directivesProxyFile: '../angular_21/src/lib/stencil-generated/components.ts',
      directivesArrayFile: '../angular_21/src/lib/stencil-generated/index.ts',
      outputType: 'standalone',
      customElementsDir: 'dist/components'
    }),
    {
      type: 'docs-readme'
    }
  ]
};
