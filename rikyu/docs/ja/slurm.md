# Slurmの使い方

## 利用可能なモジュール環境

NVIDIA HPC Software Development Kitを利用した複数のモジュール環境を提供しています。

| モジュール名   | 説明                                     |
| -------------- | ---------------------------------------- |
| `nvhpc`        | MPIを含む標準的なNVIDIA HPC SDK環境です。|
| `nvhpc-nompi`  | MPIを含まないNVIDIA HPC SDK環境です。別のMPIを自分で用意して使用する場合に使います。 |
| `nvhpc-hpcx`   | `nvhpc`にHPC-Xを組み合わせた環境です。InfiniBand/RDMA環境でHPC-XのMPIを使う場合に適しています。 |
| `nvhpc-hpcx-cuda13` | `nvhpc-hpcx`と同様にHPC-Xを含みますが、使用するCUDAバージョンがCUDA 13に固定されています。|
| `nvhpc-byo-compiler` | システムのGCCなど、利用者が用意したコンパイラを使うための環境です。BYOは“Bring Your Own”の略です。|

`module avail`を使うと、利用可能なモジュールの詳細な一覧を確認できます。

```bash
$ module avail
```

### モジュールのロード

`module load`を使うと、利用したいモジュールをロードできます。

```bash
$ module load nvhpc
```

### モジュールの確認

`module list`を使うと、現在のロードされているモジュールを確認できます。

```bash
$ module list
```

### モジュールの切り替え

現在ロードされているモジュールとは異なるモジュールを読み込みたい場合、新しいモジュールを読み込む前に`module unload`を使うと、現在のモジュールをアンロードします。

```bash
$ module unload nvhpc
$ module load nvhpc-hpcx
```

### モジュールの内容の確認

`module show`を使うと、そのモジュールが環境にどのような変更を加えるかを確認できます。

```bash
$ module show nvhpc
```

## ジョブの投入

`job.sh`のようなジョブスクリプトを作成します。GPU数は`--gres=gpu:<GPU数>`で指定します。`--job-name=`はジョブ名、`--time`は時間を指定します。

```bash
#!/bin/bash
#SBATCH --gres=gpu:1
#SBATCH --job-name=test-job
#SBATCH --time=00:10:00

module load nvhpc

nvidia-smi
```

`sbatch`を使うと、計算ノードにジョブを投入できます。

```bash
$ sbatch job.sh
```

`squeue`を使うと、自分のジョブを確認できます。

```bash
$ squeue
```

## 対話ジョブの実行

### 対話セッション

`salloc`を使うと、対話セッション用のリソースを確保できます。以下の例では、1GPUを10分間を要求します。

```bash
$ salloc --gres=gpu:1 --time=00:10:00
```

割り当てが開始されたら、`srun`を使って割り当てられたノード上でコマンドを実行します。

```bash
$ srun nvidia-smi
```

終了したら、`exit`を実行して割り当てを解放します。

```bash
$ exit
exit
salloc: Relinquishing job allocation 1066
```

### 対話シェル

`srun --pty bash`を使うと、計算ノード上で対話シェルを開始できます。以下の例では、1GPUを10分間を要求します。

```bash
$ srun --gres=gpu:1 --time=00:10:00 --pty bash
```

終了したら、`exit`を実行してシェルを抜け、`srun`ジョブを終了します。

```bash
$ exit
exit
```

## ジョブのキャンセル

`scancel`を使うと、投入済みまたは実行中のジョブをキャンセルできます。`JOBID`は`sbatch`または`squeue`で表示されるジョブIDに置き換えてください。

```bash
$ scancel JOBID
```

## 計算ノードの状態確認

`sinfo`を使うと、計算ノードの状態を確認できます。

```bash
$ sinfo
```

## テンポラリ領域

各計算ノードでは、`/tmp`にローカルファイルシステムをマウントしています。この領域では、約7TBのNVMe SSDを利用できます。

`/tmp`は、計算中に一時ファイル、データセット、チェックポイント、中間結果などを高速なローカルSSD上で扱いたい場合に有用です。`/tmp`上のファイルはジョブ終了時にすべて削除されるため、保存が必要な結果はジョブ終了前に永続的なストレージへコピーしてください。
