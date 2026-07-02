# ソフトウェア環境

# Spackとは

- Spackは主にスーパーコンピュータ向けのパッケージ管理ツールです。詳細は公式ページ [https://spack.io/](https://spack.io/) をご覧ください。
- スーパーコンピュータ「理究」ではSpackを用いてオープンソースソフトウェア（OSS）を管理、提供します。
- 利用頻度の高いOSSについては、システム側でSpackインスタンスを用意してビルド済みのOSSを提供します。この部分を「パブリック・インスタンス」と呼びます。
- 各ユーザがホームディレクトリ以下にSpackインスタンスを保持し各自でOSSをビルドして利用することもできます。この部分を「プライベート・インスタンス」と呼びます。
- プライベート・インスタンスを利用の際にも、「チェイニング」の機能を用いることでパブリック・インスタンスで提供されるビルド済みOSSを参照・利用可能です。この機能を用いることで、依存関係のために多数のOSSをビルドする負荷を軽減することができます。

## パブリック・インスタンスの利用

システム側でビルド済みのOSSを利用する場合、環境の読み込みのみで利用可能です。

!!! note
    ジョブでパブリック・インスタンスを利用する場合には、環境変数 `PJM_LLIO_GFSCACHE` に `/vol0004` を指定する必要があります。詳しくは、「利用手引書 －利用およびジョブ実行編－」の「[8.8. 利用ファイルシステム(volume)の選択](https://www.fugaku.r-ccs.riken.jp/doc_root/ja/user_guides/use_latest/LayeredStorageAndLLIO/SelectAvailableVolumes.html)」をご参照ください。

<a id="setup"></a>

### 環境の読み込み

コマンドラインで以下のようにすることでSpackが利用可能になります。
`bash` の場合：

```bash
$ . /vol0004/apps/oss/spack/share/spack/setup-env.sh
```


バッチ型ジョブで利用する場合はジョブスクリプトにも同様の記述をしてください。


### ビルド済みパッケージの確認

コマンドラインで

```bash
$ spack find -x
```

とすることで利用可能なOSSの一覧が得られます。2025-10-17現在では以下のようになっています：

```bash
login4$ spack find -x

-- linux-ubuntu24.04-neoverse_v2 / %c,cxx,fortran=gcc@13.3.0 ----
cp2k@2026.1  darshan-runtime@3.5.0  darshan-runtime@3.5.0  frontistr@5.3  julia@1.12.6  paraview@6.1.1  petsc@3.25.2  py-scipy@1.17.1

-- linux-ubuntu24.04-neoverse_v2 / %c,cxx,fortran=nvhpc@26.3 ----
quantum-espresso@7.5

-- linux-ubuntu24.04-neoverse_v2 / %c,cxx=gcc@13.3.0 ------------
ffmpeg@8.1     grads@2.2.3     gromacs@2026.1   openbabel@3.2.0  openfoam-org@12  povray@3.7.0.10       py-mpi4py@4.1.1  py-scikit-learn@1.9.0
gnuplot@6.0.0  gromacs@2026.1  lammps@20260211  openfoam@2512    openfoam-org@12  py-matplotlib@3.11.0  py-pandas@3.0.3  rust@1.96.0

-- linux-ubuntu24.04-neoverse_v2 / %c,fortran=gcc@13.3.0 --------
cpmd@4.3  genesis@1.6.0  openmx@3.9  salmon-tddft@2.0.0  scale@5.4.4  wrf@4.7.1

-- linux-ubuntu24.04-neoverse_v2 / %c=gcc@13.3.0 ----------------
gsl@2.8  py-netcdf4@1.7.2  tmux@3.6a

-- linux-ubuntu24.04-neoverse_v2 / %cxx=gcc@13.3.0 --------------
autodock-vina@1.2.6

-- linux-ubuntu24.04-neoverse_v2 / no compilers -----------------
py-ase@3.28.0  py-toml@0.10.2  py-xarray@2026.4.0
==> 38 installed packages
```

ここでは `-x` オプションにより明示的にインストールされたパッケージのみを表示していますが、実際にはこれらが依存する多数のパッケージもインストールされています。
`linux-rhel8-cascadelake` または `linux-rhel8-skylake_avx512` がログインノード用、`linux-rhel8-a64fx` が計算ノード用にビルドされたOSSであることを示しています。

### OSSのロード

例えばtmuxを利用可能にしたい場合：

```bash
$ spack load tmux
```

とすることで、必要な設定（環境変数 `PATH` など）が行われて利用可能になります。

同様に

```bash
$ spack unload tmux
```

でアンロードできます。

!!! note
    以下のように、`module` コマンドを利用してOSSをロード、アンロードすることもできます。

    ```bash
    $ module load tmux
    $ module unload tmux
    ```

## プライベート・インスタンスの利用

**これ以降の内容は、自身でOSSをビルドするユーザにのみ必要とされる作業であり、システム側で提供するビルド済みOSSを利用するだけのユーザは行う必要がありません。**

各々のユーザのホームディレクトリ等にSpackインスタンスを保持し、ユーザがOSSをビルドして利用することができます。

### リポジトリのクローン

簡単のため `$TMPDIR` へインストールする方法を説明しますが（環境変数 `TMPDIR` の設定については、[環境の読み込み](#setup) の章の注釈を参照）、インストール先のディレクトリは任意です。

```bash
$ cd $TMPDIR
$ git clone https://github.com/RIKEN-RCCS/spack.git
$ cd spack
$ git checkout fugaku-v1.0.1
```

クローンしてきた直後ではデフォルトのdevelopブランチですが、ここではfugaku-v1.0.1ブランチへと切り替えています。

### パブリック・インスタンス提供パッケージの利用

ログインノードで一度環境を読み込みます。

```bash
$ . $TMPDIR/spack/share/spack/setup-env.sh
```

Spackで提供される「チェイニング」の機能を用いることで、別のインスタンスにインストール済みのパッケージを利用することができます。ここで紹介する手順では、パブリック・インスタンスをアップストリームとして設定することで各々のプライベート・インスタンスから前者でインストール済みのパッケージを利用する設定を行います。この機能を利用するには、テキストファイル `~/.spack/upstreams.yaml` を以下の内容で作成してください：

```yaml
upstreams:
  spack-public-instance:
    install_tree: /vol0004/apps/oss/spack/opt/spack
```

この後

```bash
$ spack compilers
```

としたとき、

```bash
==> Available compilers
-- gcc ubuntu24.04-aarch64 --------------------------------------
[e]  gcc@13.3.0

-- llvm ubuntu24.04-aarch64 -------------------------------------
[+]  llvm@20.1.8  [+]  llvm@18.1.8

-- nvhpc ubuntu24.04-aarch64 ------------------------------------
[e]  nvhpc@26.3
```

のような出力があればコンパイラの設定は成功です。

さらに、

```bash
$ spack repo add /vol0004/apps/oss/spack/var/spack/fugaku-packages/repos/spack_repo/fugaku/local
$ spack repo add /vol0004/apps/oss/spack/var/spack/fugaku-packages/repos/spack_repo/fugaku/update
$ spack repo add /vol0004/apps/oss/spack/var/spack/fugaku-packages/repos/spack_repo/fugaku/rist
$ spack repo add /vol0004/apps/oss/spack/var/spack/fugaku-packages/repos/spack_repo/fugaku/rccs
```

として、ローカル・リポジトリを追加しておきます。

設定が完了したら、

```bash
$ spack find
```

としてパブリック・インスタンス提供のパッケージが見えることを確認してください。

### パッケージのインストールと管理

```bash
$ spack list
```

とすることで入手可能な全てのパッケージが表示されます。このままでは7000以上のパッケージが表示されてしまいますが、文字列による絞り込みができます（大文字小文字は区別しない）。例えば、

```bash
$ spack list mpi
```

とすると、

```bash
armcimpi                        mpi-sync-clocks  mpix-launch-swift               py-mpi4py
compiler-wrapper                mpi-test-suite   msmpi                           py-pytest-mpi
compiz                          mpibenchmark     openmpi                         py-tempita
cray-mpich                      mpibind          pbmpi                           r-rmpi
exempi                          mpich            pdiplugin-mpi                   rempi
fujitsu-mpi                     mpidiff          perl-apache-logformat-compiler  rkt-compiler-lib
hpcx-mpi                        mpifileutils     perl-params-validationcompiler  spectrum-mpi
intel-mpi-benchmarks            mpigraph         perl-posix-strftime-compiler    spiral-package-mpi
intel-oneapi-compilers          mpilander        phylobayesmpi                   sst-dumpi
intel-oneapi-compilers-classic  mpileaks         pnmpi                           tiny-tensor-compiler
intel-oneapi-mpi                mpip             py-dask-mpi                     umpire
mpi-bash                        mpir             py-fluidfft-fftwmpi             vampirtrace
mpi-rockstar                    mpitrampoline    py-fluidfft-mpi-with-fftw       wi4mpi
mpi-serial                      mpiwrapper       py-mpi4jax
==> 55 packages
```

のような出力が得られます。ここから例えば `openmpi` をインストールするには、

```bash
$ spack install openmpi
```

とします。ここで `openmpi@4.1.1` のようにバージョンを明記することもできます。利用可能なバージョンやバリアント（ここでは説明は割愛します）を調べるには、

```bash
$ spack info openmpi
```

としてください。

!!! note
    計算ノード用にパッケージをインストールするには会話型ジョブで計算ノードにログインして作業を行うか、インストール用のジョブスクリプトを投入する必要があります。

同様にアンインストールは

```bash
$ spack uninstall openmpi
```

同一名のパッケージが複数存在する場合、Spackがパッケージを解決できずにエラーとなります。このエラーを避けるには [同一名複数パッケージの区別](#sec-multiple-package) を参照してください。

<a id="sec-multiple-package"></a>

### 同一名複数パッケージの区別

しばしばひとつのインスタンス内もしくはチェイニングされたインスタンス間で同一名のパッケージが存在することがあります。複数のバージョンが同時にインストールされている場合、あるいは同一バージョンであってもログインノード向けのビルドと計算ノード向けのビルドがインストールされているケースがなどが考えられます。そのような場合、パッケージ名だけを指定して `spack load` を実行するだけでは、Spackはどのパッケージをロードするべきかを決められないため、エラーになります。

例えばパブリック・インスタンスで

```bash
$ spack load screen
```

とすると

```bash
==> Error: screen matches multiple packages.
  Matching packages:
    e754igt screen@4.9.1 arch=linux-rhel8-a64fx %fj@4.12.0
    rkrpm6l screen@4.9.1 arch=linux-rhel8-cascadelake %gcc@15.1.0
  Use a more specific spec (e.g., prepend '/' to the hash).
```

のようなエラーとなります。同様の情報は

```bash
spack find -lv screen
```

のようにしても得られます。以下、より詳細にパッケージ指定する方法をいくつか紹介していきます。

- **ハッシュ値での指定**：Spackではパッケージ名に詳細なビルド条件を付記した `spec` に対して一意にハッシュ値が定まるようになっています。`/`（スラッシュ）以降に短縮ハッシュ値の7文字を書くことで、明示的に指定することができます。これまでの例と同様に

  ```bash
  $ spack load /e754igt
  $ spack load /rkrpm6l
  ```

  のように指定できます。パブリック・インスタンスに同一名複数パッケージが存在する場合（例えば `fftw`、依存するパッケージの違いによっても同一名複数パッケージが発生する場合があります）は、

  ```bash
  $ spack find -lx
  ```

  で出てきたほうのパッケージをロードするようにしてください。（`-l` は7文字の短縮ハッシュ値を表示するオプション、`-x` はexplicitにインストールされたパッケージのみを表示するオプションです。）

- **バージョン番号での指定**：パッケージ名の後に `@`（アットマーク）を付け以降にバージョン番号を指定します。たとえば：

  ```bash
  $ spack load screen@4.9.1
  ```

  （ただし今回の例では同様のエラーとなります。）

  ```bash
  $ spack load screen%gcc
  $ spack load screen%fj
  ```

  のように区別が可能です。更に詳細に `screen%gcc@15.1.0` や `screen%fj@4.12.0` のような記述も可能です。

- **アーキテクチャでの指定**：パッケージ名の後に `arch=` でビルド時のターゲットアーキテクチャを指定できます。ログインノードと計算ノードに対してそれぞれ

  ```bash
  $ spack load screen arch=linux-rhel8-cascadelake
  $ spack load screen arch=linux-rhel8-a64fx
  ```

  のようになります。