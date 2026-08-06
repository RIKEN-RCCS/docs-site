# プログラムのコンパイル方法

## 概要

GCC および NVIDIA HPC SDK (NVHPC) によるプログラムのコンパイル方法について説明します。

## 利用可能なコンパイラ

### GCC（GNU Compiler Collection）

GCC は Linux 環境で広く利用されているオープンソースコンパイラです。C、C++、Fortran に対応しており、CPU 向けアプリケーション開発のコンパイラとして利用できます。一般的な数値計算プログラムやオープンソースソフトウェアのビルドでは GCC を使用します。また、OpenMP による共有メモリ並列化や、MPI 環境と組み合わせた CPU 並列プログラム開発にも利用できます。

利用できるコンパイラ：

| 言語 | コマンド |
|------|---------|
| C | `gcc` |
| C++ | `g++` |
| Fortran | `gfortran` |

バージョン確認：

```bash
gcc --version
g++ --version
gfortran --version
```

### NVIDIA HPC SDK (NVHPC)

NVHPC は NVIDIA が提供する高性能計算向けのコンパイラおよび関連ツール群です。OpenACC や CUDA による GPU プログラミング、および GPU ライブラリを利用したアプリケーション開発に使用します。

利用できるコンパイラ：

| 言語 | コマンド |
|------|---------|
| C | `nvc` |
| C++ | `nvc++` |
| Fortran | `nvfortran` |

バージョン確認：

```bash
module load nvhpc
nvc --version
nvc++ --version
nvfortran --version
```

## コンパイル

コンパイルとは、ソースコードから実行可能なプログラムを生成する処理です。基本的な開発手順は次のとおりです。

1. ソースコードを作成する
2. コンパイラを実行する
3. エラーや警告を確認する
4. 実行ファイルを生成する
5. 実行結果を確認する

### GCC によるコンパイル

#### C 言語

```bash
gcc sample.c -o sample
```

#### C++

C++ ではコンパイラやライブラリのバージョンによりデフォルトの言語規格が異なる場合があります。移植性を高めるため、`-std` オプションで使用する言語規格を明示することを推奨します。

```bash
g++ -std=c++17 sample.cpp -o sample
```

#### Fortran

C++ と同様に、`-std` オプションで使用する言語規格を明示することを推奨します。

```bash
gfortran -std=f2008 sample.f90 -o sample
```

### NVHPC によるコンパイル

NVHPC を使用するには、事前に `module load nvhpc` コマンドで環境を設定してください。

#### C 言語

```bash
module load nvhpc
nvc sample.c -o sample
```

#### C++

```bash
module load nvhpc
nvc++ sample.cpp -o sample
```

#### Fortran

```bash
module load nvhpc
nvfortran sample.f90 -o sample
```

### 基本的なコンパイルオプション

#### 出力ファイルの指定

`-o` オプションで出力ファイル名を指定します。`-o` オプションを省略した場合、実行ファイル名は `a.out` になります。

```bash
gcc sample.c -o myprogram
```

#### インクルードパスの指定

利用するライブラリのヘッダファイルが標準パス外に配置されている場合は、`-I` オプションで検索先ディレクトリを追加してください。

```bash
gcc -I/path/to/include1 -I/path/to/include2 sample.c -o sample
```

#### ライブラリのリンク

コンパイル処理とリンク処理は別工程です。コンパイルが成功しても、対応するライブラリがリンクされていない場合は `undefined reference` エラーが発生します。外部ライブラリをリンクする場合、`-L` オプションでライブラリディレクトリを、`-l` オプションでライブラリ名を指定します。

```bash
gcc sample.c -L/usr/local/lib -lmylib -o sample
```

## 最適化オプション

コンパイラの最適化レベルを指定することで、実行速度を改善できます。最適化オプションは、コンパイラがプログラムの実行効率を改善するために行う変換処理を制御します。

| オプション | 説明 | 用途 |
|---------|------|------|
| `-O0` | 最適化なし | デバッグ時。コンパイルが高速 |
| `-O1` | 基本的な最適化 | デバッグと実行速度のバランス |
| `-O2` | 標準最適化（**推奨**） | ほとんどの場合に適する |
| `-O3` | 高度な最適化 | 最大速度追求。コンパイル時間が長い |
| `-Ofast` | 最も積極的な最適化 | 最大速度追求。精度に注意 |

一般的な利用では `-O2` を推奨します。`-O3` や `-Ofast` は性能を重視する場合に利用します。

!!! note

    開発中はデバッグ情報 (`-g`) や警告表示 (`-Wall`) を有効にし、問題がないことを確認してから最適化オプションを適用することを推奨します。`-g` オプションはデバッグ情報を埋め込み、gdb などのデバッガで解析を行う際に利用します。`-Wall` オプションは一般的な警告を有効化します。コンパイルが成功していても警告が表示される場合は、コードに問題が潜んでいる可能性があるため確認してください。

!!! note

    最適化レベルが高いほどデバッグが難しくなります。問題解析時は `-O0` または `-O1` の利用を推奨します。

!!! note

    `-O3` や `-Ofast` で最適化したプログラムは、特に浮動小数点計算において計算結果が変わる可能性があります。

## 並列化

### OpenMP による共有メモリ並列化

OpenMP はシングルノード内の複数 CPU コアを利用した共有メモリ並列化を実現します。

#### GCC

コンパイル時に `-fopenmp` オプションを指定します。実行時に使用するスレッド数を環境変数 `OMP_NUM_THREADS` で指定します。

```bash
gcc -fopenmp sample.c -o sample
export OMP_NUM_THREADS=4
./sample
```

#### NVHPC

コンパイル時に `-mp` オプションを使用します。実行時に使用するスレッド数を環境変数 `OMP_NUM_THREADS` で指定します。

```bash
module load nvhpc
nvc -mp sample.c -o sample
export OMP_NUM_THREADS=4
./sample
```

### MPI による分散メモリ並列化

MPI は複数の計算ノード間でのプロセス間通信を実現します。`module load nvhpc` により、NVHPC に同梱された Open MPI ベースの MPI 環境が利用可能になります。

MPI プログラムのコンパイルには、`gcc`、`g++`、`gfortran` や `nvc`、`nvc++`、`nvfortran` を直接使うのではなく、MPI 用のラッパーコンパイラである `mpicc`、`mpic++`、`mpifort` を利用します。これらのラッパーは、MPI ライブラリのインクルードパスとリンク指定を自動的に付与したうえで、内部で NVHPC のコンパイラ（`nvc` など）を呼び出します。

コンパイルした MPI プログラムを実行するには `mpirun` コマンドを使用します。`-np 4` は 4 プロセスで実行することを指定しています。

```bash
module load nvhpc
mpicc sample.c -o sample          # C 言語
mpic++ sample.cpp -o sample       # C++
mpifort sample.f90 -o sample      # Fortran
mpirun -np 4 ./sample
```

ラッパーコンパイラが内部で使用するコンパイラおよびオプションは、`--show` オプションで確認できます。

```bash
mpicc --show
mpic++ --show
mpifort --show
```

### MPI と OpenMP のハイブリッド並列化

複数ノードの複数 CPU コアを効率的に利用するため、MPI と OpenMP を組み合わせたハイブリッド並列化が有効です。ラッパーコンパイラは内部で NVHPC のコンパイラを呼び出すため、OpenMP を有効化するオプションは前述の NVHPC と同じ `-mp` を指定します。

```bash
module load nvhpc
mpicc -mp hybrid_sample.c -o hybrid_sample
export OMP_NUM_THREADS=2
mpirun -np 4 ./hybrid_sample
```

この例は 4 プロセスを起動し、各プロセスが 2 スレッドで実行される設定です。

## GPU 開発

### GPU 環境の確認

```bash
module load nvhpc
nvcc --version
nvidia-smi
nvidia-smi -L
nvidia-smi -q
```

| コマンド | 説明 |
|----------|------|
| `nvcc --version` | CUDA コンパイラのバージョンを表示します。 |
| `nvidia-smi` | GPU 使用率、メモリ使用量、ドライバ情報を表示します。 |
| `nvidia-smi -L` | システムで認識されている GPU 一覧を表示します。 |
| `nvidia-smi -q` | GPU の詳細情報（温度、クロック、ECC 状態など）を表示します。 |

### OpenACC による GPU プログラミング

OpenACC は、C/C++ および Fortran プログラムを GPU にオフロードするための指示文ベースのプログラミングモデルです。CUDA のように GPU 向けの処理やメモリ管理を明示的に実装する必要がなく、ソースコードへ指示文を追加することで GPU を利用できます。

OpenACC のメリットとして、次の点が挙げられます。

- 既存コードの GPU 化が容易
- ソースコードの修正量が少ない
- 学習コストが比較的低い

CUDA のメリットとして、次の点が挙げられます。

- GPU 固有機能を詳細に利用可能
- より細かな性能チューニングが可能

一方、CUDA は GPU 向けの処理を明示的に記述する必要があるため、実装や保守の負担は大きくなります。

性能チューニングや GPU 固有機能を最大限活用したい場合は CUDA の利用も選択肢となりますが、多くの科学技術計算コードでは OpenACC による GPU 化から検討することを推奨します。

### OpenACC のコンパイル

OpenACC を利用する場合は `-acc` オプションを指定します。

#### C 言語

```bash
module load nvhpc
nvc -acc sample.c -o sample
```

#### C++

```bash
module load nvhpc
nvc++ -acc sample.cpp -o sample
```

#### Fortran

```bash
module load nvhpc
nvfortran -acc sample.f90 -o sample
```

`-Minfo=accel` オプションにより、OpenACC コンパイル時に GPU 化された処理内容を確認できます。

```bash
nvc -acc -Minfo=accel sample.c -o sample
```

出力例：

```text
main:
      4, Generating implicit firstprivate(n,i)
         Generating NVIDIA GPU code
          6, #pragma acc loop gang, vector(128) /* blockIdx.x threadIdx.x */
      4, Generating implicit copyin(a[:1000]) [if not already present]
         Generating implicit copyout(c[:1000]) [if not already present]
         Generating implicit copyin(b[:1000]) [if not already present]
```

### MPI と OpenACC の併用

MPI と OpenACC を組み合わせることで、複数ノード・複数 GPU を利用した並列計算を実行できます。MPI はノード間の通信を担当し、OpenACC は各 MPI プロセスに割り当てられた GPU 上で計算処理を実行します。

#### C 言語

```bash
module load nvhpc
mpicc -acc sample.c -o sample
mpirun -np 4 ./sample
```

#### C++

```bash
module load nvhpc
mpic++ -acc sample.cpp -o sample
mpirun -np 4 ./sample
```

#### Fortran

```bash
module load nvhpc
mpifort -acc sample.f90 -o sample
mpirun -np 4 ./sample
```

!!! note

    MPI プロセスと GPU を組み合わせて利用するアプリケーションでは、1 GPU に対して 1 MPI プロセスを割り当てる構成がよく利用されます。

### CUDA によるコンパイル

CUDA 関連機能を利用する場合は、CUDA コンパイラおよびライブラリの利用が必要です。NVHPC では `-cuda` オプションを指定することで CUDA 機能を有効化できます。

#### C 言語

```bash
module load nvhpc
nvc -cuda sample.c -o sample
```

#### C++

```bash
module load nvhpc
nvc++ -cuda sample.cpp -o sample
```

#### Fortran

```bash
module load nvhpc
nvfortran -cuda sample.f90 -o sample
```

#### Compute Capability の指定

生成する GPU コードの世代は `-gpu=ccXX` オプションで指定します。本システムに搭載されている GPU は NVIDIA GB200（Grace-Blackwell）で、Compute Capability は 10.0 です。したがって指定する値は `cc100` になります。

```bash
nvc -cuda -gpu=cc100 sample.c -o sample
```

`-gpu` オプションを省略した場合は、コンパイルを実行したノードの GPU に合わせたコードが生成されます。本システムではログインノードと計算ノードのいずれも GB200 を搭載しているため、通常は省略しても `cc100` 向けのコードが生成されます。

搭載 GPU の Compute Capability は `nvaccelinfo` コマンドの `Default Target` 欄で確認できます。

```bash
module load nvhpc
nvaccelinfo | grep "Default Target"
```

!!! note

    Compute Capability は GPU 世代に依存する値です。本システム以外の環境向けにビルドする場合は、対象環境の値を `-gpu=ccXX` で明示的に指定してください。詳細は NVIDIA HPC SDK のドキュメントを参照してください。

### MPI と CUDA の併用

MPI と CUDA を組み合わせることで、複数ノード・複数 GPU を利用した大規模並列計算を実行できます。ラッパーコンパイラに対しても `-cuda` オプションを指定します。

#### C 言語

```bash
module load nvhpc
mpicc -cuda sample.c -o sample
mpirun -np 4 ./sample
```

#### C++

```bash
module load nvhpc
mpic++ -cuda sample.cpp -o sample
mpirun -np 4 ./sample
```

#### Fortran

```bash
module load nvhpc
mpifort -cuda sample.f90 -o sample
mpirun -np 4 ./sample
```

!!! note

    MPI プロセスと GPU を組み合わせて利用するアプリケーションでは、1 GPU に対して 1 MPI プロセスを割り当てる構成がよく利用されます。

### GPU ライブラリの利用

NVHPC には GPU 向けの高性能ライブラリが統合されています。

| ライブラリ | 説明 |
|-----------|------|
| cuBLAS | 基本的な線形代数演算 |
| cuFFT | 高速フーリエ変換 |
| cuSPARSE | 疎行列演算 |

CUDA コンパイル時にライブラリをリンクする例は次のとおりです。

```bash
module load nvhpc
nvc -cuda -lcublas sample.c -o sample
```

## トラブルシューティング

### nvc が見つからない

**現象：** `nvc: command not found`

**原因：** NVHPC のモジュールが読み込まれていません。

**解決方法：**

```bash
module load nvhpc
which nvc
```

`module load` で環境変数が設定されることを確認してください。

### 数学関数のリンクエラー

**現象：** `undefined reference to 'pow'`

**原因：** 数学ライブラリがリンクされていません。

**解決方法：**

```bash
gcc sample.c -lm -o sample
```

`-lm` オプションで数学ライブラリを明示的にリンクしてください。

### 外部ライブラリのリンクエラー

**現象：** `undefined reference to 'myfunction'`

**原因：** 外部ライブラリがリンクされていない、またはライブラリの探索パスが指定されていません。

**解決方法：**

```bash
gcc sample.c -L/usr/local/lib -lmylib -o sample
```

`-L` オプションでライブラリディレクトリを、`-l` オプションでライブラリ名を指定してください。

## 環境変数設定

`configure` や `make` を使うビルドでは、使用するコンパイラやオプションを環境変数から取得します。あらかじめ設定しておくと、ビルドのたびにコンパイラを指定する必要がなくなります。

| 環境変数 | 用途 |
|---------|------|
| `CC` | C コンパイラ |
| `CXX` | C++ コンパイラ |
| `FC` | Fortran コンパイラ |
| `CFLAGS` | C コンパイル時のオプション |

これらを `.bashrc` や `.bash_profile` に記述しておくと、新しいシェルセッションで自動的に設定されます。

```bash
# ~/.bashrc に追記
export CC=gcc
export CXX=g++
export FC=gfortran
export CFLAGS="-O2 -Wall"
```

NVHPC を使用する場合は、次のように設定します。

```bash
module load nvhpc
export CC=nvc
export CXX=nvc++
export FC=nvfortran
export CFLAGS="-O2"
```
