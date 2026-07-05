# Slurmの使い方

## ジョブの投入

`job.sh`のようなジョブスクリプトを作成します。GPU数は`--gpus=<GPU数>`で指定します。`--job-name=`はジョブ名、`--time`は時間を指定します。

```bash
#!/bin/bash
#SBATCH --gpus=1
#SBATCH --job-name=test-job
#SBATCH --time=00:10:00

module load nvhpc

nvidia-smi
```

`sbatch`を使うと、計算ノードにジョブを投入できます。下記の出力メッセージの`2080`はジョブIDであり、ジョブの状態確認やキャンセルなどで対象のジョブを指定するために使用します。

```bash
$ sbatch job.sh
Submitted batch job 2080
```

`squeue`を使うと、自分のジョブを確認できます。

```bash
$ squeue
   JOBID PARTITION     NAME     USER ST       TIME  NODES NODELIST(REASON)
    2080       gpu test-job rku00011  R       0:05      1 c072
```

## 対話ジョブの実行

### 対話セッション

`salloc`を使うと、対話セッション用のリソースを確保できます。次の例では、1GPUを10分間要求します。出力メッセージの`2081`はジョブIDです。

```bash
$ salloc --gpus=1 --time=00:10:00
salloc: Granted job allocation 2081
salloc: Waiting for resource configuration
salloc: Nodes c072 are ready for job
```

割り当てが開始されたら、`srun`を使って割り当てられたノード上でコマンドを実行します。

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

### 対話シェル

`srun --pty bash`を使うと、計算ノード上で対話シェルを開始できます。次の例では、1GPUを10分間要求します。

```bash
$ srun --gpus=1 --time=00:10:00 --pty bash
$ hostname
c072 
```

終了したら、`exit`を実行してシェルを抜け、`srun`ジョブを終了します。

```bash
$ exit
exit
```

## ジョブのキャンセル

`scancel JOBID`を使うと、投入済みまたは実行中のジョブをキャンセルできます。`JOBID`は`squeue`やジョブ投入時に表示されるジョブIDに置き換えてください。

```bash
$ scancel 2081
```

## 計算ノードの状態確認

`sinfo`を使うと、計算ノードの状態を確認できます。

```bash
$ sinfo
PARTITION AVAIL  TIMELIMIT  NODES  STATE NODELIST
gpu          up 4-00:00:00    400   idle c[000-399]
```
