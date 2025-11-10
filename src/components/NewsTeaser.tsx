Run npm run build

> build
> vite build

The CJS build of Vite's Node API is deprecated. See https://vite.dev/guide/troubleshooting.html#vite-cjs-node-api-deprecated for more details.
vite v5.4.21 building for production...
transforming...
✓ 39 modules transformed.
x Build failed in 408ms
error during build:
src/App.tsx (6:7): "default" is not exported by "src/components/NewsTeaser.tsx", imported by "src/App.tsx".
file: /home/runner/work/ASV-mE1/ASV-mE1/src/App.tsx:6:7

4: import LivePlan from './components/LivePlan';
5: import LiveTickerBadge from './components/LiveTickerBadge';
6: import NewsTeaser from './components/NewsTeaser';
          ^
7: import Roster from './components/Roster';
8: import { useNuTab } from './hooks/useNuTab';

    at getRollupError (file:///home/runner/work/ASV-mE1/ASV-mE1/node_modules/rollup/dist/es/shared/parseAst.js:401:41)
    at error (file:///home/runner/work/ASV-mE1/ASV-mE1/node_modules/rollup/dist/es/shared/parseAst.js:397:42)
    at Module.error (file:///home/runner/work/ASV-mE1/ASV-mE1/node_modules/rollup/dist/es/shared/node-entry.js:16946:16)
    at Module.traceVariable (file:///home/runner/work/ASV-mE1/ASV-mE1/node_modules/rollup/dist/es/shared/node-entry.js:17400:29)
    at ModuleScope.findVariable (file:///home/runner/work/ASV-mE1/ASV-mE1/node_modules/rollup/dist/es/shared/node-entry.js:15067:39)
    at FunctionScope.findVariable (file:///home/runner/work/ASV-mE1/ASV-mE1/node_modules/rollup/dist/es/shared/node-entry.js:5641:38)
    at FunctionBodyScope.findVariable (file:///home/runner/work/ASV-mE1/ASV-mE1/node_modules/rollup/dist/es/shared/node-entry.js:5641:38)
    at Identifier.bind (file:///home/runner/work/ASV-mE1/ASV-mE1/node_modules/rollup/dist/es/shared/node-entry.js:5415:40)
    at CallExpression.bind (file:///home/runner/work/ASV-mE1/ASV-mE1/node_modules/rollup/dist/es/shared/node-entry.js:2802:28)
    at CallExpression.bind (file:///home/runner/work/ASV-mE1/ASV-mE1/node_modules/rollup/dist/es/shared/node-entry.js:12114:15)
Error: Process completed with exit code 1.
