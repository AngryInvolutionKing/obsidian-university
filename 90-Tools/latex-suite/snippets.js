/*
 * LaTeX Suite 片段库（内置 199 条 + 自定义 14 条 = 213 条）
 * 由插件启动时用 new Function 编译加载，所以正则与函数都能原样生效。
 *
 * ── options 字母表（源码逐一核对，勿凭记忆）──────────────────────────
 *   A  自动展开：不用按 Tab，打完触发器立刻替换
 *   r  触发器按「正则」解释
 *   v  visual 模式：选中文字后按单字符触发器，替换文本里的 ${VISUAL} 换成选中内容
 *      （插件判定：替换文本含 ${VISUAL} 且触发器为单字符，会自动开启 visual）
 *   w  只在词边界触发
 *   U  关掉"按 Backspace 撤销这条片段展开"的行为
 *
 * ── 作用范围字母表（决定片段在哪种环境里生效）────────────────────────
 *   m  行内数学  $...$          ← 本库 202 条都带它
 *   n  仅行内数学（不含块级）
 *   M  块级数学  $$...$$
 *   c  代码块（```` ``` ````）
 *   C  代码（行内 code span）
 *   t  纯文本（非数学、非代码）
 *   T  	ext{} 内部
 *
 * 用法提示：选项是一位一位拼起来的字符串，例如 "mA" = 行内数学 + 自动展开。
 */

export default [
  { trigger: "compl", replacement: "\\\\complement ", options: "mA", description: "补集 \\complement" },
  { trigger: "emp", replacement: "\\\\varnothing", options: "mA", description: "空集 \\varnothing" },
  { trigger: "op", replacement: "\\\\operatorname{$0}$1", options: "mA", description: "\\operatorname" },
  { trigger: "mid", replacement: "\\\\mid ", options: "mA", description: "\\mid" },
  { trigger: "varphi", replacement: "\\\\varphi", options: "mA", description: "\\varphi" },
  { trigger: "dd", replacement: "\\\\,\\\\mathrm{d}$0", options: "mA", description: "微分算子 d" },
  { trigger: "oo", replacement: "\\\\infty", options: "mA", description: "无穷 \\infty" },
  { trigger: "limx", replacement: "\\\\lim_{$0 \\\\to $1}$2", options: "mA", description: "lim_{x→a}" },
  { trigger: "setminus", replacement: "\\\\setminus ", options: "mA", description: "集合差 \\setminus" },
  { trigger: "pd", replacement: "\\\\dfrac{\\\\partial $0}{\\\\partial $1}$2", options: "mA", description: "偏导" },
  { trigger: "forall", replacement: "\\\\forall ", options: "mA", description: "\\forall" },
  { trigger: "cc", replacement: "\\\\circ ", options: "mA", description: "复合 \\circ" },
  { trigger: "nsubset", replacement: "\\\\not\\\\subseteq ", options: "mA", description: "\\not\\subseteq" },
  { trigger: "nsubseteq", replacement: "\\\\not\\\\subseteq ", options: "mA", description: "\\not\\subseteq（同义）" },
  { trigger: "mk", replacement: "${}$0{}$", options: "tA" },
  { trigger: "mk", replacement: "\\($0\\)", options: "TA" },
  { trigger: "dm", replacement: "\n$$\n$0\n$$", options: "tAw", description: "Display Math on empty line" },
  { trigger: /([^\\\w])beg/, replacement: "[[0]]\\begin{$0}\n$1\n\\end{$0}", options: "MA" },
  { trigger: /([^\\\w])beg/, replacement: "[[0]]\\begin{$0} $1 \\end{$0}", options: "nA" },
  { trigger: "@a", replacement: "\\alpha", options: "mA" },
  { trigger: "@b", replacement: "\\beta", options: "mA" },
  { trigger: "@g", replacement: "\\gamma", options: "mA" },
  { trigger: "@G", replacement: "\\Gamma", options: "mA" },
  { trigger: "@d", replacement: "\\delta", options: "mA" },
  { trigger: "@D", replacement: "\\Delta", options: "mA" },
  { trigger: "@e", replacement: "\\epsilon", options: "mA" },
  { trigger: ":e", replacement: "\\varepsilon", options: "mA" },
  { trigger: "@z", replacement: "\\zeta", options: "mA" },
  { trigger: "@t", replacement: "\\theta", options: "mA" },
  { trigger: "@T", replacement: "\\Theta", options: "mA" },
  { trigger: ":t", replacement: "\\vartheta", options: "mA" },
  { trigger: "@i", replacement: "\\iota", options: "mA" },
  { trigger: "@k", replacement: "\\kappa", options: "mA" },
  { trigger: "@l", replacement: "\\lambda", options: "mA" },
  { trigger: "@L", replacement: "\\Lambda", options: "mA" },
  { trigger: "@s", replacement: "\\sigma", options: "mA" },
  { trigger: "@S", replacement: "\\Sigma", options: "mA" },
  { trigger: "@u", replacement: "\\upsilon", options: "mA" },
  { trigger: "@U", replacement: "\\Upsilon", options: "mA" },
  { trigger: "@o", replacement: "\\omega", options: "mA" },
  { trigger: "@O", replacement: "\\Omega", options: "mA" },
  { trigger: "ome", replacement: "\\omega", options: "mA" },
  { trigger: "Ome", replacement: "\\Omega", options: "mA" },
  { trigger: /\n\s*\"/, replacement: "\n\\text{$0 } $1", options: "mrA" },
  { trigger: "text", replacement: "\\text{$0}$1", options: "mA", priority: -1 },
  { trigger: "\"", replacement: "\\text{$0}$1", options: "mA", priority: -1 },
  { trigger: "sr", replacement: "^{2}", options: "mA" },
  { trigger: "cb", replacement: "^{3}", options: "mA" },
  { trigger: "rd", replacement: "^{$0}$1", options: "mA", description: "Raise to (D)the power of" },
  { trigger: "_", replacement: "_{$0}$1", options: "mA" },
  { trigger: "sts", replacement: "_\\text{$0}", options: "mA" },
  { trigger: "sq", replacement: "\\sqrt{ $0 }$1", options: "mA" },
  { trigger: /(\d)rt/, replacement: "\\sqrt[[[0]]]{ $0 }$1", options: "mA", description: "Nth RooT" },
  { trigger: "//", replacement: "\\frac{$0}{$1}$2", options: "mA" },
  { trigger: /\bee/, replacement: "e^{ $0 }$1", options: "mA" },
  { trigger: "invs", replacement: "^{-1}", options: "mA" },
  { trigger: /([^\\])(exp|log|ln)/, replacement: "[[0]]\\[[1]]", options: "rmA" },
  { trigger: "conj", replacement: "^{*}", options: "mA" },
  { trigger: "Re", replacement: "\\mathrm{Re}", options: "mA" },
  { trigger: "Im", replacement: "\\mathrm{Im}", options: "mA" },
  { trigger: "bf", replacement: "\\mathbf{$0}", options: "mA" },
  { trigger: "rm", replacement: "\\mathrm{$0}$1", options: "mA" },
  { trigger: /([^\\])(det)/, replacement: "[[0]]\\[[1]]", options: "rmA" },
  { trigger: "trace", replacement: "\\mathrm{Tr}", options: "mA" },
  { trigger: "([a-zA-Z])hat", replacement: "\\hat{[[0]]}", options: "rmA" },
  { trigger: "([a-zA-Z])bar", replacement: "\\bar{[[0]]}", options: "rmA" },
  { trigger: "([a-zA-Z])dot", replacement: "\\dot{[[0]]}", options: "rmA", priority: -1 },
  { trigger: "([a-zA-Z])ddot", replacement: "\\ddot{[[0]]}", options: "rmA", priority: 1 },
  { trigger: "([a-zA-Z])tilde", replacement: "\\tilde{[[0]]}", options: "rmA" },
  { trigger: "([a-zA-Z])und", replacement: "\\underline{[[0]]}", options: "rmA" },
  { trigger: "([a-zA-Z])vec", replacement: "\\vec{[[0]]}", options: "rmA" },
  { trigger: "([a-zA-Z]),\\.", replacement: "\\mathbf{[[0]]}", options: "rmA" },
  { trigger: "([a-zA-Z])\\.,", replacement: "\\mathbf{[[0]]}", options: "rmA" },
  { trigger: "\\\\(${GREEK}),\\.", replacement: "\\boldsymbol{\\[[0]]}", options: "rmA" },
  { trigger: "\\\\(${GREEK})\\.,", replacement: "\\boldsymbol{\\[[0]]}", options: "rmA" },
  { trigger: "hat", replacement: "\\hat{$0}$1", options: "mA" },
  { trigger: "bar", replacement: "\\bar{$0}$1", options: "mA" },
  { trigger: "dot", replacement: "\\dot{$0}$1", options: "mA", priority: -1 },
  { trigger: "ddot", replacement: "\\ddot{$0}$1", options: "mA" },
  { trigger: "cdot", replacement: "\\cdot", options: "mA" },
  { trigger: "tilde", replacement: "\\tilde{$0}$1", options: "mA" },
  { trigger: "und", replacement: "\\underline{$0}$1", options: "mA" },
  { trigger: "vec", replacement: "\\vec{$0}$1", options: "mA" },
  { trigger: "pmod", replacement: "\\pmod{${0:n}}$1", options: "mA", description: "Parenthesized modulo (\\pmod{n})" },
  { trigger: /(\\?)([A-Za-z]+)(\d)/, replacement: (match) => {
			const isMacro = match[1] === "\\";
			const digit = match[3];
			if (!isMacro) {
				const variable = match[2];
				return `${variable}_{${digit}}`;
			}
			const greek = require("latex-suite").snippetVariables["${GREEK}"];
			const greek_pattern = new RegExp("^(?:" + greek + ")$");
			const macro_name = match[2];
			if (greek_pattern.test(macro_name)) {
				return `\\${macro_name}_{${digit}}`;
			} else {
				return `\\${macro_name} ${digit}`;
			}
		}, options: "rmA", description: "Auto letter subscript for variables and greek letters, add space after other macros", priority: -1 },
  { trigger: "(\\\\${GREEK}|[A-Za-z])_{(\\d+)}(\\d)", replacement: "[[0]]_{[[1]][[2]]}", options: "rmA", description: "Combine subscripts for variables and greek letters", priority: -1 },
  { trigger: "\\\\(${ACCENT})\\{(\\\\${GREEK}|[A-Za-z])\\}(?:_\\{(\\d+)\\})?(\\d)", replacement: "\\[[0]]{[[1]]}_{[[2]][[3]]}", options: "rmA", priority: -1 },
  { trigger: "\\\\(${ACCENT})\\{\\\\(${ACCENT})\\{(\\\\${GREEK}|[A-Za-z])\\}\\}(?:_\\{(\\d+)\\})?(\\d)", replacement: "\\[[0]]{\\[[1]]{[[2]]}}_{[[3]][[4]]}", options: "rmA", priority: -1 },
  { trigger: "xnn", replacement: "x_{n}", options: "mA" },
  { trigger: "\\xii", replacement: "x_{i}", options: "mA", priority: 1 },
  { trigger: "xjj", replacement: "x_{j}", options: "mA" },
  { trigger: "xp1", replacement: "x_{n+1}", options: "mA" },
  { trigger: "ynn", replacement: "y_{n}", options: "mA" },
  { trigger: "yii", replacement: "y_{i}", options: "mA" },
  { trigger: "yjj", replacement: "y_{j}", options: "mA" },
  { trigger: "ooo", replacement: "\\infty", options: "mA" },
  { trigger: "sum", replacement: "\\sum", options: "mA" },
  { trigger: "prod", replacement: "\\prod", options: "mA" },
  { trigger: "\\sum", replacement: "\\sum_{${0:i}=${1:1}}^{${2:N}} $3", options: "m" },
  { trigger: "\\prod", replacement: "\\prod_{${0:i}=${1:1}}^{${2:N}} $3", options: "m" },
  { trigger: "lim", replacement: "\\lim_{ ${0:n} \\to ${1:\\infty} } $2", options: "mA" },
  { trigger: "+-", replacement: "\\pm", options: "mA" },
  { trigger: "-+", replacement: "\\mp", options: "mA" },
  { trigger: "...", replacement: "\\dots", options: "mA" },
  { trigger: "nabl", replacement: "\\nabla", options: "mA" },
  { trigger: "xx", replacement: "\\times", options: "mA" },
  { trigger: "**", replacement: "\\cdot", options: "mA" },
  { trigger: "para", replacement: "\\parallel", options: "mA" },
  { trigger: "deg", replacement: "\\degree", options: "mA" },
  { trigger: "===", replacement: "\\equiv", options: "mA" },
  { trigger: "!=", replacement: "\\neq", options: "mA" },
  { trigger: ">=", replacement: "\\geq", options: "mA" },
  { trigger: "<=", replacement: "\\leq", options: "mA" },
  { trigger: ">>", replacement: "\\gg", options: "mA" },
  { trigger: "<<", replacement: "\\ll", options: "mA" },
  { trigger: "simm", replacement: "\\sim", options: "mA" },
  { trigger: "sim=", replacement: "\\simeq", options: "mA" },
  { trigger: "prop", replacement: "\\propto", options: "mA" },
  { trigger: "<->", replacement: "\\leftrightarrow ", options: "mA" },
  { trigger: "->", replacement: "\\to", options: "mA" },
  { trigger: "!>", replacement: "\\mapsto", options: "mA" },
  { trigger: "=>", replacement: "\\implies", options: "mA" },
  { trigger: "=<", replacement: "\\impliedby", options: "mA" },
  { trigger: "and", replacement: "\\cap", options: "wmA" },
  { trigger: "orr", replacement: "\\cup", options: "mA" },
  { trigger: "inn", replacement: "\\in", options: "mA" },
  { trigger: "notin", replacement: "\\not\\in", options: "mA" },
  { trigger: "\\\\\\", replacement: "\\setminus", options: "mA" },
  { trigger: "sub=", replacement: "\\subseteq", options: "mA" },
  { trigger: "sup=", replacement: "\\supseteq", options: "mA" },
  { trigger: "eset", replacement: "\\emptyset", options: "mA" },
  { trigger: "set", replacement: "\\{ $0 \\}$1", options: "wmA" },
  { trigger: /(n?)e\\xi sts/, replacement: "\\[[0]]exists", options: "mA", priority: 1 },
  { trigger: "LL", replacement: "\\mathcal{L}", options: "mA" },
  { trigger: "HH", replacement: "\\mathcal{H}", options: "mA" },
  { trigger: "CC", replacement: "\\mathbb{C}", options: "mA" },
  { trigger: "RR", replacement: "\\mathbb{R}", options: "mA" },
  { trigger: "ZZ", replacement: "\\mathbb{Z}", options: "mA" },
  { trigger: "NN", replacement: "\\mathbb{N}", options: "mA" },
  { trigger: "QQ", replacement: "\\mathbb{Q}", options: "mA" },
  { trigger: "([^\\\\])(${GREEK})", replacement: "[[0]]\\[[1]]", options: "rmA", description: "Add backslash before Greek letters" },
  { trigger: "([^\\\\])(${SYMBOL})", replacement: "[[0]]\\[[1]]", options: "rmA", description: "Add backslash before symbols" },
  { trigger: "\\\\(${GREEK}|${SYMBOL}) sr", replacement: "\\[[0]]^{2}", options: "rmA" },
  { trigger: "\\\\(${GREEK}|${SYMBOL}) cb", replacement: "\\[[0]]^{3}", options: "rmA" },
  { trigger: "\\\\(${GREEK}|${SYMBOL}) rd", replacement: "\\[[0]]^{$0}$1", options: "rmA" },
  { trigger: "\\\\(${GREEK}) hat", replacement: "\\hat{\\[[0]]}", options: "rmA" },
  { trigger: "\\\\(${GREEK}) dot", replacement: "\\dot{\\[[0]]}", options: "rmA" },
  { trigger: "\\\\(${GREEK}) bar", replacement: "\\bar{\\[[0]]}", options: "rmA" },
  { trigger: "\\\\(${GREEK}) vec", replacement: "\\vec{\\[[0]]}", options: "rmA" },
  { trigger: "\\\\(${GREEK}) tilde", replacement: "\\tilde{\\[[0]]}", options: "rmA" },
  { trigger: "\\\\(${GREEK}) und", replacement: "\\underline{\\[[0]]}", options: "rmA" },
  { trigger: "par", replacement: "\\frac{ \\partial ${0:y} }{ \\partial ${1:x} } $2", options: "m" },
  { trigger: /par([0-9])/, replacement: "\\frac{ \\partial^{[[0]]} ${0:y} }{ \\partial ${1:x}^{[[0]]} } $2", options: "mA" },
  { trigger: /parn/, replacement: "\\frac{ \\partial^{${0:n}} ${1:y} }{ \\partial ${2:x}^{${0:n}} } $2", options: "mA" },
  { trigger: /pa([A-Za-z])([A-Za-z])/, replacement: "\\frac{ \\partial [[0]] }{ \\partial [[1]] } ", options: "rm" },
  { trigger: "ddt", replacement: "\\frac{d}{dt} ", options: "mA" },
  { trigger: /([^\\])int/, replacement: "[[0]]\\int", options: "mA", priority: -1 },
  { trigger: "\\int", replacement: "\\int $0 \\, d${1:x} $2", options: "m" },
  { trigger: "dint", replacement: "\\int_{${0:0}}^{${1:1}} $2 \\, d${3:x} $4", options: "mA", description: "Definite integral" },
  { trigger: "oint", replacement: "\\oint", options: "mA" },
  { trigger: "iint", replacement: "\\iint", options: "mA" },
  { trigger: "iiint", replacement: "\\iiint", options: "mA" },
  { trigger: "oinf", replacement: "\\int_{0}^{\\infty} $0 \\, d${1:x} $2", options: "mA" },
  { trigger: "infi", replacement: "\\int_{-\\infty}^{\\infty} $0 \\, d${1:x} $2", options: "mA" },
  { trigger: /([^\\])(arcsin|sin|arccos|cos|arctan|tan|csc|sec|cot)/, replacement: "[[0]]\\[[1]]", options: "rmA", description: "Add backslash before trig funcs" },
  { trigger: /(arccsc|arcsec|arccot)/, replacement: "\\operatorname{[[0]]}$0", options: "mA", description: "Inverse trig functions, Are not built-in MathJax functions", priority: 1 },
  { trigger: "U", replacement: "\\underbrace{ ${VISUAL} }_{ $0 }", options: "mv" },
  { trigger: "O", replacement: "\\overbrace{ ${VISUAL} }^{ $0 }", options: "mv" },
  { trigger: "B", replacement: "\\underset{ $0 }{ ${VISUAL} }", options: "mv" },
  { trigger: "C", replacement: "\\cancel{ ${VISUAL} }", options: "mv" },
  { trigger: "K", replacement: "\\cancelto{ $0 }{ ${VISUAL} }", options: "mv" },
  { trigger: "S", replacement: "\\sqrt{ ${VISUAL} }", options: "mv" },
  { trigger: "kbt", replacement: "k_{B}T", options: "mA" },
  { trigger: "msun", replacement: "M_{\\odot}", options: "mA" },
  { trigger: "dag", replacement: "^{\\dagger}", options: "mA" },
  { trigger: "o+", replacement: "\\oplus ", options: "mA" },
  { trigger: "ox", replacement: "\\otimes ", options: "wmA" },
  { trigger: "bra", replacement: "\\bra{$0} $1", options: "mA" },
  { trigger: "ket", replacement: "\\ket{$0} $1", options: "mA" },
  { trigger: "brk", replacement: "\\braket{ $0 | $1 } $2", options: "mA" },
  { trigger: "outer", replacement: "\\ket{${0:\\psi}} \\bra{${0:\\psi}} $1", options: "mA" },
  { trigger: "pu", replacement: "\\pu{ $0 }", options: "mA" },
  { trigger: "cee", replacement: "\\ce{ $0 }", options: "mA" },
  { trigger: "he4", replacement: "{}^{4}_{2}He ", options: "mA" },
  { trigger: "he3", replacement: "{}^{3}_{2}He ", options: "mA" },
  { trigger: "iso", replacement: "{}^{${0:4}}_{${1:2}}${2:He}", options: "mA" },
  { trigger: /([pbBvV]mat)/, replacement: "\\begin{[[0]]rix}\n$0\n\\end{[[0]]rix}", options: "rMA", description: "Matrix environments with new lines" },
  { trigger: /(matrix|cases|align|array)/, replacement: "\\begin{[[0]]}\n$0\n\\end{[[0]]}", options: "rMA", description: "Miscellaneous environments with new lines" },
  { trigger: /([pbBvV]mat)/, replacement: "\\begin{[[0]]rix}$0\\end{[[0]]rix}", options: "rnA" },
  { trigger: /(matrix|cases|align|array)/, replacement: "\\begin{[[0]]}$0\\end{[[0]]}", options: "rnA" },
  { trigger: "avg", replacement: "\\langle $0 \\rangle $1", options: "mA" },
  { trigger: "norm", replacement: "\\lvert $0 \\rvert $1", options: "mA", priority: 1 },
  { trigger: "Norm", replacement: "\\lVert $0 \\rVert $1", options: "mA", priority: 1 },
  { trigger: "ceil", replacement: "\\lceil $0 \\rceil $1", options: "mA" },
  { trigger: "floor", replacement: "\\lfloor $0 \\rfloor $1", options: "mA" },
  { trigger: "mod", replacement: "|$0|$1", options: "mA" },
  { trigger: "(", replacement: "(${VISUAL})", options: "mv" },
  { trigger: "[", replacement: "[${VISUAL}]", options: "mv" },
  { trigger: "{", replacement: "{${VISUAL}}", options: "mv" },
  { trigger: "(", replacement: "($0)$1", options: "mA" },
  { trigger: "{", replacement: "{$0}$1", options: "mA" },
  { trigger: "[", replacement: "[$0]$1", options: "mA" },
  { trigger: "lr(", replacement: "\\left( $0 \\right) $1", options: "mA" },
  { trigger: "lr{", replacement: "\\left\\{ $0 \\right\\} $1", options: "mA" },
  { trigger: "lr[", replacement: "\\left[ $0 \\right] $1", options: "mA" },
  { trigger: "lr|", replacement: "\\left| $0 \\right| $1", options: "mA" },
  { trigger: "lra", replacement: "\\left< $0 \\right> $1", options: "mA" },
  { trigger: /\\[A-Za-z]{2,}/, replacement: function (match) {
			/** @type {string} */
			const string = match[0];
			const trigger = string.slice(1);
			
			const names = require("latex-suite").ALL_MACROS;
			if (names.some(name => name.startsWith(string))) {
				return string;
			}
			return false;
		}, options: "mAU", description: "Disable snippets while typing macros", priority: 3 },
  { trigger: /\\[A-Za-z]{2,}/, replacement: function (match) {
			/** @type {string} */
			const string = match[0];
			const trigger = string.slice(1);
			
			const names = require("latex-suite").ALL_MACROS;
			if (!names.some(name => name.startsWith(string))) {
				const macro = trigger.slice(0, -1);
				const letter = trigger.slice(-1);
				return "\\" + macro + " " + letter;
			}
			return false;
		}, options: "mA", description: "Insert space after macros if not part of another macro", priority: 3 },
  { trigger: "tayl", replacement: "${0:f}(${1:x} + ${2:h}) = ${0:f}(${1:x}) + ${0:f}'(${1:x})${2:h} + ${0:f}''(${1:x}) \\frac{${2:h}^{2}}{2!} + \\dots$3", options: "mA", description: "Taylor expansion" },
  { trigger: /iden(\d)/, replacement: (match) => {
		const n = match[1];

		let arr = [];
		for (let j = 0; j < n; j++) {
			arr[j] = [];
			for (let i = 0; i < n; i++) {
				arr[j][i] = (i === j) ? 1 : 0;
			}
		}

		let output = arr.map(el => el.join(" & ")).join(" \\\\\n");
		output = `\\begin{pmatrix}\n${output}\n\\end{pmatrix}`;
		return output;
	}, options: "mA", description: "N x N identity matrix" },
  { trigger: /(?<positive_lookbehind>(?:\n|^)[ \t]*>*)(?<marker>\d+[.)]|[-*+])(?<whitespace>[ \t]+)(?<text>.*)dm/, replacement: (m) => {
			const { positive_lookbehind, whitespace, text, marker } = m.groups;
			const firstLine = marker + whitespace + text;
			const indent = " ".repeat(marker.length) + whitespace;
			return `${positive_lookbehind}${firstLine}\n${indent}$$\n${indent}$0\n${indent}$$`;
		}, options: "rtA", description: "Display math when in a list", priority: 2 },
  { trigger: /(\n|^)[ \t]*(?:> ?)*[ \t]*dm/, replacement: "[[0]]$$\n$0\n$$", options: "tAw", description: "Display Math on empty line", priority: 2 },
];
