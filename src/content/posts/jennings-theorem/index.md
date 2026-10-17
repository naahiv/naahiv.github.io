---
title: 'A Proof of Jennings’ Theorem'
slug: jennings-theorem
date: '2026-10-16'
summary: 'A proof of Jennings’ theorem using restricted Lie algebras, with formulas for radical layers and Loewy length and an example of order 27.'
tags: [algebra, representation-theory, group-theory]
draft: false
macros: |
  \newcommand{\F}{\mathbb{F}}
  \newcommand{\g}{\mathfrak{g}}
  \newcommand{\Jen}{\mathrm{Jen}}
  \renewcommand{\braket}[1]{\langle #1\rangle}
  \DeclareMathOperator{\Rad}{Rad}
  \DeclareMathOperator{\Soc}{Soc}
  \DeclareMathOperator{\ad}{ad}
  \DeclareMathOperator{\chr}{char}
---

## Introduction {#introduction}

The goal of this post is to provide a complete proof of a theorem of Jennings in representation theory and discuss some applications thereof. Jennings' theorem provides quite a bit of information on the structure of group algebras of finite $p$-groups over a field of characteristic $p$.

Most importantly, we will get explicit formulas for the Loewy length of the group algebra and the dimensions of the radical and socle layers, and we will be able to deduce that the radical series coincides with the socle series, in reverse order, in this case.

Computing the group ring $kG$ for $\chr k=p>0$ and $G$ a finite $p$-group is of interest for various reasons. It is a situation where we can deduce more information than the general case; for example, we know that $\Rad(kG)=IG$, where $IG$ is the augmentation ideal. If $G$ is cyclic, then we have a complete description of its indecomposable modules, as well as its simple and indecomposable projective modules.

Also, in many cases even if $G$ is not a $p$-group, its structure separates a normal Sylow $p$-subgroup from a complement of order prime to $p$. This is the case when $G=H\rtimes K$, with $H$ a Sylow $p$-subgroup: the group algebra $kK$ is semisimple, while $kH$ is the modular part of the problem. A finite group with a normal Sylow $p$-subgroup admits such a complement.

### Background {#background}

Having motivated Jennings' theorem, let us give a brief historical overview of its proof. The result was first published by S. A. Jennings in 1941 in [his original paper](https://doi.org/10.2307/1989916), as a special result of his thesis. Jennings defined the **Jennings series** of a group and proved the theorem in its original form. Jennings' proof was somewhat complicated. It is notable that in a footnote to the original paper, Jennings pointed out that Zassenhaus had around the same time proved that the Jennings series also arises out of the Lie algebra associated to the group ring.

D. G. Quillen, in 1968, expanded on that idea and gave a much shorter proof using the natural Lie algebra structure which gives rise to the Jennings series, in [*On the associated graded ring of a group ring*](https://doi.org/10.1016/0021-8693(68)90069-0). His argument is the starting point for the one we use here, but we follow more closely the presentation of Benson in *Representations and Cohomology I*. Quillen's proof uses the notion of a **$p$-restricted** Lie algebra, which can be associated to a certain central series of the group.

The key idea is that the group commutator provides a Lie algebra commutator, and there is a natural $p$th power operation in the algebra. Restricted Lie algebras satisfy a Poincaré–Birkhoff–Witt (PBW) theorem. For Jennings' theorem, the spanning part of that theorem and a dimension comparison will suffice: we will use them to show that the Jennings series coincides with the series of dimension subgroups.

The post will proceed as follows. In :ref[jennings-theorem] we will state and prove Jennings' theorem. Deviating from the presentation in Benson, we will begin with a more general discussion of restricted Lie algebras because they are of interest in their own right, especially in the theory of group schemes in geometry. Then in :ref[examples] we prove the important corollary about the socle series, and conclude with an example.

## Jennings' theorem {#jennings-theorem}

### Restricted Lie algebras {#restricted-lie-algebras}

For this section, fix a field $k$ of characteristic $p>0$. If $\g$ is a Lie algebra, then for $x\in\g$ we use the standard notation $\ad(x)\colon\g\to\g$ for the map $y\mapsto[x,y]$. Our main object of study in this section is a $p$-restricted Lie algebra, or just restricted Lie algebra for short. The main reference for this subsection is Strade and Farnsteiner, *Modular Lie Algebras and Their Representations*, Chapter II, §§1–5.

:::definition{#def:restricted-lie-algebra}
A **$p$-restricted Lie algebra** over $k$ is a Lie algebra $\g$ over $k$ equipped with a map

$$
\g\to\g,\qquad x\mapsto x^{[p]},
$$

called the **$p$-mapping**, satisfying the following properties:

1. $\ad(x^{[p]})=\ad(x)^p$ for all $x\in\g$.
2. $(\alpha x)^{[p]}=\alpha^p x^{[p]}$ for all $x\in\g$ and $\alpha\in k$.
3. $(x+y)^{[p]}=x^{[p]}+y^{[p]}+\sum_{j=1}^{p-1}s_j(x,y)$ for all $x,y\in\g$.

Here the terms $s_j(x,y)$ are uniquely determined by the relation

$$
\ad(tx+y)^{p-1}(x)=\sum_{j=1}^{p-1}j\,s_j(x,y)t^{j-1},
$$

where powers of $\ad$ are interpreted as composition, and $t$ is a formal variable. A morphism of restricted Lie algebras is a Lie algebra homomorphism which preserves the map $x\mapsto x^{[p]}$.
:::

For example, if $p=2$ then $s_1(x,y)=[y,x]$, and if $p=3$ then the relation gives

$$
t[x,[y,x]]+[y,[y,x]]=2t\,s_2(x,y)+s_1(x,y).
$$

Like this one can see how to derive a general formula, but we will not need one.

:::example{#example:associative-restricted-lie-algebra}
Recall that if $A$ is an associative algebra, then $A$ is naturally a Lie algebra with $[x,y]=xy-yx$. The map $x\mapsto x^{[p]}=x^p$ makes $A$ into a $p$-restricted Lie algebra. For the first property, use the relation

$$
\ad(x)^m(y)=\sum_{i=0}^m(-1)^{m-i}\binom{m}{i}x^iyx^{m-i}
$$

for any $m$. When $m=p$, the intermediate binomial coefficients vanish, giving $\ad(x)^p(y)=[x^p,y]$. The second property is immediate.

For the third, differentiate formally in $A[t]$. Since $\binom{p-1}{i}=(-1)^i$ in $k$, the same formula gives

$$
\begin{aligned}
\frac{d}{dt}(tx+y)^p
&=\sum_{i=0}^{p-1}(tx+y)^i x(tx+y)^{p-1-i} \\
&=\ad(tx+y)^{p-1}(x).
\end{aligned}
$$

The polynomial $(tx+y)^p-t^px^p-y^p$ has zero constant term and degree at most $p-1$. Comparing derivatives with the defining formula for $s_j$ therefore gives

$$
(tx+y)^p-t^px^p-y^p=\sum_{j=1}^{p-1}s_j(x,y)t^j.
$$

Setting $t=1$ proves the third property. In particular, $\mathfrak{gl}_n(k)$ is a $p$-restricted Lie algebra.
:::

Instead of relying on an explicit formula for $(x+y)^{[p]}$, we need the following more important property: each $s_j(x,y)$ is a linear combination of iterated brackets of length $p$ in $x$ and $y$. This follows directly by expanding $\ad(tx+y)^{p-1}(x)$. In particular, the correction terms stay in the Lie subalgebra generated by $x$ and $y$.

We move on to the **restricted universal enveloping algebra**. If $\g$ is a restricted Lie algebra, the restricted enveloping algebra $u(\g)$ should have the universal property that, for $A$ an associative $k$-algebra, restricted Lie algebra homomorphisms $\g\to A$ correspond to algebra homomorphisms $u(\g)\to A$.

It is easy to see how to construct this: take the standard enveloping algebra $U(\g)$, let $I$ be the two-sided ideal generated by elements $x^{[p]}-x^p$ for all $x\in\g$, and set

$$
u(\g)\coloneqq U(\g)/I.
$$

Then the universal property of $U(\g)$ immediately implies the desired one for $u(\g)$. The main result of this section is the following restricted PBW theorem; see Strade and Farnsteiner, Chapter II, Theorem 5.1.

:::theorem{#thm:restricted-pbw}
Let $\g$ be a restricted finite-dimensional Lie algebra, and suppose $e_1,\dots,e_n$ is a basis for $\g$.

1. The collection of elements

   $$
   e_1^{j_1}\cdots e_n^{j_n}\in u(\g),\qquad 0\leq j_i<p,
   \label{eq:restricted-monomials}
   $$

   is a basis for $u(\g)$.

2. In particular, the canonical map $\g\to u(\g)$ is injective, and $\dim_k u(\g)=p^n$.
:::

:::remark{#remark:spanning-suffices}
For the proof of Jennings' theorem, we will not need the full strength of this result. We need only the easier direction that the collection :ref[eq:restricted-monomials] *spans* $u(\g)$, so that $\dim_k u(\g)\leq p^n$. In fact, the same spanning argument works directly for an algebra given by the commutator and $p$th-power relations, before we have verified all the restricted Lie algebra axioms.
:::

:::proof
Observe first that (2) is an immediate consequence of (1): the basis for $\g$ is a subset of the basis for $u(\g)$ by taking all $j_i$ to be $0$, except one to be $1$. Hence $\g\mono u(\g)$ is injective. The dimension statement is clear by counting the number of elements in :ref[eq:restricted-monomials].

For (1), it is easy to see that these elements span $u(\g)$. Indeed, the statement would be trivial if we could reorder the $e_i$ and if the powers $j_i$ could be arbitrarily large. The former part is easy to handle because we can use commutators to reorder the basis, with correction terms of smaller word length. To address the powers, note that if $j\geq p$ then

$$
x^j=x^px^{j-p}=x^{[p]}x^{j-p}\qquad\text{in }u(\g),
$$

so we can again reduce word length. Induction on word length, and then on the number of out-of-order pairs, expresses every word using ordered powers strictly less than $p$. This is the spanning argument we will use for Jennings' theorem.

For independence, we use the classical PBW theorem in $U(\g)$. Put

$$
c_i=e_i^p-e_i^{[p]}\in U(\g).
$$

These elements are central, since for $y\in\g$,

$$
[e_i^p-e_i^{[p]},y]=\ad(e_i)^p(y)-\ad(e_i^{[p]})(y)=0.
$$

Moreover, the map $x\mapsto x^p-x^{[p]}$ from $\g$ to $U(\g)$ is additive and satisfies $(\alpha x)^p-(\alpha x)^{[p]}=\alpha^p(x^p-x^{[p]})$: the correction terms in the two $p$-power formulas cancel. Thus $I$ is generated by $c_1,\dots,c_n$.

In the usual PBW filtration, the elements

$$
c_1^{a_1}\cdots c_n^{a_n}e_1^{b_1}\cdots e_n^{b_n},
\qquad a_i\geq0,\quad0\leq b_i<p,
$$

have leading monomials $e_1^{pa_1+b_1}\cdots e_n^{pa_n+b_n}$. Every PBW monomial occurs exactly once as a leading monomial, by division of its exponents by $p$. Consequently these elements form a basis of $U(\g)$: spanning and independence both follow by induction on the filtration degree.

Since the $c_i$ are central, multiplication by a $c_i$ simply increases its corresponding exponent in this basis. The ideal $I$ is therefore spanned by the displayed basis elements for which at least one $a_i$ is positive. The remaining elements, with every $a_i=0$, descend to a basis of $U(\g)/I$. These are exactly :ref[eq:restricted-monomials].
:::

For our purposes, this is all we need about restricted Lie algebras, but much more can be said about them. We refer the reader to Chapter II of Strade and Farnsteiner. These objects play a fundamental role in the theory of algebraic groups as well.

### The proof of Jennings' theorem {#proof-of-jennings-theorem}

In this section we state and prove Jennings' theorem. Fix a field $k$ of characteristic $p>0$, and let $G$ be a finite $p$-group, say of order $p^n$. Recall that in this case we have $\Rad(kG)=IG$, and so $\Rad^i(kG)=(IG)^i$; see Webb, Proposition 6.3.3. We consider the following:

:::definition{#def:dimension-subgroups}
The **dimension subgroups** of $G$ are

$$
F_r(G)\coloneqq\{g\in G:g-1\in\Rad^r(kG)\}
$$

for $r\geq1$.
:::

Recall that $IG$ is spanned by the elements $g-1$ for $g\neq1$, so $F_1(G)=G$. These are indeed subgroups because, for $g,h\in G$, we have

$$
gh-1=(g-1)+(h-1)+(g-1)(h-1),
\label{eq:multiplication-formula}
$$

and $g^{-1}-1=-g^{-1}(g-1)$. Moreover, $F_r(G)\trianglelefteq G$, because for $h$ arbitrary we have

$$
h(g-1)h^{-1}=hgh^{-1}-1,
$$

which is in $\Rad^r(kG)$ whenever $g-1$ is, since this is a two-sided ideal. The fact that the $\Rad^r(kG)$ form a decreasing sequence implies that $\{F_r(G)\}$ is also a decreasing sequence, and if $r\geq\ell$, the Loewy length, then $F_r(G)=\{1\}$. So the dimension subgroups form a decreasing filtration of $G$.

We also have $(g-1)^p=g^p-1$, so the $p$th power of an element from $F_r(G)$ is in $F_{pr}(G)$. In addition, note that

$$
[g,h]-1=\big((g-1)(h-1)-(h-1)(g-1)\big)g^{-1}h^{-1},
\label{eq:group-commutator}
$$

where we are using the convention $[g,h]=ghg^{-1}h^{-1}$. Again because the radical powers are two-sided ideals, this implies that $[F_r(G),F_s(G)]\subset F_{r+s}(G)$.

Finally, recall that the **Frattini subgroup** $\Phi(G)$ is the intersection of the maximal subgroups of $G$, and for a finite $p$-group we know that $\Phi(G)=G^p[G,G]$. We claim that

$$
\Phi(G)=F_2(G).
$$

The containments just proved give $G^p[G,G]\subset F_2(G)$. Conversely, if $g\notin\Phi(G)$, choose a maximal subgroup $H$ not containing $g$. A maximal subgroup of a finite $p$-group is normal of index $p$, so the quotient map $G\to G/H\cong C_p$ induces a map of group algebras carrying $IG$ into $I(C_p)$ and $(IG)^2$ into $I(C_p)^2$.

If $c$ generates $C_p$, then $kC_p\cong k[t]/(t^p)$ with $t=c-1$. The image of $g$ is $c^j$ for some $1\leq j<p$, and

$$
c^j-1\equiv j(c-1)\not\equiv0\pmod{I(C_p)^2}.
$$

Thus $g-1\notin(IG)^2$, proving $F_2(G)\subset\Phi(G)$. The following is what we have proved so far.

:::proposition{#prop:dimension-filtration}
Let $G$ be a finite $p$-group and $k$ a field of characteristic $p$.

1. The dimension subgroups of $G$ form a decreasing filtration

   $$
   G=F_1(G)\supset F_2(G)\supset F_3(G)\supset\cdots
   $$

   of subgroups which is trivial from the Loewy length of $kG$ onward.

2. Each $F_r(G)$ is a normal subgroup of $G$, and $F_2(G)=\Phi(G)$.

3. We have the containments

   $$
   F_r(G)^p\subset F_{rp}(G),\qquad[F_r(G),F_s(G)]\subset F_{r+s}(G)
   $$

   for all $r,s\geq1$.
:::

The properties of the dimension subgroups motivate what is called the **Jennings series of $G$**: it is the fastest descending series

$$
G=\Gamma_1(G)\supset\Gamma_2(G)\supset\Gamma_3(G)\supset\cdots
$$

such that

$$
\Gamma_r(G)^p\subset\Gamma_{rp}(G),\qquad
[\Gamma_r(G),\Gamma_s(G)]\subset\Gamma_{r+s}(G)
$$

for all $r,s\geq1$. Here $H^p$ denotes the subgroup generated by the $p$th powers of elements of $H$.

To construct the fastest such series without a recursive ambiguity, take the termwise intersection of all decreasing series satisfying these properties and starting with $G$. The power and commutator containments are preserved by intersections, so the resulting series has the required properties and is contained termwise in every other such series. In particular,

$$
\Gamma_r(G)\subset F_r(G)
$$

for all $r$, so it is trivial from the Loewy length onward. Moreover, $[G,\Gamma_r(G)]\subset\Gamma_{r+1}(G)$, so it is a central series, and all its terms are normal.

The defining properties say that $\Gamma_r(G)$ must contain the subgroups

$$
[\Gamma_s(G),\Gamma_t(G)]\quad(s+t\geq r),\qquad
\Gamma_s(G)^p\quad(ps\geq r).
$$

These are useful for computing it. For instance, $\Gamma_2(G)$ contains $[G,G]$ and $G^p$, so it contains $\Phi(G)$. Since it is also contained in $F_2(G)=\Phi(G)$, the dimension series and Jennings series agree for $r=1,2$.

Since the series is central, successive quotients are abelian. Moreover,

$$
\Gamma_r(G)^p\subset\Gamma_{pr}(G)\subset\Gamma_{r+1}(G),
$$

because $p\geq2$. Thus the quotients are elementary abelian $p$-groups, and as $\ZZ$-modules they are annihilated by $p\ZZ$, hence they are naturally $\F_p$-vector spaces. In what follows we will set

$$
n_r\coloneqq\dim_{\F_p}\big(\Gamma_r(G)/\Gamma_{r+1}(G)\big),\qquad r\geq1,
$$

and so $p^{n_r}=[\Gamma_r(G):\Gamma_{r+1}(G)]$. We can also tensor with $k$ to make this an $n_r$-dimensional vector space over $k$. Doing this, define the **Jennings algebra of $G$ over $k$** to be the graded vector space

$$
\Jen_*(G)\coloneqq\bigoplus_{r\geq1}k\underset{\F_p}{\otimes}\big(\Gamma_r(G)/\Gamma_{r+1}(G)\big).
$$

The plan is to apply the machinery from the previous section to this object. We will see that it is a graded restricted Lie algebra. For the Lie bracket, we use the Hall–Witt identity, with the convention $z^y=yzy^{-1}$ for conjugation.

:::lemma[Hall–Witt]{#lem:hall-witt}
Let $H$ be a group. With $[x,y]=xyx^{-1}y^{-1}$ and $z^y=yzy^{-1}$, we have

$$
\big[[x,y],z^y\big]\big[[y,z],x^z\big]\big[[z,x],y^x\big]=1
$$

for all $x,y,z\in H$.
:::

:::proof
Expand each of the terms using the definitions. Their product is

$$
\begin{aligned}
&(xyx^{-1}zx\,y^{-1}x^{-1}yz^{-1}y^{-1}) \\
&\quad\cdot(yzy^{-1}xy\,z^{-1}y^{-1}zx^{-1}z^{-1}) \\
&\quad\cdot(zxz^{-1}yz\,x^{-1}z^{-1}xy^{-1}x^{-1}),
\end{aligned}
$$

and successive cancellation gives the identity.
:::

Now the containments

$$
[\Gamma_{r+1}(G),\Gamma_s(G)],\ [\Gamma_r(G),\Gamma_{s+1}(G)]
\subset\Gamma_{r+s+1}(G)
$$

show that the group commutator induces a well-defined bracket from degrees $r,s$ to degree $r+s$. Extend it $k$-bilinearly to $\Jen_*(G)$. The identities

$$
[ab,c]=a[b,c]a^{-1}[a,c],\qquad
[a,bc]=[a,b]b[a,c]b^{-1}
$$

show additivity on the group quotients, since the conjugation corrections lie one step deeper in the filtration. Alternation follows from $[x,x]=1$, and antisymmetry follows by interchanging the two group elements. The Jacobi identity follows from Hall–Witt: all three factors lie in $\Gamma_{r+s+t}(G)$, and replacing a conjugated argument by the original argument changes its class only in $\Gamma_{r+s+t+1}(G)$. Taking classes there gives the sum of the three iterated brackets equal to zero. Thus $\Jen_*(G)$ is a graded Lie algebra over $k$.

The expected $p$-mapping sends the class of a group element in degree $r$ to the class of its $p$th power in degree $pr$. Rather than assume the identities for this operation, we will construct the relevant associative algebra directly and verify the restricted structure through a dimension comparison. This uses exactly the spanning argument in :ref[remark:spanning-suffices].

Choose an $\F_p$-basis of each $\Gamma_r(G)/\Gamma_{r+1}(G)$ and group representatives for these basis elements. After extending scalars, order the resulting homogeneous basis of $\Jen_*(G)$ as

$$
x_1,\dots,x_{n_1},\dots,x_{n_1+n_2},\dots,x_m,
\qquad m=\sum_r n_r.
$$

For each chosen $x_i$ of degree $r$, its representative has $p$th power in $\Gamma_{pr}(G)$. Write $x_i^{[p]}$ for the corresponding vector in the degree-$pr$ component of $\Jen_*(G)$, using these fixed representatives for now. Form the associative algebra

$$
\frac{T_k(\Jen_*(G))}
{\big(x_ix_j-x_jx_i-[x_i,x_j],\ x_i^p-x_i^{[p]}\big)_{i,j}}.
\label{eq:jen-presentation}
$$

The relations preserve the grading coming from the degrees of the $x_i$. Reordering words with the commutator relations and reducing $p$th powers shows that the ordered monomials

$$
x_1^{j_1}\cdots x_m^{j_m},\qquad0\leq j_i<p,
\label{eq:jen-monomials}
$$

span this algebra. Indeed, each correction replaces a product by an element of the vector space $\Jen_*(G)$ and therefore reduces ordinary word length, just as in the spanning proof above. Its dimension is consequently at most $p^m$.

The way we use this construction is by taking the associated graded of $kG$, filtered by the radical:

$$
\mathrm{gr}_*kG\coloneqq\bigoplus_{i\geq0}\Rad^i(kG)/\Rad^{i+1}(kG).
$$

This has a well-defined multiplication because $\Rad^i(kG)\cdot\Rad^j(kG)\subset\Rad^{i+j}(kG)$. Because $\Gamma_r(G)\subset F_r(G)$, the rule $g\mapsto g-1$ gives maps into $\Rad^r(kG)$. It descends to the successive quotients, and :ref[eq:multiplication-formula] shows that the resulting maps are additive. Extending scalars gives a graded $k$-linear map

$$
\Jen_*(G)\longrightarrow\mathrm{gr}_*kG.
$$

By :ref[eq:group-commutator], this map takes the group bracket to the algebra commutator. The factor $g^{-1}h^{-1}$ in that formula can be replaced by $1$ modulo the next radical power. Similarly, $(g-1)^p=g^p-1$ shows that the chosen $p$th-power relations hold in the target. Thus we obtain a graded algebra homomorphism $\psi$ from the algebra :ref[eq:jen-presentation] to $\mathrm{gr}_*kG$.

Since $\mathrm{gr}_*kG$ is generated by its degree-one component and $\Gamma_1(G)=G$, the elements $g-1$ show that $\psi$ is surjective. Notice that

$$
p^m=\prod_rp^{n_r}=\prod_r[\Gamma_r(G):\Gamma_{r+1}(G)]=\abs{G}.
$$

On the other hand,

$$
\begin{aligned}
\dim_k\mathrm{gr}_*kG
&=\sum_{i\geq0}\big(\dim_k\Rad^i(kG)-\dim_k\Rad^{i+1}(kG)\big) \\
&=\dim_k kG=\abs{G}.
\end{aligned}
$$

The source of $\psi$ has dimension at most $p^m=\abs{G}$, while $\psi$ surjects onto a vector space of exactly this dimension. Therefore $\psi$ is an isomorphism, and the spanning monomials :ref[eq:jen-monomials] are a basis. In particular, $\Jen_*(G)$ injects into this algebra and hence into $\mathrm{gr}_*kG$.

This also supplies the restricted structure promised above. The copy of $\Jen_*(G)$ in its associative algebra is closed under commutators and under the $p$th powers of its basis vectors. The formula in :ref[example:associative-restricted-lie-algebra] then shows that it is closed under the $p$th power of every linear combination. It therefore inherits a restricted Lie algebra structure. For any group element $g\in\Gamma_r(G)$, the identity $(g-1)^p=g^p-1$ and the injectivity just proved identify this operation with the class of $g^p$ in degree $pr$. In particular it is independent of the chosen representative.

Finally, the presentation :ref[eq:jen-presentation] has the universal property of the restricted enveloping algebra: a restricted Lie homomorphism out of $\Jen_*(G)$ satisfies its defining relations, and an algebra homomorphism out of the presentation preserves the inherited bracket and $p$-mapping. We have consequently proved a graded isomorphism

$$
\psi\colon u(\Jen_*(G))\xrightarrow{\sim}\mathrm{gr}_*kG.
$$

We now state our main result.

:::theorem[Jennings]{#thm:jennings}
Let $G$ be a finite $p$-group and $k$ a field of characteristic $p$.

1. $F_r(G)=\Gamma_r(G)$ for all $r\geq1$.

2. The Poincaré series of the radical layers of $kG$ has the expression

   $$
   \sum_{i\geq0}\dim_k\!\left(\frac{\Rad^i(kG)}{\Rad^{i+1}(kG)}\right)t^i
   =\prod_{r\geq1}\left(\frac{1-t^{pr}}{1-t^r}\right)^{n_r},
   $$

   where $p^{n_r}=[F_r(G):F_{r+1}(G)]$.

3. The Loewy length of $kG$ is

   $$
   \ell(kG)=1+\sum_{r\geq1}(p-1)r n_r.
   $$
:::

:::proof
The main part of the result is (1), which we can now prove from our work above. We use induction, and have already established the cases $r=1,2$. Suppose $F_r(G)=\Gamma_r(G)$, and take $g\in F_{r+1}(G)$. Then $g\in\Gamma_r(G)$, and its class in $\Gamma_r(G)/\Gamma_{r+1}(G)$ maps to zero in $\Rad^r(kG)/\Rad^{r+1}(kG)$, because $g-1\in\Rad^{r+1}(kG)$.

But the map from this group quotient into $\Jen_*(G)$ is injective after extension from $\F_p$ to $k$, and the map $\Jen_*(G)\to\mathrm{gr}_*kG$ is injective by the dimension comparison. Thus the class of $g$ is zero, so $g\in\Gamma_{r+1}(G)$. The reverse inclusion was already proved, completing the induction.

For (2), we have shown that the elements

$$
x_1^{j_1}\cdots x_m^{j_m},\qquad0\leq j_i<p,
$$

are a basis for $u(\Jen_*(G))$. The graded isomorphism $\psi$ identifies them with a homogeneous $k$-basis for $\mathrm{gr}_*kG$. There are $n_r$ generators of weight $r$, each of which can occur with exponent $0,1,\dots,p-1$. A monomial has weight equal to the sum of the weights of its factors, so counting these choices gives

$$
\sum_{i\geq0}\dim_k\big(\Rad^i(kG)/\Rad^{i+1}(kG)\big)t^i
=\prod_{r\geq1}(1+t^r+t^{2r}+\cdots+t^{(p-1)r})^{n_r}.
$$

The expression in (2) is just the geometric-series representation of the factors. Notice that the degree-$r$ component can contain products of lower-weight generators, as well as the $n_r$ generators themselves.

For (3), the Loewy length is one more than the largest degree with a nonzero radical layer. Indeed, if two consecutive radical powers are equal, nilpotence forces that power to be zero. Thus the Loewy length is one more than the degree of the Poincaré polynomial. Each factor has top degree $(p-1)r n_r$, so the required degree is $\sum_r(p-1)r n_r$.
:::

## Examples and applications {#examples}

We will conclude by giving the primary application of Jennings' theorem, and then a small example.

:::theorem{#thm:radical-and-socle}
Let $k$ be a field of characteristic $p>0$ and $G$ a finite $p$-group. If $\ell$ is the Loewy length of $kG$, then

$$
\Soc^n(kG)=\Rad^{\ell-n}(kG),\qquad0\leq n\leq\ell.
$$

Thus the radical series and the socle series of $kG$ are the same filtration, in reverse order.
:::

:::proof
The Poincaré polynomial of :ref[thm:jennings] is symmetric: each factor $1+t^r+\cdots+t^{(p-1)r}$ is symmetric, so

$$
\dim_k\big(\Rad^i(kG)/\Rad^{i+1}(kG)\big)
=\dim_k\big(\Rad^{\ell-i-1}(kG)/\Rad^{\ell-i}(kG)\big).
$$

The duality between radical and socle layers gives

$$
\Soc^{n+1}((kG)^*)/\Soc^n((kG)^*)
\cong\big(\Rad^n(kG)/\Rad^{n+1}(kG)\big)^*;
$$

see Webb, Chapter 6, Exercise (7). The regular group module is self-dual: the pairing on the group basis given by $(g,h)\mapsto\delta_{g,h}$ is nondegenerate and invariant under simultaneous left multiplication. Thus, as in Webb, Proposition 8.5.2,

$$
\dim_k\big(\Soc^{n+1}(kG)/\Soc^n(kG)\big)
=\dim_k\big(\Rad^n(kG)/\Rad^{n+1}(kG)\big).
$$

Finally, remember that

$$
\Soc^n(kG)\supset\Rad^{\ell-n}(kG).
$$

This is because $\Rad^n(kG)\cdot\Rad^{\ell-n}(kG)\subset\Rad^\ell(kG)=0$, and the $n$th socle is the set of elements annihilated by the $n$th radical power. Summing the layer dimensions and using the symmetry above gives

$$
\begin{aligned}
\dim_k\Soc^n(kG)
&=\sum_{i=0}^{n-1}\dim_k\big(\Rad^i(kG)/\Rad^{i+1}(kG)\big) \\
&=\sum_{i=\ell-n}^{\ell-1}\dim_k\big(\Rad^i(kG)/\Rad^{i+1}(kG)\big) \\
&=\dim_k\Rad^{\ell-n}(kG).
\end{aligned}
$$

The inclusion is therefore an equality.
:::

Now we come to an example. Abelian $p$-groups are less interesting for this purpose because they are direct products of cyclic $p$-groups, and we have a very explicit description of the group rings of cyclic $p$-groups and of direct products. The smallest nonabelian examples have order $8$; the group $D_8$ is considered in Webb, Example 6.4.2. Recall also that all groups of order $p^2$ are abelian. There are nine nonabelian groups of order $16$, and two nonabelian groups of order $27$. Let us consider one of the latter, namely

$$
M_{27}=C_9\rtimes C_3
=\braket{a,b\mid a^9=b^3=1,\ bab^{-1}=a^4}.
$$

Let $k$ be a fixed field of characteristic $3$. We will first compute the Jennings/dimension series of $M_{27}$. The first term is $M_{27}$ itself, and the second is the Frattini subgroup:

$$
\Phi(M_{27})=M_{27}^3[M_{27},M_{27}].
$$

We have $M_{27}^3=\{1,a^3,a^6\}$; indeed, $(a^ib^j)^3=a^{3i}$. The derived subgroup is generated by $bab^{-1}a^{-1}=a^3$: the quotient by $\braket{a^3}$ is abelian, and this generator is itself a commutator. Thus both subgroups are $\braket{a^3}$, and the Frattini subgroup is $\braket{a^3}$.

The first index is $27/3=9$, so $n_1=2$. The only two choices for the next subgroup are $\braket{a^3}$ and $1$, corresponding to $n_2=0$ and $n_2=1$. The power condition requires

$$
\Gamma_3(M_{27})\supset M_{27}^3=\braket{a^3},
$$

so $\Gamma_3=\Gamma_2$ and $n_2=0$. To see that the next term is trivial, observe that $\braket{a^3}$ is central of order $3$. Consequently the decreasing series

$$
M_{27},\quad\braket{a^3},\quad\braket{a^3},\quad1,\quad1,\dots
$$

satisfies both the commutator and power conditions. The fastest such series is contained in it, so $\Gamma_4=1$. Therefore the Jennings series is

$$
M_{27}\supset\braket{a^3}\supset\braket{a^3}\supset\braket{1},
\qquad n_1=2,\quad n_2=0,\quad n_3=1.
$$

Hence the Poincaré polynomial is

$$
\begin{aligned}
\prod_{r=1}^3(1+t^r+t^{2r})^{n_r}
&=(1+t+t^2)^2(1+t^3+t^6) \\
&=1+2t+3t^2+3t^3+3t^4+3t^5 \\
&\qquad+3t^6+3t^7+3t^8+2t^9+t^{10}.
\end{aligned}
$$

This gives all the dimensions of the radical layers, and of the socle layers by :ref[thm:radical-and-socle], and tells us that the Loewy length is $11$.

## References {#references}

- D. J. Benson, *Representations and Cohomology I: Basic Representation Theory of Finite Groups and Associative Algebras*, Cambridge Studies in Advanced Mathematics 30, Cambridge University Press, 1991.
- S. A. Jennings, [*The structure of the group ring of a $p$-group over a modular field*](https://doi.org/10.2307/1989916), Transactions of the American Mathematical Society **50** (1941), 175–185.
- Daniel G. Quillen, [*On the associated graded ring of a group ring*](https://doi.org/10.1016/0021-8693(68)90069-0), Journal of Algebra **10** (1968), 411–418.
- Helmut Strade and Rolf Farnsteiner, [*Modular Lie Algebras and Their Representations*](https://www.routledge.com/Modular-Lie-Algebras-and-their-Representations/Strade/p/book/9780824775940), Monographs and Textbooks in Pure and Applied Mathematics 116, Marcel Dekker, 1988.
- Peter Webb, [*A Course in Finite Group Representation Theory*](https://doi.org/10.1017/CBO9781316677216), Cambridge Studies in Advanced Mathematics 161, Cambridge University Press, 2016.

The original course-paper version is available as [a PDF](/jennings-theorem.pdf).
