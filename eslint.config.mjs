import globals from "globals"
import reactHooks from "eslint-plugin-react-hooks"
import reactPlugin from "eslint-plugin-react"
import reactRefresh from "eslint-plugin-react-refresh"
import tsParser from "@typescript-eslint/parser"
import tsPlugin from "@typescript-eslint/eslint-plugin"
import prettierPlugin from "eslint-plugin-prettier"

export default [{
  // 配置要忽略的文件和目录
  // 包括: 生成的文件、构建产物、依赖包、压缩文件
  ignores: [
    "src/__generated__",
    "**/dist/**",
    "**/node_modules/**",
    "**/*.min.js"
  ],
}, {
  // 指定要检查的文件类型: TypeScript和TypeScript React文件
  files: ["**/*.ts", "**/*.tsx"],
  // 语言选项配置
  languageOptions: {
    // 使用最新的ECMAScript版本
    ecmaVersion: "latest",
    // 同时支持浏览器和Node.js的全局变量
    globals: {
      ...globals.browser,
      ...globals.node,
    },
    // 使用TypeScript解析器
    parser: tsParser,
    parserOptions: {
      ecmaFeatures: {
        // 启用JSX支持
        jsx: true
      },
      // 启用TypeScript项目支持
      project: true
    },
    // 使用ES模块
    sourceType: "module"
  },
  // 启用的插件
  plugins: {
    "@typescript-eslint": tsPlugin,
    "prettier": prettierPlugin,
    "react": reactPlugin,
    "react-hooks": reactHooks,
    "react-refresh": reactRefresh
  },
  rules: {
    // @ts-ignore使用规则
    // ✅ 允许: @ts-ignore - 这里忽略因为xxx
    // ❌ 禁止: 无描述的@ts-ignore
    "@typescript-eslint/ban-ts-comment": ["error", {
      "ts-ignore": "allow-with-description"
    }],
    // 类型断言风格
    // ✅ 推荐: const x = foo as number
    // ❌ 禁止: const x = <number>foo
    "@typescript-eslint/consistent-type-assertions": ["error", {
      assertionStyle: "as",
      objectLiteralTypeAssertions: "allow-as-parameter"
    }],
    // 类型定义方式
    // ✅ 推荐: type Person = { name: string }
    // ❌ 不推荐: interface Person { name: string }
    "@typescript-eslint/consistent-type-definitions": ["warn", "type"],
    // 类型导入方式
    // ✅ 推荐: import type { Type } from './types'
    // ❌ 禁止: import { Type } from './types'
    "@typescript-eslint/consistent-type-imports": ["error", {
      prefer: "type-imports"
    }],
    // 类成员访问性
    // ✅ 推荐: name = ''
    // ❌ 禁止: public name = ''
    "@typescript-eslint/explicit-member-accessibility": ["error", {
      accessibility: "no-public"
    }],
    // 方法签名风格
    // ✅ 推荐: greet: () => void
    // ❌ 禁止: greet(): void
    "@typescript-eslint/method-signature-style": ["error", "property"],
    // void表达式检查已关闭
    "@typescript-eslint/no-confusing-void-expression": "off",
    // 空函数检查
    // ✅ 推荐: function foo() { doSomething() }
    // ❌ 禁止: function foo() {}
    "@typescript-eslint/no-empty-function": "error",
    // any类型使用限制
    // ✅ 推荐: function foo(x: unknown)
    // ❌ 禁止: function foo(x: any)
    "@typescript-eslint/no-explicit-any": ["error", {
      fixToUnknown: true
    }],
    // 非空断言操作符使用警告
    // ⚠️ 谨慎: obj!.prop
    // ✅ 推荐: if (obj) { obj.prop }
    "@typescript-eslint/no-non-null-assertion": "warn",
    // 不必要条件判断警告
    // ⚠️ 谨慎: if (bool === true)
    // ✅ 推荐: if (bool)
    "@typescript-eslint/no-unnecessary-condition": "warn",
    // 未使用的表达式
    // ✅ 允许: flag && doSomething(), condition ? a : b
    // ❌ 禁止: 1 + 2
    "@typescript-eslint/no-unused-expressions": ["error", {
      allowShortCircuit: true,
      allowTaggedTemplates: true,
      allowTernary: true,
      enforceForJSX: true
    }],
    // 未使用的变量
    // ✅ 允许: const { used, ...unused } = obj
    // ❌ 禁止: const unused = 5
    "@typescript-eslint/no-unused-vars": ["error", {
      caughtErrors: "all",
      ignoreRestSiblings: true
    }],
    // 空值合并运算符
    // ✅ 推荐: const x = foo ?? defaultValue
    // ❌ 不推荐: const x = foo || defaultValue
    "@typescript-eslint/prefer-nullish-coalescing": "error",
    // 可选链运算符
    // ✅ 推荐: obj?.prop
    // ❌ 不推荐: obj && obj.prop
    "@typescript-eslint/prefer-optional-chain": "error",
    // 模板字符串类型限制
    // ✅ 允许: `${number}`
    // ❌ 禁止: `${complex}`
    "@typescript-eslint/restrict-template-expressions": ["error", {
      allowNumber: true
    }],
    // 箭头函数体风格
    // ✅ 推荐: const foo = x => x * 2
    // ❌ 不推荐: const foo = x => { return x * 2 }
    "arrow-body-style": ["warn", "as-needed"],
    // 花括号使用规则
    // ✅ 推荐: if (foo) return;
    // ✅ 推荐: if (foo) { return; bar(); }
    // ❌ 不推荐: if (foo) { return; }
    curly: ["warn", "multi-or-nest"],
    // 相等操作符
    // ✅ 推荐: === 和 !==
    // ❌ 禁止: == 和 !=
    eqeqeq: "error",
    // 函数风格
    // ✅ 推荐: const foo = () => {}
    // ❌ 禁止: function foo() {}
    "func-style": ["error", "expression"],
    // console语句允许使用
    "no-console": "off",
    // 条件判断
    // ✅ 推荐: while (condition)
    // ❌ 禁止: while (true)
    "no-constant-condition": "error",
    // debugger语句
    // ❌ 禁止: debugger
    "no-debugger": "error",
    // 对象键重复
    // ❌ 禁止: { a: 1, a: 2 }
    "no-dupe-keys": "error",
    // else中的return
    // ✅ 推荐: if (x) return 1; return 2
    // ❌ 禁止: if (x) return 1; else return 2
    "no-else-return": "error",
    // return await
    // ✅ 推荐: return promise
    // ❌ 禁止: return await promise
    "no-return-await": "error",
    // 允许抛出字面量
    "no-throw-literal": "off",
    // 意外的多行表达式
    // ❌ 禁止: const x = 1 + 2
    //         + 3
    "no-unexpected-multiline": "error",
    // 不必要的三元表达式
    // ✅ 推荐: const x = bool
    // ❌ 禁止: const x = bool ? true : false
    "no-unneeded-ternary": "error",
    // 不可达代码
    // ❌ 禁止: return; console.log()
    "no-unreachable": "error",
    // 无用的反向引用
    // ❌ 禁止: /(?:a){2}(?:a)/
    "no-useless-backreference": "error",
    // 不必要的call/apply
    // ✅ 推荐: foo()
    // ❌ 禁止: foo.call(undefined)
    "no-useless-call": "error",
    // 不必要的catch
    // ❌ 禁止: try { foo() } catch (e) { throw e }
    "no-useless-catch": "error",
    // 不必要的计算属性
    // ✅ 推荐: obj.foo
    // ❌ 禁止: obj['foo']
    "no-useless-computed-key": "error",
    // 不必要的字符串连接
    // ✅ 推荐: 'ab'
    // ❌ 禁止: 'a' + 'b'
    "no-useless-concat": "error",
    // 不必要的构造函数
    // ❌ 禁止: class C { constructor(){} }
    "no-useless-constructor": "error",
    // 不必要的重命名
    // ✅ 推荐: const { foo }
    // ❌ 禁止: const { foo: foo }
    "no-useless-rename": "error",
    // 不必要的return
    // ❌ 禁止: return undefined
    "no-useless-return": "error",
    // var声明
    // ✅ 推荐: const/let x = 1
    // ❌ 禁止: var x = 1
    "no-var": "error",
    // 对象属性简写
    // ✅ 推荐: { foo }
    // ❌ 不推荐: { foo: foo }
    "object-shorthand": "error",
    // 变量声明
    // ✅ 推荐: let a; let b
    // ❌ 禁止: var a, b
    "one-var": ["error", "never"],
    // 回调函数
    // ✅ 推荐: arr.map(x => x * 2)
    // ❌ 不推荐: arr.map(function(x) { return x * 2 })
    "prefer-arrow-callback": "error",
    // const使用
    // ✅ 推荐: 对所有不会被重新赋值的变量使用const
    "prefer-const": ["error", {
      destructuring: "all"
    }],
    // 解构赋值
    // ✅ 推荐: const { prop } = obj
    // ❌ 不推荐: const prop = obj.prop
    "prefer-destructuring": ["error", {
      AssignmentExpression: {
        array: false,
        object: false
      },
      VariableDeclarator: {
        array: false,
        object: true
      }
    }],
    // 指数运算符
    // ✅ 推荐: 2 ** 3
    // ❌ 不推荐: Math.pow(2, 3)
    "prefer-exponentiation-operator": "error",
    // 数字字面量
    // ✅ 推荐: 0xFF
    // ❌ 不推荐: parseInt("FF", 16)
    "prefer-numeric-literals": "error",
    // 对象展开
    // ✅ 推荐: { ...obj }
    // ❌ 不推荐: Object.assign({}, obj)
    "prefer-object-spread": "error",
    // 模板字符串
    // ✅ 推荐: `Hello ${name}`
    // ❌ 不推荐: 'Hello ' + name
    "prefer-template": "error",
    // Prettier格式化规则设置
    // 不使用分号，使用单引号，保留尾随逗号
    "prettier/prettier": ["warn", {
      semi: false,
      singleQuote: true,
      trailingComma: "all"
    }],
    // React Hooks依赖项检查
    // 确保useEffect等钩子函数的依赖列表完整
    "react-hooks/exhaustive-deps": "error",
    // React Refresh组件导出规则
    // 允许导出常量组件
    'react-refresh/only-export-components': ['warn', {
      allowConstantExport: true
    }],
    // PropTypes外部类型使用限制
    'react/forbid-foreign-prop-types': ['warn', {
      allowInPropTypes: true
    }],
    // JSX组件命名规范
    // ✅ 推荐: MyComponent
    // ❌ 禁止: myComponent
    'react/jsx-pascal-case': ['error', {
      allowAllCaps: true,
      ignore: []
    }],
    // React导入检查已关闭
    'react/jsx-uses-react': 'off',
    // PropTypes检查已关闭
    'react/prop-types': 'off',
    // JSX的React作用域检查已关闭
    'react/react-in-jsx-scope': 'off',
    // 自闭合标签
    // ✅ 推荐: <div />
    // ❌ 不推荐: <div></div>
    "react/self-closing-comp": "error",
    // style属性值类型
    // ✅ 推荐: style={{ color: 'red' }}
    // ❌ 不推荐: style="color: red"
    'react/style-prop-object': 'warn',
    // async函数
    // ✅ 推荐: async function foo() { await something() }
    // ❌ 不推荐: async function foo() { return 42 }
    "require-await": "error"
  },
  // React设置
  settings: {
    react: {
      // 自动检测React版本
      version: "detect"
    }
  }
}]
