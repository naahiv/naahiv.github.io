---
title: {{TITLE_YAML}}
slug: {{SLUG}}
date: '{{DATE}}'
summary: "An instructional starter demonstrating a small mathematical argument, references, and a native TikZ-CD diagram. Replace this summary and example before publishing."
tags: [algebra]
draft: true
macros: |
  \newcommand{\Ab}{\mathrm{Ab}}
  \newcommand{\evone}{\mathrm{ev}_{1}}
---

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
:::

The identities in :ref[eq:evaluation] prove :ref[lem:evaluation]. For each
$f\colon A\to B$, they give the commutative square below.[^naturality]

```tikzcd {#diag:naturality caption="Evaluation is natural in the abelian group." description="The upper row is Hom from the integers to A mapping by evaluation at 1 to A. The lower row is Hom from the integers to B mapping by evaluation at 1 to B. The left vertical arrow is postcomposition by f and the right vertical arrow is f. Both paths send u to f(u(1)), so the square commutes."}
\begin{tikzcd}[column sep=large, row sep=large]
\Hom_{\Ab}(\ZZ,A) \arrow[r, "\evone", "\cong"'] \arrow[d, "f\circ(-)"'] & A \arrow[d, "f"] \\
\Hom_{\Ab}(\ZZ,B) \arrow[r, "\evone", "\cong"'] & B
\end{tikzcd}
```

:::remark[Notation]{unnumbered}
The command $\ZZ$ comes from the shared macro file. The commands $\Ab$ and
$\evone$ are local to this post and are also available in its diagram.
:::

## References {#references}

For background on naturality, see Saunders Mac Lane,
[*Categories for the Working Mathematician*, second edition](https://doi.org/10.1007/978-1-4757-4721-8).

[^naturality]: The square is an example of a natural isomorphism between the
    functor $\Hom_{\Ab}(\ZZ,-)$ and the identity functor on abelian groups.
