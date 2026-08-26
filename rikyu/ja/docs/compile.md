# プログラムのコンパイル方法

## 概要

GCCおよびNVIDIA HPC SDK（NVHPC）によるプログラムのコンパイル方法について説明します。

## 利用可能なコンパイラ

### GCC（GNU Compiler Collection）

GCCはLinux環境で広く利用されているオープンソースコンパイラです。C、C++、Fortranに対応しており、CPU向けアプリケーション開発のコンパイラとして利用できます。一般的な数値計算プログラムやオープンソースソフトウェアのビルドではGCCを使用します。また、OpenMPによる共有メモリ並列化や、MPI環境と組み合わせたCPU並列プログラム開発にも利用できます。

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

### NVIDIA HPC SDK（NVHPC）

NVHPCはNVIDIAが提供する高性能計算向けのコンパイラおよび関連ツール群です。OpenACCやCUDAによるGPUプログラミング、およびGPUライブラリを利用したアプリケーション開発に使用します。

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

### CUDA Toolkit

CUDA Toolkitは、CUDAコンパイラ`nvcc`とcuBLASなどのCUDAライブラリを提供します。NVHPCとは独立したモジュールで、`CC`、`CXX`、`FC`を上書きしないため、GCCでビルドするプログラムからCUDAを利用する場合や、`CUDA_HOME`を参照するビルドに適しています。

利用できるコンパイラ：

| 言語 | コマンド |
|------|---------|
| CUDA C/C++ | `nvcc` |

バージョン確認：

```bash
module load cuda
nvcc --version
```

!!! note

    `nvhpc`と`cuda`は用途で選び分けます。`nvc`、`nvc++`、`nvfortran`（OpenACCなど）を使う場合は`nvhpc`を、`nvcc`とCUDAライブラリだけを使いGCCでビルドする場合は`cuda`を読み込みます。両方を読み込む場合は`module load nvhpc`のあとに`module load cuda`を実行すると`cuda`側が優先されます。`nvc++`や`nvfortran`に`cuda`モジュールのCUDAを使わせる場合のみ、`export NVHPC_CUDA_HOME=$CUDA_HOME`を追加してください。

## コンパイル

コンパイルとは、ソースコードから実行可能なプログラムを生成する処理です。基本的な開発手順は次のとおりです。

1. ソースコードを作成する
2. コンパイラを実行する
3. エラーや警告を確認する
4. 実行ファイルを生成する
5. 実行結果を確認する

### GCCによるコンパイル

#### C言語

```bash
gcc sample.c -o sample
```

#### C++

C++ ではコンパイラやライブラリのバージョンによりデフォルトの言語規格が異なる場合があります。移植性を高めるため、`-std`オプションで使用する言語規格を明示することを推奨します。

```bash
g++ -std=c++17 sample.cpp -o sample
```

#### Fortran

C++ と同様に、`-std`オプションで使用する言語規格を明示することを推奨します。

```bash
gfortran -std=f2008 sample.f90 -o sample
```

### NVHPCによるコンパイル

NVHPCを使用するには、事前に`module load nvhpc`コマンドで環境を設定してください。

#### C言語

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

`-o`オプションで出力ファイル名を指定します。`-o`オプションを省略した場合、実行ファイル名は`a.out`になります。

```bash
gcc sample.c -o myprogram
```

#### インクルードパスの指定

利用するライブラリのヘッダファイルが標準パス外に配置されている場合は、`-I`オプションで検索先ディレクトリを追加してください。

```bash
gcc -I/path/to/include1 -I/path/to/include2 sample.c -o sample
```

#### ライブラリのリンク

コンパイル処理とリンク処理は別工程です。コンパイルが成功しても、対応するライブラリがリンクされていない場合は`undefined reference`エラーが発生します。外部ライブラリをリンクする場合、`-L`オプションでライブラリディレクトリを、`-l`オプションでライブラリ名を指定します。

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

一般的な利用では`-O2`を推奨します。`-O3`や`-Ofast`は性能を重視する場合に利用します。

!!! note

    開発中はデバッグ情報（`-g`）や警告表示（`-Wall`）を有効にし、問題がないことを確認してから最適化オプションを適用することを推奨します。`-g`オプションはデバッグ情報を埋め込み、gdbなどのデバッガで解析を行う際に利用します。`-Wall`オプションは一般的な警告を有効化します。コンパイルが成功していても警告が表示される場合は、コードに問題が潜んでいる可能性があるため確認してください。

!!! tip

    最適化レベルが高いほどデバッグが難しくなります。問題解析時は`-O0`または`-O1`の利用を推奨します。

!!! warning

    `-O3`や`-Ofast`で最適化したプログラムは、特に浮動小数点計算において計算結果が変わる可能性があります。

## 並列化

### OpenMPによる共有メモリ並列化

OpenMPはシングルノード内の複数CPUコアを利用した共有メモリ並列化を実現します。

#### GCC

コンパイル時に`-fopenmp`オプションを指定します。実行時に使用するスレッド数を環境変数`OMP_NUM_THREADS`で指定します。

```bash
gcc -fopenmp sample.c -o sample
export OMP_NUM_THREADS=4
./sample
```

#### NVHPC

コンパイル時に`-mp`オプションを使用します。実行時に使用するスレッド数を環境変数`OMP_NUM_THREADS`で指定します。

```bash
module load nvhpc
nvc -mp sample.c -o sample
export OMP_NUM_THREADS=4
./sample
```

### MPIによる分散メモリ並列化

MPIは複数の計算ノード間でのプロセス間通信を実現します。`module load nvhpc`により、NVHPCに同梱されたOpen MPIベースのMPI環境が利用可能になります。

MPIプログラムのコンパイルには、`gcc`、`g++`、`gfortran`や`nvc`、`nvc++`、`nvfortran`を直接使うのではなく、MPI用のラッパーコンパイラである`mpicc`、`mpic++`、`mpifort`を利用します。これらのラッパーは、MPIライブラリのインクルードパスとリンク指定を自動的に付与したうえで、内部でNVHPCのコンパイラ（`nvc`など）を呼び出します。

コンパイルしたMPIプログラムを実行するには`mpirun`コマンドを使用します。`-np 4`は4プロセスで実行することを指定しています。

```bash
module load nvhpc
mpicc sample.c -o sample          # C 言語
mpic++ sample.cpp -o sample       # C++
mpifort sample.f90 -o sample      # Fortran
mpirun -np 4 ./sample
```

ラッパーコンパイラが内部で使用するコンパイラおよびオプションは、`--show`オプションで確認できます。

```bash
mpicc --show
mpic++ --show
mpifort --show
```

### MPIとOpenMPのハイブリッド並列化

複数ノードの複数CPUコアを効率的に利用するため、MPIとOpenMPを組み合わせたハイブリッド並列化が有効です。ラッパーコンパイラは内部でNVHPCのコンパイラを呼び出すため、OpenMPを有効化するオプションは前述のNVHPCと同じ`-mp`を指定します。

```bash
module load nvhpc
mpicc -mp hybrid_sample.c -o hybrid_sample
export OMP_NUM_THREADS=2
mpirun -np 4 ./hybrid_sample
```

この例は4プロセスを起動し、各プロセスが2スレッドで実行される設定です。

## GPU開発

### GPU環境の確認

```bash
module load nvhpc
nvcc --version
nvidia-smi
nvidia-smi -L
nvidia-smi -q
```

| コマンド | 説明 |
|----------|------|
| `nvcc --version` | CUDAコンパイラのバージョンを表示します。 |
| `nvidia-smi` | GPU使用率、メモリ使用量、ドライバ情報を表示します。 |
| `nvidia-smi -L` | システムで認識されているGPU一覧を表示します。 |
| `nvidia-smi -q` | GPUの詳細情報（温度、クロック、ECC状態など）を表示します。 |

### OpenACCによるGPUプログラミング

OpenACCは、C/C++ およびFortranプログラムをGPUにオフロードするための指示文ベースのプログラミングモデルです。CUDAのようにGPU向けの処理やメモリ管理を明示的に実装する必要がなく、ソースコードへ指示文を追加することでGPUを利用できます。

OpenACCのメリットとして、次の点が挙げられます。

- 既存コードのGPU化が容易
- ソースコードの修正量が少ない
- 学習コストが比較的低い

CUDAのメリットとして、次の点が挙げられます。

- GPU固有機能を詳細に利用可能
- より細かな性能チューニングが可能

一方、CUDAはGPU向けの処理を明示的に記述する必要があるため、実装や保守の負担は大きくなります。

性能チューニングやGPU固有機能を最大限活用したい場合はCUDAの利用も選択肢となりますが、多くの科学技術計算コードではOpenACCによるGPU化から検討することを推奨します。

### OpenACCのコンパイル

OpenACCを利用する場合は`-acc`オプションを指定します。

#### C言語

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

`-Minfo=accel`オプションにより、OpenACCコンパイル時にGPU化された処理内容を確認できます。

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

### MPIとOpenACCの併用

MPIとOpenACCを組み合わせることで、複数ノード・複数GPUを利用した並列計算を実行できます。MPIはノード間の通信を担当し、OpenACCは各MPIプロセスに割り当てられたGPU上で計算処理を実行します。

#### C言語

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

    MPIプロセスとGPUを組み合わせて利用するアプリケーションでは、1 GPUに対して1 MPIプロセスを割り当てる構成がよく利用されます。

### CUDAによるコンパイル

CUDAカーネルを記述した`.cu`ファイルをコンパイルするには、`cuda`モジュールの`nvcc`を使用します。NVHPCのコンパイラでCUDA機能を有効にする場合は`-cuda`オプションを指定します。

#### nvcc

```bash
module load cuda
nvcc -arch=sm_100 sample.cu -o sample
```

cuBLASなどのCUDAライブラリは`CUDA_HOME`以下に含まれているため、リンクオプションを指定するだけで利用できます。

```bash
module load cuda
nvcc -arch=sm_100 sample.cu -o sample -lcublas
```

CMakeを使う場合は、`cuda`モジュールが設定する`CUDAToolkit_ROOT`により`find_package(CUDAToolkit)`が解決されます。

#### C言語

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

#### Compute Capabilityの指定

生成するGPUコードの世代は`-gpu=ccXX`オプションで指定します。本システムに搭載されているGPUはNVIDIA GB200（Grace-Blackwell）で、Compute Capabilityは10.0です。したがって指定する値は`cc100`になります。

```bash
nvc -cuda -gpu=cc100 sample.c -o sample
```

`-gpu`オプションを省略した場合は、コンパイルを実行したノードのGPUに合わせたコードが生成されます。本システムではログインノードと計算ノードのいずれもGB200を搭載しているため、通常は省略しても`cc100`向けのコードが生成されます。

`nvcc`でコンパイルする場合は、同じ世代の指定に`-arch=sm_100`を使用します。

搭載GPUのCompute Capabilityは`nvaccelinfo`コマンドの`Default Target`欄で確認できます。

```bash
module load nvhpc
nvaccelinfo | grep "Default Target"
```

!!! note

    Compute CapabilityはGPU世代に依存する値です。本システム以外の環境向けにビルドする場合は、対象環境の値を`-gpu=ccXX`で明示的に指定してください。詳細はNVIDIA HPC SDKのドキュメントを参照してください。

### MPIとCUDAの併用

MPIとCUDAを組み合わせることで、複数ノード・複数GPUを利用した大規模並列計算を実行できます。ラッパーコンパイラに対しても`-cuda`オプションを指定します。

#### C言語

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

    MPIプロセスとGPUを組み合わせて利用するアプリケーションでは、1 GPUに対して1 MPIプロセスを割り当てる構成がよく利用されます。

### GPUライブラリの利用

NVHPCにはGPU向けの高性能ライブラリが統合されています。

| ライブラリ | 説明 |
|-----------|------|
| cuBLAS | 基本的な線形代数演算 |
| cuFFT | 高速フーリエ変換 |
| cuSPARSE | 疎行列演算 |

CUDAコンパイル時にライブラリをリンクする例は次のとおりです。

```bash
module load nvhpc
nvc -cuda -lcublas sample.c -o sample
```

## トラブルシューティング

### nvcが見つからない

**現象：** `nvc: command not found`

**原因：** NVHPCのモジュールが読み込まれていません。

**解決方法：**

```bash
module load nvhpc
which nvc
```

`module load`で環境変数が設定されることを確認してください。

### 数学関数のリンクエラー

**現象：** `undefined reference to 'pow'`

**原因：** 数学ライブラリがリンクされていません。

**解決方法：**

```bash
gcc sample.c -lm -o sample
```

`-lm`オプションで数学ライブラリを明示的にリンクしてください。

### 外部ライブラリのリンクエラー

**現象：** `undefined reference to 'myfunction'`

**原因：** 外部ライブラリがリンクされていない、またはライブラリの探索パスが指定されていません。

**解決方法：**

```bash
gcc sample.c -L/usr/local/lib -lmylib -o sample
```

`-L`オプションでライブラリディレクトリを、`-l`オプションでライブラリ名を指定してください。

## 環境変数設定

`configure`や`make`を使うビルドでは、使用するコンパイラやオプションを環境変数から取得します。あらかじめ設定しておくと、ビルドのたびにコンパイラを指定する必要がなくなります。

| 環境変数 | 用途 |
|---------|------|
| `CC` | Cコンパイラ |
| `CXX` | C++ コンパイラ |
| `FC` | Fortranコンパイラ |
| `CFLAGS` | Cコンパイル時のオプション |

これらを`.bashrc`や`.bash_profile`に記述しておくと、新しいシェルセッションで自動的に設定されます。

```bash
# ~/.bashrc に追記
export CC=gcc
export CXX=g++
export FC=gfortran
export CFLAGS="-O2 -Wall"
```

NVHPCを使用する場合は、次のように設定します。

```bash
module load nvhpc
export CC=nvc
export CXX=nvc++
export FC=nvfortran
export CFLAGS="-O2"
```
