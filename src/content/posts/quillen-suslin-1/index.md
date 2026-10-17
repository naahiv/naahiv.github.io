---
title: 'Quillen–Suslin 1: Serre’s reduction'
slug: quillen-suslin-1
date: '2026-10-16'
summary: 'Serre’s reduction of the Quillen–Suslin theorem to stably free modules, using finite free resolutions and prime filtrations.'
tags: [algebra, algebraic-geometry, quillen-suslin]
draft: false
series:
  name: 'Quillen–Suslin'
  order: 1
macros: |
  \newcommand{\st}{\mathrm{st}}
  \newcommand{\dimff}{\operatorname{dim}_{\mathrm{ff}}}
  \newcommand{\dimsf}{\operatorname{dim}_{\mathrm{sf}}}
  \DeclareMathOperator{\Ann}{Ann}
---

The Quillen–Suslin theorem is easy to state: if $A$ is a principal ideal domain, then every finite projective module over $A[x_1,\dots,x_n]$ is free. Equivalently, every vector bundle over $\mathbb A_A^n$ is trivial. Here and throughout, “finite” means finitely generated.

The proof is broken into two parts:

1. Every finite projective module over $A[x_1,\dots,x_n]$ is stably free.
2. Every stably free module over $A[x_1,\dots,x_n]$ is free.

As will become clear, the method of proving each part will be quite different: the first consists mostly of manipulating exact sequences and resolutions, while the second deals with matrices of elements of rings. This post gives Serre’s reduction, the first part of the proof; we will complete the argument in :post[quillen-suslin-2].

## Stably free modules and resolutions {#stably-free-modules}

In this section, all modules without qualification will be over some fixed commutative ring $A$.

:::definition{#def:stably-free}
A module $M$ is **stably free** if there is a finite free module $F$ such that $M\oplus F$ is finite free. Two modules $M,M'$ are **stably isomorphic** if there are finite free modules $F,F'$ such that
$$
M\oplus F\cong M'\oplus F'.
$$
In this case we write $M\simeq_{\st}M'$.
:::

When $M$ is stably free it is finite projective, as a summand of a finite free module. It is also clear that if $M$ is stably isomorphic to a stably free module, then $M$ is stably free. Indeed, if $M\oplus F\cong M'\oplus F'$ and $M'\oplus G$ is finite free, then $M\oplus(F\oplus G)$ is finite free as well.

Throughout this post, we will generally reserve the letter $F$ for finite free modules and $E$ for stably free modules. Much of the theory of stably free modules is about resolutions.

:::definition{#def:resolutions}
A **finite free resolution** of a module $M$ is a finite exact sequence
$$
0\longrightarrow F_n\longrightarrow F_{n-1}\longrightarrow\cdots
\longrightarrow F_0\longrightarrow M\longrightarrow0
$$
with each $F_i$ finite free. A **finite stably free resolution** is defined in the same way, with each term stably free.

The finite free dimension $\dimff(M)$, respectively the finite stably free dimension $\dimsf(M)$, is the minimal length $n$ of such a resolution, and is $\infty$ if no such resolution exists. Thus dimension zero means that $M$ itself is finite free, respectively stably free.
:::

We start with a comparison of presentations.

:::lemma[Schanuel’s lemma]{#lem:schanuel}
Suppose that for $i=1,2$ the sequences
$$
0\longrightarrow K_i\longrightarrow P_i\longrightarrow M\longrightarrow0
$$
are exact, with $P_i$ projective. Then
$$
K_1\oplus P_2\cong K_2\oplus P_1.
$$
:::

:::proof
Consider the pullback $P_1\times_M P_2$. Projection onto either factor gives exact sequences
$$
\begin{aligned}
0&\longrightarrow K_1\longrightarrow P_1\times_M P_2\longrightarrow P_2\longrightarrow0,\\
0&\longrightarrow K_2\longrightarrow P_1\times_M P_2\longrightarrow P_1\longrightarrow0.
\end{aligned}
$$
Both split by projectivity, so the pullback is isomorphic to both $K_1\oplus P_2$ and $K_2\oplus P_1$.
:::

:::proposition{#prop:stable-kernels}
Let $M_1,M_2$ be modules such that $M_1\simeq_{\st}M_2$, and suppose that
$$
0\longrightarrow N_i\longrightarrow E_i\longrightarrow M_i\longrightarrow0,
\qquad i=1,2,
$$
are exact with $E_i$ stably free. Then $N_1\simeq_{\st}N_2$.
:::

:::proof
Choose finite free $F_1,F_2$ and an isomorphism $M_1\oplus F_1\cong M_2\oplus F_2$. Adding the identity of $F_i$ to the $i$th presentation gives two projective presentations of the same module. Schanuel’s lemma gives
$$
N_1\oplus E_2\oplus F_2\cong N_2\oplus E_1\oplus F_1.
$$
Choose finite free $G_i$ such that $E_i\oplus G_i$ is finite free. Adding $G_1\oplus G_2$ to both sides makes the summands accompanying $N_1$ and $N_2$ finite free. This is the required stable isomorphism.
:::

:::lemma{#lem:last-syzygy}
Let $n\geq1$ and suppose $\dimsf(M)\leq n$. If
$$
E_{n-1}\longrightarrow\cdots\longrightarrow E_0\longrightarrow M\longrightarrow0
$$
is exact with each $E_i$ stably free, then
$$
K=\ker(E_{n-1}\longrightarrow E_{n-2})
$$
is stably free, where $E_{-1}=M$ when $n=1$.
:::

:::proof
It suffices to show that $K$ is stably isomorphic to a stably free module. By assumption there is a resolution
$$
0\longrightarrow E_n'\longrightarrow\cdots\longrightarrow E_0'\longrightarrow M\longrightarrow0
$$
of length $n$, extending by zeros if necessary. Write $E_{-1}=E_{-1}'=M$, and set
$$
K_i=\ker(E_i\longrightarrow E_{i-1}),
\qquad
K_i'=\ker(E_i'\longrightarrow E_{i-1}').
$$
In particular, $K_{n-1}=K$ and $K_{n-1}'\cong E_n'$.

For $i=0$, :ref[prop:stable-kernels] gives $K_0\simeq_{\st}K_0'$. For $i\geq1$ we have exact sequences
$$
0\longrightarrow K_i\longrightarrow E_i\longrightarrow K_{i-1}\longrightarrow0
$$
and similarly for the primed modules. The same proposition now gives $K_i\simeq_{\st}K_i'$ inductively. In particular $K\simeq_{\st}E_n'$, as desired.
:::

:::corollary{#cor:syzygy-bound}
Assume $A$ is Noetherian, and suppose
$$
0\longrightarrow N\longrightarrow E\longrightarrow M\longrightarrow0
$$
is exact with $E$ stably free. If $\dimsf(M)=n<\infty$, then
$$
\dimsf(N)\leq\max\{n-1,0\}.
$$
:::

:::proof
If $n=0$, then $M$ is stably free, hence projective, so $E\cong N\oplus M$. Adding finite free complements for $E$ and $M$ shows that $N$ is stably free.

For $n\geq1$, the module $N$ and the successive kernels of finite free presentations are finite by Noetherianity. Choose enough such presentations to extend $E\to M$ to a partial stably free resolution with terms in degrees $0,\dots,n-1$. Its last kernel is stably free by :ref[lem:last-syzygy]. Removing $E\to M$ gives a stably free resolution of $N$ of length at most $n-1$.
:::

## Resolvable modules {#resolvable-modules}

:::definition{#def:resolvable}
A module is **resolvable** if it admits a finite free resolution, i.e. if $\dimff(M)<\infty$. A ring $A$ is **pointwise resolvable** if every prime ideal $\mathfrak p\subset A$ is resolvable as an $A$-module.
:::

The distinction between prime ideals and their quotient modules is harmless here: the sequence
$$
0\longrightarrow\mathfrak p\longrightarrow A\longrightarrow A/\mathfrak p\longrightarrow0
$$
and the next proposition will show that one is resolvable if and only if the other is.

First, a small observation lets us use stably free terms whenever convenient. A finite stably free resolution can always be changed into a finite free resolution. Choose a finite free $G_0$ such that $E_0\oplus G_0$ is finite free, and add the exact complex $G_0\xrightarrow{\id}G_0$ in degrees $1$ and $0$. Now the term in degree $0$ is free and the term in degree $1$ is still stably free. Repeat in degrees $2$ and $1$, then $3$ and $2$, and so on. After the last step, all terms are finite free, with at most one extra term at the left.

:::proposition[The 2-of-3 property]{#prop:two-of-three}
Assume $A$ is Noetherian. If
$$
0\longrightarrow M'\longrightarrow M\longrightarrow M''\longrightarrow0
$$
is exact and any two of the modules are resolvable, then so is the third.
:::

:::proof
We give the three cases explicitly.

Suppose first that $M'$ and $M''$ have finite free resolutions $F_\bullet'$ and $F_\bullet''$. Lift $F_0''\to M''$ through $M\to M''$, using freeness. Together with $F_0'\to M'\to M$, this gives a surjection
$$
F_0'\oplus F_0''\longrightarrow M.
$$
Its kernel fits into a short exact sequence whose outer terms are the kernels of $F_0'\to M'$ and $F_0''\to M''$. Indeed, projecting a pair in the middle kernel to $F_0''$ gives a map onto the second kernel; a preimage can be corrected using $F_0'\to M'$, and its kernel is the first kernel. Repeating this construction gives a resolution of $M$ with terms $F_i'\oplus F_i''$. It is finite because the original resolutions are finite. This is the horseshoe construction.

For the other cases, recall the following explicit construction. Given a homomorphism $u:L\to N$ and finite free resolutions $F_\bullet\to L$ and $G_\bullet\to N$, projectivity lets us lift $u$ to maps $f_i:F_i\to G_i$ commuting with the differentials. At degree $0$ this is the lifting property for $G_0\to N$. At each later degree, the map already constructed lands in the appropriate kernel, which is the image of the next differential, so the same lifting property applies.

The mapping cone has terms
$$
C_i=G_i\oplus F_{i-1}\quad(i\geq1),
\qquad C_0=G_0,
$$
and differential
$$
d_C(g,v)=\bigl(d_Gg+f_{i-1}(v),-d_Fv\bigr),
$$
with the second component omitted when $i=1$. Its homology is
$$
H_1(C_\bullet)\cong\ker u,
\qquad
H_0(C_\bullet)\cong\coker u,
\qquad
H_i(C_\bullet)=0\quad(i\geq2).
$$
For completeness, these identities follow from the degreewise split exact sequence of complexes
$$
0\longrightarrow G_\bullet\longrightarrow C_\bullet
\longrightarrow F_\bullet[1]\longrightarrow0,
$$
where $F_\bullet[1]$ denotes the complex with $F_{i-1}$ in degree $i$ and differential $-d_F$. The connecting map in homology is precisely $u$, and the resolutions have no positive homology. Equivalently, the same identities follow by substituting the displayed formula for $d_C$ and chasing kernels and images.

If $M'$ and $M$ are resolvable, apply this construction to the injection $u:M'\to M$. The cone has no positive homology and has $H_0=M''$, so it is a finite free resolution of $M''$.

Finally, suppose $M$ and $M''$ are resolvable, and apply the construction to $u:M\to M''$. This time $H_0(C_\bullet)=0$, so $C_1\to C_0$ is surjective. Since $C_0$ is finite free, it splits. Thus
$$
K=\ker(C_1\longrightarrow C_0)
\quad\text{satisfies}\quad
K\oplus C_0\cong C_1,
$$
so $K$ is stably free. The homology calculation gives an exact sequence
$$
\cdots\longrightarrow C_3\longrightarrow C_2
\longrightarrow K\longrightarrow M'\longrightarrow0.
$$
This is a finite stably free resolution of $M'$, and the preceding observation converts it to a finite free resolution.
:::

In fact, the proof of the 2-of-3 property did not need Noetherianity. It will be crucial in what follows, however, because it gives finite filtrations. This is to be expected: our results concern finite resolutions, and Serre’s problem asks about sheaves which are locally free of finite rank.

## Prime filtrations {#prime-filtrations}

To prove the following lemma, we will need associated primes. For an $A$-module $M$, write
$$
\Ann_A(M)=\{a\in A:ax=0\text{ for all }x\in M\}.
$$
An **associated prime** of $M$ is a prime ideal $\mathfrak p=\Ann_A(x)$ for some nonzero $x\in M$. Equivalently, $M$ has a submodule isomorphic to $A/\mathfrak p$.

If $A$ is Noetherian and $M\neq0$, then $M$ always has an associated prime. Indeed, choose a maximal element of
$$
\{\Ann_A(x):0\neq x\in M\}
$$
under inclusion, say $I=\Ann_A(x)$. This ideal is proper. If $ab\in I$ and $b\notin I$, then $bx\neq0$ and $I\subseteq\Ann_A(bx)$. Maximality gives equality, so $a\in I$. Thus $I$ is prime.

:::lemma[Prime filtration]{#lem:prime-filtration}
Let $A$ be Noetherian and $M$ a finite $A$-module. Then there are prime ideals $\mathfrak p_i$ and a finite filtration
$$
M=M_n\supset M_{n-1}\supset\cdots\supset M_1\supset M_0=0
$$
such that $M_i/M_{i-1}\cong A/\mathfrak p_i$ for each $i$.
:::

:::proof
By Noetherianity, $M$ satisfies the ascending chain condition on submodules. Start with $M_0=0$. If $M_i\neq M$, choose an associated prime $\mathfrak p_{i+1}$ of $M/M_i$. The corresponding submodule of $M/M_i$ has an inverse image $M_{i+1}\subseteq M$ satisfying
$$
M_{i+1}/M_i\cong A/\mathfrak p_{i+1}.
$$
In particular $M_i\subsetneq M_{i+1}$. This process must stop by the ascending chain condition, and it can only stop when $M_n=M$.
:::

## Adjoining one variable {#adjoining-one-variable}

Our next goal is the following theorem.

:::theorem{#thm:polynomial-resolvability}
Suppose that $A$ is Noetherian and pointwise resolvable. Then $A[x]$ is pointwise resolvable.
:::

From this Serre’s reduction will follow relatively easily, but its proof requires more than the exact sequence manipulation we have used so far. We first prove an intermediate step. For an ideal $\mathfrak p\subseteq A$, write $\mathfrak p[x]=\mathfrak pA[x]$.

:::lemma{#lem:larger-contractions}
Let $A$ be Noetherian, let $P\subset A[x]$ be prime, and put $\mathfrak p=P\cap A$. Suppose $P\neq\mathfrak p[x]$. Then there is a finite $A[x]$-module $N$ with the following properties:

1. There is an exact sequence
$$
0\longrightarrow A[x]/\mathfrak p[x]
\longrightarrow P/\mathfrak p[x]\longrightarrow N\longrightarrow0.
$$
2. The module $N$ admits a finite filtration
$$
N=N_m\supset N_{m-1}\supset\cdots\supset N_0=0
$$
such that $N_i/N_{i-1}\cong A[x]/Q_i$, where each $Q_i$ is prime and
$$
\mathfrak p\subsetneq Q_i\cap A.
$$
:::

:::proof
Let $A_0=A/\mathfrak p$, a Noetherian domain, and let $k$ be its fraction field. Since $\mathfrak p[x]\subseteq P$, the quotient
$$
P_0=P/\mathfrak p[x]
$$
is a nonzero ideal of $A_0[x]\cong A[x]/\mathfrak p[x]$. The ring $A_0[x]$ is Noetherian, so $P_0$ is generated by finitely many polynomials $g_1,\dots,g_r$.

Choose a nonzero $f\in P_0$ of minimal degree. Division in $k[x]$ gives
$$
g_i=q_i f+r_i,
\qquad \deg r_i<\deg f
$$
for each nonzero remainder. Let $d_0\in A_0\setminus\{0\}$ be a product of denominators such that $d_0q_i,d_0r_i\in A_0[x]$ for all $i$. Then
$$
d_0r_i=d_0g_i-(d_0q_i)f\in P_0.
$$
If this polynomial were nonzero, it would have degree less than $f$, contradicting minimality. Hence $r_i=0$ for every $i$, and
$$
d_0P_0\subseteq(f).
$$

Set $N=P_0/(f)$, considered as an $A[x]$-module through the quotient map $A[x]\to A_0[x]$. There is an exact sequence
$$
0\longrightarrow(f)\longrightarrow P_0\longrightarrow N\longrightarrow0.
$$
Multiplication by $f$ identifies $A_0[x]$ with $(f)$: it is onto by definition and injective because $A_0[x]$ is a domain and $f\neq0$. This gives the first required sequence.

Choose a lift $d\in A$ of $d_0$, so $d\notin\mathfrak p$. The inclusion $d_0P_0\subseteq(f)$ shows that $dN=0$, and $\mathfrak pN=0$ by the definition of the $A[x]$-module structure. Thus
$$
(\mathfrak p,d)A[x]\subseteq\Ann_{A[x]}(N).
$$
The module $N$ is finite, so :ref[lem:prime-filtration] gives a filtration with quotients $A[x]/Q_i$. Every element annihilating $N$ also annihilates these quotients, hence
$$
(\mathfrak p,d)A[x]\subseteq Q_i.
$$
Therefore $\mathfrak p\subseteq Q_i\cap A$, and the inclusion is strict since $d\in Q_i\cap A$ but $d\notin\mathfrak p$.
:::

We can now prove :ref[thm:polynomial-resolvability].

:::proof
First, each extended prime $\mathfrak p[x]$ is resolvable as an $A[x]$-module. Indeed, pointwise resolvability of $A$ gives a finite free resolution of $\mathfrak p$. The extension $A\to A[x]$ is flat, and
$$
A^{\oplus r}\otimes_A A[x]\cong A[x]^{\oplus r},
\qquad
\mathfrak p\otimes_A A[x]\cong\mathfrak p[x].
$$
Tensoring the resolution with $A[x]$ therefore gives the required finite free resolution of $\mathfrak p[x]$. The 2-of-3 property also shows that $A[x]/\mathfrak p[x]$ is resolvable.

Suppose now that some prime of $A[x]$ is not resolvable. By Noetherianity of $A$, the set
$$
\{P\cap A:P\in\Spec(A[x]),\ P\text{ is not resolvable}\}
$$
has a maximal element. Choose such a $P$ and write $\mathfrak p=P\cap A$. The preceding paragraph implies $P\neq\mathfrak p[x]$, so we may apply :ref[lem:larger-contractions].

In its filtration of $N$, each prime $Q_i$ has contraction strictly larger than $\mathfrak p$. By maximality, $Q_i$ is resolvable. The exact sequence
$$
0\longrightarrow Q_i\longrightarrow A[x]\longrightarrow A[x]/Q_i\longrightarrow0
$$
then shows that $A[x]/Q_i$ is resolvable. Starting from $N_0=0$ and applying the 2-of-3 property to
$$
0\longrightarrow N_{i-1}\longrightarrow N_i\longrightarrow A[x]/Q_i\longrightarrow0
$$
shows inductively that $N=N_m$ is resolvable.

We already know that $A[x]/\mathfrak p[x]$ is resolvable, so the first sequence of :ref[lem:larger-contractions] shows that $P/\mathfrak p[x]$ is resolvable. Finally,
$$
0\longrightarrow\mathfrak p[x]\longrightarrow P\longrightarrow P/\mathfrak p[x]\longrightarrow0
$$
shows that $P$ is resolvable, a contradiction.
:::

:::corollary[Serre]{#cor:all-modules-resolvable}
Suppose that $A$ is Noetherian and pointwise resolvable. Then every finite $A[x]$-module is resolvable.
:::

:::proof
By :ref[thm:polynomial-resolvability], all prime ideals of $A[x]$ are resolvable. If $M$ is a finite $A[x]$-module, take a prime filtration
$$
M=M_r\supset\cdots\supset M_0=0,
\qquad M_i/M_{i-1}\cong A[x]/P_i.
$$
The sequence $0\to P_i\to A[x]\to A[x]/P_i\to0$ shows that each quotient is resolvable. The sequences
$$
0\longrightarrow M_{i-1}\longrightarrow M_i\longrightarrow A[x]/P_i\longrightarrow0
$$
then show by induction that every $M_i$, and in particular $M$, is resolvable.
:::

## Serre’s reduction {#serres-reduction}

It remains to connect resolutions back to stably free modules.

:::lemma{#lem:projective-resolvable}
Let $M$ be a projective module. Then $M$ is stably free if and only if it is resolvable.
:::

:::proof
If $M\oplus F\cong G$ with $F,G$ finite free, then
$$
0\longrightarrow F\longrightarrow G\longrightarrow M\longrightarrow0
$$
is a finite free resolution.

Conversely, suppose $M$ has a finite free resolution, and induct on its length. In length zero there is nothing to prove. Otherwise write its last part as
$$
0\longrightarrow K\longrightarrow F_0\longrightarrow M\longrightarrow0.
$$
Since $M$ is projective, this sequence splits, so $F_0\cong K\oplus M$ and $K$ is projective. The remaining terms form a shorter finite free resolution of $K$, so $K$ is stably free by induction. Choose finite free $F,G$ with $K\oplus F\cong G$. Then
$$
M\oplus G\cong M\oplus K\oplus F\cong F_0\oplus F
$$
is finite free. Thus $M$ is stably free.
:::

:::theorem[Serre’s reduction]{#cor:serre-reduction}
Let $A$ be a principal ideal domain. Then every finite projective module over $A[x_1,\dots,x_n]$ is stably free.
:::

:::proof
A PID is Noetherian and every ideal is finite free: the zero ideal is free of rank zero, and a nonzero principal ideal is isomorphic to $A$ because $A$ is a domain. In particular $A$ is pointwise resolvable.

Repeatedly applying :ref[thm:polynomial-resolvability] shows that $A[x_1,\dots,x_{n-1}]$ is Noetherian and pointwise resolvable. Hence, for $n\geq1$, :ref[cor:all-modules-resolvable] shows that every finite $A[x_1,\dots,x_n]$-module is resolvable. Its finite projective modules are therefore stably free by :ref[lem:projective-resolvable].

For $n=0$, every finite projective $A$-module is already free. To recall the elementary reason, any submodule $M\subseteq A^r$ is finite free: project onto the last factor, whose image is a principal ideal, and use induction on $r$ on the kernel. The resulting short exact sequence splits because the image is free. A finite projective module is a summand, hence a submodule, of some $A^r$.
:::

Notice that Serre’s reduction works more generally over any Noetherian pointwise resolvable ring: its finite projective modules, and those over its polynomial rings, are stably free. The argument applies in particular when every prime ideal is stably free, since stably free modules are resolvable.

A natural question is where in this argument the ring $A$ may be replaced by a scheme $X$ and the modules by quasicoherent sheaves. The biggest issue is that finite freeness, which we would like to replace with triviality, is not local. In addition, vector bundles need not be projective objects of $\operatorname{QCoh}(X)$. For these reasons, the best setting for this sequence of results is the affine case.

We have now reduced the Quillen–Suslin theorem to a cancellation problem: if adding a finite free summand makes a module free, must it already be free? We answer this for polynomial rings over a PID in :post[quillen-suslin-2]. For the original exposition and its geometric context, see [*Serre Schemes and the Quillen–Suslin Theorem*](/serre-schemes.pdf).
