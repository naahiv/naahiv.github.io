---
title: 'Vector bundles on A² − 0'
slug: vector-bundles-on-the-punctured-plane
date: '2026-10-16'
summary: 'The punctured affine plane is a non-affine scheme on which every vector bundle is trivial.'
tags: [algebraic-geometry, vector-bundles, quillen-suslin]
draft: false
macros: |
  \newcommand{\A}{\mathbb{A}}
  \renewcommand{\O}{\mathcal{O}}
  \newcommand{\E}{\mathcal{E}}
  \newcommand{\F}{\mathcal{F}}
  \newcommand{\wt}[1]{\widetilde{#1}}
  \DeclareMathOperator{\Vect}{Vect}
  \DeclareMathOperator{\depth}{depth}
---

The Quillen–Suslin theorem says that every vector bundle over affine space over a field is trivial. There are also non-affine schemes with this property. The goal of this post is to prove one example, namely the punctured affine plane.

Let $k$ be a field, write $\A_k^2=\Spec(k[x,y])$, and set
$$
U:=\A_k^2\setminus0=\A_k^2\setminus\{(x,y)\}.
$$
Throughout, a vector bundle means a locally free sheaf of finite rank. Following the terminology in my paper, a scheme is *Serre* if every vector bundle on it is trivial. More generally, a morphism $f\colon X\to Y$ is Serre if the induced functor
$$
f^*\colon\Vect(Y)\longrightarrow\Vect(X)
$$
is essentially surjective. Observe that if $f$ is Serre and $Y$ is a Serre scheme, then $X$ too is a Serre scheme, because pullback preserves trivial bundles.

:::theorem{#punctured-plane}
The open immersion $j\colon U\hookrightarrow\A_k^2$ is a Serre morphism of schemes. In particular, $U$ is a non-affine Serre scheme.
:::

We will use the Quillen–Suslin theorem in this proof. Its proof is divided into :post[quillen-suslin-1] and :post[quillen-suslin-2]; the version we need allows a PID as the coefficient ring.

For any open immersion $j\colon U\hookrightarrow X$, there is a canonical isomorphism $j^*j_*\E\cong\E$. Hence, if the pushforward of every vector bundle on $U$ is a vector bundle on $X$, then $j$ is Serre. This is how we will prove the theorem. The argument proceeds in three steps: $j_*\E$ is coherent, it is reflexive, and finally it is locally free.

## The punctured plane {#punctured-plane-functions}

We must first study the open subscheme $U\subset\A_k^2$. Observe that $D(x)\cup D(y)=U$ and $D(x)\cap D(y)=D(xy)$. Therefore the sheaf condition shows that
$$
\begin{CD}
\Gamma(U,\O_U) @>>> k[x^{\pm1},y] \\
@VVV @VVV \\
k[x,y^{\pm1}] @>>> k[x^{\pm1},y^{\pm1}]
\end{CD}
$$
is a pullback square. Both maps to the bottom-right corner are inclusions, and so
$$
\Gamma(U,\O_U)
=k[x^{\pm1},y]\cap k[x,y^{\pm1}]
=k[x,y].
$$
Indeed, a Laurent polynomial belonging to the first ring has no negative powers of $y$, and one belonging to the second has no negative powers of $x$.

In particular, the restriction map
$$
\Gamma(\A_k^2,\O_{\A_k^2})\longrightarrow\Gamma(U,\O_U)
$$
is an isomorphism. If $U$ were affine, the open immersion $j$ would therefore be an isomorphism of affine schemes, which it is not. Thus $U$ is non-affine.

## Coherence {#coherence}

The schemes $\A_k^2$ and $U$ are Noetherian. The open immersion $j$ is quasicompact and quasiseparated, so $j_*$ preserves quasicoherence. Moreover, over a Noetherian scheme, a quasicoherent sheaf is coherent exactly when it is of finite type. Any vector bundle $\E$ on $U$ is coherent; we need to show that its pushforward is of finite type as well.

:::lemma{#coherent-pushforward}
Let $\E$ be a vector bundle on $U$. Then $j_*\E$ is coherent on $\A_k^2$.
:::

:::proof
Set $R=k[x,y]$. Since $\A_k^2$ is affine, we can write
$$
j_*\E=\wt M,
\qquad
M=\Gamma(\A_k^2,j_*\E)=\Gamma(U,\E).
$$
It suffices to prove that $M$ is a finitely generated $R$-module.

Consider the affine open cover $\{D(x),D(y)\}$ of $U$. We claim that both opens are Serre schemes. Indeed,
$$
D(x)=\Spec(k[x^{\pm1}][y]),
\qquad
D(y)=\Spec(k[y^{\pm1}][x]),
$$
and $k[z^{\pm1}]=k[z]_z$ is a PID, being a localization of a PID. The Quillen–Suslin theorem therefore applies to both rings. Thus we can choose trivializations
$$
\E|_{D(x)}\cong\O_{D(x)}^{\oplus n},
\qquad
\E|_{D(y)}\cong\O_{D(y)}^{\oplus n}.
$$
The ranks agree because the overlap is nonempty and connected.

Let $T\in\mathrm{GL}_n(R_{xy})$ be the transition matrix which converts the second trivialization to the first on $D(xy)$. The sheaf condition identifies the global sections with
$$
M\cong R_x^{\oplus n}\cap T R_y^{\oplus n}
\subset R_{xy}^{\oplus n}.
$$
Choose $a\geq0$ large enough to clear all powers of $x$ from the denominators of the entries of $T$. Then $x^aT$ has entries in $R_y$, and consequently
$$
x^aM
\subset R_x^{\oplus n}\cap R_y^{\oplus n}
=R^{\oplus n}.
$$
It follows that $M$ is an $R$-submodule of the finite free module $x^{-a}R^{\oplus n}$. Since $R$ is Noetherian, $M$ is finitely generated, as required.
:::

The bound on the denominators is needed here. The sheaf condition alone gives an injection into $R_x^{\oplus n}\oplus R_y^{\oplus n}$, but those localized modules are not finite over $R$.

## Reflexivity {#reflexivity}

It is at this point that we need some more powerful tools, namely reflexive sheaves. If $\F$ is a coherent sheaf on a locally Noetherian scheme $X$, write
$$
\F^*:=\mathcal{H}om_{\O_X}(\F,\O_X),
\qquad
\F^{**}:=\mathcal{H}om_{\O_X}(\F^*,\O_X)
$$
for its dual and double dual. We say that $\F$ is *reflexive* if the canonical evaluation map $\F\to\F^{**}$ is an isomorphism. Every vector bundle is reflexive. For coherent sheaves over a locally Noetherian scheme, duals commute with localization, so reflexivity can be checked on stalks.

We use the following facts, which are the same ingredients as in the paper.

:::proposition{#reflexive-facts}
Let $X$ be a locally Noetherian scheme and $\F$ a coherent sheaf on $X$.

1. Suppose $j\colon U\hookrightarrow X$ is an open immersion and $\depth(\F_z)\geq2$ for every $z\in X\setminus U$. Then the canonical map $\F\to j_*j^*\F$ is an isomorphism. See [Stacks, Tag 0E9I](https://stacks.math.columbia.edu/tag/0E9I).

2. If $X$ is integral, then $\F^{**}$ is coherent and reflexive. See [Stacks, Tag 0EBH](https://stacks.math.columbia.edu/tag/0EBH).

3. If $X$ is integral, $\F$ is reflexive, and $\depth(\O_{X,z})\geq2$, then $\depth(\F_z)\geq2$. See [Stacks, Tag 0EBI](https://stacks.math.columbia.edu/tag/0EBI).
:::

The first statement says that a coherent sheaf with sufficient depth at the missing points can be recovered from its restriction. This is the scheme-theoretic ingredient of the argument; the other statements follow from their commutative algebra counterparts.

:::theorem{#reflexive-pushforward}
Let $\E$ be a vector bundle on $U\subset\A_k^2$. Then $j_*\E$ is a coherent reflexive sheaf on $\A_k^2$.
:::

:::proof
Set $\F=j_*\E$, which is coherent by :ref[coherent-pushforward]. Its double dual $\F^{**}$ is reflexive by :ref[reflexive-facts](2). Since $j$ is an open immersion,
$$
j^*(\F^{**})\cong(j^*\F)^{**}\cong\E^{**}\cong\E.
$$
At the origin, the local ring
$$
\O_{\A_k^2,0}=k[x,y]_{(x,y)}
$$
is regular local of dimension and depth two. Applying :ref[reflexive-facts](3) to $\F^{**}$ gives
$$
\depth(\F^{**}_0)\geq2.
$$
The origin is the only point outside $U$, so :ref[reflexive-facts](1) now shows that the canonical map
$$
\F^{**}\longrightarrow j_*j^*(\F^{**})
$$
is an isomorphism.

To check that this makes $\F$ reflexive, consider the natural square
$$
\begin{CD}
\F @>>> \F^{**} \\
@VVV @VVV \\
j_*j^*\F @>>> j_*j^*(\F^{**}).
\end{CD}
$$
The left arrow is an isomorphism because $\F=j_*\E$, the right arrow is an isomorphism by the depth argument, and the bottom arrow is an isomorphism because $\E$ is locally free. Hence the top arrow, which is the evaluation map, is an isomorphism as well.
:::

## Local freeness {#local-freeness}

We can finish with one additional commutative algebra lemma.

:::lemma{#regular-local-free}
Let $R$ be a regular local ring. Any finite maximal Cohen–Macaulay $R$-module is free.
:::

This is [Stacks, Tag 00NT](https://stacks.math.columbia.edu/tag/00NT). Recall that a nonzero finite module is maximal Cohen–Macaulay when its depth equals $\dim R$. One way to see the lemma is the Auslander–Buchsbaum formula: a finite module over a regular local ring has finite projective dimension, and
$$
\operatorname{pd}_R M+\depth M=\depth R=\dim R.
$$
Thus a maximal Cohen–Macaulay module has projective dimension zero, and finite projective modules over a local ring are free.

:::corollary{#reflexive-locally-free}
Every coherent reflexive sheaf on $\A_k^2$ is a vector bundle.
:::

:::proof
Let $\F$ be such a sheaf and $z\in\A_k^2$. The local ring $R=\O_{\A_k^2,z}$ is regular, with dimension $0$, $1$, or $2$. We consider these cases separately.

If $\dim R=0$, then $R$ is a field and the finite $R$-module $\F_z$ is free. If $\dim R=1$, then $R$ is a discrete valuation ring. A reflexive module over a domain is torsion-free, so the finite module $\F_z$ is again free.

Finally, suppose $\dim R=2$. Since a regular local ring has depth equal to its dimension, :ref[reflexive-facts](3) gives $\depth(\F_z)\geq2$. If $\F_z\neq0$, its depth is at most $\dim R=2$, so it is maximal Cohen–Macaulay. By :ref[regular-local-free], it is free; the zero module is free as well.

Thus every stalk of $\F$ is finite free. Since $\F$ is coherent, a basis at a stalk extends to a basis on some neighborhood, so $\F$ is locally free.
:::

We have now completed all three steps. Given a vector bundle $\E$ on $U$, the sheaf $j_*\E$ is coherent by :ref[coherent-pushforward], reflexive by :ref[reflexive-pushforward], and locally free by :ref[reflexive-locally-free]. Since
$$
j^*j_*\E\cong\E,
$$
the immersion $j$ is Serre. The Quillen–Suslin theorem says that the vector bundle $j_*\E$ on $\A_k^2$ is trivial, and pulling back shows that $\E$ is trivial as well. Together with the calculation of global functions, this proves :ref[punctured-plane].

We have at last shown that $\A_k^2\setminus0$ is a Serre scheme which is not affine.

For the proof of Quillen–Suslin used here, see :post[quillen-suslin-1] and :post[quillen-suslin-2]. For more context about Serre schemes and morphisms, see [the paper version, *Serre Schemes and the Quillen–Suslin Theorem*](/serre-schemes.pdf).
