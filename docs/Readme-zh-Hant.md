# Get Release URL Action

| Languages/語言                            | ID         |
| ----------------------------------------- | ---------- |
| 中文 (Traditional)                       | zh-Hant-TW |
| [English](../Readme.md)                   | en-Latn-US |
| [中文 (Simplified)](./Readme-zh.md)      | zh-Hans-CN |

從 github releases api 中獲取特定的平臺的 url。

比如說，某開源專案釋出了 arm64 macOS, x64 Windows 以及 x64 Linux 的軟體包。

您可以匹配 x64, 過濾掉 Windows，最後得到的就是 x64 Linux 軟體包的 url。

## Inputs

| Inputs        | 描述                                                               | 預設值 |
| ------------- | ------------------------------------------------------------------ | ------ |
| repo          | github 倉庫的名稱. e.g., actions/runner                            |        |
| tag           | Tag for releases                                                   | latest |
| include       | 匹配項，可以用多行字串來指定多個匹配項                           |        |
| exclude       | 過濾項                                                             |        |
| token         | 只有在訪問私有倉庫時，才需要 token                                 |        |
| write-to-file | 將 url 寫入到特定檔案（e.g., url.txt）, 而不是輸出到 github output |        |

## Outputs

| Outputs | Description                                                    | Default |
| ------- | -------------------------------------------------------------- | ------- |
| url     | 透過匹配與過濾後得到的最終網址（要求: write-to-file 的值為空） |         |

## Get Started

假設某專案的 releases 網址為： <https://github.com/actions/runner/releases>

我們從中得到了 `repo: actions/runner`

檔案列表：

- linux-arm-2.317.0.tar.gz
- linux-arm64-2.317.0.tar.gz
- linux-x64-2.317.0.tar.gz
- osx-arm64-2.317.0.tar.gz
- osx-x64-2.317.0.tar.gz
- win-arm64-2.317.0.zip
- win-x64-2.317.0.zip

如需獲取 linux-arm64 的url, 那可以這樣子做：

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

github 倉庫的名稱，若為空，則使用當前專案倉庫。（`env.GITHUB_REPOSITORY`）

### tag

```yaml
with:
  tag: latest
```

- type: string
- default: latest

github releases 的 tag (標籤)，e.g., `v2.1.0`。

### include

```yaml
with:
  include: |
    x64
    Windows
```

- type: string
- required: true

匹配檔案列表中包含的檔名。

假設 releases 檔案列表為:

- aarch64-apple-darwin.dmg
- riscv64gc-unknown-linux-musl.tar.zst
- riscv64gc-unknown-linux-gnu.tar.zst
- x86_64-pc-windows-msvc.zip

如果想要匹配 riscv64 linux musl，那可以用：

```yaml
with:
  include: riscv64gc-unknown-linux-musl
```

如需使用多個值進行匹配，請使用多行字串，每行一個。
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

過濾掉特定項。

一般情況下，要與 include 一同使用。

假設檔案列表為:

- riscv64gc-unknown-linux-gnu.tzst
- riscv64gc-unknown-linux-musl.tzst".

如果想要匹配 "musl", 過濾掉 "gnu"，那可以這樣子做：

```yaml
with:
  include: |
    linux
    musl
  exclude: gnu
```

如需使用多個值進行過濾，則請使用多行字串。

### token

```yaml
with:
  token: ${{secrets.GITHUB_TOKEN}}
```

- type: string

只有在訪問私有倉庫時，才需要 TOKEN。

若為空，則從 `env.GITHUB_TOKEN` 獲取。

### write-to-file

```yaml
with:
  write-to-file: url.txt
```

- type: string

如果不想要透過 `${{steps."step-id".outputs.url}}` 來獲取 url，那也可以將 url 寫入到特定的檔案，e.g., a.txt.
