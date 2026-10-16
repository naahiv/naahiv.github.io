---
title: "Pullbacks, universal properties, and mathematical writing"
slug: mathematical-writing-specimen
date: 2026-10-16
summary: "A development specimen for mathematical reading: an elementary pullback, its universal property, carefully linked statements, and native TikZ-CD diagrams."
tags: [category-theory, exposition]
draft: true
specimen: true
series:
  name: Mathematical writing specimens
  order: 2
macros: |
  \newcommand{\pullback}[3]{#1\times_{#3}#2}
  \newcommand{\kernelpair}[1]{#1\times #1}
  \renewcommand{\cF}{\mathcal{E}}
---

This is a **development specimen**, not a published article by Vihaan Dheer.
The elementary examples below exercise the reading layout and authoring tools.
They are deliberately more varied than a short blog post would usually need.
For a quieter version of the same idea, see :post[a-small-pullback].

A useful way to understand a construction is to ask which maps it represents.
For abelian groups $A$, $B$, and $C$ with homomorphisms $f\colon A\to C$ and
$g\colon B\to C$, the pullback $\pullback{A}{B}{C}$ remembers a pair whose two
images agree. The content is simple; the notation has to remain comfortable
even in a paragraph containing $\Hom_\ZZ(T,\pullback{A}{B}{C})$, a script letter
$\sL$, a calligraphic sheaf $\cF$, or a quotient
$\frac{\abs{x}+\frac{1}{2}}{1+\abs{x}}$. These belong to the same line of thought.

The forward link to :ref[universal-property] already has its final target.
The displayed identity $\eqref{hom-pullback}$ is collected before any reference
is rendered; it is not a number typed into this paragraph.

## A square and its objects {#the-square}

:::definition[Pullback of abelian groups]{#pullback-definition}
For $f\colon A\to C$ and $g\colon B\to C$, define

$$
\pullback{A}{B}{C}=\{(a,b)\in A\times B\mid f(a)=g(b)\}.
\label{pullback-set}
$$

The projection maps are $p_A(a,b)=a$ and $p_B(a,b)=b$.
:::

This is a subgroup of $A\times B$: equality of the two images is preserved by
addition and additive inverses. In particular, the notation does not add a new
choice to the construction. The projections fit into :ref[pullback-square].

```tikzcd {#pullback-square caption="The defining square for $\pullback{A}{B}{C}$." description="The pullback P = A times over C B maps to A by p_A and to B by p_B. The maps f from A to C and g from B to C satisfy f p_A = g p_B. The square is commutative."}
\begin{tikzcd}[column sep=large,row sep=large]
\pullback{A}{B}{C} \arrow[r,"p_A"] \arrow[d,"p_B"'] & A \arrow[d,"f"] \\
B \arrow[r,"g"'] & C
\end{tikzcd}
```

Both the paragraph and the diagram use the same three-argument
`\pullback` command. The diagram is compiled from its retained TeX source by
TikZ-CD; it is not a substitute drawn by the page layout. Its description
records the objects, arrows, and equality even when its path-based glyphs are
not read as text.

For a small square, the ordinary equation renderer also supports a simple CD:

$$
\begin{CD}
\pullback{A}{B}{C} @>{p_A}>> A \\
@V{p_B}VV @VV{f}V \\
B @>>{g}> C
\end{CD}
$$

This lighter syntax is useful on occasion, but the native route above is the
one that supplies the full arrow vocabulary.

## The universal property of $\Hom$ {#universal}

:::theorem[Maps into a pullback]{#universal-property}
For every abelian group $T$, the projections induce a bijection

$$
\begin{aligned}
\Hom_\ZZ(T,\pullback{A}{B}{C})
&\longrightarrow
\Hom_\ZZ(T,A)\times_{\Hom_\ZZ(T,C)}\Hom_\ZZ(T,B),\\
u&\longmapsto(p_Au,p_Bu).
\end{aligned}
\label{hom-pullback}
$$

This bijection is natural in $T$.
:::

:::proof[of the universal property]{#universal-proof}
A homomorphism $u$ gives a compatible pair because the square commutes.
Conversely, suppose $a\colon T\to A$ and $b\colon T\to B$ satisfy $fa=gb$.
Then $t\mapsto(a(t),b(t))$ takes values in the subgroup in
:ref[pullback-definition] and is a homomorphism. Its two projections are $a$
and $b$, so it is the only possible map with those projections.

Precomposition by $v\colon T'\to T$ takes the pair $(a,b)$ to $(av,bv)$ on
both sides of $\eqref{hom-pullback}$, proving naturality.
:::

We have proved the universal property directly, without choosing generators.
The argument works for maps of sets as well; the extra group structure only
asks us to check that the mediating function is a homomorphism.[^naturality]

:::lemma[An injectivity test]{#injective-projection}
If $f$ is injective, then $p_B\colon\pullback{A}{B}{C}\to B$ is injective.
:::

:::proof
If $p_B(a,b)=0$, then $b=0$ and $f(a)=g(0)=0$. Injectivity of $f$ gives
$a=0$, as required.
:::

:::proposition[Pulling back an isomorphism]{#iso-projection}
If $f$ is an isomorphism, then $p_B$ is an isomorphism, with inverse
$b\mapsto(f^{-1}g(b),b)$.
:::

:::proof
The displayed map is a homomorphism into the pullback. Its composite with
$p_B$ is the identity. In the other direction, every $(a,b)$ in the pullback
satisfies $f^{-1}g(b)=a$. These equalities prove both inverse identities.
:::

:::corollary[The identity case]{#identity-case}
Taking $A=C$ and $f=\id_C$ gives $C\times_C B\cong B$ canonically.
:::

The word *canonically* has a concrete meaning here: the isomorphism is the
projection already present in :ref[pullback-square]. It does not mean an
unspecified isomorphism obtained by comparing cardinalities.

## Examples, notation, and long expressions {#examples}

:::example[Two integer multiplications]{#integer-example}
Let $A=B=C=\ZZ$, with $f(a)=2a$ and $g(b)=3b$. A compatible pair has the form
$(a,b)=(3k,2k)$ for a unique integer $k$. Thus this pullback is isomorphic to
$\ZZ$ by $k\mapsto(3k,2k)$.
:::

:::remark[Equality and isomorphism]{#equality-remark}
The set in $\eqref{pullback-set}$ is a particular model. An isomorphic model
has the same universal property, but it need not have the same elements.
We keep $=$, $\cong$, and $\simeq$ distinct instead of silently exchanging
one arrow or relation for another.
:::

:::question[A small exercise]{#exercise}
If $f\colon A\to C$ is surjective, is $p_B$ surjective for every $g\colon B\to C$?
Use the description of a compatible pair to give a direct proof.
:::

:::remark[Notation in this specimen]{#notation unnumbered}
The shared commands $\ZZ$, $\Hom$, $\abs{x}$, and $\pair{x}{y}$ work in article
math and native diagrams. The post deliberately overrides $\cF$ with a new
calligraphic letter using `\renewcommand`. That override does not affect
:post[a-small-pullback].
:::

The following alignment tests nested fractions, long subscripts, scripts,
blackboard letters, and accents. It is a notation exercise, not an asserted
identity involving the preceding pullback:

$$
\begin{aligned}
q(x)&:=\frac{1+\dfrac{\abs{x}^{2}}{1+\abs{x}}}{2+\abs{x}},
\qquad x\in\RR,\\
V_{\substack{0\le i\le n\\j\in I_{\mathrm{finite}}}}
&:=\bigoplus_{\substack{0\le i\le n\\j\in I_{\mathrm{finite}}}}\QQ e_{i,j},\\
\widehat{\cF}\,,\quad\widetilde{\cG}\,,\quad\sL\,,\quad\mathfrak{m}
&\qquad\text{(four distinct notation samples).}
\end{aligned}
$$

Authors can normally split a long equality at a meaningful relation. This
single unbroken product is retained to test local keyboard and touch scrolling:

$$
\underbrace{\Hom_\ZZ(T,A)\times_{\Hom_\ZZ(T,C)}\Hom_\ZZ(T,B)}_{\text{compatible pairs of maps from }T}
\times
\underbrace{\Hom_\ZZ(T',A)\times_{\Hom_\ZZ(T',C)}\Hom_\ZZ(T',B)}_{\text{compatible pairs of maps from }T'}.
\label{a-long-expression}
$$

The equation number remains available while its expression scrolls. This
should never make the surrounding page wider than the phone.

## A native arrow vocabulary {#native-arrows}

The second native specimen is a **syntax gallery**, not a commutative diagram
asserting relationships between particular objects. Its curved and diagonal
arrows, parallel pair, hook, surjection, dashed arrow, and equality have
different meanings; the source preserves those differences.

```tikzcd {#arrow-variations caption="Native TikZ-CD arrow and label specimen; no commutativity is asserted." description="A syntax gallery on objects A, B, C, and D: A has two parallel arrows to B, a hook to C, and a diagonal dashed arrow to D. B has a two-headed arrow to D. C has an equality arrow to D. A curved arrow from A to D carries a long superscripted label. This gallery tests rendering and asserts no commutativity."}
\begin{tikzcd}[column sep=12em,row sep=7em]
A \arrow[r,shift left=1.5ex,"u" near start] \arrow[r,shift right=1.5ex,"v"']
  \arrow[d,hook,"i"'] \arrow[dr,dashed,"\alpha" description]
  \arrow[dr,bend left=50,"{\Hom_\ZZ(T,A)^{\mathrm{natural}}}" near start]
& B \arrow[d,two heads,"q"] \\
C \arrow[r,equal] & D
\end{tikzcd}
```

For further details about the construction itself, the [Stacks Project's
definition of a fibre product](https://stacks.math.columbia.edu/tag/001U)
is a useful reference. The discussion here is original elementary exposition;
the linked sources supply terminology and broader context.

## References {#references}

1. The Stacks Project Authors, *The Stacks Project*,
   [Fibre products and pushouts, Tag 001U](https://stacks.math.columbia.edu/tag/001U).
2. The Stacks Project Authors, *The Stacks Project*,
   [Total direct image, Tag 08DY](https://stacks.math.columbia.edu/tag/08DY),
   consulted as a reference for mathematical reading and navigation.
3. Jacob Lurie, *Kerodon*,
   [The Language of ∞-Categories, Tag 0001](https://kerodon.net/tag/0001),
   consulted as a typography and cross-reference reference.

[^naturality]: The naturality assertion concerns precomposition in $T$.
    It says the bijections commute with the maps induced by
    $v\colon T'\to T$, rather than merely that each bijection exists.
