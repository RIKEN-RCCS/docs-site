# 利用方法

「理究」を利用するには、「WebブラウザからOpen OnDemandを利用する方法」と「ターミナルソフトウェアからSSH接続する方法」があります。

## Open OnDemand

Open OnDemandはWebブラウザからスーパーコンピュータを利用できるWebポータルです。[https://ondemand.rikyu.r-ccs.riken.jp](https://ondemand.rikyu.r-ccs.riken.jp)からログインください。Open OnDemandは下記の機能を提供しています。

* ファイルの送受信・編集
* Webターミナルの利用
* 対話アプリケーション（リモートデスクトップなど）の実行と管理
* バッチジョブの実行と管理

Open OnDemandは、Google Chrome、Mozilla Firefox、Microsoft Edgeなどの主要なWebブラウザに対応しています（注：Internet Explorer 11は対応していません）。中でもChromeは、リモートデスクトップなどにおいて、文字列のコピー & ペースト機能をネイティブにサポートしていますので、Chromeのご利用をお勧めします。

## ターミナルソフトウェア

SSHの公開鍵の登録を行うために、[https://ondemand.rikyu.r-ccs.riken.jp](https://ondemand.rikyu.r-ccs.riken.jp)から「SSH Public Key」を起動してください。下記の画面が表示されますので、「Add a Public Key」の中のテキストエリアにご自身のSSH公開鍵を入力し、「Add」ボタンをクリックしてください。登録が成功すると、「Registered Public Keys」に登録情報が表示されます。

![SSH public key](../img/sshpubkey.png){ width="800" }

ターミナルソフトウェアから、下記のコマンドでSSHログインできます。以下の`USERNAME`は自分のユーザ名に置き換えてください。

```bash
$ ssh USERNAME@login.rikyu.r-ccs.riken.jp
```

### Slurmの使い方

Slurmを使ってジョブを投入します。利用可能なパーティションは以下のとおりです。

<div class="spec-table">
<table>
  <tbody>
    <tr>
      <th>パーティション</th>
      <th>最大ノード数</th>
      <th>最大GPU数/ノード</th>
      <th>最大CPUコア数/ノード</th>
      <th>最大メモリ量/ノード</th>
      <th>実行時間</th>
    </tr>
    <tr>
      <td>gpu</td>
      <td>4</td>
      <td>4</td>
      <td>144</td>
      <td>1,600GB</td>
      <td>96時間</td>
    </tr>
  </tbody>
</table>
</div>

### モジュール環境

このシステムでは、NVIDIA HPC Software Development Kitを利用した開発・実行向けに複数のモジュール環境を提供しています。

|モジュール|説明|
| ---------- | ---- |
| nvhpc |標準的なNVHPC環境|
| nvhpc-nompi | MPIなしのNVHPC環境。MPIを自分で管理する場合に使用します|
| nvhpc-hpcx | IBとHPC-Xを含むNVHPC環境|
| nvhpc-hpcx-cuda13 | HPC-Xを含み、CUDA 13に固定されたNVHPC環境|
| nvhpc-byo-compiler |システムのGCCを利用する環境。BYOはbring your ownの意味です|

#### 利用可能なモジュールを確認する

`module avail`を使うと、利用可能なモジュールの詳細な一覧を確認できます。

```bash
$ module avail
```

#### ロード済みのモジュールを確認する

`module list`を使うと、現在ロードされているモジュールを確認できます。

```bash
$ module list
```

#### モジュールを読み込む

利用したい環境は`module load`で読み込みます。

```bash
$ module load nvhpc
```

#### モジュールを切り替える

別のモジュールを読み込む前に、現在のモジュールをunloadします。

```bash
$ module unload nvhpc
$ module load nvhpc-hpcx
```

#### モジュールの内容を確認する

`module show`を使うと、そのモジュールが環境にどのような変更を加えるかを確認できます。

```bash
$ module show nvhpc-hpcx
```

### バッチジョブを投入する

`job.sh`のようなジョブスクリプトを作成します。以下の例では、`1n1gpu`パーティションで1ノード、1 GPUを要求します。

```bash
#!/bin/bash
#SBATCH --job-name=test-job
#SBATCH --partition=1n1gpu
#SBATCH --nodes=1
#SBATCH --gpus-per-node=1
#SBATCH --time=00:10:00

module load nvhpc

hostname
nvidia-smi
```

`sbatch`でジョブを投入します。

```bash
$ sbatch job.sh
```

`squeue`で自分のジョブを確認します。

```bash
$ squeue -u $USER
```

### インタラクティブジョブを実行する

#### sallocを使う

`salloc`を使うと、インタラクティブセッション用のリソースを確保できます。以下の例では、`1n1gpu`パーティションで10分間、1ノード、1 GPUを要求します。

```bash
$ salloc --partition=1n1gpu --nodes=1 --gpus-per-node=1 --time=00:10:00
```

割り当てが開始されたら、`srun`を使って割り当てられたノード上でコマンドを実行します。

```bash
$ srun hostname
$ srun nvidia-smi
```

終了したら、`exit`を実行してインタラクティブ割り当てを解放します。

```bash
$ exit
exit
salloc: Relinquishing job allocation 1066
```

#### srunを使う

`srun --pty bash`を使うと、計算ノード上でインタラクティブシェルを開始できます。以下の例では、`1n1gpu`パーティションで10分間、1ノード、1 GPUを要求します。

```bash
$ srun --partition=1n1gpu --nodes=1 --gpus-per-node=1 --time=00:10:00 --pty bash
```

終了したら、`exit`を実行してシェルを抜け、`srun`ジョブを終了します。

```bash
$ exit
exit
```

### ジョブをキャンセルする

投入済みまたは実行中のジョブは`scancel`でキャンセルできます。`JOBID`は`sbatch`または`squeue`で表示されるジョブIDに置き換えてください。

```bash
$ scancel JOBID
```

### パーティションの状態を確認する

`sinfo`を使って、パーティションとノードの状態を確認できます。

```bash
$ sinfo
```

特定のパーティションを確認するには`-p`を使います。

```bash
$ sinfo -p 1n1gpu
```

### ローカルScratchストレージ

各計算ノードでは、約7TBのNVMe SSD上にローカルScratch領域を提供しています。ジョブからこのScratch領域にアクセスするには、`USER_SCRATCH_DIR`環境変数を使用します。

このストレージは、計算中に一時ファイル、データセット、チェックポイント、中間結果などを高速なローカルSSD上で扱いたい場合に有用です。この領域のファイルはジョブ終了後に自動的に削除されるため、保存が必要な結果はジョブ終了前に永続的なストレージへコピーしてください。

```bash
#!/bin/bash
#SBATCH --job-name=scratch-example
#SBATCH --partition=1n1gpu
#SBATCH --nodes=1
#SBATCH --gpus-per-node=1
#SBATCH --time=00:10:00

module load nvhpc

echo "Scratch directory: ${USER_SCRATCH_DIR}"

./my_application > ${USER_SCRATCH_DIR}/output.log

# ジョブ終了後も保存が必要な結果をコピーします。
# SLURM_SUBMIT_DIR は sbatch コマンドを実行したディレクトリです。
cp ${USER_SCRATCH_DIR}/output.log ${SLURM_SUBMIT_DIR}/
```

### マルチGPU /マルチノードでのMPI通信設定（暫定推奨）

GPUバッファを直接MPIに渡す（CUDA-aware MPI / GPUDirect）アプリでは、現時点のソフトウェアスタック（HPC-X 2.25.1 / UCX 1.20）で以下の設定を行わないと、ノードをまたぐGPU間通信が極端に遅くなったり失敗したりすることが確認されています。これらは恒久対応までの**暫定（tentative）推奨設定**です。

```bash
module load nvhpc-hpcx

# (1) CUDA-aware MPI を有効にする環境変数
export OMPI_MCA_pml=ucx
export UCX_CUDA_COPY_DMABUF=no
export UCX_MAX_RNDV_RAILS=4
export NCCL_DMABUF_ENABLE=0
export NCCL_NET_GDR_LEVEL=SYS

# (2) マルチノードで GPU バッファ通信を使う場合に必須
#    これが無いとノード間の非ブロッキング GPU 通信（MPI_Isend/Irecv 等）が
#    "cannot find remote protocol ... tag_send ... from cuda" で失敗します。
export UCX_PROTO_ENABLE=n

# mpirun には -x で各変数を伝播させてください
X="-x OMPI_MCA_pml -x UCX_CUDA_COPY_DMABUF -x UCX_MAX_RNDV_RAILS -x NCCL_DMABUF_ENABLE -x NCCL_NET_GDR_LEVEL -x UCX_PROTO_ENABLE"
mpirun -n <ranks> --map-by ppr:4:node $X ./your_app
```

#### GPUの割り当て（1プロセス= 1 GPU）

1ノードで複数GPUを使う場合、各MPIプロセスを別々のGPUに割り当てないと、全プロセスがGPU 0を共有してNVLinkが使われず、性能が大きく低下します。アプリ側で割り当てるのが理想です。

- C/CUDA: `cudaSetDevice(local_rank)`
- OpenACC (Fortran): `call acc_set_device_num(mod(local_rank, ndev), acc_get_device_type())`
- アプリを変更できない場合は、ラッパースクリプトで`CUDA_VISIBLE_DEVICES`をローカルランクに設定します:

```bash
cat > devwrap.sh <<'WRAP'
#!/bin/bash
export CUDA_VISIBLE_DEVICES=${OMPI_COMM_WORLD_LOCAL_RANK:-0}
exec "$@"
WRAP
chmod +x devwrap.sh
mpirun -n <ranks> --map-by ppr:4:node $X ./devwrap.sh ./your_app
```

これらの設定は今後のスタック更新で不要になる可能性があります。
