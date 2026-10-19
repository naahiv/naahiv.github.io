# Quiver support for native diagrams

`quiver.sty` and `LICENSE` are unmodified copies from
[varkor/quiver, commit 792731ac3566983496d89f7ee71dc08c6f7977df](https://github.com/varkor/quiver/tree/792731ac3566983496d89f7ee71dc08c6f7977df),
version 1.6.0 (2025-09-20), under the MIT license.

The compiler copies this package into its isolated working directory and loads
it normally. This supplies Quiver's `curve` and `between` styles, including arrows
between arrows, without depending on the host's Quiver version. The existing
TeX Live installation supplies TikZ-CD and the `spath3` library. Version 1.6.0
avoids the additional `nfold` dependency introduced in Quiver 1.7.0.

The bundled bytes participate in the diagram cache key. Package updates require
native fixture tests and desktop/phone visual checks. This package is separate
from the preserved public `/quiver-macros.tex` notation asset.
