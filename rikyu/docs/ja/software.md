# ソフトウェア環境

## Spackとは

- Spackは主にスーパーコンピュータ向けのパッケージ管理ツールです。詳細は公式ページ <https://spack.io/> をご覧ください。
- 理究ではSpackを用いてオープンソースソフトウェア（OSS）を管理、提供します。
- 利用頻度の高いOSSについては、システム側でSpackインスタンスを用意してビルド済みのOSSを提供します。この部分を「パブリック・インスタンス」と呼びます。
- 各ユーザがホームディレクトリ以下にSpackインスタンスを保持し、各自でOSSをビルドして利用することもできます。この部分を「プライベート・インスタンス」と呼びます。
- プライベート・インスタンスにおいても、「チェイニング」機能を利用することで、パブリック・インスタンスで提供されるビルド済みOSSを参照できます。この機能により、依存関係のために多数のOSSをビルドする負荷を軽減できます。

## パブリック・インスタンスの利用

システム側でビルド済みのOSSを利用する場合、環境を読み込むだけで利用できます。

### 環境の読み込み

コマンドラインで以下を実行するとSpackが利用可能になります。

`bash` の場合：

```bash
$ . /shared/software/spack/share/spack/setup-env.sh
```

バッチ型ジョブで利用する場合は、ジョブスクリプトにも同様の記述を追加してください。

### ビルド済みパッケージの確認

コマンドラインで

```bash
$ spack find -x
```

を実行すると、利用可能なOSSの一覧を確認できます。

以下は2026-07-06時点の例です。

```bash
spack find -x
-- linux-ubuntu24.04-neoverse_v2 / %c,cxx,fortran=gcc@13.3.0 --
cp2k@2026.1            frontistr@5.3   petsc@3.25.2
darshan-runtime@3.5.0  julia@1.12.6    py-scipy@1.17.1
darshan-runtime@3.5.0  paraview@6.1.1

-- linux-ubuntu24.04-neoverse_v2 / %c,cxx,fortran=nvhpc@26.3 --
quantum-espresso@7.5

-- linux-ubuntu24.04-neoverse_v2 / %c,cxx=gcc@13.3.0 ----------
ffmpeg@8.1       openbabel@3.2.0       py-mpi4py@4.1.1
gnuplot@6.0.0    openfoam@2512         py-pandas@3.0.3
grads@2.2.3      openfoam-org@12       py-scikit-learn@1.9.0
gromacs@2026.1   openfoam-org@12       rust@1.96.0
gromacs@2026.1   povray@3.7.0.10
lammps@20260211  py-matplotlib@3.11.0

-- linux-ubuntu24.04-neoverse_v2 / %c,fortran=gcc@13.3.0 ------
cpmd@4.3       openmx@3.9          scale@5.4.4
genesis@1.6.0  salmon-tddft@2.0.0  wrf@4.7.1

-- linux-ubuntu24.04-neoverse_v2 / %c=gcc@13.3.0 --------------
gsl@2.8  py-netcdf4@1.7.2  tmux@3.6a

-- linux-ubuntu24.04-neoverse_v2 / %cxx=gcc@13.3.0 ------------
autodock-vina@1.2.6

-- linux-ubuntu24.04-neoverse_v2 / no compilers ---------------
py-ase@3.28.0  py-toml@0.10.2  py-xarray@2026.4.0

==> 38 installed packages
```

同一名称のパッケージが複数表示される場合があります。これは依存関係やビルド条件の違いによるものであり、詳細は後述の「同一名複数パッケージの区別」を参照してください。

ここでは `-x` オプションにより、明示的にインストールされたパッケージのみを表示しています。実際にはこれらが依存する多数のパッケージもインストールされています。

## プライベート・インスタンスの利用

> **注意**
>
> 以降の内容は、自身でOSSをビルドして利用するユーザ向けです。
>
> パブリック・インスタンスで提供されるビルド済みOSSのみを利用する場合、この作業は不要です。

各ユーザはホームディレクトリ以下などにSpackインスタンスを作成し、独自にOSSをビルドして利用できます。

### Spackインスタンスの作成

以下はSpackインスタンス作成の一例です。

```bash
$ cd <インストール先ディレクトリ>
$ git clone <SpackリポジトリURL>
$ cd spack
$ git checkout <ブランチ名>
```

利用するリポジトリおよびブランチは、システム管理者の案内に従ってください。

### プライベート・インスタンスの環境読み込み

プライベート・インスタンスを利用する場合は、自身がインストールしたSpackインスタンスの環境を読み込みます。

```bash
$ . <spack-root>/share/spack/setup-env.sh
```

バッチ型ジョブで利用する場合は、ジョブスクリプトにも同様の記述を追加してください。

### パブリック・インスタンスとのチェイニング

Spackのチェイニング機能を利用することで、パブリック・インスタンスで提供されるビルド済みパッケージをプライベート・インスタンスから利用できます。

設定方法はシステム管理者の案内に従ってください。

設定後は以下のコマンドで認識状況を確認できます。

```bash
$ spack compilers
```

また、パブリック・インスタンスで提供されているパッケージが参照できることを確認するには、以下のコマンドを実行してください。

```bash
$ spack find
```

### 追加リポジトリの登録

必要に応じて追加のパッケージリポジトリを登録できます。

```bash
$ spack repo add <リポジトリパス>
```

登録済みリポジトリは以下で確認できます。

```bash
$ spack repo list
```

### パッケージの検索

利用可能なパッケージは以下のコマンドで検索できます。

```bash
$ spack list
```

パッケージ名の一部を指定して検索することもできます。

```bash
$ spack list mpi
```

### パッケージ情報の確認

利用可能なバージョンやビルドオプションは以下で確認できます。

```bash
$ spack info openmpi
```

### パッケージのインストール

プライベート・インスタンスでは独自にパッケージをインストールできます。

```bash
$ spack install openmpi
```

バージョン指定も可能です。

```bash
$ spack install openmpi@4.1.1
```

> **注意**
>
> 計算ノード向けパッケージのビルドは、会話型ジョブで計算ノードへログインするか、インストール用ジョブを投入して実施してください。

### パッケージのアンインストール

インストール済みパッケージは以下のコマンドで削除できます。

```bash
$ spack uninstall openmpi
```

同一名のパッケージが複数存在する場合の指定方法については、「同一名複数パッケージの区別」を参照してください。

## OSSのロード

例えば `cp2k` を利用可能にしたい場合は、

```bash
$ spack load cp2k
```

を実行します。

必要な環境変数（`PATH` など）が設定され、アプリケーションを利用できるようになります。

利用後にアンロードする場合は、

```bash
$ spack unload cp2k
```

でアンロードできます。

### 現在GPU対応しているアプリケーション

現在、以下のアプリケーションがGPUに対応しています。

- petsc
- lammps
- quantum-espresso
- gromacs

## hpcx-mpiを使用する場合の注意点

本システムでは NVIDIA HPC-X MPI を利用できます。

HPC-X MPI は Open MPI をベースとした高性能MPI実装であり、UCXなどの高速通信ライブラリを利用することで高い並列性能を実現しています。

ただし、パブリック・インスタンスで提供されるすべてのMPIアプリケーションが hpcx-mpi に対応しているわけではありません。MPI実行前に、対象アプリケーションが hpcx-mpi 対応版としてビルドされていることを確認してください。

### hpcx-mpi対応アプリケーションの確認

現在、以下のアプリケーションが hpcx-mpi に対応しています。

- quantum-espresso
- gromacs
- openfoam-org
- darshan-runtime
- scotch
- fftw
- hdf5
- nvpl-scalapack

インストール済みパッケージの詳細情報は以下のコマンドで確認できます。

```bash
$ spack find -lv <パッケージ名>
```

例えば Quantum ESPRESSO の場合：

```bash
$ spack find -lv quantum-espresso
```

あるいはビルド構成（spec）を確認します。

```bash
$ spack spec quantum-espresso
```

依存関係ツリー内に

```text
^hpcx-mpi
```

が表示されている場合、そのアプリケーションは hpcx-mpi を利用する構成でビルドされています。

また、インストール済みパッケージのハッシュ値が分かっている場合は、

```bash
$ spack spec /<hash>
```

でも確認できます。

### 実行時の注意

本システムで hpcx-mpi を利用する場合は、スクリプト内で対象アプリケーションをロードした上で実行することを推奨します。

Quantum ESPRESSO のジョブスクリプト例：

```bash
#!/bin/bash
#SBATCH --nodes=2
#SBATCH --ntasks-per-node=8

. /shared/software/spack/share/spack/setup-env.sh

spack load quantum-espresso

srun pw.x -in qe.in

```
※ `qe.in` は Quantum ESPRESSO の入力ファイルです。
※ 実際の計算を行うには、入力ファイルおよび必要な擬ポテンシャルファイル（UPF形式）を事前に準備してください。

## 同一名複数パッケージの区別

複数のバージョンが同時にインストールされている場合や、同一バージョンであってもログインノード向けと計算ノード向けで異なるビルドがインストールされている場合があります。

そのような場合、パッケージ名だけを指定して `spack load` を実行すると、Spackがどのパッケージをロードするべきか判断できず、エラーになります。

例えば、

```bash
$ spack load fftw
```

を実行すると、

```text
==> Error: fftw matches multiple packages.
  Matching packages:
    5rny4xu fftw@3.3.11 platform=linux os=ubuntu24.04 target=neoverse_v2 %c,fortran=gcc@13.3.0
    ftaxup7 fftw@3.3.11 platform=linux os=ubuntu24.04 target=neoverse_v2 %c,fortran=gcc@13.3.0
    nkvjfgj fftw@3.3.11 platform=linux os=ubuntu24.04 target=neoverse_v2 %c,fortran=gcc@13.3.0
  Use a more specific spec (e.g., prepend '/' to the hash).
```

のようなエラーになります。

同様の情報は、

```bash
$ spack find -lv fftw
```

でも確認できます。

### ハッシュ値での指定

Spackではパッケージのビルド条件を含む `spec` に対して一意のハッシュ値が割り当てられます。

以下のように短縮ハッシュ値を用いて指定できます。

```bash
$ spack load /5rny4xu
$ spack load /ftaxup7
$ spack load /nkvjfgj
```

パブリック・インスタンスで明示的に提供されているパッケージは、

```bash
$ spack find -lx
```

で確認できます。

同名パッケージが複数存在する場合は、通常は `spack find -lx` に表示されるパッケージを利用してください。

- `-l` : 7文字の短縮ハッシュ値を表示
- `-x` : 明示的（explicit）にインストールされたパッケージのみ表示

### バージョン番号での指定

パッケージ名の後ろに `@` を付けてバージョン番号を指定できます。

```bash
$ spack load fftw@3.3.11
```

ただし、この例では複数の候補が存在するため同様のエラーになります。

コンパイラを指定して区別することもできます。

```bash
$ spack load fftw%gcc
$ spack load fftw%nvhpc
```

さらに詳細に指定する場合は、

```bash
$ spack load fftw%gcc@13.3.0
$ spack load fftw%nvhpc@26.3
```

のような記述も可能です。

---

# 付録A：提供ソフトウェア一覧

以下は2026-07-06時点でパブリック・インスタンスから提供している主要ソフトウェアです。

## 第一原理計算・量子化学

- cp2k
- quantum-espresso
- cpmd
- openmx
- salmon-tddft

## 分子動力学

- gromacs
- lammps
- genesis

## CAE・構造解析・流体解析

- frontistr
- openfoam
- openfoam-org

## 気象・地球科学

- wrf
- scale

## 可視化・画像・動画処理

- paraview
- povray
- gnuplot
- grads
- ffmpeg

## Python関連ライブラリ

- py-scipy
- py-pandas
- py-matplotlib
- py-scikit-learn
- py-netcdf4
- py-mpi4py
- py-ase
- py-xarray
- py-toml

## 化学・創薬関連

- openbabel
- autodock-vina

## 開発・その他

- julia
- rust
- gsl
- tmux
- darshan-runtime

## 最新の提供ソフトウェア一覧の確認

提供ソフトウェアは随時更新される場合があります。

最新の一覧は以下のコマンドで確認してください。

```bash
$ spack find -x
```
