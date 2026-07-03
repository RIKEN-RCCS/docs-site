# モジュール環境

NVIDIA HPC Software Development Kitを利用した複数のモジュール環境を提供しています。

| モジュール名   | 説明                                     |
| -------------- | ---------------------------------------- |
| `nvhpc`        | MPIを含む標準的なNVIDIA HPC SDK環境です。|
| `nvhpc-nompi`  | MPIを含まないNVIDIA HPC SDK環境です。別のMPIを自分で用意して使用する場合に使います。 |
| `nvhpc-hpcx`   | `nvhpc`にHPC-Xを組み合わせた環境です。InfiniBand/RDMA環境でHPC-XのMPIを使う場合に適しています。 |
| `nvhpc-hpcx-cuda13` | `nvhpc-hpcx`と同様にHPC-Xを含みますが、使用するCUDAバージョンがCUDA 13に固定されています。|
| `nvhpc-byo-compiler` | システムのGCCなど、利用者が用意したコンパイラを使うための環境です。BYOは“Bring Your Own”の略です。|

## モジュールの一覧表示

`module avail`を使うと、利用可能なモジュールの詳細な一覧を確認できます。

```bash
$ module avail
```

## モジュールの初期化

`module purge`を使うと、現在ロードされているすべてのモジュールをアンロードできます。ジョブスクリプトでは、必要なモジュールをロードする前に`module purge`を実行しておくと、意図しないモジュール環境の影響を避けやすくなります。

```bash
$ module purge
```

## モジュールのロード

`module load`を使うと、利用したいモジュールをロードできます。

```bash
$ module load nvhpc
```

## モジュールの確認

`module list`を使うと、現在のロードされているモジュールを確認できます。

```bash
$ module list
```

## モジュールの切り替え

現在ロードされているモジュールとは異なるモジュールを読み込みたい場合、新しいモジュールを読み込む前に`module unload`を使うと、現在のモジュールをアンロードします。

```bash
$ module unload nvhpc
$ module load nvhpc-hpcx
```

## モジュールの内容の確認

`module show`を使うと、そのモジュールが環境にどのような変更を加えるかを確認できます。

```bash
$ module show nvhpc
```
