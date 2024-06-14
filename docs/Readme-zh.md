# Get Release URL Action

| Languages/語言                            | ID         |
| ----------------------------------------- | ---------- |
| 中文                                      | zh-Hans-CN |
| [English](../Readme.md)                   | en-Latn-US |
| [中文 (Traditional)](./Readme-zh-Hant.md) | zh-Hant-TW |

从 github releases api 中获取特定的平台的 url。

比如说，某开源项目发布了 arm64 macOS, x64 Windows 以及 x64 Linux 的软件包。

您可以匹配 x64, 过滤掉 Windows，最后得到的就是 x64 Linux 软件包的 url。

## Inputs

| Inputs        | 描述                                                               | 默认值 |
| ------------- | ------------------------------------------------------------------ | ------ |
| repo          | github 仓库的名称. e.g., actions/runner                            |        |
| tag           | Tag for releases                                                   | latest |
| include       | 匹配项，可以用多行字符串来指定多个匹配项                           |        |
| exclude       | 过滤项                                                             |        |
| token         | 只有在访问私有仓库时，才需要 token                                 |        |
| write-to-file | 将 url 写入到特定文件（e.g., url.txt）, 而不是输出到 github output |        |

## Outputs

| Outputs | Description                                                    | Default |
| ------- | -------------------------------------------------------------- | ------- |
| url     | 通过匹配与过滤后得到的最终网址（要求: write-to-file 的值为空） |         |

## Get Started

假设某项目的 releases 网址为： <https://github.com/actions/runner/releases>

我们从中得到了 `repo: actions/runner`

文件列表：

- linux-arm-2.317.0.tar.gz
- linux-arm64-2.317.0.tar.gz
- linux-x64-2.317.0.tar.gz
- osx-arm64-2.317.0.tar.gz
- osx-x64-2.317.0.tar.gz
- win-arm64-2.317.0.zip
- win-x64-2.317.0.zip

如需获取 linux-arm64 的url, 那可以这样子做：

```yaml
name: test
on: push
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - id: get-rurl
        uses: 2moe/get-releases-url-action@v0
        with:
          repo: actions/runner
          include: |
            linux
            arm
          exclude: |
            arm-
      - name: print url
        run: printf "url: ${{steps.get-rurl.outputs.url}}\n"
```

## Options

### repo

```yaml
with:
  repo: [owner]/[repo-name]
```

- type: string

github 仓库的名称，若为空，则使用当前项目仓库。（`env.GITHUB_REPOSITORY`）

### tag

```yaml
with:
  tag: latest
```

- type: string
- default: latest

github releases 的 tag (标签)，e.g., `v2.1.0`。

### include

```yaml
with:
  include: |
    x64
    Windows
```

- type: string
- required: true

匹配文件列表中包含的文件名。

假设 releases 文件列表为:

- aarch64-apple-darwin.dmg
- riscv64gc-unknown-linux-musl.tar.zst
- riscv64gc-unknown-linux-gnu.tar.zst
- x86_64-pc-windows-msvc.zip

如果想要匹配 riscv64 linux musl，那可以用：

```yaml
with:
  include: riscv64gc-unknown-linux-musl
```

如需使用多个值进行匹配，请使用多行字符串，每行一个。
第一行使用riscv64，第二行使用musl。

```yaml
with:
  include: |
    riscv64gc
    musl
```

### exclude

```yaml
with:
  exclude: |
    gnu
    arm
    aarch64
```

- type: string
- required: false

过滤掉特定项。

一般情况下，要与 include 一同使用。

假设文件列表为:

- riscv64gc-unknown-linux-gnu.tzst
- riscv64gc-unknown-linux-musl.tzst".

如果想要匹配 "musl", 过滤掉 "gnu"，那可以这样子做：

```yaml
with:
  include: |
    linux
    musl
  exclude: gnu
```

如需使用多个值进行过滤，则请使用多行字符串。

### token

```yaml
with:
  token: ${{secrets.GITHUB_TOKEN}}
```

- type: string

只有在访问私有仓库时，才需要 TOKEN。

若为空，则从 `env.GITHUB_TOKEN` 获取。

### write-to-file

```yaml
with:
  write-to-file: url.txt
```

- type: string

如果不想要通过 `${{steps."step-id".outputs.url}}` 来获取 url，那也可以将 url 写入到特定的文件，e.g., a.txt.
