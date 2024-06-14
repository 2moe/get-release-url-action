# Get Release URL Action

| Languages/語言                                 | ID         |
| ---------------------------------------------- | ---------- |
| English                                        | en-Latn-US |
| [中文](./docs/Readme-zh.md)                    | zh-Hans-CN |
| [中文 (Traditional)](./docs/Readme-zh-Hant.md) | zh-Hant-TW |

Get the URL for a specific platform from the GitHub releases API.

For example, an open-source project has released software packages for arm64 macOS, x64 Windows, and x64 Linux.

You can match x64, filter out Windows, and finally get the URL of the x64 Linux software package.

## Inputs

| Inputs        | Description                                                                              | Default |
| ------------- | ---------------------------------------------------------------------------------------- | ------- |
| repo          | Name of the GitHub repository. e.g., actions/runner                                      |         |
| tag           | Tag for releases                                                                         | latest  |
| include       | Matching items, you can specify multiple matching items with a multiline string          |         |
| exclude       | Filtering items                                                                          |         |
| token         | Token is only needed when accessing private repositories                                 |         |
| write-to-file | Write the URL to a specific file (e.g., url.txt), instead of outputting to GitHub output |         |

## Outputs

| Outputs | Description                                                                                            | Default |
| ------- | ------------------------------------------------------------------------------------------------------ | ------- |
| url     | The final URL obtained after matching and filtering (requirement: the value of write-to-file is empty) |         |

## Get Started

Assume the releases URL of a project is: <https://github.com/actions/runner/releases>

We got `repo: actions/runner` from it.

File list:

- linux-arm-2.317.0.tar.gz
- linux-arm64-2.317.0.tar.gz
- linux-x64-2.317.0.tar.gz
- osx-arm64-2.317.0.tar.gz
- osx-x64-2.317.0.tar.gz
- win-arm64-2.317.0.zip
- win-x64-2.317.0.zip

If you want to get the URL of linux-arm64, you can do this:

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

The name of the GitHub repository, if empty, use the current project repository. (`env.GITHUB_REPOSITORY`)

### tag

```yaml
with:
  tag: latest
```

- type: string
- default: latest

Tag (label) of GitHub releases, e.g., `v2.1.0`.

### include

```yaml
with:
  include: |
    x64
    Windows
```

- type: string
- required: true

Match the filenames included in the file list.

Assume the releases file list is:

- aarch64-apple-darwin.dmg
- riscv64gc-unknown-linux-musl.tar.zst
- riscv64gc-unknown-linux-gnu.tar.zst
- x86_64-pc-windows-msvc.zip

If you want to match riscv64 linux musl, you can use:

```yaml
with:
  include: riscv64gc-unknown-linux-musl
```

If you need to use multiple values for matching, please use a multiline string, one per line.
The first line uses riscv64, the second line uses musl.

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

Filter out specific items.

In general, it should be used together with include.

Assume the file list is:

- riscv64gc-unknown-linux-gnu.tzst
- riscv64gc-unknown-linux-musl.tzst".

If you want to match "musl", filter out "gnu", you can do this:

```yaml
with:
  include: |
    linux
    musl
  exclude: gnu
```

If you need to use multiple values for filtering, please use a multiline string.

### token

```yaml
with:
  token: ${{secrets.GITHUB_TOKEN}}
```

- type: string

TOKEN is only needed when accessing private repositories.

If empty, get from `env.GITHUB_TOKEN`.

### write-to-file

```yaml
with:
  write-to-file: url.txt
```

- type: string

If you don't want to get the URL through `${{steps."step-id".outputs.url}}`, you can also write the URL to a specific file, e.g., a.txt.
