---
title: "The homotopy hypothesis"
slug: my-first-post
date: '2026-10-16'
summary: "A sample blog post discussing the homotopy hypothesis, relating the ∞-category of ∞-groupoids with the ∞-category of topological spaces."
tags: [algebra]
draft: true
macros: |
  \newcommand{\Ab}{\mathbf{Ab}}
  \newcommand{\evone}{\mathrm{ev}_{1}}
---

## Background

Let $\scr{C}$ be an $\infty$-category. The inclusion $\Lambda^2_1\mono\Delta^2$ induces a trivial fibration
$$
\iHom(\Delta^2,\scr{C})\to\iHom(\Lambda^2_2,\scr{C})
$$
This means that if $f\colon a\to b$ and $g\colon b\to c$ are morphisms in $\scr{C}$, there is a canonical contractible $\infty$-groupoid of composites equipped with 2-simplices witnessing the composition.


This is an instructional draft, not a finished post. Replace the example with
your own exposition before changing `draft` to `false`.

## Evaluation at one {#evaluation}

For an abelian group $A$, a homomorphism $u\colon \ZZ\to A$ is determined
by $u(1)$. The naturality diagram in :ref[diag:naturality] records how this
observation behaves under a homomorphism $f\colon A\to B$.

:::lemma[Evaluation]{#lem:evaluation}
The map $\evone\colon \Hom_{\Ab}(\ZZ,A)\to A$ is an isomorphism of
abelian groups.
:::
:::proof
Given $a\in A$, define $u_a(n)=na$. Then $u_a(1)=a$, while every homomorphism
$u\colon\ZZ\to A$ satisfies $u(n)=nu(1)$. Both constructions preserve addition.
They are inverse to one another:
$$
\begin{aligned}
\evone(u_a) &= a, \\
u_{\evone(u)}(n) &= nu(1)=u(n).
\end{aligned}
\label{eq:evaluation}
$$
This completes the proof, as desired. 
:::

The identities in :ref[eq:evaluation] prove :ref[lem:evaluation]. For each
$f\colon A\to B$, they give the commutative square below.[^naturality]
```tikzcd {#diag:naturality}
\begin{tikzcd}[column sep=large, row sep=large]
\Hom_{\Ab}(\ZZ,A) \arrow[r, "\evone", "\cong"'] \arrow[d, "f\circ(-)"'] & A \arrow[d, "f"] \\
\Hom_{\Ab}(\ZZ,B) \arrow[r, "\evone", "\cong"'] & B
\end{tikzcd}
```
This is an example of a commutative diagram.

:::remark[Notation]{unnumbered}
The command $\ZZ$ comes from the shared macro file. The commands $\Ab$ and
$\evone$ are local to this post and are also available in its diagram.
:::

## References {#references}

For background on naturality, see Saunders Mac Lane,
[*Categories for the Working Mathematician*, second edition](https://doi.org/10.1007/978-1-4757-4721-8).

[^naturality]: The square is an example of a natural isomorphism between the
    functor $\Hom_{\Ab}(\ZZ,-)$ and the identity functor on abelian groups.
