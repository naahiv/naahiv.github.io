---
title: 'Quillen–Suslin 2: Vaserstein’s proof'
slug: quillen-suslin-2
date: '2026-10-16'
summary: 'Unimodular vectors, Horrocks’ theorem, and Vaserstein’s local-to-global argument, with the monic-polynomial step over a PID.'
tags: [algebra, algebraic-geometry, quillen-suslin]
draft: false
series:
  name: 'Quillen–Suslin'
  order: 2
macros: |
  \DeclareMathOperator{\GL}{GL}
  \DeclareMathOperator{\Frac}{Frac}
  \newcommand{\m}{\mathfrak{m}}
  \newcommand{\p}{\mathfrak{p}}
---

In this post we complete the proof of the Quillen–Suslin theorem using Vaserstein’s simplified proof. In :post[quillen-suslin-1], we showed that every finite projective module over a polynomial ring over a PID is stably free. Our remaining task is to show that every stably free module over the same ring is free.

The focus is the following definition.

## Unimodular vectors {#unimodular-vectors}

:::definition{#def:unimodular}
Let $A$ be a ring.

1. A **unimodular vector** $(f_1,\ldots,f_m)$ is an ordered list of elements of $A$ which generate the unit ideal.
2. A unimodular vector has the **unimodular extension property** (UEP) if there is a matrix in $\GL_m(A)$ whose first column is $(f_1,\ldots,f_m)^t$.
3. The ring $A$ has the **unimodular extension property** if every unimodular vector over $A$ has the UEP.
:::

We regard vectors as columns from now on. This is a fundamentally geometric notion: unimodularity says precisely that the principal open sets $D(f_i)$ cover $\Spec(A)$. Equivalently, the section $f$ of the trivial rank-$m$ bundle generates a trivial line subbundle, and the UEP asks whether it extends to a frame of the whole bundle. The following proposition explains why the definition is useful, in light of the previous post.

:::proposition{#prop:uep-stably-free}
A ring $A$ has the UEP if and only if every finite stably free $A$-module is free.
:::

:::proof
Suppose first that $A$ has the UEP. By induction on the number of free summands, it suffices to show that if $E\oplus A$ is finite free, then $E$ is free.

Choose an identification $E\oplus A\cong A^m$, and let $u_1$ be the image of $(0,1)$. Projection to the second summand gives a linear map $p\colon A^m\to A$ such that $p(u_1)=1$, so the coordinates of $u_1$ generate $A$. We may therefore complete $u_1$ to a basis $u_1,u_2,\ldots,u_m$ of $A^m$.

For $j\geq2$, replace $u_j$ by

$$
v_j=u_j-p(u_j)u_1.
$$

These replacements preserve the basis and put $v_j$ in $\ker p=E$. If $v\in E$ is written in the basis $u_1,v_2,\ldots,v_m$, applying $p$ shows that its $u_1$-coefficient is zero. Hence $v_2,\ldots,v_m$ is a basis of $E$.

Conversely, let $f\in A^m$ be unimodular. Choose $a_i\in A$ such that $\sum_i a_if_i=1$ and define

$$
p\colon A^m\longrightarrow A,
\qquad
p(v_1,\ldots,v_m)=\sum_i a_iv_i.
$$

Since $p(f)=1$, we have $A^m=Af\oplus\ker p$. The second summand is stably free, hence free by assumption. A basis of it, together with $f$, completes the required matrix.
:::

The first example of a ring with the UEP is a PID. There is a brute-force induction proof, but the following argument is a nice trick.

:::proposition{#prop:pid-uep}
Every PID has the UEP.
:::

:::proof
Let $f\in A^m$ be unimodular, choose $a_i$ with $\sum_i a_if_i=1$, and use the map $p$ from the preceding proof. Then

$$
A^m=Af\oplus\ker p.
$$

Since $A$ is a PID, the submodule $\ker p\subseteq A^m$ is free. It has rank $m-1$, as one sees after tensoring with $\Frac(A)$. Thus $f$ extends to a basis.
:::

:::definition{#def:equivalence}
For $f,g\in A^m$, we say that $f$ and $g$ are **$A$-equivalent**, and write $f\sim g$, if there is $M\in\GL_m(A)$ such that $f=Mg$.
:::

This is an equivalence relation. A unimodular vector has the UEP exactly when it is equivalent to the first standard basis vector $e_1$. Permuting components, multiplying one component by a unit, and adding a multiple of one component to another all preserve equivalence.

Two small cases will be useful. A unimodular vector of length one is a unit. For a unimodular vector $(f_1,f_2)^t$, choose $a_1f_1+a_2f_2=1$; then

$$
\begin{pmatrix}
f_1&-a_2\\
f_2&a_1
\end{pmatrix}
$$

has determinant $1$ and completes the vector. Thus vectors of length at most two have the UEP over every commutative ring.

## Horrocks’ theorem {#horrocks}

We next need Horrocks’ theorem. This is the machinery behind the inductive proof of the Quillen–Suslin theorem. We give the polynomial argument, including the degree reduction which makes the induction work.

:::lemma{#lem:degree-reduction}
Let $R$ be a ring, let $f\in R[x]$ be monic of degree $d>0$, and let

$$
g=b_0+b_1x+\cdots+b_sx^s,
\qquad s<d.
$$

If the coefficients $b_i$ generate $R$, then the ideal $(f,g)$ contains a monic polynomial of degree $d-1$.
:::

:::proof
Division by the monic polynomial $f$ gives a unique remainder of degree less than $d$. For $0\leq i\leq s$, let $h_i$ be the remainder of $x^{d-1-i}g$ modulo $f$, and let $c_i$ be its coefficient of $x^{d-1}$. Each $h_i$ belongs to $(f,g)$.

The term $b_ix^i$ contributes $b_i$ to $c_i$, terms with index less than $i$ have degree less than $d-1$, and terms with index greater than $i$ contribute $R$-multiples of their coefficients. Consequently,

$$
c_i=b_i+\sum_{j>i}r_{ij}b_j
\qquad(r_{ij}\in R).
$$

Descending induction on $i$ shows that $(c_0,\ldots,c_s)=(b_0,\ldots,b_s)=R$. Choose $a_i$ with $\sum_i a_ic_i=1$. Then $\sum_i a_ih_i$ has degree $d-1$ and leading coefficient $1$, as required.
:::

:::theorem[Horrocks]{#thm:horrocks}
Let $(R,\m)$ be a local ring. If $f\in R[x]^m$ is a unimodular vector with a monic component, then $f$ has the UEP.
:::

:::proof
The cases $m=1,2$ were handled above, so assume $m\geq3$. After permuting components, let $f_1$ be monic of degree $d$. We induct on $d$.

If $d=0$, then $f_1=1$ and subtracting $f_i$ times the first component from the $i$th component gives $e_1$. Suppose $d>0$. Divide each $f_i$, for $i\geq2$, by $f_1$ and subtract the quotient times $f_1$. These operations let us assume that

$$
\deg f_i<d\qquad(i\geq2).
$$

At least one coefficient of one of these remaining components is a unit in $R$. Otherwise all the $f_i$ for $i\geq2$ would vanish in $(R/\m)[x]$, and unimodularity would say that the monic degree-$d$ polynomial $\overline{f_1}$ generates the unit ideal of $(R/\m)[x]$, which is impossible. Relabel so that $f_2$ has a unit coefficient.

By :ref[lem:degree-reduction], there are $u,v\in R[x]$ such that

$$
h=uf_1+vf_2
$$

is monic of degree $d-1$. Let $c$ be the coefficient of $x^{d-1}$ in $f_3$. Replace $f_3$ by

$$
f_3+(1-c)uf_1+(1-c)vf_2=f_3+(1-c)h.
$$

This is an elementary change, and its coefficient of $x^{d-1}$ is $c+(1-c)=1$.

We have obtained an equivalent unimodular vector with a monic component of degree $d-1$. The induction hypothesis completes the proof.
:::

:::corollary{#cor:local-evaluation}
If $R$ is a local ring and $f\in R[x]^m$ is unimodular with a monic component, then $f\sim f(0)$ over $R[x]$.
:::

:::proof
Evaluating a relation $\sum_i g_if_i=1$ at zero shows that $f(0)$ is unimodular over $R$. At least one $f_i(0)$ is a unit, since otherwise all of them would lie in $\m$. Hence $f(0)\sim e_1$ over $R$, and Horrocks’ theorem gives $f\sim e_1$ over $R[x]$.
:::

## From local rings to a domain {#patching}

The local theorem tells us when a polynomial vector is equivalent to its value at zero. The next step is to patch this equivalence over a domain. The useful intermediate statement concerns translations of the variable.

:::lemma{#lem:clearing-denominators}
Let $A$ be a domain and $S\subseteq A\setminus\{0\}$ a multiplicative subset. If $f(x)\sim f(0)$ over $S^{-1}A[x]$, then there is $c\in S$ such that

$$
f(x+cy)\sim f(x)
$$

over $A[x,y]$.
:::

:::proof
Choose $M(x)\in\GL_m(S^{-1}A[x])$ with $M(x)f(0)=f(x)$, and set

$$
G(x,y)=M(x)M(x+y)^{-1}.
$$

Then

$$
G(x,y)f(x+y)=f(x),
\qquad G(x,0)=I_m.
$$

Thus $G(x,y)=I_m+yH(x,y)$ for a matrix $H$ over $S^{-1}A[x,y]$. Choose a common denominator $c\in S$ for its finitely many coefficients. We then have

$$
G(x,cy)=I_m+cyH(x,cy)\in\operatorname{Mat}_m(A[x,y]).
$$

It remains to check invertibility over $A[x,y]$, rather than just over its localization. A unit in a polynomial ring over a domain is constant, so $\det M(x)$ is a unit of $S^{-1}A$. Therefore

$$
\det G(x,cy)
=\frac{\det M(x)}{\det M(x+cy)}=1.
$$

The adjugate supplies an inverse over $A[x,y]$. The displayed identity now proves the desired equivalence.
:::

:::proposition{#prop:monic-evaluation}
Let $A$ be a domain and $f\in A[x]^m$ a unimodular vector with a monic component. Then $f(x)\sim f(0)$ over $A[x]$.
:::

:::proof
Let

$$
J=\{c\in A:f(x+cy)\sim f(x)\text{ over }A[x,y]\}.
$$

We first check that $J$ is an ideal. Clearly $0\in J$. If $c\in J$ and $a\in A$, substituting $ay$ for $y$ in an equivalence gives $ac\in J$. For addition, suppose

$$
M_c(x,y)f(x)=f(x+cy),
\qquad
M_d(x,y)f(x)=f(x+dy).
$$

Substitute $x+dy$ for $x$ in the first identity and compose with the second. This gives

$$
M_c(x+dy,y)M_d(x,y)f(x)=f(x+(c+d)y).
$$

Both factors are invertible over $A[x,y]$, so $c+d\in J$.

Now let $\p\subset A$ be a prime ideal. The ring $A_\p$ is local, so :ref[cor:local-evaluation] gives $f(x)\sim f(0)$ over $A_\p[x]$. Applying :ref[lem:clearing-denominators] with $S=A\setminus\p$ produces $c\in J\setminus\p$. Thus $J$ is contained in no prime ideal, and $J=A$.

In particular, there is $M(x,y)\in\GL_m(A[x,y])$ with

$$
M(x,y)f(x)=f(x+y).
$$

Evaluating $x$ at zero gives $M(0,y)f(0)=f(y)$. The specialized matrix is invertible because its inverse specializes as well. Renaming $y$ as $x$ proves the proposition.
:::

## Making a component monic over a PID {#monic-over-pid}

We can now discard a variable whenever a component is monic in it. Over a field, a suitable change of variables makes any nonzero polynomial have constant nonzero leading coefficient, which we may then scale to $1$. Over a PID, that coefficient need not be a unit. We therefore need a stronger version of the monic trick.

We will use unique factorization to prove exactly the version needed here. Recall that polynomial rings over a PID are noetherian UFDs. Saying that an ideal has no common irreducible divisor means that it is not contained in $(q)$ for any irreducible element $q$.

:::lemma{#lem:leading-coefficients}
Let $B$ be a noetherian UFD and $I\subseteq B[t]$ a nonzero ideal with no common irreducible divisor. The set

$$
L(I)=\{0\}\cup\{\text{leading coefficients in }t\text{ of nonzero elements of }I\}
$$

is an ideal of $B$ with no common irreducible divisor.
:::

:::proof
To add two leading coefficients, multiply their polynomials by suitable powers of $t$ to give them the same degree and then add. If the coefficients cancel, their sum is zero, which is included in $L(I)$. Multiplication by elements of $B$ is equally immediate. Thus $L(I)$ is an ideal.

Suppose, for a contradiction, that $L(I)\subseteq(q)$ for an irreducible $q\in B$. Choose the finitely many minimal primes $P_1,\ldots,P_r$ over $I$. Noetherianity gives an integer $N$ such that

$$
(P_1\cdots P_r)^N\subseteq I.
$$

Indeed, the product is contained in $\sqrt I$, and a finitely generated ideal contained in $\sqrt I$ has some power contained in $I$. Leading coefficients multiply in the domain $B[t]$, so

$$
L(P_1)^N\cdots L(P_r)^N\subseteq L(I)\subseteq(q).
$$

Since $(q)$ is prime, $L(P)\subseteq(q)$ for at least one of the $P_i$, which we now call $P$. Put $\p=P\cap B$. Then $\p\subseteq(q)$. In a UFD the only primes contained in $(q)$ are $(0)$ and $(q)$: a nonzero prime contained in $(q)$ contains an irreducible factor of any of its nonzero elements, and that factor must be associated to $q$.

If $\p=(q)$, every coefficient of every polynomial in $P$ lies in $(q)$. To see this, its leading coefficient lies in $(q)$ by assumption; subtract that leading term, which belongs to $qB[t]\subseteq P$, and repeat. Hence $P=qB[t]$, contradicting the hypothesis on $I\subseteq P$.

If $\p=(0)$, localize at $B\setminus\{0\}$. The nonzero prime $P$ becomes a nonzero proper prime of the PID $\Frac(B)[t]$, and is therefore generated there by an irreducible polynomial. Clear denominators and divide out its content to obtain a primitive irreducible polynomial $h\in B[t]$. Gauss’ lemma says

$$
\big(h\Frac(B)[t]\big)\cap B[t]=hB[t].
$$

A prime disjoint from the multiplicative set equals the contraction of its localization, so $P=hB[t]$. Again $I\subseteq P$ has a common irreducible divisor, a contradiction.
:::

:::lemma[The monic trick over a PID]{#lem:pid-monic}
Let $A$ be a PID and $I\subseteq A[x_1,\ldots,x_n]$ a nonzero ideal with no common irreducible divisor. If $n\geq1$, there are polynomial coordinates $s_1,\ldots,s_n$ over $A$ in which $I$ contains a polynomial monic in $s_1$.
:::

:::proof
For $n=1$, the ideal $L(I)\subseteq A$ from :ref[lem:leading-coefficients] has no common irreducible divisor. Since $A$ is a PID and $L(I)\neq0$, it follows that $L(I)=A$. Thus $I$ contains a monic polynomial.

Suppose $n>1$ and put $B=A[x_1,\ldots,x_{n-1}]$. Regard $I$ as an ideal in $B[x_n]$. By the preceding lemma, $L(I)$ has no common irreducible divisor in $B$. By induction we may choose coordinates $s_1,\ldots,s_{n-1}$ for $B$ such that $L(I)$ contains a polynomial

$$
g=s_1^d+g_{d-1}s_1^{d-1}+\cdots+g_0,
\qquad g_i\in A[s_2,\ldots,s_{n-1}].
$$

By the definition of $L(I)$, choose

$$
F=gx_n^e+\sum_{j<e}h_jx_n^j\in I,
\qquad h_j\in B.
$$

Choose a positive integer $N$ so large that

$$
Ne+d>Nj+\deg_{s_1}h_j
$$

for every nonzero $h_j$ with $j<e$. Set $s_n=x_n-s_1^N$, so $x_n=s_n+s_1^N$. These are still polynomial coordinates over $A$. Written in these coordinates, the leading $s_1$-term of $gx_n^e$ is $s_1^{Ne+d}$ with coefficient $1$, and every term coming from $h_jx_n^j$ has smaller $s_1$-degree. Therefore $F$ is monic in $s_1$.
:::

This is the UFD case of Suslin’s monic-polynomial argument; the more general formulation uses the height of an ideal. See [Suslin, §6](https://www.mathnet.ru/links/753a4e7cb0659a105b6187851b181e21/im1800_eng.pdf). The point of the preceding proof is that it applies to a PID without dividing by a nonunit coefficient.

:::lemma{#lem:monic-component}
Let $A$ be a PID and $m\geq3$. Given a unimodular vector $f\in A[x_1,\ldots,x_n]^m$, with $n\geq1$, elementary operations and a change of polynomial coordinates produce a vector with a monic component.
:::

:::proof
Permute the components so that $f_1\neq0$. If $f_1$ is a unit, adding a suitable multiple of $f_1$ to $f_2$ makes $f_2=1$, and we are done. Otherwise let $p_1,\ldots,p_r$ be its distinct irreducible factors in the UFD $A[x_1,\ldots,x_n]$.

For each $j$ such that $p_j$ divides $f_2$, unimodularity supplies an index $i_j\geq3$ for which $p_j$ does not divide $f_{i_j}$. Replace $f_2$ by

$$
f_2+\sum_{\{j:p_j\mid f_2\}}
\left(\prod_{k\neq j}p_k\right)f_{i_j},
$$

where the condition in the sum refers to the original $f_2$. This is a sequence of elementary operations. Modulo any $p_j$ which originally divided $f_2$, exactly its designated summand is nonzero. Modulo any other $p_j$, all the added summands vanish and $f_2$ was already nonzero. Thus the new $f_2$ is divisible by none of the $p_j$, and $f_1,f_2$ have no common irreducible divisor.

Apply :ref[lem:pid-monic] to the ideal $(f_1,f_2)$. After changing coordinates, there is a polynomial

$$
h=af_1+bf_2
$$

which is monic in $s_1$. Choose $k\geq0$ with $k+\deg_{s_1}h>\deg_{s_1}f_3$. Replacing $f_3$ by

$$
f_3+s_1^kaf_1+s_1^kbf_2
$$

makes the third component monic in $s_1$. Again, these are elementary operations.
:::

## Vaserstein’s theorem {#vaserstein}

We can finally complete the induction. The proof is an induction on the number of variables, not on the length of the vector.

:::theorem[Vaserstein]{#thm:vaserstein}
Let $A$ be a PID and let $f\in A[x_1,\ldots,x_n]^m$ be unimodular. Then $f$ has the UEP.
:::

:::proof
For $n=0$, this is :ref[prop:pid-uep]. Suppose the result holds for $n-1$ variables. Vectors of length one or two can be completed over any ring, so assume $m\geq3$.

By :ref[lem:monic-component], after elementary operations and a change of coordinates we may assume that a component of $f$ is monic in $s_1$, where

$$
A[x_1,\ldots,x_n]=A[s_1,\ldots,s_n].
$$

Apply :ref[prop:monic-evaluation] with coefficient ring $A[s_2,\ldots,s_n]$. It gives

$$
f(s_1,s_2,\ldots,s_n)\sim f(0,s_2,\ldots,s_n)
$$

over $A[s_1,\ldots,s_n]$. The vector on the right is unimodular over $A[s_2,\ldots,s_n]$, so the induction hypothesis completes it to an invertible matrix over that ring. The same matrix remains invertible after adjoining $s_1$.

Hence our transformed vector is equivalent to $e_1$. Undo the elementary operations to obtain a completion of the original vector. A change of coordinates does not affect the conclusion: an isomorphism of polynomial rings sends an invertible matrix, together with its inverse and its specified first column, to an invertible matrix with the corresponding first column.
:::

:::corollary[Quillen–Suslin]{#thm:quillen-suslin}
Let $A$ be a PID. Then every finite projective module over $A[x_1,\ldots,x_n]$ is free. Equivalently, every finite-rank vector bundle on $\mathbb A_A^n$ is trivial.
:::

:::proof
Vaserstein’s theorem says that $A[x_1,\ldots,x_n]$ has the UEP, so :ref[prop:uep-stably-free] shows that every finite stably free module over it is free. By :ref[quillen-suslin-1#cor:serre-reduction], every finite projective module over the same ring is stably free. Combining the two statements proves the theorem.
:::

The two parts of the argument do rather different jobs. Serre’s reduction produces a stable basis; the unimodular-vector argument removes the additional free summands. Horrocks’ theorem and the translation ideal are what let us carry this cancellation from a local ring back to the polynomial ring itself.

For the paper version, including the geometric background and further applications, see [Serre Schemes and the Quillen–Suslin Theorem](/serre-schemes.pdf).
