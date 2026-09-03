# Spackの使い方

## 用語の説明 { #terminology }

| 用語 | 意味 |
|---|---|
| Spack | スーパーコンピュータやHPCシステムでよく使われるパッケージ管理ツールです。複数のバージョン、コンパイラ、MPI、GPU対応の有無などを区別して管理できます。 |
| OSS | Open Source Softwareの略です。本ページでは、cp2k、gromacs、lammps、quantum-espressoなど、システムで提供するオープンソースソフトウェアを指します。 |
| パブリック・インスタンス | システム側で管理するSpack環境です。利用頻度の高いOSSがビルド済みで提供されています。通常の利用者は、まずこの環境を使います。 |
| プライベート・インスタンス | 利用者が自分のホームディレクトリなどに作成するSpack環境です。システム側にないOSSや独自のビルド条件が必要な場合に使います。 |
| チェイニング | プライベート・インスタンスからパブリック・インスタンスのビルド済みパッケージを参照する機能です。依存関係を一からビルドする負担を減らせます。 |
| spec | Spackでパッケージ構成を表す指定です。パッケージ名だけでなく、バージョン、コンパイラ、依存関係、ビルドオプションなどを含みます。 |
| ハッシュ値 | Spackがビルド済みパッケージを一意に区別するための短い識別子です。同名パッケージが複数ある場合に使います。 |

## パブリック・インスタンスの基本手順 { #public-instance }

システム側でビルド済みのソフトウェアを利用する場合は、本節の流れで作業します。

### Spack環境を読み込む { #load-env }

`bash`または`zsh`を使っている場合は、ログイン後に次を実行します。

```bash
. /shared/software/spack-1.2.0/share/spack/setup-env.sh
```

`csh`または`tcsh`を使っている場合は、次を実行します。

```bash
source /shared/software/spack-1.2.0/share/spack/setup-env.csh
```

バッチジョブ内でソフトウェアを使う場合も、ジョブスクリプト内に同じ設定を入れてください。

### Spackが使えることを確認する { #verify-spack }

環境を読み込んだら、次を実行します。

```bash
spack --version
which spack
```

`spack: command not found`と表示される場合は、[Spack環境を読み込む](#load-env)ができていません。同じシェルで、もう一度`setup-env.sh`を読み込んでください。

### 利用できるソフトウェアを確認する { #list-software }

システム側で明示的に提供されているビルド済みソフトウェアを確認します。

```bash
spack find -x
```

ハッシュ値も表示したい場合は、次を使います。

```bash
spack find -lx
```

よく使う確認コマンドは次のとおりです。

| コマンド | 目的 |
|---|---|
| `spack find -x` | 利用者が直接使うことを想定して提供されているパッケージだけを表示します。 |
| `spack find -lx` | `spack find -x`に加えて、短縮ハッシュ値を表示します。 |
| `spack find PACKAGE_NAME` | 指定した名前のインストール済みパッケージを検索します。 |
| `spack find -lv PACKAGE_NAME` | 指定したパッケージの詳細情報とハッシュ値を表示します。 |
| `spack find --loaded` | 現在のシェルにロードされているパッケージを表示します。 |

`-x`を外して`spack find`を実行すると、依存関係として入っているパッケージも含めて表示されます。通常の利用では、まず`spack find -x`を使ってください。

### ソフトウェアをロードする { #load-software }

例として`cp2k`を使う場合は、次を実行します。

```bash
spack load cp2k
```

ロードすると、`PATH`などの環境変数が設定され、そのシェルまたはジョブの中でアプリケーションを実行できるようになります。

実行ファイルが見えるか確認します。

```bash
which COMMAND
```

アプリケーションによっては、パッケージ名と実行コマンド名が異なります。
たとえばQuantum ESPRESSOでは`pw.x`など、アプリケーション固有のコマンドを使います。
実行コマンドが分からない場合は、アプリケーションの公式マニュアルまたはシステム管理者の案内を確認してください。

現在ロードされているパッケージは、次で確認できます。

```bash
spack find --loaded
```

### 使い終わったらアンロードする { #unload-software }

利用後に現在のシェルから外す場合は、次を実行します。

```bash
spack unload cp2k
```

別のビルド条件の同名パッケージを試す場合は、古いパッケージをアンロードしてから新しいパッケージをロードしてください。

## バッチジョブでの利用 { #batch-jobs }

ログインノードでは重い計算を実行しないでください。実計算は、バッチジョブまたは会話型ジョブで計算ノード上で実行してください。

### GPUジョブの基本形 { #gpu-job }

GPU対応ソフトウェアを使う場合は、SpackでソフトウェアをロードするだけではGPUは割り当てられません。Slurmのジョブ指定でGPU資源を要求してください。

```bash
#!/bin/bash
#SBATCH --job-name=gpu-app-test # ジョブ名
#SBATCH --time=00:10:00         # 時間指定
#SBATCH --gpus=8                # GPU数
#SBATCH --ntasks=8              # プロセス数

. /shared/software/spack-1.2.0/share/spack/setup-env.sh
spack load PACKAGE_NAME

# GPUが割り当てられているか確認する例
srun nvidia-smi
srun bash -c 'echo CUDA_VISIBLE_DEVICES=$CUDA_VISIBLE_DEVICES'

srun COMMAND INPUT_FILE
```

### GPU対応として提供されている主なソフトウェア { #gpu-software }

現在、次のソフトウェアがGPU対応版として提供されています。

- `petsc`
- `lammps`
- `quantum-espresso`
- `gromacs`
- `kokkos`

提供内容は更新されることがあります。最新の一覧は次で確認してください。

```bash
spack find -x
```

### Quantum ESPRESSOのジョブスクリプト例 { #quantum-espresso }

次は`quantum-espresso`を利用する例です。

```bash
#!/bin/bash
#SBATCH --job-name=qe-test # ジョブ名
#SBATCH --time=00:30:00	   # 時間指定
#SBATCH --gpus=8      	   # GPU数
#SBATCH --ntasks=8         # プロセス数

. /shared/software/spack-1.2.0/share/spack/setup-env.sh
spack load quantum-espresso

srun pw.x -in qe.in
```

`qe.in`はQuantum ESPRESSOの入力ファイルです。実際の計算では、入力ファイルと必要な擬ポテンシャルファイル（UPF形式）を事前に準備してください。

## hpcx-mpiを使用する場合 { #hpcx-mpi }

本システムではNVIDIA HPC-X MPIを利用できます。HPC-X MPIはOpen MPIをベースとしたMPI実装で、UCXなどの通信ライブラリを利用します。

ただし、パブリック・インスタンスで提供されるすべてのMPIアプリケーションが`hpcx-mpi`対応版としてビルドされているわけではありません。MPI実行前に、対象アプリケーションが`hpcx-mpi`対応構成でビルドされていることを確認してください。

### hpcx-mpi対応構成として提供されている主なパッケージ { #hpcx-mpi-packages }

現在、次のアプリケーションおよびライブラリが`hpcx-mpi`対応構成として提供されています。

- `quantum-espresso`
- `gromacs`

### hpcx-mpi対応か確認する { #check-hpcx-mpi }

まず、対象パッケージのハッシュ値を確認します。

```bash
spack find -lv PACKAGE_NAME
```

例：

```bash
spack find -lv quantum-espresso
```

ハッシュ値が分かったら、そのハッシュを使ってビルド構成を確認します。

```bash
spack spec /HASH
```

依存関係ツリー内に次の表示があれば、その構成は`hpcx-mpi`を利用しています。

```bash
^hpcx-mpi
```

同名パッケージが複数ある場合、`spack spec quantum-espresso`のようにパッケージ名だけで確認すると、意図したインストール済みパッケージとは異なる構成が表示される可能性があります。`spack find -lv PACKAGE_NAME`でハッシュ値を確認し、`spack spec /HASH`で確認する方法を推奨します。

### MPI実行時の考え方 { #mpi-runtime }

MPIアプリケーションは、ロードしたアプリケーションが想定するMPI実装と、実行時に使うMPI実装を合わせる必要があります。本システムのパブリック・インスタンスで提供されたMPIアプリケーションを使う場合は、原則として対象アプリケーションを`spack load`したうえで、Slurmの`srun`から実行してください。

```bash
. /shared/software/spack-1.2.0/share/spack/setup-env.sh
spack load PACKAGE_NAME
srun COMMAND INPUT_FILE
```

MPI通信エラーが発生した場合は、[トラブルシューティング](#troubleshooting)を確認してください。

## 提供ソフトウェアの探し方 { #find-software }

提供ソフトウェアは更新されることがあります。最新の一覧は、必ずシステム上で確認してください。

```bash
spack find -x
```

### 主な提供ソフトウェア { #main-software }

| 分野 | 主なパッケージ |
|---|---|
| 第一原理計算・量子化学 | `cp2k`, `quantum-espresso`, `cpmd`, `openmx`, `salmon-tddft` |
| 分子動力学 | `gromacs`, `lammps`, `genesis` |
| CAE・構造解析・流体解析 | `frontistr`, `openfoam`, `openfoam-org` |
| 気象・地球科学 | `wrf`, `scale` |
| 可視化・画像・動画処理 | `paraview`, `povray`, `gnuplot`, `grads`, `ffmpeg` |
| Python関連ライブラリ | `py-scipy`, `py-pandas`, `py-matplotlib`, `py-scikit-learn`, `py-netcdf4`, `py-mpi4py`, `py-ase`, `py-xarray`, `py-toml` |
| 化学・創薬関連 | `openbabel`, `autodock-vina` |
| 開発・その他 | `julia`, `rust`, `gsl`, `tmux`, `darshan-runtime`, `kokkos`, `petsc`, `parallel-netcdf`, `netcdf-c`, `netcdf-fortran` |

### `spack find -lx`の出力例 { #find-lx-output }

次は出力例です。ハッシュ値、バージョン、パッケージ数はシステム更新により変わります。

```bash
spack find -lx
```

出力例：

```text
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

## 同名パッケージが複数ある場合 { #duplicate-packages }

Spackでは、同じソフトウェアであっても、バージョン、コンパイラ、MPI、GPU対応の有無、依存関係などが異なる複数のビルドを同時に管理できます。そのため、同じパッケージ名が複数表示されることがあります。

### 典型的なエラー { #typical-error }

例えば、`fftw`が複数ビルドされている状態で次を実行するとします。

```bash
spack load fftw
```

候補が複数ある場合、次のようなエラーになります。

```bash
==> Error: fftw matches multiple packages.
  Matching packages:
    erk4i5v fftw@3.3.11 platform=linux os=ubuntu24.04 target=neoverse_v2 %c,fortran=gcc@13.3.0
    5rny4xu fftw@3.3.11 platform=linux os=ubuntu24.04 target=neoverse_v2 %c,fortran=gcc@13.3.0
    nkvjfgj fftw@3.3.11 platform=linux os=ubuntu24.04 target=neoverse_v2 %c,fortran=nvhpc@26.3
```

### 推奨: ハッシュ値で指定する { #specify-by-hash }

同名パッケージが複数ある場合は、まず短縮ハッシュ値を確認します。

```bash
spack find -lx fftw
```

その後、利用したいビルドの短縮ハッシュ値を使ってロードします。

```bash
spack load /5rny4xu
```

出力例の候補であれば、次のように指定できます。

```bash
spack load /erk4i5v
spack load /5rny4xu
spack load /nkvjfgj
```

ハッシュ値は環境更新により変わる可能性があります。説明書中のハッシュ値を固定値として覚えるのではなく、実行時に`spack find -lx PACKAGE_NAME`で確認してください。

### バージョンやコンパイラで指定する { #specify-by-version }

バージョン番号で指定することもできます。

```bash
spack load fftw@3.3.11
```

ただし、同じバージョンのビルドが複数ある場合は、これだけでは区別できません。その場合は、コンパイラを含めて指定します。

```bash
spack load fftw%gcc
spack load fftw%nvhpc
```

さらに詳細に指定する場合は、次のように書けます。

```bash
spack load fftw%gcc@13.3.0
spack load fftw%nvhpc@26.3
```

それでも候補が複数残る場合は、ハッシュ値での指定を使ってください。

## プライベート・インスタンスの利用 { #private-instance }

本節は、自分でOSSをビルドして利用する方向けです。パブリック・インスタンスで提供されるビルド済みソフトウェアだけを使う場合、本節の作業は不要です。

### プライベート・インスタンスが必要になる場合 { #when-private-instance }

次のような場合に、プライベート・インスタンスを使います。

- パブリック・インスタンスにないOSSを使いたい
- 提供されているものとは異なるバージョンを使いたい
- 独自のビルドオプション、依存関係、コンパイラ指定でビルドしたい
- 研究グループ内で独自のパッケージを管理したい

### Spackインスタンスを作成する { #create-instance }

次は、ホームディレクトリ配下に自分用のSpackインスタンスを作成する例です。

```bash
cd $HOME
git clone SPACK_REPO_URL spack
cd spack
git checkout BRANCH_NAME
```

利用するリポジトリURLとブランチ名は、管理者の案内に従ってください。

### プライベート・インスタンスの環境を読み込む { #load-private-env }

```bash
. $HOME/spack/share/spack/setup-env.sh
```

同じシェルでパブリック・インスタンスとプライベート・インスタンスの`setup-env.sh`を重ねて読み込むと、どちらのSpackを使っているか分かりにくくなります。プライベート・インスタンスを使う場合は、新しいシェルでプライベート側の`setup-env.sh`を読み込むことを推奨します。

### パブリック・インスタンスとのチェイニングを設定する { #chaining }

プライベート・インスタンスでは、Spackの`upstreams.yaml`を設定することで、パブリック・インスタンスにあるビルド済みパッケージを参照できます。これにより、依存関係を毎回ビルドする負荷を減らせます。

標準的な構成例は次のとおりです。

```bash
mkdir -p ~/.spack
cat > ~/.spack/upstreams.yaml <<'EOF'
upstreams:
  gb200-public:
    install_tree: /shared/software/spack-1.2.0/opt/spack
EOF
```

`install_tree`のパスは、実際のパブリック・インスタンスの設定に依存します。管理者から別のパスが案内されている場合は、そのパスを使用してください。

設定後、パブリック・インスタンス側のパッケージが見えるか確認します。

```bash
spack find -lx
```

### パッケージを検索する { #search-packages }

Spackで利用可能なパッケージ名を検索します。

```bash
spack list
spack list mpi
```

パッケージのバージョンやビルドオプションを確認します。

```bash
spack info openmpi
```

### パッケージをインストールする { #install-packages }

例として`openmpi`をインストールする場合は次を実行します。

```bash
spack install openmpi
```

バージョン指定も可能です。

```bash
spack install openmpi@4.1.1
```

インストール後は、次で確認できます。

```bash
spack find -lx openmpi
```

!!! note

    計算ノード向けパッケージのビルドは、会話型ジョブで計算ノードに入るか、インストール用ジョブを投入して実施してください。ログインノードで長時間のビルドを実行しないでください。

### パッケージをアンインストールする { #uninstall-packages }

```bash
spack uninstall openmpi
```

同名パッケージが複数存在する場合は、誤削除を防ぐため、ハッシュ値で対象を確認してから実行してください。

```bash
spack find -lx openmpi
spack uninstall /HASH
```

!!! note

    パブリック・インスタンス側のパッケージは削除しないでください。自分のプライベート・インスタンスでインストールしたパッケージだけを削除対象にしてください。

## ml-linux-aarch64 スタックの利用 { #ml-linux-aarch64 }

本システムでは、標準のソフトウェア群とは別に、Arm環境における機械学習・AI・データサイエンス分野のパッケージ群を統合的に検証・提供している `ml-linux-aarch64` スタック環境を利用できます。

### 専用環境の読み込み { #ml-linux-aarch64-load }

`ml-linux-aarch64` スタックを利用する場合は、通常のパブリック・インスタンスとは別の専用パスに用意された環境設定スクリプトを読み込んでください。

`bash`または`zsh`を使っている場合は、次を実行します。

```bash
. /shared/software/ml-linux-aarch64/env.sh
```

### 利用時の注意点 { #ml-linux-aarch64-notes }

- **シェルの分離:** 通常のパブリック・インスタンス用パスやプライベート・インスタンスのキャッシュ・設定と同時に読み込むと、 concretizer の依存関係解決や環境変数に競合が生じる原因になります。利用する際は、必ず新しく立ち上げたシェルで本環境のみを読み込んでください。
- **パッケージの確認:** 本スタックで提供されているパッケージの一覧やビルド済み構成は、環境をロードした状態で次を実行して確認してください。

```bash
spack find -lx
-- linux-ubuntu24.04-aarch64 / %c,cxx=clang@18.1.8 --------------
rvdltfy py-jaxlib@0.10.1  35firrg py-tensorflow@2.20.0

-- linux-ubuntu24.04-aarch64 / %c,cxx=gcc@13.3.0 ----------------
26dq6yh py-scikit-learn@1.9.0  dvrmjfz py-tensorflow-metadata@1.17.2  rujxraz py-torch@2.12.0  kjorvey py-torch-nvidia-apex@24.04.01  rcjt7fg py-torchaudio@2.11.0  62r7jr7 py-torchvision@0.27.0

-- linux-ubuntu24.04-aarch64 / %cxx=gcc@13.3.0 ------------------
vfsb26o py-transformers@4.57.0

-- linux-ubuntu24.04-aarch64 / no compilers ---------------------
5qmndhd py-botorch@0.8.4  2omptwj py-kornia@0.8.3                       yjzhzb4 py-tensorboard@2.20.0             nbebl2h py-timm@1.0.24            zmw5kt2 py-vector-quantize-pytorch@0.3.9
4z67epj py-gpytorch@1.13  2hcpwjx py-lightning@2.6.5                    jiiecon py-tensorboardx@2.6.2.2           aglujkh py-torch-geometric@2.5.3
gf4b375 py-jax@0.10.1     ucsotkz py-pytorch-lightning@2.6.1            j45akk5 py-tensorflow-datasets@4.4.0      stxjtil py-torchgeo@0.9.0
ootk7uq py-keras@3.14.1   7ce5zk3 py-segmentation-models-pytorch@0.5.0  vbl5kb5 py-tensorflow-probability@0.25.0  aowxp5a py-torchmetrics@1.9.0

-- linux-ubuntu24.04-neoverse_v2 / %c,cxx=gcc@13.3.0 ------------
b7qoi5i llvm@18.1.8
==> 27 installed packages
```

### アプリケーションの実行 { #ml-linux-aarch64-run }

環境設定スクリプトを読み込むと、必要なパッケージ群（Python等）へのパスが自動的に通るように構成されています。そのため、個別の `spack load` は不要です。

そのまま `srun` や `sbatch` 等のジョブ投入コマンドから実行してください。

**実行例:**
```bash
srun -p gpu -N1 -G 1 -t 00:10:00 python -c "import torch; print(torch.cuda.is_available())"
```

## トラブルシューティング { #troubleshooting }

| 症状 | 主な原因 | 対処 |
|---|---|---|
| `spack: command not found`と表示される | Spack環境を読み込んでいない | `. /shared/software/spack-1.2.0/share/spack/setup-env.sh`を実行します。ジョブ内でも同じ設定が必要です。 |
| `matches multiple packages`と表示される | 同名パッケージが複数ある | `spack find -lx PACKAGE_NAME`で候補を確認し、`spack load /HASH`でロードします。 |
| `spack load`後も実行コマンドが見つからない | 実行ファイル名がパッケージ名と異なる、またはライブラリパッケージである | アプリケーションの実行コマンド名を確認します。必要に応じて管理者に確認してください。 |
| MPIジョブが起動しない、または通信エラーになる | MPI実装やビルド構成が実行環境と合っていない | `spack find -lv PACKAGE_NAME`と`spack spec /HASH`で`hpcx-mpi`対応構成か確認します。 |
| プライベート・インスタンスでビルドが非常に遅い | 依存関係も一からビルドしている | パブリック・インスタンスとのチェイニングを設定し、既存のビルド済みパッケージを再利用します。 |
| ジョブスクリプトでは動かないが、ログインシェルでは動く | ジョブスクリプト内でSpack環境を読み込んでいない | ジョブスクリプトに`setup-env.sh`の読み込みと`spack load`を明示的に書きます。 |

### 問い合わせ前に確認する情報 { #before-contacting }

管理者へ問い合わせる場合は、可能であれば次の情報を添えてください。

```bash
hostname
date
echo $SHELL
which spack
spack --version
spack find --loaded
spack find -lx PACKAGE_NAME
```

ジョブで問題が出る場合は、ジョブID、ジョブスクリプト、標準出力、標準エラーも添えてください。

