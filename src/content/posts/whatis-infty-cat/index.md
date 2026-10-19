---
title: 'What is an $\infty$-category?'
slug: whatis-infty-cat
date: '2026-10-16'
summary: 'What is an (∞,1)-category, why should we care, and what does it have to do with homotopy theory?'
tags: [infinity-categories, soft-post, what-is]
draft: true
series:
  name: 'What-Is'
  order: 1
macros: |
  \newcommand{\Ob}{\operatorname{Ob}}
  \newcommand{\Cat}{\mathbf{Cat}}
  \newcommand{\Fun}{\operatorname{Fun}}
---

I'm a big proponent of the use of higher categories in all sorts of mathematics. This post will discuss why one would naturally be led to think about $\infty$-categories, and why they might be led to model them using simplicial sets, i.e. as weak Kan complexes. The prerequisite for most of this post is a basic understanding of category theory.
:::remark{unnumbered}
This post ignores all considerations of set theory, even though they can be quite important when discussing specific models of $(\infty,1)$-categories. As usual, everything is repaired (with some difficulty) by using Grothendieck universes.
:::

## From categories to higher categories

As we know, a category is a mathematical object $\scr{C}$ equipped with the following data:

0. A collection of objects $\Ob(\scr{C})$.
1. For any two objects $X,Y$ in $\Ob(\scr{C})$, a collection of morphisms $\Hom_{\scr{C}}(X,Y)$ from $X$ to $Y$.
2. For any objects $X,Y,Z$ and morphisms $f\colon X\to Y$ and $g\colon Y\to Z$, a morphism $g\circ f\colon X\to Z$.

Composition of morphisms should be associative and unital (with respect to an *identity morphism* $1_X\colon X\to X$ for each object $X$). Among the first few things one learns about categories is that there is a good notion of map between them, namely we have functors $F\colon\scr{C}\to\scr{D}$. These compose associatively, and each category has an identity functor $\id_{\scr{C}}\colon\scr{C}\to\scr{C}$, so we can assemble them into a category $\Cat$ of all categories.

### Morphisms between morphisms

There is new structure in $\Cat$ which does not appear in the familiar categories such as $\mathbf{Set},\mathbf{Ab}$, etc.: There is a natural notion of map between two morphisms, namely natural transformations $\eta\colon F\to G$ between functors. Moreover these are not completely 'free' with respect to the functors, but rather there are relations: For one thing, the functors between $\scr{C}$ and $\scr{D}$ form a new category $\Fun(\scr{C},\scr{D})$ whose morphisms are natural transformations. Moreover, given three categories $\scr{C},\scr{D},\scr{E}$, we have a composition *functor* of the form
$$
\circ\colon\Fun(\scr{D},\scr{E})\times\Fun(\scr{C},\scr{D})\to\Fun(\scr{C},\scr{E})
$$
sending $(G,F)\mapsto G\circ F$. This must act on natural transformations too.

Such a mathematical structure $\mathbf{C}$ is called a *strict 2-category*, or a category *enriched in categories*: it has objects $\scr{A},\scr{B},\dots$, and for each such pair a category $\mathbf{C}(\scr{A},\scr{B})$ of morphisms between them, with composition functors as above satisfying some standard properties.

:::remark[Morphisms between morphisms]{collapsed}
Sometimes one means something different by 'morphisms between morphisms', which is that a morphism between $f\colon X\to X'$ and $g\colon Y\to Y'$ in a category should be a commutative diagram:
```tikzcd {#diag:morphism-of-arrows}
\begin{tikzcd}
	X & Y \\
	{X'} & {Y'}
	\arrow[from=1-1, to=1-2]
	\arrow["f"', from=1-1, to=2-1]
	\arrow["g", from=1-2, to=2-2]
	\arrow[from=2-1, to=2-2]
\end{tikzcd}
```
This is also known as a morphism $f\to g$ in the arrow category $\operatorname{Arr}(\scr{C})$. In this post what we will mean is a morphism between two *parallel* arrows, which in other words means that $Y=X$ and $X'=Y'$, and the horizontal maps in the square above are required to be $1_X$ and $1_{X'}$. Thus in the case of a classical category, this can only express an equality $f=g$.
:::

Okay, so $\Cat$ forms a (strict) 2-category. As good category theorists our next step should be to ask what maps between 2-categories are. Well, it should be an assignment $F\colon\mathbf{C}\to\mathbf{C}'$ sending $\mathscr{A}\mapsto F(\scr{A})$, and inducing a functor
$$
F_*\colon\mathbf{C}(\scr{A},\scr{B})\to\mathbf{C}'\big(F(\scr{A}),F(\scr{B})\big)
$$
for all pairs of objects (plus some other conditions). Then we can see there's a natural notion of morphism of two such functors $F\to F'$ which is a sort of **strict 2-natural transformation**: It is, for each $\scr{A}$ in $\mathbf{C}$, an object of $\mathbf{C}'(F(\scr{A}),F'(\scr{A}))$ making some natural diagrams commute. 

At this point a new structure appears: if we consider two strict 2-natural transformations $\alpha,\beta\colon F\to F'$ between our strict 2-functors of strict 2-categories, there is a natural notion of a map between them, called a **modification**: For each object $\scr{A}$ of $\mathbf{C}$, the associated 1-morphisms $\alpha_{\scr{A}},\beta_{\scr{A}}\colon F(\scr{A})\to F'(\scr{A})$ are *objects* of a given category, and we may consider morphisms between these objects. One pictures this situation as follows:

```tikzcd {#diag:modifications caption="A modification between 2-natural transformations between 2-functors between 2-categories"}
\begin{tikzcd}
	{\mathbf{C}} &&&& {\mathbf{C}'}
	\arrow[""{name=0, anchor=center, inner sep=0}, "F", curve={height=-30pt}, from=1-1, to=1-5]
	\arrow[""{name=1, anchor=center, inner sep=0}, "{F'}"', curve={height=30pt}, from=1-1, to=1-5]
	\arrow[""{name=2, anchor=center, inner sep=0}, "\alpha"', shift right=5, curve={height=12pt}, between={0.2}{0.8}, Rightarrow, from=0, to=1]
	\arrow[""{name=3, anchor=center, inner sep=0}, "\beta", shift left=5, curve={height=-12pt}, between={0.2}{0.8}, Rightarrow, from=0, to=1]
	\arrow["f", between={0.2}{0.8}, Rightarrow, from=2, to=3]
\end{tikzcd}
```

In other words, the collection of 2-functors between our pair of 2-categories now itself forms a 2-category, in the same way that the functors between a pair of categories forms a category. So, if we consider the collection of all *2-categories*, it will naturally have a notion of object, 1-morphism (2-functor), 2-morphism (2-natural transformation), and 3-morphism (modification). Extrapolating, we are led to the following pseudo-definition:

:::definition[strict $n$-category]{unnumbered}
A *strict $0$-category* is a set. For $n\geq1$, a *strict $n$-category* $\mathbf{C}$ is a collection of objects, equipped with a strict $(n-1)$-category $\mathbf{C}(\scr{A},\scr{B})$ for each pair of objects $\scr{A}$ and $\scr{B}$, satisfying various coherence laws.
:::

In practice, even for $n=3$, it is quite difficult to write down exactly what these coherences are, much less check them in a given situation. Our example from above showed that the collection of all $n$-categories should form an $(n+1)$-category. On the other hand, given a specific $n$-category, the collection of morphisms between two objects forms an $(n-1)$-category (by definition). Thus dealing with an $n$-category simultaneously requires a good theory of three different objects, $(n+1)$-categories, $n$-categories, and $(n-1)$-categories, which all in principal behave differently. 

:::example
The case of ordinary category theory is $n=1$: to use categories we need to understand sets and categories themselves, and our theory of natural transformations is a manifestation of 2-categorical reasoning creeping in.
:::

:::motivation
An *$\infty$-category* should simultaneously have the data of an $n$-category for all $n\geq0$, including all possible coherence conditions. The collection of functors between two $\infty$-categories should be another $\infty$-category. The collection of all $\infty$-categories should form another $\infty$-category.
:::

The first problem is that there is no obvious way to write down what axioms such a thing should satisfy. More importantly, why exactly is it useful in practice to work with $n$-categories (beyond $n=1$ or $2$) in the first place? We will answer the second question next, which will lead us to ask for something even more general than the kind of strict $\infty$-category discussed above.

### Why $\infty$-categories? {#why-infty-cats}

More precisely, what are specific areas of math in which things start to go wrong when we only work with ordinary categories? The one-word answer is **localization**, which will be the underlying theme of this section.. More specifically, the most natural place when category theory stops working properly is when we try to consider different notions of "equivalence" than just the apparent ones, like equality or isomorphism. 

:::example{#ex:localizing-zero-cats}
Let us first try to do this for a 0-category, i.e. a set $X$. In this case, the most natural notion of equivalence of two objects (elements) is equality; but we may consider other notions, as encoded by an equivalence relation $\sim$ on $X$. Then two objects $x,y$ (elements) are *equivalent* if $x\sim y$. The process of 'localization' is that of forming the quotient: this comes with a map $q\colon X\to X/{\sim}$ and a universal property, which is that a set function out of $X/{\sim}$ is the same thing as a set function $f$ out of $X$ for which $f(x)=f(y)$ if ever $x\sim y$.
:::

Now let us go to 1-categories. As good category theorists we already know that equality of objects is not the most natural notion of equivalence, but rather isomorphism between objects is. Thus if we localize at isomorphisms, nothing should change. But there there are various situations where we want to think of other notions of eqiuvalences in categories.

:::example
In topology, an isomorphism is a homeomorphism. But we often care more (or can say more) about homotopy equivalences of spaces, especially when we want to use algebraic invariants. Here's what we can do about this:

0. Following :ref[ex:localizing-zero-cats], the most naive thing we could do is consider an equivalence relation $\sim$ on the collection of all topological spaces, where $X\sim Y$ if $X$ and $Y$ are homotopy equivalent. 
1. However one rarely stops there, because we usually want to talk about a *specific* homotopy equivalence $f\colon X\to Y$. So instead, we consider a category $\mathbf{hTop}$ whose objects are topological spaces and its morphisms are homotopy classes of continuous maps, rather than just continous maps. In this category, isomorphism means homotopy equivalence; it not only records that two spaces are homotopy equivalent, but also contains the data of *how* (i.e. by what map) they are homotopy equivalent.

It is important to remember why we do this. The $0$th case allows us to write down assignments of sets, such as
$$
H_n\colon \{\text{spaces}\}/\{\text{homotopy equivalence}\}\to\{\text{groups}\}/\{\text{isomorphism}\},
$$
because a homotopy equivalence induces an isomorphism between first homology groups. But this loses a lot structure; a more refined notion is a functor
$$
H_n\colon\mathbf{hTop}\to\mathbf{Ab},
$$
which not only includes the map on sets above, but also remembers the isomorphism of groups associated with a homotopy equivalence, and more. Moreover proving the existence of this map records an extra fact, which is that homotopic maps induce the same homomorphism on homology groups.
:::

Let us take a step back and analyze what happened in the previous example. Our objects are topological spaces, and by viewing it as a 0-category we localized and obtained a 0-category homotopy-equivalent spaces are equal. But this forgot *how* they are equal, so we viewed spaces as a 1-category and localized. This corresponded to localizing the 0-categories between any two objects at the relation of homotopy. 



## References {#references}

For background on naturality, see Saunders Mac Lane,
[*Categories for the Working Mathematician*, second edition](https://doi.org/10.1007/978-1-4757-4721-8).
