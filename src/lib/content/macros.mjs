import katex from 'katex';

/**
 * This validates a deliberately small shared TeX profile; KaTeX itself parses
 * command definitions. Native diagrams consume the same unmodified source.
 */
function parseMacroDefinitions(source, sourcePath = 'macro definitions') {
  const input = source.replace(/(?<!\\)%[^\n]*/g, '');
  const declarations = [];
  let offset = 0;
  const skip = () => { while (/\s/.test(input[offset] || '') && offset < input.length) offset += 1; };
  const group = (open, close) => {
    skip();
    if (input[offset] !== open) throw new Error(`${sourcePath}: expected ${open} in macro definition near character ${offset + 1}`);
    const start = ++offset;
    let depth = 1;
    while (offset < input.length && depth) {
      if (input[offset] === '\\') { offset += 2; continue; }
      if (input[offset] === open) depth += 1;
      if (input[offset] === close) depth -= 1;
      offset += 1;
    }
    if (depth) throw new Error(`${sourcePath}: unclosed ${open} in macro definition`);
    return input.slice(start, offset - 1);
  };
  while (offset < input.length) {
    skip();
    if (offset >= input.length) break;
    const command = input.slice(offset).match(/^\\(newcommand|renewcommand|DeclareMathOperator)(\*)?/);
    if (!command) throw new Error(`${sourcePath}: only \\newcommand, \\renewcommand, and \\DeclareMathOperator definitions are supported here (near character ${offset + 1})`);
    offset += command[0].length;
    const name = group('{', '}');
    if (!/^\\[A-Za-z]+$/.test(name)) throw new Error(`${sourcePath}: macro names must be a command such as {\\Hom}`);
    skip();
    let arity;
    if (input[offset] === '[') {
      if (command[1] === 'DeclareMathOperator') throw new Error(`${sourcePath}: \\DeclareMathOperator does not take an argument count`);
      arity = group('[', ']');
      if (!/^[0-9]$/.test(arity)) throw new Error(`${sourcePath}: macro argument count must be 0–9`);
      skip();
      if (input[offset] === '[') throw new Error(`${sourcePath}: optional macro argument defaults are outside the supported shared profile; use an explicit argument`);
    }
    const body = group('{', '}');
    declarations.push({ command: command[1], star: Boolean(command[2]), name, arity, body });
  }
  return declarations;
}

export function validateMacroSource(source, sourcePath = 'macro definitions') {
  parseMacroDefinitions(source, sourcePath);
  return source;
}

export function katexMacroSource(source, sourcePath) {
  return parseMacroDefinitions(source, sourcePath).map(({ command, star, name, arity, body }) => command === 'DeclareMathOperator'
    ? `\\newcommand{${name}}{\\operatorname${star ? '*' : ''}{${body}}}`
    : `\\${command}{${name}}${arity !== undefined ? `[${arity}]` : ''}{${body}}`).join('\n');
}

export function createMathContext(sharedSource, postSource = '', sourcePath = 'post') {
  validateMacroSource(sharedSource, 'src/data/math-macros.tex');
  validateMacroSource(postSource, `${sourcePath} frontmatter macros`);
  const macros = {};
  const options = {
    output: 'htmlAndMathml', throwOnError: true, strict: 'error', maxExpand: 1000,
    globalGroup: true, macros,
    // Returning false makes KaTeX emit red literal commands without throwing.
    // Fail explicitly instead; Markdown and document references provide links.
    trust: ({ command }) => { throw new Error(`Unsupported trusted TeX command ${command}; use Markdown links, :ref, or :post outside mathematics`); },
  };
  try { katex.renderToString(`${katexMacroSource(sharedSource)}\n${katexMacroSource(postSource)}`, options); }
  catch (error) { throw new Error(`${sourcePath}: invalid shared/post macro definitions: ${error.message}`); }
  return {
    source: `${sharedSource}\n${postSource}`,
    render(tex, displayMode = false) {
      // Copy the table so definitions in a formula cannot mutate another formula or document.
      return katex.renderToString(tex, { ...options, macros: { ...macros }, globalGroup: false, displayMode });
    },
  };
}

const symbols = { infty: '∞', alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ε', theta: 'θ', lambda: 'λ', pi: 'π', sigma: 'σ', phi: 'φ', omega: 'ω', Delta: 'Δ', Gamma: 'Γ', Omega: 'Ω', times: '×', to: '→', rightarrow: '→', leftarrow: '←', mapsto: '↦', simeq: '≃', cong: '≅', subseteq: '⊆', in: '∈', sum: '∑', prod: '∏', otimes: '⊗', cdot: '·', le: '≤', ge: '≥' };
export function plainMath(tex) {
  return tex.replace(/\\(?:label|eqref|ref)\{[^}]*\}/g, '')
    .replace(/\\(?:begin|end)\{[^}]*\}/g, '')
    .replace(/\\(?:mathbb|mathcal|mathscr|mathrm|mathbf|mathsf|mathfrak|operatorname|text|overline|underline|widehat|widetilde)\{([^{}]*)\}/g, '$1')
    .replace(/\\(?:left|right|big|Big|bigg|Bigg|limits|nolimits)\b/g, '')
    .replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, '($1)/($2)')
    .replace(/\\([A-Za-z]+)/g, (_, name) => symbols[name] || name)
    .replace(/\\[,;!:\\ ]/g, ' ').replace(/[{}$]/g, '').replace(/[_^]/g, ' ').replace(/\s+/g, ' ').trim();
}

export function plainTitle(text) {
  return text.replace(/\$([^$]+)\$/g, (_, tex) => plainMath(tex)).replace(/\s+/g, ' ').trim();
}
