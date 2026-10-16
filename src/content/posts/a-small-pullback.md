---
title: "A small observation about pullbacks"
slug: a-small-pullback
date: 2026-10-15
summary: "A short development specimen: why pulling back an identity map changes nothing, and how to link a longer explanation."
tags: [category-theory]
draft: true
specimen: true
series:
  name: Mathematical writing specimens
  order: 1
---

This is a **development specimen**, not a published article by Vihaan Dheer.
It shows how a short mathematical note can read without numbered results or
a long contents list.

Suppose we have a map $g\colon B\to C$. What happens if we pull it back along
the identity map of $C$? The answer is already hiding in the elements:

$$
C\times_C B=\{(c,b)\in C\times B\mid c=g(b)\}.
$$

Once $b$ is chosen, there is exactly one possible $c$. Projection to $B$
therefore gives a bijection, and its inverse sends $b$ to $(g(b),b)$. For
abelian groups these maps are homomorphisms too. Nothing mysterious happens;
the extra coordinate records information we already had.

## The useful habit {#useful-habit}

When a universal construction seems abstract, it can help to identify the
maps that are forced. In this example the second projection is forced by the
description, and the first coordinate of its inverse is forced by the
compatibility equation. The longer specimen makes that habit precise in
:ref[mathematical-writing-specimen#universal-property].

This note uses the unchanged site-wide macro $\cF=\mathcal{F}$.
A different post may override the command without changing this page.

The [Stacks Project's definition of a fibre product](https://stacks.math.columbia.edu/tag/001U)
gives the categorical formulation. For the present observation, a pair of
coordinates is enough.
