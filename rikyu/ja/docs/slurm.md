# Slurmの使い方

本システムでプログラムを実行するには、[Slurmジョブスケジューラ](https://slurm.schedmd.com/slurm.html){ target="_blank" rel="noopener" }を使ってジョブを投入します。ジョブの実行方法には、<span class="text-marker">バッチジョブ</span>と<span class="text-marker">対話ジョブ</span>があります。バッチジョブは、あらかじめジョブスクリプトを作成して投入する方法で、長時間実行する場合などに適しています。一方、対話ジョブでは、ユーザがコマンドを対話的に実行できるため、バッチジョブ投入前のデバッグなどに適しています。

本ページでは、コマンドラインによるジョブの投入方法について説明します。

ジョブで利用できるGPU数、CPUコア数、メモリ量については、[ジョブ実行資源](resources.md)を参照してください。

## ジョブスクリプト例

### 逐次ジョブ

逐次ジョブ（MPIやOpenMPによる並列化が行われていないジョブ）のジョブスクリプト例です。`--gpus=`で指定した数だけGPUが利用できます。

```bash
#!/bin/bash
#SBATCH --job-name=test-job # ジョブ名
#SBATCH --time=00:10:00     # 時間指定
#SBATCH --gpus=2            # GPU数

module load nvhpc           # モジュールの読み込み
./a.out                     # 実行コマンド
```

### 並列ジョブ

並列ジョブのジョブスクリプト例です。プロセス数（`--ntasks=`）とスレッド数（`export OMP_NUM_THREADS=`）は必要に応じて指定してください。

```bash
#!/bin/bash
#SBATCH --job-name=test-job  # ジョブ名
#SBATCH --time=00:10:00      # 時間指定
#SBATCH --gpus=8             # GPU数
#SBATCH --ntasks=32          # プロセス数
export OMP_NUM_THREADS=1     # スレッド数

module load nvhpc            # モジュールの読み込み
mpiexec ./a.out              # 実行コマンド
```

## Slurmのコマンド

Slurmでは、ジョブの投入、状態確認、キャンセルを行うことができます。主なSlurmコマンドは次のとおりです。

| コマンド | 説明 |
| -------- | ---- |
| `sbatch JOB_SCRIPT` | バッチジョブの投入 |
| `squeue`            | ジョブの状態表示 |
| `salloc`            | 対話ジョブ用の計算資源確保 |
| `srun`              | 対話ジョブの実行 |
| `scancel JOB_ID`    | ジョブのキャンセル |
| `sinfo`             | 計算ノードの状態表示 |

!!! note
    各Slurmコマンドの詳細については、次のURLを参照してください。
    https://slurm.schedmd.com/documentation.html

### バッチジョブの投入

ジョブスクリプト（`job.sh`）を作成し、ログインノード上で`sbatch`コマンドを実行します。

```bash
$ sbatch job.sh
Submitted batch job 2080
```

出力メッセージの`2080`はジョブIDであり、ジョブの状態確認やキャンセルなどで対象のジョブを指定するために使用します。

複数の課題に所属している場合は、Slurmの`--account=`または`-A`オプションで、ジョブの課金対象となる課題を指定できます。ジョブスクリプトには、次のように記述します。`PROJECT_NAME`には、利用する課題名を指定してください。

```bash
#SBATCH --account=PROJECT_NAME
```

または、`sbatch`コマンドの実行時に指定します。

```bash
$ sbatch --account=PROJECT_NAME job.sh
```

### ジョブの状態表示

```bash
$ squeue
   JOBID PARTITION     NAME     USER ST       TIME  NODES NODELIST(REASON)
    2080       gpu test-job rku00011  R       0:05      1 c072
```

### 対話ジョブ用の計算資源確保

対話ジョブ用の計算資源を`salloc`コマンドで確保します。次の例では、2 GPUを10分間要求します。出力メッセージの`2081`はジョブIDです。

```bash
$ salloc --gpus=2 --time=00:10:00
salloc: Granted job allocation 2081
salloc: Waiting for resource configuration
salloc: Nodes c072 are ready for job
```

割り当てが開始されたら、`srun`コマンドを使って割り当てられたノード上でコマンドを実行します。

```bash
$ srun hostname
c072
```

終了したら、`exit`を実行して割り当てを解放します。

```bash
$ exit
exit
salloc: Relinquishing job allocation 2081
```

### 対話ジョブの実行

対話ジョブを`srun --pty bash`コマンドで開始します。次の例では、4 GPUを10分間要求します。

```bash
$ srun --gpus=4 --time=00:10:00 --pty bash
$ hostname
c072 
```

複数の課題に所属している場合は、Slurmの`--account=`または`-A`オプションで、ジョブの課金対象となる課題を指定できます。ジョブスクリプトには、次のように記述します。`PROJECT_NAME`には、利用する課題名を指定してください。

```bash
$ srun --account=PROJECT_NAME --gpus=4 --time=00:10:00 --pty bash
```

終了したら、`exit`を実行してシェルを抜け、`srun`ジョブを終了します。

```bash
$ exit
exit
```

### ジョブのキャンセル

ジョブIDを指定して、投入済みまたは実行中のジョブを`scancel`コマンドでキャンセルします。

```bash
$ scancel 2081
```

### 計算ノードの状態確認

計算ノードの状態を`sinfo`で確認します。

```bash
$ sinfo
PARTITION AVAIL  TIMELIMIT  NODES  STATE NODELIST
gpu          up 4-00:00:00    400   idle c[000-399]
```
