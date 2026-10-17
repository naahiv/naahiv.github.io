---
title: 'Exterior Powers 2'
slug: exterior-powers-2
date: '2026-10-16'
summary: 'Exterior powers under base change, for sheaves on ringed spaces, and for vector bundles and quasicoherent sheaves on schemes.'
tags: [algebra, algebraic-geometry]
draft: false
series:
  name: 'Exterior Powers'
  order: 2
macros: |
  \newcommand{\LA}{\Lambda}
  \renewcommand{\O}{\mathcal{O}}
  \newcommand{\F}{\cF}
  \newcommand{\G}{\cG}
  \newcommand{\E}{\mathcal{E}}
  \newcommand{\wt}[1]{\widetilde{#1}}
  \newcommand{\isoto}{\xrightarrow{\sim}}
  \DeclareMathOperator{\Mod}{Mod}
  \DeclareMathOperator{\PMod}{PMod}
---

In this post our main goal will be to study how exterior powers behave for locally free sheaves of finite constant rank, i.e. vector bundles. To build a slightly more general theory, we need some preliminaries to examine the interaction of exterior powers with base change. We continue from :post[exterior-powers-1].

## Base change {#base-change}

Let $\phi\colon A\to B$ be a ring homomorphism. Recall from algebra that we have a standard adjunction $\Mod(A)\rightleftarrows\Mod(B)$ as follows: a $B$-module $N$ is sent to $N\rvert_A$, the same underlying abelian group where $A$ acts by $\phi$, and an $A$-module is sent to the base change $M\otimes_A B$ where $B$ acts through the second factor. A few standard properties of this construction:

1. Given $B$-modules $N_1$ and $N_2$, we *do not generally have*

   $$
   (N_1\otimes_B N_2)\rvert_A=N_1\rvert_A\otimes_A N_2\rvert_A.
   $$

   E.g., under the inclusion $\RR\to\CC$, $\CC\otimes_\CC\CC=\CC$ so its restriction is $\RR^2$, but by restricting first we get $\RR^2\otimes_\RR\RR^2=\RR^4$.

2. However, given $A$-modules $M_1$ and $M_2$, there is a canonical isomorphism

   $$
   (M_1\otimes_A M_2)\otimes_A B\cong(M_1\otimes_A B)\otimes_B(M_2\otimes_A B).
   $$

   We have a map in one direction via the $A$-linear map from $M_1\otimes_A M_2$ to the RHS, sending $x\otimes y\mapsto(x\otimes1)\otimes(y\otimes1)$. We have a map in the other direction because of the $B$-bilinear map

   $$
   (x\otimes b),(y\otimes b')\mapsto (x\otimes y)\otimes bb',
   $$

   which is an inverse to the map above.

Thus, base change behaves well with respect to tensor products, and so we expect it to behave well with respect to exterior algebra. We first focus on the module structure:

:::theorem{#thm:base-change}
Let $\phi\colon A\to B$ be a ring homomorphism and $M$ an $A$-module. For each $k\geq0$, there is a unique isomorphism $\LA^k_A(M)\otimes_A B\isoto\LA^k_B(M\otimes_A B)$ such that

$$
\big(x_1\wedge\cdots\wedge x_k\big)\otimes b\mapsto b\big((x_1\otimes1)\wedge\cdots\wedge(x_k\otimes1)\big)
$$

for all $x_1,\dots,x_k\in M$. Moreover, this isomorphism is natural with respect to maps $\psi\colon M_1\to M_2$ of $A$-modules, so that the diagram

$$
\begin{CD}
\LA^k_A(M_1)\otimes_A B @>{\cong}>> \LA^k_B(M_1\otimes_A B) \\
@V{\LA^k(\psi)\otimes B}VV @VV{\LA^k(\psi\otimes B)}V \\
\LA^k_A(M_2)\otimes_A B @>{\cong}>> \LA^k_B(M_2\otimes_A B)
\end{CD}
$$

commutes.
:::

:::proof
Such a map is obviously unique, and this uniqueness immediately implies that the naturality diagram commutes. To show existence, observe that the $A$-linear unit maps $M\to (M\otimes_A B)\rvert_A$ induce a natural composite

$$
M^k\to(M\otimes_A B)^k\to\LA^k_B(M\otimes_A B)\rvert_A
$$

sending $(x_1,\dots,x_k)\mapsto((x_1\otimes1)\wedge\cdots\wedge(x_k\otimes1))$, which is an $A$-alternating map. Thus we have a map out of $\LA^k_A(M)$, and hence an adjunct

$$
\LA_A^k(M)\otimes_A B\to\LA_B^k(M\otimes_A B)
$$

providing the unique map in the theorem statement. For the inverse, consider the $B$-linear map

$$
(M\otimes_A B)^{\otimes k}\isoto M^{\otimes k}\otimes_A B\to\LA^k_A(M)\otimes_A B
$$

where the first map is the isomorphism coming from the remark above this proof, and the second is the base change of the canonical surjection. Then this satisfies

$$
(x_1\otimes b_1)\otimes\cdots\otimes(x_k\otimes b_k)\mapsto (x_1\wedge\cdots\wedge x_k)\otimes b_1\cdots b_k,
$$

which is alternating in the tensor factors, so we obtain an induced map $\LA^k_B(M\otimes_A B)\to\LA^k_A(M)\otimes_A B$ satisfying the above equation after replacing the outer tensors with wedges. This is a two-sided inverse as we can observe by plugging in $b_i=1$.
:::

:::corollary{#cor:exterior-powers-of-localization}
Let $M$ be an $A$-module.

1. If $I\subset A$ is an ideal, then there is a canonical isomorphism

   $$
   \LA^k_{A/I}(M/IM)\cong\LA^k_A(M)/I\LA^k_A(M)
   $$

   of $A/I$-modules. For example, if $\mathfrak{m}\subset A$ is a maximal ideal, then

   $$
   \LA^k_{\kappa(\mathfrak{m})}(\mathfrak{m}/\mathfrak{m}^2)\cong\LA^k_A(\mathfrak{m})\otimes_A\kappa(\mathfrak{m})
   $$

   as $\kappa(\mathfrak{m})$-vector spaces.

2. If $S\subset A$ is a multiplicative subset, then there is a canonical isomorphism

   $$
   \LA^k_{A[S^{-1}]}(M[S^{-1}])\cong\LA^k_A(M)[S^{-1}]
   $$

   of $A[S^{-1}]$-modules.
:::

Let us briefly remark that everything here works well with respect to the multiplicative structure on $\LA_A(M)$. Note that if $\phi\colon A\to B$ is a ring homomorphism and $S$ is a graded-commutative $A$-algebra, then we can form the base change $S\otimes_A B$ as a graded-commutative $B$-algebra by first forming it as a $B$-module, and then declaring

$$
(s\otimes b)(s'\otimes b')=ss'\otimes bb'
$$

as usual. Since $(-)\otimes_A B$ preserves direct sums, this inherits a natural grading. It is clear from :ref[thm:base-change] that $\LA_A(M)\otimes_A B\cong\LA_B(M\otimes_A B)$ becomes an isomorphism of graded-commutative $B$-algebras.

## For ringed spaces {#ringed-spaces}

Now let $(X,\O_X)$ be a ringed space. We will apply our constructions from the previous post to sheaves of $\O_X$-modules to construct a graded-commutative $\O_X$-algebra. We begin on the level of presheaves.

Let $F$ be a pre-$\O_X$-module, i.e. an object of $\PMod(\O_X)$. For each $k\geq0$, define a new premodule $\LA^kF$ by

$$
(\LA^kF)(U)\coloneqq\LA^k(F(U))\qquad U\subset X\text{ open}.
$$

If $U\subset V$, then $F(V)\to F(U)$ induces a natural restriction map $\LA^k(F(V))\to\LA^k(F(U))$ of $\O_X(V)$-modules given on standard wedges by

$$
x_1\wedge\cdots\wedge x_k\mapsto x_1\rvert_U\wedge\cdots\wedge x_k\rvert_U.
$$

This makes $\LA^kF$ a pre-$\O_X$-module. We claim it has the universal property that maps $\LA^kF\to G$ correspond to maps $F^{\otimes k}\to G$ which are **alternating**, in the sense that they are alternating over all sections (note that here $F^{\otimes k}$ is just as a pre-$\O_X$-module). Indeed, the canonical surjection $F^{\otimes k}\to\LA^kF$ is compatibly defined sectionwise, and from this the property is clear.

Note also that if $\phi\colon F\to G$ is a morphism of premodules, then we get an induced map $\LA^k\phi\colon\LA^k F\to\LA^k G$ because we get one sectionwise which is compatible with restriction. This defines a functor $\LA^k\colon\PMod(\O_X)\to\PMod(\O_X)$.

:::definition{#def:sheaf-exterior-power}
The functor $\LA^k$ is defined on the level of $\O_X$-modules by sheafifying, i.e. we have a commutative diagram

```tikzcd {#diag:sheafification description="Exterior powers of sheaves are obtained by including sheaves among presheaves, taking the presheaf exterior power, and sheafifying. The induced sheaf functor is dashed."}
\begin{tikzcd}[sep=scriptsize]
  {\Mod(\O_X)} & {\Mod(\O_X)} \\
  {\PMod(\O_X)} & {\PMod(\O_X)}
  \arrow["{\LA^k}", dashed, from=1-1, to=1-2]
  \arrow[hook, from=1-1, to=2-1]
  \arrow["{\LA^k}", from=2-1, to=2-2]
  \arrow["L"', from=2-2, to=1-2]
\end{tikzcd}
```

of functors where $L$ denotes sheafification.
:::

The fundamental properties of sheafification tell us firstly that if $U\subset X$ is open, then $(\LA^k_X\F)\rvert_U=\LA^k_U(\F\rvert_U)$, since this property holds on the level of premodules by definition. Secondly, to compute the stalks recall that we just need to compute the stalks of the corresponding premodule.

For $F$ a premodule, the maps $F(U)\to F_x$ induce maps $\LA^kF(U)\to\LA^k F_x$ of $\O_X(U)$-modules given by $s_1\wedge\cdots\wedge s_k\mapsto s_{1,x}\wedge\cdots\wedge s_{k,x}$, and since these are compatible with our restriction maps there is an induced map

$$
(\LA^kF)_x\to\LA^k(F_x)
$$

of $\O_X(U)$-modules for every $U$ containing $x$, and hence of $\O_{X,x}$-modules. To see that this is an isomorphism, observe that the canonical surjection induces stalk maps

$$
(F_x)^{\otimes k}\isoto(F^{\otimes k})_x\to(\LA^k F)_x
$$

which are given by

$$
[s_1]\otimes\cdots\otimes [s_k]\mapsto[s_1\wedge\cdots\wedge s_k]
$$

for sections $s_i$ defined in a neighborhood of $x$. If any two classes on the LHS are equal, then the sections agree in a small enough neighborhood, showing that the RHS is zero. Thus we get a map $\LA^k(F_x)\to(\LA^kF)_x$ which is a two-sided inverse to the natural one defined above.

:::proposition{#prop:sheaf-exterior-power-properties}
Let $(X,\O_X)$ be a ringed space and $\F$ be an $\O_X$-module.

1. For every open set $U\subset X$, we identify $\LA^k_U(\F\rvert_U)=\LA^k(\F)\rvert_U$.

2. For each $x\in X$, the canonical map $(\LA^k\F)_x\to\LA^k(\F_x)$ induced by restriction is an isomorphism of $\O_{X,x}$-modules.

3. There is a unique surjection $\F^{\otimes k}\epi\LA^k\F$ of $\O_X$-modules which on stalks corresponds to the canonical surjection $(\F_x)^{\otimes k}\to\LA^k\F_x$ under (2).

4. $\LA^k\F$ has the universal property that composition with the map of (3) induces a correspondence between maps $\LA^k\F\to\G$ and **alternating maps** $\F^{\otimes k}\to\G$, i.e. maps so that the induced map

   $$
   (\F_x)^{\otimes k}\to\G_x
   $$

   on stalks is an alternating map of $\O_{X,x}$-modules.
:::

:::proof
We already proved (1) and (2). The surjection (3) comes from the fact that we have a surjection $F^{\otimes k}\to\LA^k F$ of premodules, where $F$ is the underlying presheaf of $\F$, and then sheafifying both sides gives us the desired map. This has the desired property by construction of the isomorphism in (2).

To prove the universal property, note that a morphism of sheaves $\LA^k\F\to\G$ is the same as a morphism of presheaves $\LA^kF\to\G$ where $F$ is the underlying presheaf of $\F$. This is the same as a sectionwise alternating map $F^{\otimes k}\to\G$, which obviously implies that it is stalkwise alternating. On the other hand, if $\phi\colon F^{\otimes k}\to\G$ is stalkwise alternating, then for each $U$ and $s_1,\dots,s_k\in F(U)$,

$$
\phi(s_1\otimes\cdots\otimes s_k)_x=\phi(s_{1,x}\otimes\cdots\otimes s_{k,x})
$$

(under the identification $(F^{\otimes k})_x=(F_x)^{\otimes k}$) is zero if two of the sections are equal. Thus in that case, $\phi(s_1\otimes\cdots\otimes s_k)=0$ because $\G$ is a sheaf.
:::

Let us note that just as for tensor products, we have the canonical sheafification unit $\LA^kF\to\LA^k\F$ which is a morphism of premodules inducing an isomorphism on stalks (where again $F$ is the underlying presheaf). In particular, for each $U\subset X$ there is a map $\LA^k F(U)\to(\LA^k\F)(U)$, so given sections $s_1,\dots,s_k\in\F(U)$, we can always form their wedge product $s_1\wedge\cdots\wedge s_k$ (which is alternating) and get a section over $U$ of $\LA^k\F$. Moreover, every section restricts to a finite linear combination of such wedges on an open cover. Two sections of the presheaf $\LA^kF$ with the same image in its sheafification agree locally.

Now let us construct the graded sheaf $\LA\F$. If $F$ is a premodule, then we have a bilinear multiplication map

$$
\LA^k F\otimes \LA^l F\to\LA^{k+l}F
$$

because it exists sectionwise and is natural with respect to the restriction maps. Sheafifying, we obtain a multiplication map

$$
\LA^k\F\otimes\LA^l\F\to\LA^{k+l}\F.
$$

Using the sectionwise wedge product defined above, and the sectionwise tensor product, this is the unique map satisfying

$$
\begin{aligned}
&(s_1\wedge\cdots\wedge s_k)\otimes(t_1\wedge\cdots\wedge t_l) \\
&\qquad\mapsto s_1\wedge\cdots\wedge s_k\wedge t_1\wedge\cdots\wedge t_l
\end{aligned}
$$

on all sections. This recovers the wedge product if we take stalks. Thus, defining

$$
\LA\F\coloneqq\bigoplus_{k=0}^\infty\LA^k\F,
$$

this induces a multiplication map

$$
\LA\F\otimes\LA\F\to\LA\F,
$$

which on stalks recovers the wedge product $\LA\F_x\otimes\LA\F_x\to\LA\F_x$. This makes $\LA\F$ a graded-commutative sheaf of $\O_X$-algebras, because we can check all properties of this multiplication stalkwise. Usually, we will focus on properties of the $k$th powers themselves. As a corollary of our earlier theory, we do have the following important result:

:::proposition{#prop:sheaf-direct-sums}
Let $\F,\G$ be $\O_X$-modules. For each $k\geq1$ there is a canonical isomorphism

$$
\bigoplus_{i+j=k}\big(\LA^i\F\underset{\O_X}{\otimes}\LA^j\G\big)\isoto\LA^k(\F\oplus\G)
$$

of $\O_X$-modules.
:::

:::proof
We could simply use the fact that it's obvious for premodules, and then sheafify that result. But since it's nice to have an explicit description of the map in one direction, it is simply the one induced by

$$
\begin{aligned}
\LA^i\F\otimes\LA^j\G
&\to\LA^i(\F\oplus\G)\otimes\LA^j(\F\oplus\G) \\
&\xrightarrow{\wedge}\LA^k(\F\oplus\G),
\end{aligned}
$$

which on stalks is the same corresponding map of $\O_{X,x}$-modules. The resulting direct-sum map is an isomorphism on stalks, so the one above is an isomorphism.
:::

Before specializing to the locally free case, we will consider the behavior under base change.

:::proposition{#prop:sheaf-base-change}
Let $(X,\O_X)$ and $(Y,\O_Y)$ be ringed spaces and $f\colon X\to Y$ a morphism, and let $k\geq0$.

1. If $\O_1,\O_2$ are sheaves of rings on $X$, $\phi\colon\O_1\to\O_2$ is a morphism, and $\F$ is an $\O_1$-module, then there is a canonical isomorphism

   $$
   \LA^k_{\O_1}(\F)\otimes_{\O_1}\O_2\isoto\LA^k_{\O_2}(\F\otimes_{\O_1}\O_2)
   $$

   of $\O_2$-modules.

2. If $\F$ is an $\O_X$-module, then there is a canonical map

   $$
   \LA^k f_*\F\to f_*\LA^k\F
   $$

   of $\O_Y$-modules.

3. If $\G$ is an $\O_Y$-module, then there is a canonical isomorphism

   $$
   f^{-1}\LA^k\G\isoto\LA^kf^{-1}\G
   $$

   of $f^{-1}\O_Y$-modules. In particular, there is a canonical isomorphism

   $$
   f^*\LA^k\G\isoto\LA^k f^*\G
   $$

   of $\O_X$-modules which induces the isomorphism

   $$
   \big(\LA^k_{\O_{Y,f(x)}}\G_{f(x)}\big)\underset{\O_{Y,f(x)}}{\otimes}\O_{X,x}\isoto\LA^k_{\O_{X,x}}\big(\G_{f(x)}\underset{\O_{Y,f(x)}}\otimes\O_{X,x}\big)
   $$

   of :ref[thm:base-change] on all stalks.
:::

:::proof
(1) We get a map in one direction by supplying $\LA^k_{\O_1}(\F)\to\LA^k_{\O_2}(\F\otimes_{\O_1}\O_2)$, a map of $\O_1$-modules, which comes from taking tensor powers and precomposing with the $\O_1$-module map $\F\to\F\otimes_{\O_1}\O_2$. Now we may check on stalks and conclude by :ref[thm:base-change].

(2) If we take the $k$th tensor power of the counit map $f^*f_*\F\to\F$, we obtain a map

$$
f^*(f_*\F)^{\otimes k}\cong (f^*f_*\F)^{\otimes k}\to\F^{\otimes k},
$$

which is the left adjunct to a map $(f_*\F)^{\otimes k}\to f_*(\F^{\otimes k})$. By applying $f_*$ to the standard surjection and composing, we get

$$
(f_*\F)^{\otimes k}\to f_*(\F^{\otimes k})\to f_*\LA^k_X\F
$$

which clearly has the alternating property, so it induces the map we wanted.

(3) The unit $\G\to f_*f^{-1}\G$ induces a map $\LA^k\G\to\LA^k f_*f^{-1}\G$, so composing with the map of (2), applied to $\F=f^{-1}\G$ on the ringed space $(X,f^{-1}\O_Y)$, we obtain $\LA^k\G\to f_*\LA^k f^{-1}\G$. This is the right adjunct of a map $f^{-1}\LA^k\G\to\LA^k f^{-1}\G$. Taking stalks, we obtain the isomorphisms

$$
(\LA^k\G)_{f(x)}\cong(\LA^kf^{-1}\G)_x\cong\LA^k\G_{f(x)}
$$

from earlier. The second statement is simply applying (1) to this with the morphism $f^{-1}\O_Y\to\O_X$ of sheaves of rings.
:::

Now, keep $(X,\O_X)$ as a ringed space and let $\E$ be a free $\O_X$-module, so that there is a set of global sections $\{s_i:i\in I\}$ of $\E$ which induce an isomorphism $\O_X^{\oplus I}\to\E$. Assuming $I$ is ordered, we know that $s_{i_1}\wedge\cdots\wedge s_{i_k}$ is a global section of $\LA^k\E$, so we may form the corresponding map

$$
\bigoplus_{i_1<\cdots<i_k\in I}\O_X\to\LA^k\E.
$$

This is an isomorphism because we know it's an isomorphism on stalks, by :ref[exterior-powers-1#thm:free-basis]. Thus, more generally, if $\E$ is a locally free sheaf, then $\LA^k\E$ is also locally free, trivialized on any open cover that $\E$ is trivialized by, with local basis given as above.

We reserve the term **vector bundle** for a locally free sheaf of finite constant rank. If $\E$ is a vector bundle of rank $d\geq0$, we write $\det(\E)\coloneqq\LA^d\E$ for its top exterior power. Since taking exterior powers is compatible with restriction, we know that $\det(\E)$ is a line bundle.

:::proposition{#prop:exact-sequence-splitting}
Let $(X,\O_X)$ be a ringed space.

1. If $\phi\colon\E\to\E'$ is a morphism of vector bundles of the same rank, then $\phi$ is an isomorphism iff $\phi$ is surjective iff $\det(\phi)\colon\det(\E)\to\det(\E')$ is an isomorphism of line bundles.

2. Suppose

   $$
   0\to\E'\to\E\to\E''\to0
   $$

   is a short exact sequence of vector bundles on $X$. Then there is a canonical isomorphism

   $$
   \det(\E')\otimes_{\O_X}\det(\E'')\isoto\det(\E).
   $$

   In particular, $\det$ induces a group homomorphism $K_0(\operatorname{Vect}(X))\to\operatorname{Pic}(X)$ from the Grothendieck group of the exact category of vector bundles on $X$.
:::

Before we prove this, let us consider some general phenomenon first. But we are building towards (2), because for (1), the properties are checked pointwise, so we are immediately done because of the case of finite free modules of the same rank over a ring. Also, a simple consequence of (2) is as follows: since $\det\colon K_0(\operatorname{Vect}(X))\to\operatorname{Pic}(X)$ is a group homomorphism, we deduce the more general fact that if we have an exact sequence

$$
0\to\E_1\to\cdots\to\E_n\to0
$$

of vector bundles, then

$$
\bigotimes_{\substack{1\leq i\leq n\\i\text{ odd}}}\det(\E_i)\otimes\bigotimes_{\substack{1\leq i\leq n\\i\text{ even}}}\det(\E_i)^\lor\cong\O_X.
$$

Let us now consider some generalities; we momentarily return to the case of $A$-modules, so consider an exact sequence

$$
0\to M'\xrightarrow{i} M\xrightarrow{p} M''\to0
$$

of $A$-modules. If we make the hypothesis that $M'$ is generated by $k$ elements, then in fact there is a canonical map

$$
\phi\colon(\LA^k M')\otimes_A(\LA^l M'')\to\LA^{k+l}M,
$$

which is slightly counterintuitive because this would seem to involve lifting elements along $p$. To see this, let $y_1,\dots,y_l$ be some elements in $M''$ and choose lifts $\wt{y}_i$ of these along $p$ to $M$. Then we have a linear wedging map

$$
(\wt{y}_1,\dots,\wt{y}_l)\colon\LA^kM'\to\LA^{k+l}M
$$

sending $x_1\wedge\cdots\wedge x_k\mapsto i(x_1)\wedge\cdots\wedge i(x_k)\wedge\wt{y}_1\wedge\cdots\wedge\wt{y}_l$. Observe that if some $\wt{y}_j$ is of the form $i(x)$ for some $x$, then this map is $0$: on elementary wedges as above, up to a sign we can move this term to be adjacent to the $i$ terms, and then write the image as

$$
\pm\LA^{k+1}i(x_1\wedge\cdots\wedge x_k\wedge x)\wedge\wt{y}_1\wedge\cdots\wedge\widehat{\wt{y}_j}\wedge\cdots\wedge\wt{y}_l,
$$

but $x_1\wedge\cdots\wedge x_k\wedge x$ is zero because $M'$ is generated by $k$ elements. So, if $\wt{y}'_j$ was another lift of $y_j$, then $\wt{y}'_j-\wt{y}_j=i(x)$ for some $x$, and then the above argument shows that

$$
(\wt{y}_1,\dots,\wt{y}_j,\dots,\wt{y}_l)=(\wt{y}_1,\dots,\wt{y}'_j,\dots,\wt{y}_l)
$$

are equal as maps $\LA^kM'\to\LA^{k+l}M$. Since this is still alternating, this defines a map

$$
\begin{aligned}
&\LA^l M''\to\Hom_A\big(\LA^k M',\LA^{k+l}M\big) \\
&\qquad\leftrightarrow\quad\LA^kM'\otimes_A\LA^l M''\to\LA^{k+l}M
\end{aligned}
$$

as desired. We can summarize this concisely as follows:

:::lemma{#lem:top-wedge-exact-sequence}
Suppose $0\to M'\xrightarrow{i} M\xrightarrow{p} M''\to0$ is a short exact sequence of $A$-modules, and assume $M'$ is generated by $k$ elements. Then there is a unique map

$$
\LA^kM'\otimes_A\LA^l M''\to\LA^{k+l}M
$$

making the diagram

```tikzcd {#diag:module-exact-sequence description="The top exterior power of M prime wedged with a lifted exterior power of M double prime factors uniquely through the dashed map to the exterior power of M."}
\begin{tikzcd}[sep=scriptsize]
  {\LA^k M'\otimes_A\LA^l M} & {\LA^k M\otimes_A\LA^l M} \\
  {\LA^k M'\otimes_A\LA^l M''} & {\LA^{k+l}M}
  \arrow["{\LA^ki\otimes 1}", from=1-1, to=1-2]
  \arrow["{1\otimes\LA^lp}", from=1-1, to=2-1]
  \arrow["\wedge", from=1-2, to=2-2]
  \arrow[dashed, from=2-1, to=2-2]
\end{tikzcd}
```

commute for each $l$. Moreover, suppose the sequence splits and $M''$ is generated by $l$ elements. Then $M$ is generated by $k+l$ elements and the map is the isomorphism of :ref[exterior-powers-1#example:splitting-of-modules].
:::

:::proof
All that remains is the second statement, and clearly if the sequence splits then $M$ is generated by $k+l$ elements. That the map is identified with the isomorphism of :ref[exterior-powers-1#example:splitting-of-modules] follows from the fact that this map was induced by including the direct summands and taking the wedge product, which is exactly what providing a section of $p$ would do with the above diagram.
:::

Now we carry this over to sheaves. We say that an $\O_X$-module $\F$ is **generated pointwise by $k$ sections** if $\F_x$ is generated over $\O_{X,x}$ by $k$ elements for all $x$. We also say an exact sequence of $\O_X$-modules is **pointwise split** if at each point $x$ the corresponding exact sequence of $\O_{X,x}$-modules is split.

:::corollary{#cor:sheaf-top-wedge-exact-sequence}
Suppose $0\to\F'\xrightarrow{i}\F\xrightarrow{p}\F''\to0$ is a short exact sequence of $\O_X$-modules, and assume $\F'$ is pointwise generated by $k$ sections. Then for each $l\geq0$, there is a unique map

$$
\LA^k\F'\otimes\LA^l\F''\to\LA^{k+l}\F
$$

making the diagram

```tikzcd {#diag:sheaf-exact-sequence description="The corresponding diagram for sheaves: the wedge map factors uniquely through the dashed map from the tensor product of exterior powers of F prime and F double prime."}
\begin{tikzcd}[sep=scriptsize]
  {\LA^k \F'\otimes_{\O_X}\LA^l \F} & {\LA^k \F\otimes_{\O_X}\LA^l \F} \\
  {\LA^k \F'\otimes_{\O_X}\LA^l \F''} & {\LA^{k+l}\F}
  \arrow["{\LA^ki\otimes 1}", from=1-1, to=1-2]
  \arrow["{1\otimes\LA^lp}", from=1-1, to=2-1]
  \arrow["\wedge", from=1-2, to=2-2]
  \arrow[dashed, from=2-1, to=2-2]
\end{tikzcd}
```

commute. Suppose in addition the sequence is pointwise split, and that $\F''$ is pointwise generated by $l$ sections. Then $\F$ is pointwise generated by $k+l$ sections, and the map is an isomorphism, given on stalks by the isomorphism of :ref[exterior-powers-1#example:splitting-of-modules].
:::

:::proof
We have a collection of maps $\varphi_x\colon\LA^k\F'_x\otimes\LA^l\F''_x\to\LA^{k+l}\F_x$ which satisfy this property by the previous result, so we just want to check that these glue together. We know that all sections of the domain are locally finite linear combinations of sections of the form

$$
s=(x_1\wedge\cdots\wedge x_k)\otimes(y_1\wedge\cdots\wedge y_l)
$$

where $x_i\in\F'(U)$ and $y_j\in\F''(U)$ for some open $U\subset X$. Now for each $x\in U$, there is a smaller neighborhood $V\subset U$ of $x$ on which all of the $y_j$'s admit lifts to sections $\wt{y}_j$ of $\F(V)$, and thus we have a local section

$$
t\coloneqq i(x_1)\wedge\cdots\wedge i(x_k)\wedge\wt{y}_1\wedge\cdots\wedge\wt{y}_l\in H^0(V,\LA^{k+l}\F)
$$

such that $t_y=\varphi_y(s_y)$ for each $y\in V$. Since $x\in U$ was arbitrary, these local sections agree on overlaps and we may glue and assume that $t$ is defined over $U$. Now if instead of $s$ we started with a section $r$ over the tensor product which was only locally a finite linear combination of sections of the form above, then we would take the same linear combination of their images and obtain local images which agree on overlaps. Thus we can find $t'$ such that $t'_y=\varphi_y(r_y)$ for all $y$. This is of course unique, so we have found our map. Note that the diagram commutes because it commutes stalkwise.

For the second statement, our hypotheses put us exactly in the case of the previous result at each point, yet now that we have the morphism of sheaves we are done.
:::

Note that this finishes the proof of :ref[prop:exact-sequence-splitting] because a vector bundle is pointwise a free and hence projective module. Note that in fact our multiplicativity of determinants applies slightly more generally, to the case where the sheaves aren't actually vector bundles of finite rank, but they are just pointwise free modules of constant finite rank. But, e.g. for coherent sheaves on schemes, such a thing is a vector bundle anyway.

## For schemes {#schemes}

Now let us study the special case of quasicoherent sheaves on a scheme, where we can give some applications of the theory developed above. The fundamental observation is that for a quasicoherent $\O_X$-module, the exterior powers remain quasicoherent, and they are given on affine opens by exterior power modules, not just pointwise.

:::theorem{#thm:quasicoherent-exterior-powers}
Let $M$ be an $A$-module. There is a natural isomorphism

$$
\LA^k\wt{M}\isoto\wt{\LA^k M}
$$

of $\O_{\Spec A}$-modules for each $k\geq0$. In particular, if $X$ is a scheme, $\F$ is a quasicoherent $\O_X$-module, and $U\subset X$ is an affine open, then there is a canonical isomorphism

$$
(\LA^k\F)\rvert_U\isoto\wt{\LA^k\F(U)}
$$

for all $k\geq0$.
:::

:::proof
The second statement follows immediately from the first, and the fact that taking exterior powers commutes with restriction. For the first statement, we use the corresponding fact for tensor products to obtain a map

$$
\wt{M}^{\otimes k}\isoto\wt{M^{\otimes k}}\epi\wt{\LA^k M},
$$

which is locally alternating and thus induces $\LA^k\wt{M}\to\wt{\LA^k M}$. At each prime $\mathfrak{p}\in\Spec A$, the stalk of this map is

$$
\big(\LA^k\wt{M}\big)_{\mathfrak{p}}\cong\LA^k(M_{\mathfrak{p}})\to(\LA^k M)_{\mathfrak{p}},
$$

which is an isomorphism of $A_{\mathfrak{p}}$-modules by :ref[cor:exterior-powers-of-localization](2). Naturality is clear because of the universal properties defining this map.
:::

One often computes exterior powers by embedding a scheme into a larger space and computing the module there. To do this, we want to have good behavior with respect to restriction. We first state the very classical projection result. Let $f\colon X\to Y$ be a morphism of ringed spaces, $\F$ be an $\O_X$-module and $\G$ be an $\O_Y$-module. Then the canonical map

$$
\begin{aligned}
f^*(f_*\F\otimes_{\O_Y}\G)
&\cong f^*f_*\F\otimes_{\O_X}f^*\G \\
&\to\F\otimes_{\O_X}f^*\G
\end{aligned}
$$

(where the second map is tensoring with the counit) induces an adjunct map

$$
f_*\F\otimes_{\O_Y}\G\to f_*\big(\F\otimes_{\O_X}f^*\G\big)
\label{eq:projection-map}
$$

called the **projection map**, clearly natural in both $\F$ and $\G$.

:::proposition{#prop:projection-formula}
Let $f\colon X\to Y$ be a morphism of ringed spaces, $\F$ be an $\O_X$-module and $\G$ be an $\O_Y$-module. Suppose we are in one of the following circumstances:

1. $f$ is a closed embedding on underlying spaces; or
2. $\G$ is locally free of finite rank; or
3. $f$ is an affine morphism of schemes, and $\F$ and $\G$ are quasicoherent.

Then the projection map :ref[eq:projection-map] is an isomorphism.
:::

:::proof
(1) Using the explicit description of stalks of a closed embedding, both sides are supported in $f(X)\subset Y$, and at the point $f(x)$ the map on stalks is

$$
\F_x\underset{\O_{Y,f(x)}}{\otimes}\G_{f(x)}\to\F_x\underset{\O_{X,x}}{\otimes}\big(\G_{f(x)}\underset{\O_{Y,f(x)}}{\otimes}\O_{X,x}\big),
$$

which is an isomorphism by the commutativity and cancellation properties of tensor products.

(2) Let $U\subset Y$ be an open set on which $\G\rvert_U\cong\O_U^{\oplus n}$. Restricting :ref[eq:projection-map] to $U$, we obtain the map

$$
\begin{aligned}
&f_*(\F\rvert_{f^{-1}U})\otimes_{\O_U}\O_U^{\oplus n} \\
&\qquad\to f_*\big(\F\rvert_{f^{-1}U}\otimes_{\O_{f^{-1}U}}\O_{f^{-1}U}^{\oplus n}\big)
\end{aligned}
$$

after applying naturality, which is an isomorphism because $f_*$ preserves finite direct sums.

(3) By restricting to an affine open, we reduce to showing that if $\phi\colon A\to B$ is a ring homomorphism, $N$ is an $A$-module and $M$ is a $B$-module, then the natural map

$$
M\rvert_A\otimes_A N\to\big(M\otimes_B(N\otimes_A B)\big)\rvert_A
$$

is an isomorphism of $A$-modules. This is of course the case because the cancellation property identifies the RHS with $(M\otimes_A N)\rvert_A$ where $M\otimes_A N$ is a $B$-module through the $B$ action on $M$. Since the tensor product is computed using only its $A$-module structure, this is equal to $M\rvert_A\otimes_A N$.
:::

Of course, this is quite a bit more generality than we usually need, since in fact we normally apply this to closed immersions $Z\to X$ with $\F=\O_Z$ and $\G$ a line bundle. In any case, the corresponding result doesn't hold for exterior powers, but we do at least have a formula for twisting with line bundles:

:::lemma{#lem:line-bundle-twist}
Let $(X,\O_X)$ be a ringed space and $\scr{L}$ a line bundle on $X$. For any $\O_X$-module $\F$, there is a canonical isomorphism

$$
\LA^k(\F\otimes_{\O_X}\scr{L})\isoto\LA^k(\F)\otimes_{\O_X}\scr{L}^{\otimes k}
$$

of $\O_X$-modules for each $k\geq0$.
:::
