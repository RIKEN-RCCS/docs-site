## 0. このマニュアルの読み方

このマニュアルは、理究でソフトウェアを使うための手順を説明します。
ソフトウェアの管理には **Spack** を使用します。

まずは **1・2章必要に応じて5章、6章** を読めば、システム側でビルド済みのソフトウェアを利用できます。
自分でOSSをビルドする必要がある方だけ、**7章** のプライベート・インスタンスを読んでください。

 ※ コマンド例の行頭にある `$` や `%` はプロンプトです。実際に入力する必要はありません。

| 利用目的 | 読む章 |
|---|---|
| ビルド済みソフトウェアを使いたい | 1章、2章、3章、5章、6章 |
| GPU対応ソフトウェアを使いたい | 1章、2章、3章、5章、6章 |
| MPIアプリケーションを使いたい | 1章、2章、3章、4章、5章、6章 |
| 同じ名前のパッケージが複数出て困っている | 6章 |
| 自分でソフトウェアをビルドしたい | 1章、7章、8章 |


## 1. 用語の説明

| 用語 | 意味 |
|---|---|
| Spack | スーパーコンピュータやHPCシステムでよく使われるパッケージ管理ツールです。複数のバージョン、コンパイラ、MPI、GPU対応の有無などを区別して管理できます。 |
| OSS | Open Source Software の略です。本マニュアルでは、cp2k、gromacs、lammps、quantum-espresso など、システムで提供するオープンソースソフトウェアを指します。 |
| パブリック・インスタンス | システム側で管理するSpack環境です。利用頻度の高いOSSがビルド済みで提供されています。通常の利用者は、まずこの環境を使います。 |
| プライベート・インスタンス | 利用者が自分のホームディレクトリなどに作成するSpack環境です。システム側にないOSSや独自のビルド条件が必要な場合に使います。 |
| チェイニング | プライベート・インスタンスからパブリック・インスタンスのビルド済みパッケージを参照する機能です。依存関係を一からビルドする負担を減らせます。 |
| spec | Spackでパッケージ構成を表す指定です。パッケージ名だけでなく、バージョン、コンパイラ、依存関係、ビルドオプションなどを含みます。 |
| ハッシュ値 | Spackがビルド済みパッケージを一意に区別するための短い識別子です。同名パッケージが複数ある場合に使います。 |


## 2. パブリック・インスタンスの基本手順

システム側でビルド済みのソフトウェアを利用する場合は、この章の流れで作業します。

### 2.1 Spack環境を読み込む

`bash` または `zsh` を使っている場合は、ログイン後に次を実行します。

```bash
$ . /shared/software/spack-1.2.0/share/spack/setup-env.sh
```

`csh` または `tcsh` を使っている場合は、次を実行します。

```csh
% source /shared/software/spack-1.2.0/share/spack/setup-env.csh
```

バッチジョブ内でソフトウェアを使う場合も、ジョブスクリプト内に同じ設定を入れてください。

> 注意: `/shared/software/spack-1.2.0` の部分は、システム更新により変更される可能性があります。管理者から別のパスが案内された場合は、そのパスを使用してください。

### 2.2 Spackが使えることを確認する

環境を読み込んだら、次を実行します。

```bash
$ spack --version
$ which spack
```

`spack: command not found` と表示される場合は、2.1の環境読み込みができていません。同じシェルで、もう一度 `setup-env.sh` を読み込んでください。

### 2.3 利用できるソフトウェアを確認する

システム側で明示的に提供されているビルド済みソフトウェアを確認します。

```bash
$ spack find -x
```

ハッシュ値も表示したい場合は、次を使います。

```bash
$ spack find -lx
```

よく使う確認コマンドは次のとおりです。

| コマンド | 目的 |
|---|---|
| `spack find -x` | 利用者が直接使うことを想定して提供されているパッケージだけを表示します。 |
| `spack find -lx` | `spack find -x` に加えて、短縮ハッシュ値を表示します。 |
| `spack find <名前>` | 指定した名前のインストール済みパッケージを検索します。 |
| `spack find -lv <名前>` | 指定したパッケージの詳細情報とハッシュ値を表示します。 |
| `spack find --loaded` | 現在のシェルにロードされているパッケージを表示します。 |

`-x` を外して `spack find` を実行すると、依存関係として入っているパッケージも含めて表示されます。通常の利用では、まず `spack find -x` を使ってください。

### 2.4 ソフトウェアをロードする

例として `cp2k` を使う場合は、次を実行します。

```bash
$ spack load cp2k
```

ロードすると、`PATH` などの環境変数が設定され、そのシェルまたはジョブの中でアプリケーションを実行できるようになります。

実行ファイルが見えるか確認します。

```bash
$ which <実行コマンド>
```

アプリケーションによっては、パッケージ名と実行コマンド名が異なります。
たとえば Quantum ESPRESSO では `pw.x` など、アプリケーション固有のコマンドを使います。
実行コマンドが分からない場合は、アプリケーションの公式マニュアルまたはシステム管理者の案内を確認してください。

現在ロードされているパッケージは、次で確認できます。

```bash
$ spack find --loaded
```

### 2.5 使い終わったらアンロードする

利用後に現在のシェルから外す場合は、次を実行します。

```bash
$ spack unload cp2k
```

別のビルド条件の同名パッケージを試す場合は、古いパッケージをアンロードしてから新しいパッケージをロードしてください。


## 3. バッチジョブでの利用

ログインノードでは重い計算を実行しないでください。実計算は、バッチジョブまたは会話型ジョブで計算ノード上で実行してください。

### 3.1 GPUジョブの基本形

GPU対応ソフトウェアを使う場合は、SpackでソフトウェアをロードするだけではGPUは割り当てられません。Slurmのジョブ指定でGPU資源を要求してください。

```bash
#!/bin/bash
#SBATCH --job-name=gpu-app-test
#SBATCH --nodes=1
#SBATCH --ntasks-per-node=8
#SBATCH --gpus-per-node=<GPU数>
#SBATCH --time=00:10:00
# システム設定によっては、上の行の代わりに以下を使う場合があります。
# #SBATCH --gres=gpu:<GPU数>
# 必要に応じて指定してください。
# #SBATCH --account=<アカウント名>
# #SBATCH --partition=<GPUパーティション名>

. /shared/software/spack-1.2.0/share/spack/setup-env.sh

spack load <GPU対応パッケージ名>

# GPUが割り当てられているか確認する例
srun nvidia-smi
srun bash -c 'echo CUDA_VISIBLE_DEVICES=$CUDA_VISIBLE_DEVICES'

srun <アプリケーションの実行コマンド> <入力ファイルなど>
```

GPU数、GPU種別、パーティション名の指定方法は、システムのSlurm設定に依存します。管理者が案内しているジョブ投入方法に合わせてください。

### 3.2 GPU対応として提供されている主なソフトウェア

現在、次のソフトウェアがGPU対応版として提供されています。

- `petsc`
- `lammps`
- `quantum-espresso`
- `gromacs`
- `kokkos`

提供内容は更新されることがあります。最新の一覧は次で確認してください。

```bash
$ spack find -x
```

### 3.3 Quantum ESPRESSOのジョブスクリプト例

次は `quantum-espresso` を利用する例です。実際のノード数、タスク数、GPU指定、アカウント、パーティションは利用環境に合わせて変更してください。

```bash
#!/bin/bash
#SBATCH --job-name=qe-test
#SBATCH --nodes=2
#SBATCH --ntasks-per-node=8
#SBATCH --time=00:30:00
# GPUを使う場合は、必要に応じて指定してください。
# #SBATCH --gpus-per-node=<GPU数>
# #SBATCH --gres=gpu:<GPU数>
# #SBATCH --account=<アカウント名>
# #SBATCH --partition=<パーティション名>

. /shared/software/spack-1.2.0/share/spack/setup-env.sh

spack load quantum-espresso

srun pw.x -in qe.in
```

`qe.in` は Quantum ESPRESSO の入力ファイルです。実際の計算では、入力ファイルと必要な擬ポテンシャルファイル（UPF形式）を事前に準備してください。


## 4. hpcx-mpiを使用する場合

本システムでは NVIDIA HPC-X MPI を利用できます。HPC-X MPI は Open MPI をベースとしたMPI実装で、UCXなどの通信ライブラリを利用します。

ただし、パブリック・インスタンスで提供されるすべてのMPIアプリケーションが `hpcx-mpi` 対応版としてビルドされているわけではありません。MPI実行前に、対象アプリケーションが `hpcx-mpi` 対応構成でビルドされていることを確認してください。

### 4.1 hpcx-mpi対応構成として提供されている主なパッケージ

現在、次のアプリケーションおよびライブラリが `hpcx-mpi` 対応構成として提供されています。

- `quantum-espresso`
- `gromacs`
- `openfoam-org`
- `darshan-runtime`
- `scotch`
- `fftw`
- `hdf5`
- `nvpl-scalapack`

### 4.2 hpcx-mpi対応か確認する

まず、対象パッケージのハッシュ値を確認します。

```bash
$ spack find -lv <パッケージ名>
```

例:

```bash
$ spack find -lv quantum-espresso
```

ハッシュ値が分かったら、そのハッシュを使ってビルド構成を確認します。

```bash
$ spack spec /<hash>
```

依存関係ツリー内に次の表示があれば、その構成は `hpcx-mpi` を利用しています。

```text
^hpcx-mpi
```

同名パッケージが複数ある場合、`spack spec quantum-espresso` のようにパッケージ名だけで確認すると、意図したインストール済みパッケージとは異なる構成が表示される可能性があります。`spack find -lv <パッケージ名>` でハッシュ値を確認し、`spack spec /<hash>` で確認する方法を推奨します。

### 4.3 MPI実行時の考え方

MPIアプリケーションは、ロードしたアプリケーションが想定するMPI実装と、実行時に使うMPI実装を合わせる必要があります。本システムのパブリック・インスタンスで提供されたMPIアプリケーションを使う場合は、原則として対象アプリケーションを `spack load` したうえで、Slurmの `srun` から実行してください。

```bash
. /shared/software/spack-1.2.0/share/spack/setup-env.sh
spack load <MPI対応パッケージ名>
srun <MPIアプリケーションの実行コマンド> <入力ファイルなど>
```

MPI通信エラーが発生した場合は、8章のトラブルシュートを確認してください。


## 5. 提供ソフトウェアの探し方

提供ソフトウェアは更新されることがあります。最新の一覧は、必ずシステム上で確認してください。

```bash
$ spack find -x
```

### 5.1 主な提供ソフトウェア

| 分野 | 主なパッケージ |
|---|---|
| 第一原理計算・量子化学 | `cp2k`, `quantum-espresso`, `cpmd`, `openmx`, `salmon-tddft` |
| 分子動力学 | `gromacs`, `lammps`, `genesis` |
| CAE・構造解析・流体解析 | `frontistr`, `openfoam`, `openfoam-org` |
| 気象・地球科学 | `wrf`, `scale` |
| 可視化・画像・動画処理 | `paraview`, `povray`, `gnuplot`, `grads`, `ffmpeg` |
| Python関連ライブラリ | `py-scipy`, `py-pandas`, `py-matplotlib`, `py-scikit-learn`, `py-netcdf4`, `py-mpi4py`, `py-ase`, `py-xarray`, `py-toml` |
| 化学・創薬関連 | `openbabel`, `autodock-vina` |
| 開発・その他 | `julia`, `rust`, `gsl`, `tmux`, `darshan-runtime`, `kokkos` |

### 5.2 `spack find -lx` の出力例

以下は出力例です。ハッシュ値、バージョン、パッケージ数はシステム更新により変わります。

```text
$ spack find -lx
-- linux-ubuntu24.04-neoverse_v2 / %c,cxx,fortran=gcc@13.3.0 ----
g6hpeea cp2k@2026.1            qxqrq4o parallel-netcdf@1.14.1
gmcipc4 darshan-runtime@3.5.0  vephnns paraview@6.1.1
q6ezzfa frontistr@5.3          e7q773o petsc@3.25.2
dtkhf7f julia@1.12.6           kg4hkb6 py-scipy@1.17.1

-- linux-ubuntu24.04-neoverse_v2 / %c,cxx,fortran=nvhpc@26.3 ----
efwm4pc quantum-espresso@7.5

-- linux-ubuntu24.04-neoverse_v2 / %c,cxx=gcc@13.3.0 ------------
icb2hpj ffmpeg@8.1       j25jgtt openfoam-org@12
g4gyqaz ffmpeg@8.1       snjqbss povray@3.7.0.10
kiylntv gnuplot@6.0.0    l2zajbr py-matplotlib@3.11.0
teveiql grads@2.2.3      wypy6fy py-mpi4py@4.1.1
b2zyy2l gromacs@2026.1   qpo72vu py-pandas@3.0.3
sjduy44 lammps@20260211  esjclj6 py-scikit-learn@1.9.0
dcheirs openbabel@3.2.0  usvgll2 rust@1.96.0
lrbixw3 openfoam@2512

-- linux-ubuntu24.04-neoverse_v2 / %c,fortran=gcc@13.3.0 --------
53j2h54 cpmd@4.3              t3je6ga salmon-tddft@2.0.0
djkxpao genesis@1.6.0         4hnwin4 scale@5.4.4
7phdib7 netcdf-fortran@4.6.2  vjefr4h wrf@4.7.1
6trnbya openmx@3.9

-- linux-ubuntu24.04-neoverse_v2 / %c=gcc@13.3.0 ----------------
hb4jb3t gsl@2.8         djy67le py-netcdf4@1.7.2
i7qisgo netcdf-c@4.9.2  fxzltob tmux@3.6a

-- linux-ubuntu24.04-neoverse_v2 / %cxx=gcc@13.3.0 --------------
y4boldd autodock-vina@1.2.6  kup5bkr kokkos@5.1.1

-- linux-ubuntu24.04-neoverse_v2 / no compilers -----------------
52c5kr6 py-ase@3.28.0   us4lyh6 py-xarray@2026.4.0
kn3r4xs py-toml@0.10.2
==> 40 installed packages
```


## 6. 同名パッケージが複数ある場合

Spackでは、同じソフトウェアであっても、バージョン、コンパイラ、MPI、GPU対応の有無、依存関係などが異なる複数のビルドを同時に管理できます。そのため、同じパッケージ名が複数表示されることがあります。

### 6.1 典型的なエラー

例えば、`fftw` が複数ビルドされている状態で次を実行するとします。

```bash
$ spack load fftw
```

候補が複数ある場合、次のようなエラーになります。

```text
==> Error: fftw matches multiple packages.
  Matching packages:
    erk4i5v fftw@3.3.11 platform=linux os=ubuntu24.04 target=neoverse_v2 %c,fortran=gcc@13.3.0
    5rny4xu fftw@3.3.11 platform=linux os=ubuntu24.04 target=neoverse_v2 %c,fortran=gcc@13.3.0
    nkvjfgj fftw@3.3.11 platform=linux os=ubuntu24.04 target=neoverse_v2 %c,fortran=nvhpc@26.3
```

### 6.2 推奨: ハッシュ値で指定する

同名パッケージが複数ある場合は、まず短縮ハッシュ値を確認します。

```bash
$ spack find -lx fftw
```

その後、利用したいビルドの短縮ハッシュ値を使ってロードします。

```bash
$ spack load /5rny4xu
```

出力例の候補であれば、次のように指定できます。

```bash
$ spack load /erk4i5v
$ spack load /5rny4xu
$ spack load /nkvjfgj
```

ハッシュ値は環境更新により変わる可能性があります。説明書中のハッシュ値を固定値として覚えるのではなく、実行時に `spack find -lx <パッケージ名>` で確認してください。

### 6.3 バージョンやコンパイラで指定する

バージョン番号で指定することもできます。

```bash
$ spack load fftw@3.3.11
```

ただし、同じバージョンのビルドが複数ある場合は、これだけでは区別できません。その場合は、コンパイラを含めて指定します。

```bash
$ spack load fftw%gcc
$ spack load fftw%nvhpc
```

さらに詳細に指定する場合は、次のように書けます。

```bash
$ spack load fftw%gcc@13.3.0
$ spack load fftw%nvhpc@26.3
```

それでも候補が複数残る場合は、ハッシュ値での指定を使ってください。


## 7. プライベート・インスタンスの利用

この章は、自分でOSSをビルドして利用する方向けです。パブリック・インスタンスで提供されるビルド済みソフトウェアだけを使う場合、この章の作業は不要です。

### 7.1 プライベート・インスタンスが必要になる場合

次のような場合に、プライベート・インスタンスを使います。

- パブリック・インスタンスにないOSSを使いたい
- 提供されているものとは異なるバージョンを使いたい
- 独自のビルドオプション、依存関係、コンパイラ指定でビルドしたい
- 研究グループ内で独自のパッケージを管理したい

### 7.2 Spackインスタンスを作成する

以下は、ホームディレクトリ配下に自分用のSpackインスタンスを作成する例です。

```bash
$ cd $HOME
$ git clone <SpackリポジトリURL> spack
$ cd spack
$ git checkout <ブランチ名>
```

利用するリポジトリURLとブランチ名は、管理者の案内に従ってください。

### 7.3 プライベート・インスタンスの環境を読み込む

```bash
$ . $HOME/spack/share/spack/setup-env.sh
```

同じシェルでパブリック・インスタンスとプライベート・インスタンスの `setup-env.sh` を重ねて読み込むと、どちらのSpackを使っているか分かりにくくなります。プライベート・インスタンスを使う場合は、新しいシェルでプライベート側の `setup-env.sh` を読み込むことを推奨します。

### 7.4 パブリック・インスタンスとのチェイニングを設定する

プライベート・インスタンスでは、Spackの `upstreams.yaml` を設定することで、パブリック・インスタンスにあるビルド済みパッケージを参照できます。これにより、依存関係を毎回ビルドする負荷を減らせます。

標準的な構成例は次のとおりです。

```bash
$ mkdir -p ~/.spack
$ cat > ~/.spack/upstreams.yaml <<'EOF'
upstreams:
  gb200-public:
    install_tree: /shared/software/spack-1.2.0/opt/spack
EOF
```

`install_tree` のパスは、実際のパブリック・インスタンスの設定に依存します。管理者から別のパスが案内されている場合は、そのパスを使用してください。

設定後、パブリック・インスタンス側のパッケージが見えるか確認します。

```bash
$ spack find -lx
```

### 7.5 パッケージを検索する

Spackで利用可能なパッケージ名を検索します。

```bash
$ spack list
$ spack list mpi
```

パッケージのバージョンやビルドオプションを確認します。

```bash
$ spack info openmpi
```

### 7.6 パッケージをインストールする

例として `openmpi` をインストールする場合は次を実行します。

```bash
$ spack install openmpi
```

バージョン指定も可能です。

```bash
$ spack install openmpi@4.1.1
```

インストール後は、次で確認できます。

```bash
$ spack find -lx openmpi
```

> 注意: 計算ノード向けパッケージのビルドは、会話型ジョブで計算ノードに入るか、インストール用ジョブを投入して実施してください。ログインノードで長時間のビルドを実行しないでください。

### 7.7 パッケージをアンインストールする

```bash
$ spack uninstall openmpi
```

同名パッケージが複数存在する場合は、誤削除を防ぐため、ハッシュ値で対象を確認してから実行してください。

```bash
$ spack find -lx openmpi
$ spack uninstall /<hash>
```

> 注意: パブリック・インスタンス側のパッケージは削除しないでください。自分のプライベート・インスタンスでインストールしたパッケージだけを削除対象にしてください。


## 8. トラブルシュート

| 症状 | 主な原因 | 対処 |
|---|---|---|
| `spack: command not found` と表示される | Spack環境を読み込んでいない | `. /shared/software/spack-1.2.0/share/spack/setup-env.sh` を実行します。ジョブ内でも同じ設定が必要です。 |
| `matches multiple packages` と表示される | 同名パッケージが複数ある | `spack find -lx <パッケージ名>` で候補を確認し、`spack load /<hash>` でロードします。 |
| `spack load` 後も実行コマンドが見つからない | 実行ファイル名がパッケージ名と異なる、またはライブラリパッケージである | アプリケーションの実行コマンド名を確認します。必要に応じて管理者に確認してください。 |
| GPU対応ソフトウェアなのにGPUが見えない | ジョブでGPU資源を要求していない | Slurmで `--gpus-per-node=<GPU数>` または `--gres=gpu:<GPU数>` を指定し、ジョブ内で `srun nvidia-smi` を実行します。 |
| MPIジョブが起動しない、または通信エラーになる | MPI実装やビルド構成が実行環境と合っていない | `spack find -lv <パッケージ名>` と `spack spec /<hash>` で `hpcx-mpi` 対応構成か確認します。 |
| プライベート・インスタンスでビルドが非常に遅い | 依存関係も一からビルドしている | パブリック・インスタンスとのチェイニングを設定し、既存のビルド済みパッケージを再利用します。 |
| ジョブスクリプトでは動かないが、ログインシェルでは動く | ジョブスクリプト内でSpack環境を読み込んでいない | ジョブスクリプトに `setup-env.sh` の読み込みと `spack load` を明示的に書きます。 |

### 8.1 問い合わせ前に確認する情報

管理者へ問い合わせる場合は、可能であれば次の情報を添えてください。

```bash
$ hostname
$ date
$ echo $SHELL
$ which spack
$ spack --version
$ spack find --loaded
$ spack find -lx <利用したいパッケージ名>
```

ジョブで問題が出る場合は、ジョブID、ジョブスクリプト、標準出力、標準エラーも添えてください。
