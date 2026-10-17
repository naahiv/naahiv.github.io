---
title: 'Tannakian Reconstruction for Tensor Categories'
slug: tannakian-reconstruction
date: '2026-10-16'
summary: 'An exposition of Deligne’s reconstruction theorems, from Hopf algebras and super vector spaces to Schur functors and tensor categories.'
tags: [category-theory, representation-theory, algebraic-geometry]
draft: false
macros: |
  \newcommand{\A}{\mathcal{A}}
  \newcommand{\C}{\mathcal{C}}
  \renewcommand{\O}{\mathcal{O}}
  \newcommand{\Vect}{\mathbf{Vect}}
  \newcommand{\SVect}{\mathbf{SVect}}
  \renewcommand{\Set}{\mathbf{Set}}
  \DeclareMathOperator{\Rep}{Rep}
  \DeclareMathOperator{\Aut}{Aut}
  \DeclareMathOperator{\End}{End}
  \DeclareMathOperator{\Mon}{Mon}
  \DeclareMathOperator{\Comon}{Comon}
  \DeclareMathOperator{\Hopf}{Hopf}
  \DeclareMathOperator{\QCoh}{QCoh}
  \DeclareMathOperator{\PSh}{PSh}
---

This is a short exposition on P. Deligne's Tannakian reconstruction theorems regarding certain tensor categories. The definitions needed to state the theorems, although relatively simple, are numerous; hence the goal is to state the results and discuss examples, particularly in representation theory and algebraic geometry.

The main sources are Deligne's *Catégories tensorielles* and *Catégories tannakiennes*, together with Deligne–Milne's *Tannakian Categories*. Most proofs can be found in those papers and will be omitted here for brevity.

## Tannakian duality {#tannakian-duality}

The goal of Tannakian reconstruction or duality is to recover an object from its associated category of representations, appropriately construed. In most scenarios this is not possible, so one determines under what conditions it can be done. “Tannakian” usually connotes that the category should be viewed with a symmetric monoidal structure.

There are two classes of reconstruction theorems. One asks whether a representation category determines the underlying object. The other asks when we can, given a category satisfying some properties, produce an object whose representations are that category. Deligne's theorems are of the latter form. We begin with some examples of the former.

If $R$ is a ring, its category of modules $\operatorname{Mod}(R)$ is its category of representations. We might ask when an additive equivalence

$$
\operatorname{Mod}(R)\simeq\operatorname{Mod}(S)
$$

implies $R\cong S$. It does, for instance, if $R$ and $S$ are commutative: the endomorphism ring of the identity functor on $\operatorname{Mod}(R)$ is the center of $R$. In general this is the theory of Morita equivalence. For commutative rings, if the equivalence also preserves the usual tensor products, the ring can be recovered directly as the endomorphisms of the tensor unit.

We may ask the same thing for representations of a group $G$ in sets. Write $\Set(G)$ for the category of left $G$-sets.

:::theorem
Let $G,G'$ be groups such that $\Set(G)\simeq\Set(G')$. Then $G\cong G'$.
:::

:::proof
The regular left $G$-set $G$ is, up to isomorphism, the unique nonempty indecomposable projective object of $\Set(G)$. Indeed, an indecomposable nonempty $G$-set is transitive, hence of the form $G/H$. If it is projective, the surjection $G\to G/H$ has a $G$-equivariant section. Every point of $G$ has trivial stabilizer, so such a section forces $H=1$. Conversely, the regular $G$-set is projective because a map out of it is determined by the image of the identity, and that image lifts across any surjection.

An equivalence preserves these categorical properties, and hence identifies the automorphism groups of the two regular objects. Since

$$
\Aut_{\Set(G)}(G)\cong G^\op,
$$

and similarly for $G'$, we recover $G\cong G'$.
:::

There is also a reconstruction which remembers the forgetful functor $F\colon\Set(G)\to\Set$. The regular object represents $F$, so the Yoneda lemma gives

$$
\Aut(F)\cong G.
$$

This is particularly close to the reconstruction by a fiber functor that we will encounter later.

If we think of $G$ as a one-object groupoid, then $\Set(G)=\operatorname{Fun}(G,\Set)$. It is natural to think of

$$
\PSh(C)=\operatorname{Fun}(C^\op,\Set)
$$

as a category of representations of an arbitrary small category $C$. In this setting a presheaf category determines the *idempotent completion* of $C$: the category obtained by formally splitting every idempotent as a section–retraction pair. More precisely, $\PSh(C)\simeq\PSh(D)$ if and only if the idempotent completions of $C$ and $D$ are equivalent. In particular, if $C$ and $D$ are already idempotent complete, an equivalence of their presheaf categories implies $C\simeq D$.

Our example of commutative rings shows that affine schemes $X$ and $Y$ with an additive equivalence

$$
\QCoh(X)\simeq\QCoh(Y)
$$

are isomorphic. The case becomes more interesting when the schemes are not affine. Under suitable hypotheses, even the bounded derived category of coherent sheaves determines the scheme; the Bondal–Orlov reconstruction theorem is one example.

Deligne's theorem instead starts with a potential representation category. Roughly, it says that a suitable abelian symmetric tensor category in characteristic zero is a category of super-representations if every object is annihilated by some Schur functor. The ordinary version requires the stronger condition that sufficiently large exterior powers vanish. We will state both precisely after explaining the terminology.

## Hopf algebras {#hopf-algebras}

Let $\C=(C,\otimes,I)$ be a symmetric monoidal category. We will suppress associators and unitors, inserting them where needed by the coherence theorem. We must retain the symmetry

$$
\tau_{c,d}\colon c\otimes d\longrightarrow d\otimes c;
$$

in the super setting, it will carry an essential sign.

Recall that a *monoid* in $\C$ is an object $c$ equipped with multiplication $m\colon c\otimes c\to c$ and unit $\eta\colon I\to c$ such that

$$
\begin{CD}
c\otimes c\otimes c @>{1\otimes m}>> c\otimes c \\
@V{m\otimes1}VV @VV{m}V \\
c\otimes c @>{m}>> c
\end{CD}
$$

commutes, and

$$
m\circ(\eta\otimes1)=1_c=m\circ(1\otimes\eta).
$$

A *comonoid* in $\C$ is a monoid in $\C^\op$. We write its structure maps as

$$
w\colon c\longrightarrow c\otimes c,
\qquad
\nu\colon c\longrightarrow I.
$$

A monoid is *commutative* if $m\circ\tau_{c,c}=m$; a comonoid is *cocommutative* if $\tau_{c,c}\circ w=w$.

A morphism of monoids is a morphism $f\colon c\to d$ satisfying

$$
f\circ m_c=m_d\circ(f\otimes f),
\qquad
f\circ\eta_c=\eta_d,
$$

and likewise for comonoids with the arrows reversed. These form categories $\Mon(\C,\otimes)$ and $\Comon(\C,\otimes)$. Some examples are

$$
\begin{aligned}
\Mon(\Set,\times)&=\{\text{monoids}\},\\
\Mon(\mathbf{Cat},\times)&=\{\text{strict monoidal categories}\},\\
\Mon(\mathbf{Grp},\times)&\simeq\mathbf{Ab},\\
\Mon(\Vect(k),\otimes)&=\{\text{associative unital }k\text{-algebras}\}.
\end{aligned}
$$

In the second example the morphisms on the right are strict monoidal functors. There are also canonical equivalences

$$
\Mon(C,\sqcup)\simeq C,
\qquad
\Comon(C,\times)\simeq C,
$$

whenever the indicated finite coproducts or products exist. The corresponding multiplication is the fold map, or comultiplication the diagonal. In general, forgetting the structure gives a faithful functor $\Mon(\C)\to\C$.

A *bialgebra* or *bimonoid* in $\C$ is an object with both structures, subject to compatibility. Concretely, the comultiplication and counit must be monoid morphisms. Thus

$$
w\circ m=(m\otimes m)\circ(1\otimes\tau\otimes1)\circ(w\otimes w),
$$

and, with the canonical identifications involving $I$ understood,

$$
w\circ\eta=\eta\otimes\eta,
\qquad
\nu\circ m=\nu\otimes\nu,
\qquad
\nu\circ\eta=1_I.
$$

For example, if $\C$ is semiadditive, every object has a unique bimonoid structure for $(\C,\oplus,0)$, using its fold and diagonal maps. In $\Vect(k)$ with $\otimes_k$, we recover the usual notion of a bialgebra.

Let $A=k[x_1,\ldots,x_n]$ be the polynomial algebra. It has a coalgebra structure determined by

$$
w(x_i)=x_i\otimes1+1\otimes x_i,
\qquad
\nu(f)=f(0,\ldots,0),
$$

where $w$ extends as an algebra homomorphism. These maps make $A$ a bialgebra.

Finally, a *Hopf algebra* in $\C$ is a bialgebra $c$ equipped with an antipode $S\colon c\to c$ such that

$$
m\circ(1\otimes S)\circ w
=\eta\circ\nu
=m\circ(S\otimes1)\circ w.
$$

These again form a category $\Hopf(\C)$. For example,

$$
\Hopf(\Set,\times)\simeq\mathbf{Grp},
$$

and taking $\C=\Vect(k)$ recovers classical Hopf algebras. For the polynomial bialgebra above, setting $S(x_i)=-x_i$ gives a Hopf algebra.

A nice geometric example is the cohomology of a compact Lie group. Over a field $k$, the cup product makes $H^*(G;k)$ a graded algebra, and the group multiplication induces

$$
H^*(G;k)\longrightarrow H^*(G\times G;k)
\cong H^*(G;k)\otimes_k H^*(G;k).
$$

The identity and inverse give the counit and antipode. This is a Hopf algebra in graded vector spaces, with the graded symmetry, and the assignment is contravariant in $G$. Compactness gives finite-dimensional cohomology, so the indicated Künneth identification applies without additional finiteness issues. For fun, Lie groups themselves can be described as $\Hopf(\mathbf{SmMan},\times)$.

## Superalgebra {#superalgebra}

We now discuss *superobjects*, which means objects with a $\ZZ/2$ grading. A super vector space over $k$ is a vector space with a decomposition

$$
V=V_0\oplus V_1.
$$

We think of $V_0$ as the even subspace and $V_1$ as the odd subspace. A nonzero homogeneous element belongs to one of these summands, and its parity $p(v)\in\ZZ/2$ records which one.

Direct sums are defined componentwise. For tensor products, we set

$$
\begin{aligned}
(V\otimes W)_0&=(V_0\otimes W_0)\oplus(V_1\otimes W_1),\\
(V\otimes W)_1&=(V_0\otimes W_1)\oplus(V_1\otimes W_0).
\end{aligned}
$$

Similarly, the space of linear maps has a grading: $\Hom_k(V,W)_0$ consists of maps preserving parity, while $\Hom_k(V,W)_1$ consists of maps reversing it.

The category $\SVect(k)$ has super vector spaces as objects and *even* linear maps as morphisms. Thus its ordinary morphism spaces are $k$-vector spaces. It also has an internal super-Hom, whose even and odd parts are the spaces just described.

The symmetric monoidal structure uses the Koszul rule:

$$
\tau_{V,W}(v\otimes w)=(-1)^{p(v)p(w)}w\otimes v
$$

for homogeneous elements. The forgetful functor $F\colon\SVect(k)\to\Vect(k)$ is faithful and strong monoidal. It does not preserve this symmetry in characteristic different from two: interchanging two odd factors introduces a minus sign.

There is also a canonical functor $i\colon\Vect(k)\to\SVect(k)$ sending $V$ to the purely even space $(V)_0\oplus(0)_1$. All linear maps between purely even spaces preserve parity, so $i$ is fully faithful. If $p\colon\SVect(k)\to\Vect(k)$ takes the even summand, then

$$
\Hom_{\Vect(k)}(p(V),W)
\cong\Hom_{\SVect(k)}(V,i(W))
$$

exhibits an adjunction $p\dashv i$.

On the other hand, a linear map $V\to F(W)$ amounts to a pair of maps into $W_0$ and $W_1$. Define $d\colon\Vect(k)\to\SVect(k)$ by placing one copy of $V$ in each parity. Then

$$
\Hom_{\SVect(k)}(d(V),W)
\cong\Hom_{\Vect(k)}(V,F(W)),
$$

giving $d\dashv F$. Notice that $p\circ d\cong\mathrm{Id}$. Reversing the same arguments gives the other adjunctions:

$$
\begin{aligned}
\Hom_{\Vect(k)}(F(V),W)
&\cong\Hom_{\SVect(k)}(V,d(W)),\\
\Hom_{\SVect(k)}(i(W),V)
&\cong\Hom_{\Vect(k)}(W,p(V)).
\end{aligned}
$$

Thus $F\dashv d$ and $i\dashv p$ as well. These are adjunctions of the underlying categories; the two adjoint pairs provide useful ways to pass between ordinary and super vector spaces.

Because of our generality in the previous section, we can apply the definitions to $\SVect(k)$ to get superalgebras, superbialgebras, and Hopf superalgebras. Commutativity with respect to the Koszul symmetry is exactly *supercommutativity*:

$$
ab=(-1)^{p(a)p(b)}ba.
$$

For a supercommutative algebra, $A_0$ is an ordinary commutative subalgebra. Products of odd elements lie in $A_0$, and in characteristic different from two every odd element squares to zero. Given superalgebras $A,B$, their tensor product has multiplication

$$
(a\otimes b)(a'\otimes b')
=(-1)^{p(a')p(b)}aa'\otimes bb'
$$

on homogeneous tensors.

We finish this part with examples. Let $G$ be a group and consider the group algebra $k[G]$. Define, for every $g\in G$,

$$
w(g)=g\otimes g,
\qquad
\nu(g)=1,
\qquad
S(g)=g^{-1},
$$

and extend linearly. This gives a Hopf algebra. If $G$ is finite, its linear dual

$$
\O(G)=k[G]^*
$$

is the Hopf algebra of $k$-valued functions on $G$. Its product is pointwise multiplication, and its comultiplication, counit, and antipode are

$$
w(f)(g,h)=f(gh),
\qquad
\nu(f)=f(e),
\qquad
S(f)(g)=f(g^{-1}).
$$

More generally, the dual of a finite-dimensional Hopf algebra is again a Hopf algebra. Finite dimensionality matters: the dual of a multiplication need not land in $H^*\otimes H^*$ when $H$ is infinite-dimensional. We will use coordinate Hopf algebras directly when discussing general algebraic groups.

For a super example, take an odd generator $\theta$ and the exterior algebra $k[\theta]/(\theta^2)$. It becomes a Hopf superalgebra by

$$
w(\theta)=\theta\otimes1+1\otimes\theta,
\qquad
\nu(\theta)=0,
\qquad
S(\theta)=-\theta.
$$

Here the Koszul sign ensures that the square of $w(\theta)$ is zero, as required.

## Tensor categories {#tensor-categories}

We now define the categories to which Deligne's theorem applies. From this point on, let $k$ be algebraically closed of characteristic zero. Write $\Vect(k)^{\mathrm{fin}}$ and $\SVect(k)^{\mathrm{fin}}$ for the finite-dimensional categories.

:::definition[Tensor category]{#def:tensor-category}
For this discussion, a *$k$-tensor category* is an essentially small abelian $k$-linear symmetric monoidal category $\A$ such that the tensor product is $k$-linear and exact in each variable, every object has a dual, and the natural map $k\to\End(I)$ is an isomorphism.
:::

The abelian and exactness conditions allow us to discuss subobjects and quotients; the remaining conditions describe the tensor structure. Let us work backwards through them.

That $\A$ is $k$-linear means its morphism sets are $k$-vector spaces and composition is bilinear. An object $A\in\A$ has a left dual $B$ if there are maps

$$
\operatorname{coev}\colon I\to A\otimes B,
\qquad
\operatorname{ev}\colon B\otimes A\to I
$$

such that the composites

$$
\begin{aligned}
A&\xrightarrow{\operatorname{coev}\otimes1}
A\otimes B\otimes A\xrightarrow{1\otimes\operatorname{ev}}A,\\
B&\xrightarrow{1\otimes\operatorname{coev}}
B\otimes A\otimes B\xrightarrow{\operatorname{ev}\otimes1}B
\end{aligned}
$$

are identities. Right duals are defined similarly. In a symmetric monoidal category, a left dual supplies a right dual using the symmetry. A monoidal category is *rigid* if every object has both.

Both $\Vect(k)^{\mathrm{fin}}$ and $\SVect(k)^{\mathrm{fin}}$ are rigid, by taking linear duals, and satisfy :ref[def:tensor-category]. Finite dimensionality is essential here.

Not all symmetric monoidal categories are rigid. For a scheme $X$, the category $\QCoh(X)$ is symmetric monoidal, and its dualizable objects are precisely the vector bundles of finite rank. On an affine scheme this is the statement that dualizable modules are finite projective modules. Even $\QCoh(\Spec k)=\Vect(k)$ contains infinite-dimensional objects, so the whole category is not rigid even for a one-point scheme.

### Schur functors {#schur-functors}

We need one more finiteness property. Recall the representation-theoretic fact that, over a field of characteristic zero, the irreducible representations of the symmetric group $S_n$ are classified by partitions of $n$. A partition is a sequence $\lambda=(n_1,\ldots,n_r)$ with

$$
n_1\geq\cdots\geq n_r>0,
\qquad
\sum_i n_i=n.
$$

Write $V_\lambda$ for the corresponding irreducible representation.

The symmetry gives a natural action of $S_n$ on $X^{\otimes n}$ for every $X\in\A$. We define the *Schur functor* by

$$
S_\lambda(X)=(V_\lambda^*\otimes X^{\otimes n})^{S_n}.
$$

This formula makes sense inside $\A$. Tensoring an object with a finite-dimensional vector space is defined using finite direct sums, and taking invariants means taking the image of the averaging idempotent

$$
\frac{1}{n!}\sum_{\sigma\in S_n}\sigma.
$$

Idempotents split in an abelian category. Thus we need not treat objects of $\A$ as actual vector spaces in order to define $S_\lambda$. The dual on $V_\lambda$ expresses the usual multiplicity-object convention; the irreducible representations of $S_n$ are self-dual, so it gives the same isomorphism class as the formula without the dual.

For example,

$$
S_{(n)}(X)=\operatorname{Sym}^n(X),
\qquad
S_{(1,\ldots,1)}(X)=\Lambda^n(X).
$$

One can also use the enriched Yoneda embedding to regard $\A$ as a full subcategory of $k$-linear functors $\A^\op\to\Vect(k)$. Limits and colimits in that functor category are computed pointwise. This can help interpret the linear algebra, but the embedding alone does not provide the tensor or abelian properties needed for the constructions above; those are included in our hypotheses.

We say that $\A$ is *finitely generated by tensor products* if there is an object $X$ from which every object is obtained using finite direct sums, tensor products, duals, and subquotients. Equivalently, after replacing the generator by $X\oplus X^*$, every object is a subquotient of a finite direct sum of its tensor powers, with the zeroth power interpreted as $I$.

For example, the odd line $(0)_0\oplus(k)_1$ tensor-generates $\SVect(k)^{\mathrm{fin}}$: its square is the even line, and finite sums of the even and odd lines give all finite-dimensional super vector spaces.

:::definition[Schur-finiteness]{#def:regular}
An object $X$ is *Schur-finite* if $S_\lambda(X)=0$ for some partition $\lambda$ of some positive integer. Following the terminology of my notes, call a $k$-tensor category *regular* if it is finitely generated by tensor products and every object is Schur-finite.
:::

Schur-finiteness says that some irreducible $S_n$-type is absent from the corresponding tensor power. In ordinary finite-dimensional vector spaces, sufficiently large exterior powers vanish. Super vector spaces require the more general Schur functors: an odd line has nonzero exterior powers in every degree, although its second symmetric power is zero.

## The Deligne theorems {#deligne-theorems}

We can now describe the representation categories in the theorem. If $H$ is a Hopf superalgebra, an $H$-module is a super vector space with an even action of the algebra $H$. An $H$-comodule is a super vector space $V$ with an even coaction

$$
\rho\colon V\longrightarrow V\otimes H
$$

satisfying coassociativity and the counit identity. When $H$ is finite-dimensional, right $H$-comodules correspond to left $H^*$-modules, and vice versa. For general coordinate algebras, we keep the comodule description.

The Hopf structure gives tensor products of representations. For modules, the usual super symmetry is compatible with the action when $H$ is supercocommutative; for comodules, the corresponding condition is supercommutativity of $H$. An arbitrary Hopf algebra does not automatically give a symmetric representation category.

:::definition[Affine supergroup]{#def:supergroup}
An *affine supergroup* $G$ over $k$ is represented by a supercommutative Hopf superalgebra $\O(G)$. Thus, for a supercommutative $k$-algebra $R$,

$$
G(R)=\Hom_{k\text{-superalg}}(\O(G),R),
$$

with multiplication induced by $w$, identity by $\nu$, and inverse by $S$. It is *algebraic* if $\O(G)$ is finitely generated as a superalgebra.
:::

A finite-dimensional super-representation of $G$ is a finite-dimensional right $\O(G)$-comodule. When the coordinate algebra is purely even, this includes the usual representations of affine group schemes by placing them in even degree.

Every superalgebra has a canonical parity involution, given on homogeneous elements by

$$
h\longmapsto(-1)^{p(h)}h.
$$

For a supergroup it induces the parity automorphism of $G$. An *inner parity* is an element $\sigma\in G(k)$ such that $\sigma^2=e$ and conjugation by $\sigma$ is this parity automorphism. If $G$ is purely even, this says that $\sigma$ is central; it need not be central for a general supergroup.

Fixing such $\sigma$, define $\Rep_k(G,\sigma)$ to consist of finite-dimensional super-representations for which the action of $\sigma$ is the parity involution of the representation. These form a $k$-tensor category.

:::theorem[Deligne]{#thm:super-deligne}
Let $k$ be an algebraically closed field of characteristic zero, and let $\A$ be a regular $k$-tensor category in the sense above. There is an affine algebraic supergroup $G$ with inner parity $\sigma$ and an equivalence

$$
\A\simeq\Rep_k(G,\sigma)
$$

of symmetric tensor categories.
:::

This is Deligne's [*Catégories tensorielles*, Theorem 0.6](https://publications.ias.edu/sites/default/files/Tensorielles.pdf). The tensor-generation hypothesis is what allows the reconstructed supergroup to be of finite type. The proof produces an exact faithful $k$-linear symmetric monoidal functor

$$
F\colon\A\longrightarrow\SVect(k)^{\mathrm{fin}},
$$

called a *super fiber functor*. Given this functor, the reconstruction takes the form

$$
G(R)=\Aut^\otimes(R\otimes_k F)
$$

for every supercommutative $k$-algebra $R$. These are even $R$-linear tensor automorphisms, natural in the objects of $\A$. The formula describes a functor on superalgebras, not just a group of $k$-points. The parity automorphism of $F$ supplies $\sigma\in G(k)$.

For the forgetful functor on $\Rep_k(G,\sigma)$, this construction recovers $G$ and $\sigma$. Under the hypotheses stated here, the pair is unique up to isomorphism. The identification is not canonical without a choice of identification between fiber functors; changing that choice changes the resulting group isomorphism by conjugation.

### The ordinary version {#ordinary-deligne}

Recall that an affine group scheme is an affine $k$-scheme equipped with a group-object structure. Taking spectra gives an anti-equivalence between commutative Hopf $k$-algebras and affine group schemes. A simple example is

$$
\mathbf G_m=\Spec(k[t,t^{-1}]),
$$

with $w(t)=t\otimes t$, $\nu(t)=1$, and $S(t)=t^{-1}$. Representations of an affine group scheme are finite-dimensional comodules over its coordinate Hopf algebra.

The ordinary Deligne theorem requires exterior powers, rather than arbitrary Schur functors, to vanish.

:::theorem[Deligne, ordinary form]{#thm:ordinary-deligne}
Let $k$ be algebraically closed of characteristic zero, and let $\A$ be a $k$-tensor category as in :ref[def:tensor-category]. Suppose that for every object $X$ there is $n\geq1$ with $\Lambda^n(X)=0$. Then there is an affine group scheme $G$ and an equivalence

$$
\A\simeq\Rep_k(G)
$$

of symmetric tensor categories. If $\A$ is finitely generated by tensor products, $G$ can be taken to be an affine algebraic group.
:::

See Deligne's *Catégories tannakiennes*, Théorème 7.1, and [Deligne–Milne, *Tannakian Categories*](https://www.jmilne.org/math/xnotes/tc2022.pdf), including the discussion of the exterior-power criterion. Here the fiber functor takes values in $\Vect(k)^{\mathrm{fin}}$, and

$$
G(R)=\Aut^\otimes(R\otimes_k F)
$$

is evaluated on ordinary commutative $k$-algebras. With a tensor generator, the same uniqueness discussion applies.

The difference in the hypotheses is visible in the simplest super example. The odd line in $\SVect(k)^{\mathrm{fin}}$ is Schur-finite but has no vanishing exterior power, so this category cannot be a category of ordinary representations with its usual symmetry. It is instead $\Rep_k(\boldsymbol\mu_2,-1)$, with the symmetry determined by parity. This is why the super and ordinary reconstruction statements must be distinguished.

For the original short exposition and its references, see [the paper version, *Tannakian Reconstruction for Tensor Categories*](/tensor-categories.pdf).
