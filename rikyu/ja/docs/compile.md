# 理究 利用手引書 コンパイル環境編（改訂版 v2）

## 1. 概要

理究では GCC および NVIDIA HPC SDK (NVHPC) によるプログラムのコンパイルが可能です。
ここでは、GCC、NVHPCによるプログラムのコンパイル方法について説明します。
また、記載されているコマンドはmodule load nvhpc/26.5　をロード済みであることを想定しています。

## 2. 利用可能なコンパイラ

### 2.1 GCC（GNU Compiler Collection）

GCC は Linux 環境で広く利用されているオープンソースコンパイラです。
C、C++、Fortran に対応しており、理究における CPU 向けアプリケーション開発のコンパイラとして利用できます。

一般的な数値計算プログラムやオープンソースソフトウェアのビルドでは GCC を使用します。
また、OpenMP による共有メモリ並列化や、MPI 環境と組み合わせた CPU 並列プログラム開発にも利用できます。

**確認済みバージョン：13.3.0**

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

### 2.2 NVIDIA HPC SDK (NVHPC)

NVHPC は NVIDIA が提供する高性能計算向けのコンパイラおよび関連ツール群です。
OpenACC や CUDA による GPU プログラミング、および GPU ライブラリを利用したアプリケーション開発に使用します。
理究では NVHPC を提供しています。
NVHPC のコンパイラやライブラリを利用する場合は、事前に module load コマンドで環境設定を行ってください。
**対応バージョン：26.5**


```bash
module load nvhpc/26.5
```

利用できるコンパイラ：

| 言語 | コマンド |
|------|---------|
| C | `nvc` |
| C++ | `nvc++` |
| Fortran | `nvfortran` |

バージョン確認：

```bash
nvc --version
nvc++ --version
nvfortran --version
```

### 2.3 コンパイラの選択

開発するアプリケーションの特性に応じて選択してください。

**GCC を選ぶ場合：**
- 一般的な CPU アプリケーション開発
- オープンソースソフトウェアのビルド
- OpenMP や MPI を使用した並列化

**NVHPC を選ぶ場合：**
- OpenACC や CUDA を利用した GPU アプリケーション開発
- NVIDIA HPC SDK 標準ライブラリ（cuBLAS、cuFFT など）を利用する場合

## 3. コンパイル基本
コンパイルとは、ソースコードから実行可能なプログラムを生成する処理です。

基本的な開発手順は以下のとおりです。

1. ソースコードを作成する
2. コンパイラを実行する
3. エラーや警告を確認する
4. 実行ファイルを生成する
5. 実行結果を確認する

開発中はデバッグ情報 (-g) や警告表示 (-Wall) を有効にし、
問題がないことを確認してから最適化オプションを適用することを推奨します。

### 3.1 GCC によるコンパイル

#### C 言語
-g オプションはデバッグ情報を埋め込み、gdb などのデバッガで解析を行う際に利用します。

-Wall オプションは一般的な警告を有効化します。
コンパイルが成功していても警告が表示される場合は、コードに問題が潜んでいる可能性があるため確認してください。

最も簡単なコンパイル例：

```bash
gcc sample.c -o sample
```

開発時にはデバッグ情報と警告を有効にすることを推奨します：

```bash
gcc -g -Wall sample.c -o sample
```

#### C++
C++ ではコンパイラやライブラリのバージョンによりデフォルトの言語規格が異なる場合があります。
移植性を高めるため、-std オプションで使用する言語規格を明示することを推奨します。

```bash
g++ -std=c++11 sample.cpp -o sample
```

#### Fortran

```bash
gfortran -std=f2008 sample.f90 -o sample
```

### 3.2 NVHPC によるコンパイル

NVHPC を使用するには、事前に `module load nvhpc/26.5` で環境設定してください。

#### C 言語

```bash
module load nvhpc/26.5
nvc -O2 sample.c -o sample
```

#### C++

```bash
module load nvhpc/26.5
nvc++ -O2 sample.cpp -o sample
```

#### Fortran

```bash
module load nvhpc/26.5
nvfortran -O2 sample.f90 -o sample
```

### 3.3 基本的なコンパイルオプション

#### 出力ファイルの指定
-o オプションを省略した場合、実行ファイル名はデフォルトで a.out になります。
複数のプログラムを管理する場合は、明示的に出力ファイル名を指定することを推奨します。

`-o` オプションで出力ファイル名を指定します：

```bash
gcc sample.c -o myprogram
```

#### インクルードパスの指定
コンパイラは標準の検索パスに存在するヘッダファイルを自動的に参照します。

利用するライブラリ固有のヘッダファイルが標準パス外に配置されている場合は、
-I オプションで検索先ディレクトリを追加してください。

ヘッダファイルのディレクトリを指定する場合は `-I` オプションを使用します：

```bash
gcc -I/usr/local/include sample.c -o sample
gcc -I/path/to/include1 -I/path/to/include2 sample.c -o sample
```

#### ライブラリのリンク
コンパイル処理とリンク処理は別工程です。

ヘッダファイルが見つかっていても、対応するライブラリがリンクされていない場合は
undefined reference エラーが発生します。

外部ライブラリをリンクする場合、`-L` オプションでライブラリディレクトリを、`-l` オプションでライブラリ名を指定します：

```bash
gcc sample.c -L/usr/local/lib -lmylib -o sample
```

数学ライブラリ（libm）をリンクする例：

```bash
gcc sample.c -lm -o sample
```

このオプションは `undefined reference to pow` などのリンクエラーを解決する際に重要です。

## 4. 最適化フラグ
最適化オプションは、コンパイラがプログラムの実行効率を改善するために行う変換処理を制御します。

一般的な利用では -O2 を推奨します。
-O0 はデバッグ用途、-O3 や -Ofast は性能を重視する場合に利用します。

なお、最適化レベルが高いほどデバッグが難しくなる場合があります。
問題解析時は -O0 または -O1 の利用を推奨します。

コンパイラの最適化レベルを指定することで、実行速度を改善できます。

| フラグ | 説明 | 用途 |
|---------|------|------|
| `-O0` | 最適化なし | デバッグ時。コンパイルが高速 |
| `-O1` | 基本的な最適化 | デバッグと実行速度のバランス |
| `-O2` | 標準最適化（**推奨**） | ほとんどの場合に最適 |
| `-O3` | 高度な最適化 | 最大速度追求。コンパイル時間が長い |
| `-Ofast` | 最も積極的な最適化 | 最大速度追求。精度に注意 |

#### 使用例

開発時：

```bash
gcc -g -O1 sample.c -o sample
```

本番環境（推奨）：

```bash
gcc -O2 sample.c -o sample
```

最高速度追求時（結果検証が必須）：

```bash
gcc -O3 sample.c -o sample
```

**注意：** `-O3` や `-Ofast` で最適化したプログラムは、特に浮動小数点計算において計算結果が変わる可能性があります。必ず検証してください。

## 5. 並列化

### 5.1 OpenMP による共有メモリ並列化
OpenMP はシングルノード内の複数 CPU コアを利用した共有メモリ並列化を実現します。

OpenMP を利用するには、ソースコード内の OpenMP 指示文だけでなく、
コンパイル時に OpenMP 用のオプションを指定する必要があります。

OpenMP オプションを付けずにコンパイルした場合、
OpenMP の並列処理は有効になりません。

#### GCC による OpenMP

コンパイル時に `-fopenmp` フラグを指定します：

```bash
gcc -fopenmp sample.c -o sample
gcc -O2 -fopenmp sample.c -o sample
```

実行時に使用するスレッド数を指定できます：

```bash
export OMP_NUM_THREADS=4
./sample
```

#### NVHPC による OpenMP

NVHPC では `-mp` フラグを使用します：

```bash
module load nvhpc/26.5
nvc -mp -O2 sample.c -o sample
export OMP_NUM_THREADS=4
./sample
```

### 5.2 MPI による分散メモリ並列化

MPI は複数の計算ノード間でのプロセス間通信を実現します。

NVHPC モジュール読み込み時に OpenMPI ベースの MPI 環境が利用可能になります。

MPI プログラムは通常の gcc や g++ ではなく、
MPI 用のラッパーコンパイラである mpicc、mpic++、mpifort を利用してコンパイルします。

これらのコマンドは MPI ライブラリの設定やリンク処理を自動的に行います。

#### MPI コンパイル

```bash
module load nvhpc/26.5
mpicc sample.c -o sample          # C 言語
mpic++ sample.cpp -o sample       # C++
mpifort sample.f90 -o sample      # Fortran
```

これらのコマンドは通常のコンパイラに MPI ライブラリのリンク処理を自動的に追加します。

#### MPI プログラムの実行

MPI プログラムを実行するには `mpirun` コマンドを使用します：

```bash
mpirun -np 4 ./sample
```

`-np 4` は 4 プロセスで実行することを指定しています。

MPI プログラムを多数のプロセスで実行する場合は、計算ノード上で実行してください。

理究のクラスタ環境では、通常は Slurm ジョブを通じて実行します。
ジョブ投入方法については「Slurm 利用ガイド」を参照してください。

### 5.3 MPI と OpenMP のハイブリッド並列化

複数ノードの複数コアを効率的に利用するため、MPI と OpenMP を組み合わせたハイブリッド並列化が有効です。

```bash
module load nvhpc/26.5
mpicc -mp -O2 hybrid_sample.c -o hybrid_sample
```

実行時に環境変数でスレッド数を指定します：

```bash
export OMP_NUM_THREADS=4
mpirun -np 4 ./hybrid_sample
```

この例は 4 プロセスを起動し、各プロセスが 4 スレッドで実行される設定です。

### 5.4 MPI と GPU の併用

MPI と GPU を組み合わせることで、複数ノード・複数 GPU を利用した大規模並列計算を実行できます。

理究では NVHPC モジュール読み込み時に OpenMPI 環境が利用可能になります。

MPI プログラムのコンパイルには mpicc、mpic++、mpifort を利用します。
これらは MPI ラッパーコンパイラと呼ばれ、MPI ライブラリの設定やリンク処理を自動的に行います。

利用されるコンパイラおよびコンパイルオプションは以下のコマンドで確認できます。

```bash
mpicc --show
mpic++ --show
mpifort --show
```

GPU を利用する MPI プログラムでは、MPI ラッパーコンパイラと CUDA オプションを組み合わせてコンパイルできます。

#### C 言語

```bash
module load nvhpc/26.5

mpicc -cuda sample.c -o sample
```

#### C++

```bash
module load nvhpc/26.5

mpic++ -cuda sample.cpp -o sample
```

#### Fortran

```bash
module load nvhpc/26.5

mpifort -cuda sample.f90 -o sample
```

#### 実行例

```bash
mpirun -np 4 ./sample
```

この例では 4 個の MPI プロセスを起動します。

GPU を利用する場合は、GPU リソースが割り当てられた計算ノード上で実行してください。

MPI プロセスと GPU を組み合わせて利用するアプリケーションでは、一般的に 1 GPU に対して 1 MPI プロセスを割り当てる構成が利用されます。

## 6. GPU 開発

### 6.1 GPU 環境の確認

GPU プログラムを実行するためには NVIDIA GPU が利用可能な環境である必要があります。

```bash
module load nvhpc/26.5
nvcc --version
```

GPU の情報確認：

```bash
nvidia-smi
nvidia-smi -L
nvidia-smi -q
```

| コマンド | 説明 |
|----------|------|
| `nvidia-smi` | GPU 使用率、メモリ使用量、ドライバ情報を表示します。 |
| `nvidia-smi -L` | システムで認識されている GPU 一覧を表示します。 |
| `nvidia-smi -q` | GPU の詳細情報（温度、クロック、ECC 状態など）を表示します。 |


### 6.2 OpenACC による GPU プログラミング

OpenACC は、C/C++ および Fortran プログラムを GPU にオフロードするためのディレクティブベースのプログラミングモデルです。

CUDA のように GPU 向けの処理やメモリ管理を明示的に実装する必要がなく、ソースコードへディレクティブ（指示文）を追加することで GPU を利用できます。

#### OpenACC と CUDA の使い分け

- OpenACC
  - 既存コードの GPU 化が容易
  - ソースコードの修正量が少ない
  - 学習コストが比較的低い

- CUDA
  - GPU 固有機能を詳細に利用可能
  - より細かな性能チューニングが可能
  - 実装や保守の負担が大きい

性能チューニングや GPU 固有機能を最大限活用したい場合は CUDA の利用も選択肢となりますが、多くの科学技術計算コードでは OpenACC による GPU 化から検討することを推奨します。

#### OpenACC のコンパイル

OpenACC を利用する場合は `-acc` オプションを指定します。

##### C 言語

```bash
module load nvhpc/26.5
nvc -acc sample.c -o sample
```

##### C++

```bash
module load nvhpc/26.5
nvc++ -acc sample.cpp -o sample
```

##### Fortran

```bash
module load nvhpc/26.5
nvfortran -acc sample.f90 -o sample
```

#### 最適化オプションとの併用

実運用では最適化オプションと組み合わせて利用します。

##### C 言語

```bash
nvc -acc -O2 sample.c -o sample
```

##### C++

```bash
nvc++ -acc -O2 sample.cpp -o sample
```

##### Fortran

```bash
nvfortran -acc -O2 sample.f90 -o sample
```

#### GPU オフロード情報の確認

OpenACC コンパイル時に GPU 化された処理内容を確認できます。

```bash
nvc -acc -Minfo=accel sample.c -o sample
```

出力例：

```text
15, Generating Tesla code
16, Loop parallelized across CUDA thread blocks
```

`-Minfo=accel` オプションを指定すると、どのループが GPU にオフロードされたかを確認できます。

#### OpenACC プログラムの例

C 言語の例：

```c
#pragma acc parallel loop
for(int i=0;i<n;i++){
    c[i] = a[i] + b[i];
}
```

Fortran の例：

```fortran
!$acc parallel loop
do i = 1, n
    c(i) = a(i) + b(i)
end do
```

ディレクティブを付与することで、ループ処理を GPU 上で実行できます。

#### MPI と OpenACC の併用

MPI と OpenACC を組み合わせることで、複数ノード・複数 GPU を利用した並列計算を実行できます。

MPI はノード間の通信を担当し、OpenACC は各 MPI プロセスに割り当てられた GPU 上で計算処理を実行します。

一般的には GPU 1 台に対して MPI プロセスを 1 つ割り当てる構成が利用されます。

##### コンパイル

C 言語：

```bash
module load nvhpc/26.5
mpicc -acc -O2 sample.c -o sample
```

C++：

```bash
module load nvhpc/26.5
mpic++ -acc -O2 sample.cpp -o sample
```

Fortran：

```bash
module load nvhpc/26.5
mpifort -acc -O2 sample.f90 -o sample
```

##### 実行例

```bash
mpirun -np 4 ./sample
```

この例では 4 個の MPI プロセスを起動します。

GPU を利用する場合は GPU が割り当てられた計算ノード上で実行してください。

##### 一般的な利用形態

MPI と OpenACC を組み合わせる場合は、GPU 1 台に対して MPI プロセスを 1 つ割り当てる構成が一般的です。

例：

```text
GPU0 ← Rank0
GPU1 ← Rank1
GPU2 ← Rank2
GPU3 ← Rank3
```

### 6.3 CUDA によるコンパイル
CUDA 関連機能を利用する場合は、CUDA コンパイラおよびライブラリの利用が必要です。

NVHPC では -cuda オプションを指定することで CUDA 機能を有効化できます。

NVHPC で CUDA プログラムをコンパイルする場合、`-cuda` フラグを使用します。

#### C 言語

```bash
module load nvhpc/26.5
nvc -cuda -O2 sample.c -o sample
```

#### C++

```bash
module load nvhpc/26.5
nvc++ -cuda -O2 sample.cpp -o sample
```

**注：** Compute Capability は GPU 世代に依存するため、実機確認後に指定してください。詳細は NVIDIA HPC SDK のドキュメントを参照してください。

### 6.4 GPU ライブラリの利用

NVHPC には GPU 向けの高性能ライブラリが統合されています：

| ライブラリ | 説明 |
|-----------|------|
| cuBLAS | 基本的な線形代数演算 |
| cuFFT | 高速フーリエ変換 |
| cuSPARSE | 疎行列演算 |

CUDA コンパイル時にライブラリをリンクする例：

```bash
module load nvhpc/26.5
nvc -cuda -lcublas sample.c -o sample
```

## 7. トラブルシューティング

### nvc が見つからない

**現象：** `nvc: command not found`

**解決方法：**

```bash
module load nvhpc/26.5
which nvc
```

`module load` で環境変数が設定されることを確認してください。

### 数学関数のリンクエラー

**現象：** `undefined reference to pow`

**原因：** 数学ライブラリがリンクされていません。

**解決方法：**

```bash
gcc sample.c -lm -o sample
```

`-lm` オプションで数学ライブラリを明示的にリンクしてください。

### ライブラリが見つからない

**現象：** `undefined reference to myfunction`

**原因：** 外部ライブラリのパスが指定されていません。

**解決方法：**

```bash
gcc sample.c -L/usr/local/lib -lmylib -o sample
```

`-L` オプションでライブラリディレクトリを、`-l` オプションでライブラリ名を指定してください。

## 8. 環境変数設定

よく使用する環境変数を設定することで、コンパイルコマンドをシンプルに保つことができます。

```bash
export CC=gcc
export CXX=g++
export FC=gfortran
export CFLAGS="-O2 -Wall"
```

これらを `.bashrc` や `.bash_profile` に記述しておくと、新しいシェルセッションで自動的に設定されます：

## 9. 実行時の注意

コンパイルしたプログラムはローカル環境で直接実行することができます。

```bash
./sample
./hybrid_sample
mpirun -np 4 ./sample
```

理究のクラスタ環境では Slurm ジョブスケジューラを使用して計算リソースを管理しています。クラスタでのジョブ投入方法、リソース要求の詳細については、別途「Slurm 利用ガイド」を参照してください。

## 10. 注意事項

- GPU プログラムは GPU リソースが利用可能な環境で実行してください。
- ベンチマークを行う場合は、コンパイラのバージョンおよび最適化オプションを記録することを推奨します。