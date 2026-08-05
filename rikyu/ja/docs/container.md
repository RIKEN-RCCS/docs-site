# コンテナの使い方

## 1. はじめに

本章では、コンテナプラットフォーム Apptainer を理究で利用する方法を説明します。
コンテナを利用すると、OS ディストリビューションやライブラリ、アプリケーションを 1 つのイメージにまとめて持ち運べるため、次のような利点があります。

- アプリケーション実行環境の再現性を確保できる
- イメージが単一ファイルであり、保存・転送・共有が容易である
- イメージを展開せずそのまま実行するため、共有ファイルシステムへの I/O 負荷を抑えられる
- アプリケーションの起動が高速かつ安定する

理究では、ログインノード・計算ノードの双方に Apptainer が導入されており、追加のセットアップなしで利用できます。

!!! note "クイックスタート"

    イメージの取得から実行までの最短の流れは次の 3 コマンドです。

    ```console
    $ apptainer pull ~/ubuntu2404.sif docker://ubuntu:24.04
    $ apptainer exec ~/ubuntu2404.sif cat /etc/os-release
    $ sbatch -A <プロジェクトID> --gpus=1 --time=00:05:00 --wrap "apptainer exec --nv ~/ubuntu2404.sif nvidia-smi -L"
    ```

    ジョブでの GPU の要求は `--gpus=N` で行います (`--gres=gpu:...` は使えません。[6 節](#6-ジョブスケジューラ-slurm-との連携) を参照)。

本章のコマンド例では、次のプレースホルダを使用します。自身の環境に読み替えてください。

| 表記 | 意味 |
|---|---|
| `<username>` | 自分のログインユーザー名 |
| `<プロジェクトID>` | 自分の課題 (プロジェクト) の ID (rkpXXXXX 形式。例: `rkp00010`) |
| `<グループ>` | 自分の所属グループ名 (グループ領域 `/data1/<グループ>` のディレクトリ名) |

このほか、`< >` で囲んだ箇所 (例: `<名前>`, `<計算ノード>`) は文脈に応じて読み替えてください。

## 2. Apptainer とは

Apptainer は、HPC 環境向けに設計されたオープンソースの Linux コンテナ実装です。
2015 年に Singularity という名称で開発が始まり、2021 年にプロジェクトが Linux Foundation 傘下へ移管された際に Apptainer に改名されました。Singularity の直接の後継であり、後方互換性を保っています ([2.4 節](#24-singularity-との互換性) を参照)。

Apptainer には、HPC 環境での利用に適した次の特徴があります。

1. イメージが単一ファイル (SIF 形式) で管理でき、取り扱いが直感的で容易
2. イメージを展開せず単一ファイルのまま実行でき、I/O を抑制できる
3. 起動したユーザーの UID・権限がコンテナ内にそのまま引き継がれる
4. root 権限や常駐デーモンを必要とせず、マルチユーザー環境で安全に運用できる

### 2.1 コンテナ

コンテナは仮想化技術の一種で、ホスト側のカーネルを共有したまま、ルートディレクトリ以下のユーザー環境のみを切り替えて専用の環境でアプリケーションを実行する方式です。ハードウェアごと仮想化する完全仮想化とは異なります。

コンテナには次の特徴があります。

1. カーネルは起動済みのものを共有するため、起動が高速でオーバーヘッドが小さい
2. OS 環境・アプリケーション・設定を 1 つにまとめられ、再現性が高い
3. 一度作成したイメージを複数のシステムで再利用でき、環境構築・検証の手間を減らせる

一方で、次の制限があります。

- コンテナはハードウェアのエミュレーションを行わないため、CPU アーキテクチャ (aarch64 / x86_64 など) が異なるイメージは動作しない
- カーネルはホスト側のものを使うため、カーネルバージョンやドライバに依存する機能には注意が必要

### 2.2 イメージ

コンテナイメージは、ホストとは別の OS 環境・ランタイム・アプリケーションをファイルシステムとして構築し、ファイルに保存したものです。

Apptainer は SIF (Singularity Image Format) と呼ばれる単一ファイル形式を採用しています。ランタイムを含む実行環境一式を 1 ファイルとして所有でき、保存・転送が容易です。また、Docker Hub などで配布されている他形式のコンテナイメージを取得して SIF に変換したり、直接実行したりすることもできます。

### 2.3 実行

Apptainer はコンテナの起動とアプリケーションの起動を統合しており、コンテナ内のアプリケーションを、あたかもスタティックリンクされた 1 つのバイナリのように実行できます。

実行方法は大きく 4 通りあります。

1. コンテナ起動時にシェルを起動し、手動で操作する (`apptainer shell`)
2. イメージ内の任意のコマンドをコンテナ起動と同時に実行する (`apptainer exec`)
3. イメージ内に事前設定されたコマンドを実行する (`apptainer run` / SIF の直接実行)
4. コンテナのみ起動しておき、外部からコマンドを投入する (`apptainer instance`)

バッチジョブでは通常 2. と 3. を使います。4. は多数のデータを繰り返し処理する場合や、Jupyter Notebook などのサービスを立ち上げておく場合に適しています。

### 2.4 Singularity との互換性

Apptainer は Singularity に対する後方互換性を持ち、`singularity` コマンドでも同じ操作ができます。理究では `singularity` コマンドは Apptainer の実体へのリンクになっており、`singularity --version` を実行すると `apptainer version 1.4.5` と表示されます。既存の Singularity 向け手順やスクリプトは、基本的に `singularity` を `apptainer` に置き換えるだけでそのまま動作します。

ただし、次の差分に注意してください。

- **環境変数の接頭辞**: `SINGULARITY_*` / `SINGULARITYENV_*` は `APPTAINER_*` / `APPTAINERENV_*` に改名されています。互換のため旧接頭辞も認識され、変数は問題なく伝搬しますが (対応する `APPTAINER_*` が未設定の場合のみ有効)、「`INFO:    Environment variable SINGULARITYENV_FOO is set, but APPTAINERENV_FOO is preferred`」のような INFO メッセージが表示されます。両方が設定されている場合は `APPTAINER_*` 側が優先されます。
- **設定・キャッシュディレクトリ**: `~/.singularity` に相当するディレクトリは `~/.apptainer` です (`APPTAINER_CACHEDIR` などの環境変数で変更可能)。`~/.singularity` が存在する場合、リモートエンドポイント設定や PGP 鍵は初回実行時に自動移行されますが、キャッシュされたイメージデータは移行されません。

上記以外のサブコマンド・オプションは Apptainer と Singularity で同一です。

## 3. 利用の手順

本節では、既存イメージの取得からコンテナ起動までの基本的な流れを説明します。イメージを入手・作成する方法は大きく 3 通りあります。

1. Docker Hub などで公開されている既存イメージを取得して再利用する
2. イメージをファイルシステムに展開 (sandbox 化) し、手作業で変更する
3. 定義ファイル (def ファイル) を書いてビルドを自動化する

手作業 (2.) はデバッグには便利ですが、再現性の観点からは、定義ファイル (3.) をリポジトリ等で管理してビルドする方法を推奨します。ベースイメージには Docker Hub で配布されている Ubuntu、AlmaLinux、Red Hat Universal Base Image (UBI) などの利用を想定しています。

### 3.1 理究の Apptainer 環境

理究では Apptainer 1.4.5 (執筆時点) が `/shared/software/apptainer/bin` に導入されており、標準で PATH に含まれています。`module load` などの事前準備は不要で、ログイン直後からそのまま利用できます。

```console
$ apptainer --version
apptainer version 1.4.5
```

理究はログインノード・計算ノードとも aarch64 (Arm) アーキテクチャです。イメージの取得・作成・実行のいずれもアーキテクチャの食い違いを気にせず行えますが、取得するイメージは arm64 (aarch64) 版である必要があります ([7.1 節](#71-アーキテクチャに関する注意) を参照)。

イメージの置き場所・作業領域としては、次のストレージ領域を利用できます。

| 領域 | パス | 容量 | アクセス範囲 | 種類 | 用途 |
|---|---|---|---|---|---|
| ホーム領域 | `/home/<username>` | 50 GB | 本人のみ | Lustre | 設定・定義ファイル、小規模な作業、小さな SIF イメージの保存 |
| グループ領域 | `/data1/<グループ>` | 1 TB/グループ (最大 100 TB) | グループメンバ | Lustre | 大きな SIF イメージ・大規模データの保存、グループでの共有 |
| スクラッチ領域 | `/tmp` | 1.5 TB/GPU | 実行ノードのみ | ローカル SSD (xfs) | 計算中の中間ファイル等の高速な一時作業 (ジョブ終了時に全削除) |

!!! note

    スクラッチ領域 (`/tmp`) はノードローカルで、ジョブ終了時にすべて削除されます。
    残したいファイル (ビルドした SIF イメージ等) は、ジョブ終了前にホーム領域または
    グループ領域へコピーしてください。SIF イメージの保存先は、小さなものはホーム領域、
    大きなものはグループ領域 (`/data1/<グループ>`) を使用してください
    (ホーム領域のクォータは 50 GB です)。

### 3.2 コマンドラインでのイメージ作成

公開リポジトリからイメージを取得するには `pull` コマンドを使います。`docker://` に続けてイメージ名とタグを指定します。理究からの取得は内部のレジストリミラー (zot) を経由し、docker.io (Docker Hub)・nvcr.io (NVIDIA NGC)・quay.io のイメージが利用できます (いずれも取得できることを確認済みです)。

```console
$ apptainer pull ubuntu2404.sif docker://ubuntu:24.04
$ apptainer pull alma9.sif docker://almalinux:9
$ apptainer pull cuda13-base.sif docker://nvcr.io/nvidia/cuda:13.0.0-base-ubuntu24.04
$ apptainer pull busybox.sif docker://quay.io/prometheus/busybox:latest
```

取得の際、Docker 形式のイメージレイヤーは SIF 形式に変換され、レイヤーデータは `~/.apptainer/cache` 以下にキャッシュされます。Apptainer は実行マシンのアーキテクチャを自動判別するため、理究上で取得すると自動的に arm64 (aarch64) 版のイメージが選択されます。

SIF イメージの実体は SquashFS 形式で、起動すると読み込み専用になります。イメージにアプリケーションを追加するには、後述の定義ファイルによるビルド、またはファイルシステムに展開する sandbox を利用します。

sandbox (ディレクトリ展開形式) は、`build` コマンドに `--sandbox` オプションを付けて作成します。

```console
$ apptainer build --sandbox ubuntu2404 docker://ubuntu:24.04
```

sandbox 内のファイルはユーザー自身がオーナーとなり、コンテナを起動しなくても直接編集できます。ただし、sandbox からコンテナを起動した場合も既定では読み込み専用です。書き込み可能な状態で起動するには `--writable` オプションを指定します (SIF イメージでは指定できません)。また、root 権限を前提とする `apt` / `dnf` / `rpm` などのパッケージ管理コマンドを使うには `--fakeroot` オプションが必要です ([4.1 節](#41-sandbox-を用いる方法) を参照)。

SIF と sandbox は相互に変換できます。

```console
$ apptainer build from_sandbox.sif ubuntu2404
$ apptainer build --sandbox from_sif ubuntu2404.sif
```

### 3.3 イメージからのコンテナ起動

`shell` コマンドでコンテナを起動し、シェルで対話的に操作できます。ここでは、ホストと異なるディストリビューションの例として、[3.2 節](#32-コマンドラインでのイメージ作成) で取得した AlmaLinux イメージを起動してみます。

```console
$ apptainer shell alma9.sif
Apptainer> cat /etc/os-release
NAME="AlmaLinux"
VERSION="9.8 (Olive Jaguar)"
...
```

ホスト OS は Ubuntu 24.04 LTS ですが、コンテナ内ではイメージの OS 環境 (この例では AlmaLinux) に切り替わり、イメージ内のコマンド・ライブラリのみが利用可能になります。カーネルとユーザー (UID) はホスト側のものがそのまま使われます。

コンテナ内からは自身のホームディレクトリがそのまま見えます (他ユーザーのホームディレクトリは見えません)。コンテナ内の `/etc/passwd` には起動時に自身のエントリーのみが追加されます。また、プロセス空間はホストと共有されるため、`ps` や `kill` はコンテナ内外で相互に有効です。

`exec` コマンドを使うと、コンテナ起動と同時に任意のコマンドを実行できます。

```console
$ apptainer exec ubuntu2404.sif cat /etc/os-release
$ apptainer exec docker://almalinux:9 cat /etc/passwd
```

2 つ目の例のようにリポジトリを直接指定した場合は、SIF への変換 (またはキャッシュとの同期) を行ってから実行されます ([5.3 節](#53-リポジトリを指定した直接実行) を参照)。

SIF ファイルには実行属性が付いており、スクリプトのように直接起動することもできます。

```console
$ ./ubuntu2404.sif                      # イメージ内のシェルまたは %runscript を起動
$ ./ubuntu2404.sif cat /etc/os-release
```

イメージ内容を固定して運用したい場合や、起動オーバーヘッドを最小化したい場合は、SIF イメージでの利用を原則として推奨します。SIF は内部が圧縮されており、総ファイル量に比してサイズが小さく、メタデータアクセスの負荷も低いため、アプリケーションの起動が高速かつ安定します。

## 4. イメージの作成

本節では、実行用の SIF イメージを作成するいくつかの方法を説明します。理究では一般ユーザー権限のまま `--fakeroot` オプションによるビルドが可能です (ログインノード・計算ノードの双方で、`docker://` ベースのビルドが動作することを確認済みです)。

### 4.1 sandbox を用いる方法

sandbox を編集して SIF に固める方法です。手軽な反面、作業履歴が残らないため、確定した手順は定義ファイル ([4.2 節](#42-定義ファイルによるカスタムイメージ)) に落とすことを推奨します。

**コンテナを起動せずに済む場合**は、既成のアプリケーションやリファレンスデータを sandbox に展開して固めるだけです。

```console
$ apptainer build --sandbox ubi9_py312 docker://registry.access.redhat.com/ubi9/python-312
$ tar xvzf ~/application.tar.gz -C ubi9_py312
$ vi ubi9_py312/usr/local/etc/application.config
$ apptainer build appl.sif ubi9_py312
```

**パッケージの追加など、コンテナを起動してシステムを変更する場合**は、`--writable` と `--fakeroot` を指定して sandbox を編集します。

```console
$ apptainer build --sandbox /tmp/ubuntu-sandbox ubuntu2404.sif
$ apptainer shell --fakeroot --writable /tmp/ubuntu-sandbox
Apptainer> apt-get update
Apptainer> apt-get install -y XXXXXXX
Apptainer> exit
$ apptainer build ~/from-sandbox.sif /tmp/ubuntu-sandbox
```

なお、`apt-get` などによる外部からのパッケージ取得には、外部ネットワークへの到達制限に関する注意があります ([4.2 節](#42-定義ファイルによるカスタムイメージ) の警告を参照)。

!!! note

    sandbox は多数の小ファイルで構成されるため、共有ファイルシステム (ホーム領域・グループ領域)
    上に置くとメタデータアクセスの負荷が大きくなります。sandbox の作成・編集はスクラッチ領域
    (`/tmp`) 上で行うことを推奨します。スクラッチ領域はジョブ終了時に削除されるため、
    完成した SIF イメージはホーム領域またはグループ領域に保存してください。

### 4.2 定義ファイルによるカスタムイメージ

定義ファイル (Definition File、慣習的に拡張子 `.def`) を書くと、イメージのビルドを自動化・再現可能にできます。定義ファイルは主に次の要素で構成されます。

1. ヘッダー (`Bootstrap:`, `From:`): ベースイメージの指定
2. `%files`: ホストからイメージへのファイル取り込み
3. `%post`: イメージ内で実行する構築処理 (パッケージ追加など)
4. `%environment` / `%runscript`: 実行時の環境変数と既定コマンドの定義
5. `%labels`: メタデータ

例として、Ubuntu 24.04 をベースにパッケージとデータを追加する定義ファイル `example.def` を示します。

```text
Bootstrap: docker
From: ubuntu:24.04

%files
    some_data.tar.gz /

%post
    apt-get update
    apt-get install -y python3 python3-lxml
    tar xzf /some_data.tar.gz -C /usr/share
    rm /some_data.tar.gz
    apt-get clean

%environment
    export LC_ALL=C.UTF-8

%runscript
    python3 "$@"

%labels
    Author <username>@example.org
```

ビルドは `build` コマンドに `--fakeroot` を付けて実行します。

```console
$ apptainer build --fakeroot ~/from_def.sif example.def
```

!!! warning

    理究から外部への HTTP (ポート 80) 接続は制限されており、`%post` での `apt-get` などによる
    外部からのパッケージ取得は失敗することがあります。

!!! note

    ビルド時の一時展開先は既定でスクラッチ領域 (`/tmp`) が使われます。一時領域を明示したい
    場合は、環境変数 `APPTAINER_TMPDIR` で展開先を、`APPTAINER_CACHEDIR` でキャッシュ先を
    変更できます。ホーム領域 (50 GB) の容量を圧迫したくない場合は、`APPTAINER_CACHEDIR` を
    スクラッチ領域やグループ領域 (`/data1/<グループ>`) に向けることも有効です。

### 4.3 実行環境の埋め込み

定義ファイルの `%runscript` に実行コマンドを記述しておくと、SIF イメージを直接実行するだけでアプリケーションを起動できます。前節の `example.def` では `%runscript` に `python3 "$@"` を設定しているため、次のように使えます。

```console
$ ./from_def.sif hoge.py 1024      # → コンテナ内で python3 hoge.py 1024 が実行される
```

`%environment` に環境変数を埋め込んでおけば設定漏れを防止でき、ジョブスクリプトも簡素になります ([6.2 節](#62-実行方法のイメージへの埋め込み) を参照)。

!!! warning

    定義ファイルの `From:` に `latest` タグを指定すると、ビルドのたびに取得される内容が変わる
    可能性があります。再現性を重視する場合は、バージョンを固定したタグを指定してください。

### 4.4 ジョブ投入によるイメージ作成

理究ではログインノードでも `--fakeroot` によるビルドが可能なため、軽量なイメージであればログインノード上で直接ビルドできます。一方、多数のパッケージをインストールする大規模なビルドは CPU・メモリ・ストレージへの負荷が大きいため、バッチジョブとして計算ノードで実行することを推奨します。計算ノードでも、内部ミラーからの `docker://` 取得と `--fakeroot` ビルドの双方が可能なことを確認済みです。ビルドをジョブスクリプト化しておくと、定義ファイルと合わせて手順が記録され、再現性の面でも有利です。

ジョブスクリプトの例を示します (資源の要求方法は [6 節](#6-ジョブスケジューラ-slurm-との連携) を参照)。

```bash
#!/bin/bash
#SBATCH -A <プロジェクトID>
#SBATCH --time=01:00:00

# スクラッチ領域 (/tmp。ジョブ終了時に削除) を作業領域にしてビルドし、
# 成果物のみホーム領域 (大きい場合はグループ領域) に保存する
export APPTAINER_TMPDIR=/tmp/build
mkdir -p $APPTAINER_TMPDIR
apptainer build --fakeroot $APPTAINER_TMPDIR/create_job.sif ~/example.def
cp $APPTAINER_TMPDIR/create_job.sif ~/
```

```console
$ sbatch ./build_job.sh
```

この例のように GPU を使わないジョブでは `--gpus` の指定は不要です ([6 節](#6-ジョブスケジューラ-slurm-との連携) を参照)。

### 4.5 電子署名によるイメージ管理

Apptainer は公開鍵暗号によるイメージの署名・検証機能を持ち、イメージの真正性 (作成者と改竄の有無) を確認できます。

キーペアの作成:

```console
$ apptainer key newpair
```

名前・メールアドレス・コメント・パスフレーズを対話的に入力します。作成した鍵は `~/.apptainer` 以下に保存され、次のコマンドで確認できます。

```console
$ apptainer key list           # 公開鍵の一覧
$ apptainer key list --secret  # 秘密鍵の一覧
```

署名と検証:

```console
$ apptainer sign ubuntu2404.sif     # パスフレーズを入力して署名
$ apptainer verify ubuntu2404.sif   # 署名者・フィンガープリント・検証結果を表示
```

`verify` による検証には署名者の公開鍵が必要です。署名されていないイメージを `verify` すると、次のように "signature not found" エラーで失敗します。

```console
$ apptainer verify unsigned.sif
INFO:    Verifying image with PGP key material
WARNING: No default remote in use, falling back to default keyserver: https://keys.openpgp.org
FATAL:   Failed to verify container: integrity: signature not found for object group 1
```

!!! note

    上の出力にあるとおり、手元に該当する公開鍵がない場合、既定では外部のキーサーバ
    (keys.openpgp.org) が参照されます (理究から HTTPS で到達可能なことを確認済みです)。

公開鍵のエクスポート・インポート:

```console
$ apptainer key export ./public.asc
$ apptainer key import ./public.asc
```

1 つのイメージに複数の署名を付けられるため、作成者と管理者による多段階の承認といった運用も可能です。

## 5. 実行時オプションと挙動

### 5.1 ホスト側の環境の取り込み

#### 5.1.1 環境変数の取り扱い

Apptainer はコンテナ起動時に、ホスト側の環境変数をほぼすべてコンテナ内に引き継ぎます。ただし `PATH` と `LD_LIBRARY_PATH` は例外で、コンテナ側で再設定されます。定義ファイルの `%environment` セクションに記述した内容は、イメージ内にスクリプトとして転記され、コンテナ起動時に source されます。

ホスト側で `APPTAINERENV_***` (`***` は任意の変数名) という環境変数を設定しておくと、コンテナ内では `***` という名前の変数として設定されます。ホスト環境に干渉せずにコンテナ内の変数を事前設定でき、イメージを再作成することなく `%environment` の設定を一時的に上書きできます。

```console
$ export APPTAINERENV_WORKFILE=/data/input.dat
$ apptainer exec ubuntu2404.sif env | grep WORKFILE
WORKFILE=/data/input.dat
```

同じ変数が複数の方法で設定されている場合、`APPTAINERENV_***` が最優先され、次に `%environment` の設定、最後にホスト側から引き継がれた値の順で適用されます。個別の変数を渡すには `--env` オプションも利用できます。

```console
$ apptainer exec --env MYVAR=abc ubuntu2404.sif env | grep MYVAR
```

#### 5.1.2 ディレクトリのバインド

Apptainer はコンテナ起動時に、次のディレクトリを自動的にバインド (コンテナ内から見えるようにマウント) します。

- ホームディレクトリ
- `/tmp`, `/var/tmp`
- `/dev`, `/proc`, `/sys`
- 起動時のカレントディレクトリ (コンテナ内に同名ディレクトリが存在する場合)

これ以外のディレクトリをバインドするには `-B` オプション (`--bind` の短縮形) を使います。ホスト側パスとコンテナ内のマウントポイントをコロンで区切って指定します (マウント先を省略すると同名パスにバインドされます)。グループ領域 `/data1/<グループ>` は自動バインドされないため、コンテナ内から利用する場合は明示的に指定してください。

```console
$ apptainer exec -B /data1/<グループ> ubuntu2404.sif ls /data1/<グループ>
$ apptainer exec -B /data1/<グループ>:/work ubuntu2404.sif ls -al /work
```

読み取り専用でマウントするには、さらにコロンで `ro` を追加します。次の例は、グループ領域に置いたリファレンスデータを読み取り専用で参照するものです。

```console
$ apptainer exec -B /data1/<グループ>/reference:/opt/data:ro ubuntu2404.sif ls -al /opt/data
```

複数のディレクトリは `-B` を列挙するか、カンマで区切って指定できます。環境変数 `APPTAINER_BIND` にあらかじめ設定しておくこともできます。

```console
$ export APPTAINER_BIND='/data1/<グループ>/input:/opt/input:ro,/data1/<グループ>/output:/opt/output'
```

!!! warning

    カレントディレクトリは既定で自動バインドされるため、`/usr/bin` や `/usr/lib` などから
    コンテナを起動すると、コンテナ内の同名ディレクトリがホスト側のもので置き換わり、
    ランタイムエラーの原因になることがあります。システムディレクトリからの起動は避けてください。

### 5.2 インスタンス化とインタラクティブ処理

`exec` や `run` はアプリケーション終了と同時にコンテナも終了するため、繰り返し実行するとコンテナ起動のオーバーヘッドが累積します。また、サーバーのように常駐するサービスの運用にも向きません。インスタンス化は、コンテナを起動したまま維持し、その中で複数のアプリケーションを実行できる機能です。

```console
$ apptainer instance start ubuntu2404.sif noble
$ apptainer instance list
INSTANCE NAME    PID       IP    IMAGE
noble            <PID>           /home/<username>/ubuntu2404.sif
```

起動中のインスタンスは `instance://<名前>` で参照できます。

```console
$ apptainer exec instance://noble cat /etc/os-release
```

多数のファイルを繰り返し処理する場合、毎回コンテナを起動する代わりにインスタンスを使うと、起動オーバーヘッドを削減してスループットを上げられます。

```bash
apptainer instance start appl.sif worker
for data in data.*
do
    apptainer exec instance://worker appl ${data}
done
apptainer instance stop worker
```

複数のインスタンスを同時に起動して、異なる環境での処理を 1 ジョブ内で並行実行することもできます。一般的には、データベースや Web サーバーなど、ノード内に何らかのサービスを起動させておく用途で利用されます。インスタンス起動時に自動実行させたい処理は、定義ファイルの `%runscript` の代わりに `%startscript` に記述します。

インスタンスの停止:

```console
$ apptainer instance stop noble
```

### 5.3 リポジトリを指定した直接実行

`exec` などにリポジトリを直接指定して実行できます。初回実行時は SIF イメージ化が行われ、`~/.apptainer` 以下にキャッシュされます。

```console
$ apptainer exec docker://ubuntu:24.04 head -n 5 /etc/os-release
```

再実行時はリポジトリに更新がないかをチェックし、キャッシュを最大限利用して同期をとった上で実行されます。更新がなければキャッシュ済みの SIF イメージが直接起動されます。

キャッシュの確認・削除:

```console
$ apptainer cache list -v
NAME                     DATE CREATED           SIZE             TYPE
1991bd789d7184290c3cce   2026-07-16 11:33:11    0.61 KiB         blob
2c999b3bd705fad8b11574   2026-07-16 18:02:14    1.01 KiB         blob
3f26bc2dec0b515f1c2818   2026-07-16 18:01:58    3.90 MiB         blob
45e09956dc667c5eff3583   2026-07-16 18:01:58    1.00 KiB         blob
4b987da45db4d6278590ab   2026-07-13 11:21:35    27.55 MiB        blob
5de55e5ef9c03399744146   2026-07-16 11:33:11    3.99 MiB         blob
7f622ca8766bccb22f0424   2026-07-13 11:21:35    0.41 KiB         blob
ab3fe4defd29ba6231229a   2026-07-16 18:01:58    0.61 KiB         blob
ac1e79f92e8f480400c312   2026-07-16 18:02:14    67.29 MiB        blob
b8ccdf7026bcaa90f19f3b   2026-07-16 18:02:14    0.61 KiB         blob
e7a1a92a5bfeee40966aea   2026-07-16 11:33:11    1.00 KiB         blob
ea17ec341c4211d1dd7f18   2026-07-13 11:21:35    2.02 KiB         blob
4980a8b73e769874ff1544   2026-07-16 18:02:16    65.32 MiB        oci-tmp
5f34df5144d4fcbe7d206e   2026-07-16 18:01:59    3.82 MiB         oci-tmp
d8695c491922692fbdb835   2026-07-16 17:25:50    27.61 MiB        oci-tmp
tmp_1601666898           2026-07-16 18:02:18    0.00 KiB         oci-tmp

There are 4 container file(s) using 96.75 MiB and 12 oci blob file(s) using 102.74 MiB of space
Total space used: 199.49 MiB

$ apptainer cache clean
```

!!! note

    この実行方法はリポジトリ側の更新に追従するため、動作実績のある実行環境を維持したい場合には
    向きません。常に最新版を取り込みたい場合などに限定して利用することをお勧めします。

### 5.4 Overlay 機能について

SIF イメージは読み込み専用ですが、Linux カーネルの OverlayFS を使って書き込み可能なレイヤーを重ね合わせることができます。方法は 2 つあります。

1. `--writable-tmpfs` オプション: メモリ上の tmpfs を一時的な書き込み領域として重ねる
2. `--overlay` オプション: 永続的な書き込み可能領域 (overlay イメージ) を別途用意して重ねる

`--writable-tmpfs` では任意の場所に新しいファイル・ディレクトリを作成できますが、イメージ内の既存ファイルの変更はできず、コンテナ終了後に変更内容は消失します。

```console
$ apptainer shell --writable-tmpfs something.sif
Apptainer> echo hogefuga > /etc/testfile        # 新規作成は可能
Apptainer> echo hogefuga > /etc/os-release      # 既存ファイルは変更不可
bash: /etc/os-release: Permission denied
```

永続的な overlay イメージは次のように作成・利用します。

```console
# 1GB の overlay イメージを作成し、マウント用ディレクトリを予め作っておく
$ apptainer overlay create --size 1024 --create-dir /usr/share/apps overlay.img

# overlay を重ねてデータを展開する (書き込みは overlay 側に保存される)
$ apptainer exec --overlay overlay.img core.sif tar xzf reference-data.tar.gz -C /usr/share/apps

# 実行時に重ね合わせる
$ apptainer exec --overlay overlay.img core.sif ls -al /usr/share/apps
```

SIF と overlay の両方に同一のファイルがある場合は overlay 側が優先されるため、イメージの部分的な改変にも活用できます。overlay イメージは ext3 形式の単なるファイルであり、`resize2fs` によるリサイズも可能です。また、`apptainer overlay create` の引数に SIF ファイルを指定すると、overlay を SIF に埋め込んで 1 ファイルで運用することもできます。

小サイズのファイルが多数あるワークロードでは、overlay に取り込んでおくことで共有ファイルシステムのメタデータアクセス負荷の軽減にも寄与します。

### 5.5 GPU の利用

理究の計算ノードは NVIDIA GB200 NVL4 構成 (Grace CPU ×2、B200 GPU ×4) で、1 ノードあたり 4 基の GPU を利用できます。GPU メモリは HBM3e で、1 GPU あたり 173.2 GiB (ノード合計 692.8 GiB) です。ホスト側の GPU ドライバは 580.159.03 で、CUDA 13.0 に対応しています (ドライバ・CUDA は執筆時点の実測値)。**コンテナ内で利用する CUDA ツールキットは 13.0 以下のバージョンである必要があります。**

コンテナ内から GPU を利用するには、`--nv` オプションを指定します。次の例は、GPU を 4 基割り当てたジョブ内での実行例です。

```console
$ apptainer exec --nv docker://ubuntu:24.04 nvidia-smi -L
GPU 0: NVIDIA GB200 (UUID: <省略>)
GPU 1: NVIDIA GB200 (UUID: <省略>)
GPU 2: NVIDIA GB200 (UUID: <省略>)
GPU 3: NVIDIA GB200 (UUID: <省略>)
```

このように、GPU を含まないイメージ (上の例では素の Ubuntu) からでもホストの GPU を認識できます。なお、ジョブ内では Slurm が割り当てた GPU のみが見えます (例: `--gpus=1` のジョブでは GPU 0 のみが表示されます)。`--nv` を指定すると、Apptainer は次の処理を行います。

1. `/dev/nvidia*` などの GPU デバイスをコンテナ内で利用可能にする (コンテナ内に `/dev/nvidia*` が現れます)
2. ホスト側の NVIDIA ドライバ関連ライブラリをコンテナ内にバインドする
3. バインドしたライブラリが使われるよう、コンテナ内の `LD_LIBRARY_PATH` を設定する

CUDA ツールキットやフレームワーク (PyTorch 等) はコンテナイメージ側に含め、ドライバはホスト側のものを `--nv` で取り込む、という分担が基本です。GPU 用イメージは NVIDIA NGC (`docker://nvcr.io/...`) から arm64 (aarch64) 版を取得できます ([3.2 節](#32-コマンドラインでのイメージ作成)・[7.1 節](#71-アーキテクチャに関する注意) を参照)。

ジョブでの GPU の要求は `--gpus=N` オプションで行います ([6 節](#6-ジョブスケジューラ-slurm-との連携) を参照)。

### 5.6 MPI 並列

!!! note

    本節の各方式は、単純な MPI プログラム (MPI_Allreduce) の疎通を、ノード内 (4 ランク)・
    2 ノード (8 ランク) で確認しています。InfiniBand/UCX が実際に使われているかの確認や
    通信性能、GPU 対応 MPI、実アプリケーション固有の互換性は未確認のため、本番利用の前に
    各自のイメージ構成で確認してください。

#### 5.6.1 ノード内並列

1 ノード内で完結する MPI 並列は、コンテナ内で `mpirun` / `mpiexec` を起動するだけで実行できます。プロセスマネージャがコンテナ内で直接アプリケーションを起動するため、コンテナ外との連携は不要です。コンテナ内に MPI ランタイムが含まれていることが前提です。

```console
$ apptainer exec mpi-apps.sif mpiexec --bind-to none -np 8 ~/myapps/hoge inputfile
```

理究のジョブ内では、既定のプロセスバインドがジョブに割り当てられたコアと衝突して失敗するため (`hwloc_set_cpubind` エラー)、`--bind-to none` を指定します (プロセス配置を制御したい場合は、アプリケーション・ジョブ側で調整してください)。なお、HPC-X ビルドの Open MPI を内蔵するイメージ (NGC の nvhpc 系など) では、ノード内実行でも [5.6.4 節](#mpi-container-pmix) の注記にある `OPAL_PREFIX` / `LD_LIBRARY_PATH` の指定が必要です。

この場合、起動されるコンテナは 1 つだけで、その中で複数のプロセスが動作します。

#### 5.6.2 マルチノード並列の考え方

複数ノードにまたがる MPI 並列を、ノード内並列と同じ方法で起動することはできません。他ノードでのプロセス起動時点ではコンテナ環境が立ち上がっていないためです。マルチノード並列では、プロセスの起動にコンテナ起動を含める、すなわち **ホスト側のプロセスマネージャから `apptainer exec` を起動する** 形をとります。ノード内並列とは `mpirun` (`srun`) と `apptainer` の順番が逆になっている点に注意してください。

理究では、複数ノードの確保は GPU 数の指定で行います (1 ノード 4 基のため、`--gpus=8` で 2 ノード。[6 節](#6-ジョブスケジューラ-slurm-との連携) を参照)。確保した複数ノードへのコンテナ起動は、Slurm の PMIx 連携を用いた次の形で動作することを確認済みです (`--gpus=8 --ntasks-per-node=4` のジョブで、2 ノード×4 タスクの計 8 コンテナが起動)。

```console
# --gpus=8 --ntasks-per-node=4 のジョブ内で実行した例 (2 ノードが確保されている状態)
$ srun --mpi=pmix apptainer exec ubuntu2404.sif hostname
c146
c146
c146
c146
c147
c147
c147
c147
```

この方式では、ホスト側とコンテナ内の MPI が連携して動作する必要があるため、両者のバージョン整合が重要になります。理究では次の 2 つの方式を利用できます。

#### 5.6.3 ホスト提供 MPI のバインド方式 (第一選択)

理究のホスト側には NVIDIA HPC-X (`nvhpc-hpcx` モジュール) が用意されています (提供バージョンは `module avail` で確認してください)。HPC-X は HPC SDK (`/shared/software/hpc_sdk`。読み取り専用のシステムソフトウェア領域) の一部として導入されており、Open MPI 5.0 系 (執筆時点の実測では 5.0.10rc2) ベースです。HPC-X は GB200 GPU と InfiniBand 相互結合網に最適化されており、**ホスト側の HPC-X をコンテナにバインドして利用する方式が、相互結合網と GPU の性能を引き出す推奨経路です**。

モジュールをロードすると `mpirun` 等が PATH に追加されます。Open MPI や UCX の実体ライブラリは HPC SDK ツリー側にあるため、コンテナへのバインドは HPC SDK のディレクトリごと行い、コンテナ内にライブラリの場所を環境変数で伝えます。アプリケーションはホスト側の `mpicc` (モジュールロード後に利用可) でビルドすると、ホスト MPI と ABI が一致し確実です。

```bash
#!/bin/bash
#SBATCH -A <プロジェクトID>
#SBATCH --gpus=8
#SBATCH --ntasks-per-node=4
#SBATCH --time=01:00:00

module load nvhpc-hpcx

# ホスト側 Open MPI の場所 (OPAL_PREFIX) を mpirun の実体パスから求める
OMPI_PREFIX=$(readlink -f "$(which mpirun)"); OMPI_PREFIX=${OMPI_PREFIX%/bin/mpirun}
UCX_LIB=<UCX の lib ディレクトリ>   # HPC SDK 内の hpcx-*/ucx*/lib (libucp.so のある場所。
                                    # 例: find /shared/software/hpc_sdk -name libucp.so で確認)

mpirun --bind-to none -np 8 apptainer exec --nv -B /shared/software/hpc_sdk \
  --env OPAL_PREFIX=$OMPI_PREFIX \
  --env LD_LIBRARY_PATH=$OMPI_PREFIX/lib:$UCX_LIB \
  mpi-apps.sif ~/myapps/hoge inputfile
```

!!! note

    この方式で 2 ノード×8 ランクの MPI_Allreduce 疎通を確認済みです
    (検証の範囲は本節冒頭の注記を参照)。

#### 5.6.4 代替: コンテナ内蔵 Open MPI + srun --mpi=pmix { #mpi-container-pmix }

ホスト側 MPI に依存せず、コンテナの可搬性を優先したい場合は、コンテナ内に Open MPI を内蔵し、Slurm の PMIx 連携でプロセスを起動する方式が利用できます。

```console
$ srun --mpi=pmix apptainer exec mpi-apps.sif ~/myapps/hoge inputfile
```

この方式では、ホスト側の Slurm (PMIx プラグイン) が各ノードでコンテナを起動し、コンテナ内蔵の MPI ランタイムが PMIx を介してプロセス群を集合させます。

!!! note

    NGC の nvhpc 系イメージなど、HPC-X ビルドの Open MPI を内蔵するイメージは、ビルド時の
    インストール先パスが焼き込まれているため、そのままでは MPI_Init に失敗します
    (`PML ob1 cannot be selected` 等)。実行時に
    `--env OPAL_PREFIX=<コンテナ内の ompi プレフィックス>` と
    `--env LD_LIBRARY_PATH=<ompi/lib>:<ucx/lib>` を指定してください
    (プレフィックスはコンテナ内の `hpc_sdk/**/hpcx-*/ompi` を探して確認します)。

コンテナ内蔵の Open MPI 4.1 系とホスト側 `pmix_v5` の組み合わせで、2 ノード×8 ランクの MPI_Allreduce 疎通を確認済みです。実行時に共有メモリ転送の UCX ERROR (`mm_posix ... Permission denied`) が多数出力されることがありますが、別のトランスポートにフォールバックして正常に完走します。別系統の MPI を内蔵する場合は、事前に疎通確認してください。

## 6. ジョブスケジューラ (Slurm) との連携

理究のジョブスケジューラは Slurm です。Apptainer はホスト環境との親和性が高く、ジョブスクリプト内でコンテナであることをあまり意識せずに利用できます。

ジョブの資源要求は、次のポリシーに従ってください。

- **GPU は必ず `--gpus=N` (短縮形 `-G N`) で要求します。** 指定できる GPU 数は 1〜4・8・12・16 です。`--gres=gpu:...` や `--gpus-per-node` による指定はジョブ投入時にエラーになります。
- **ノード数は利用者が `-N` で指定しません。** 要求した GPU 数から自動的に決定されます (1 ノード 4 基。例えば `--gpus=8` なら 2 ノード)。ノードの配置はスケジューラに任せます。
- GPU を使わないジョブ (イメージのビルド等) では `--gpus` の指定は不要です。
- パーティションは既定の `gpu` が使用されるため、指定は不要です (最大実行時間は 96 時間)。
- 経過時間は `--time=HH:MM:SS` で指定します。
- `#SBATCH -A` (`--account=`) には **課題 (プロジェクト) の ID** (rkpXXXXX 形式。例: `rkp00010`) を指定します。ログインユーザー名ではありません。複数の課題に所属している場合は、課金対象とする課題の指定が必要です。自分の課題 ID は `sacctmgr -n show assoc user=$USER format=account,user,qos` で確認できます (課題未所属のアカウントでは空になります)。

### 6.1 シンプルな実行

ホームディレクトリの SIF イメージ内でアプリケーションを実行する基本的なジョブスクリプトの例です。

```bash
#!/bin/bash
#SBATCH -A <プロジェクトID>
#SBATCH --gpus=1
#SBATCH --time=00:15:00

export OMP_NUM_THREADS=8
export APPTAINERENV_MYCODE_CONFIG=/usr/share/MyApps/config.json
apptainer exec ~/ubuntu2404.sif python3 ~/mycode/test.py
```

```console
$ sbatch ./job.sh
```

この例のアプリケーションは GPU を使いませんが、`--gpus=1` により 1 GPU 分の CPU コア・メモリが割り当てられるため、`OMP_NUM_THREADS=8` のようなスレッド並列にも対応できます。GPU を使わないジョブでは `--gpus` を省略することもできます。

GPU を利用する場合は、`--gpus=N` で必要な GPU 数を要求し、`--nv` を付けて実行します。

```bash
#!/bin/bash
#SBATCH -A <プロジェクトID>
#SBATCH --gpus=4
#SBATCH --time=01:00:00

apptainer exec --nv ~/cuda-app.sif python3 ~/mycode/train.py
```

### 6.2 実行方法のイメージへの埋め込み

`%environment` と `%runscript` をイメージに設定しておくと、ジョブスクリプトを極めてシンプルにできます。

定義ファイル:

```text
Bootstrap: docker
From: ubuntu:24.04

%environment
    export OMP_NUM_THREADS=8
    export MYCODE_CONFIG=/usr/share/MyApps/hoge.json

%runscript
    python3 /usr/share/MyApps/hoge.py "$@"
```

このイメージを `hoge` という名前で PATH の通ったディレクトリに実行属性付きで保存しておくと、ジョブスクリプトは通常のアプリケーション実行と変わらなくなります。

```bash
#!/bin/bash
#SBATCH -A <プロジェクトID>
#SBATCH --time=00:15:00

hoge input.txt
```

### 6.3 MPI 並列ジョブ

マルチノード MPI の実行方式は [5.6 節](#56-mpi-並列) を参照してください。コンテナ内蔵 Open MPI + PMIx 方式のジョブスクリプト例を示します (`--gpus=8` により 2 ノードが確保され、`--ntasks-per-node=4` との組み合わせで 2 ノード×4 タスクの計 8 タスクで実行されることを確認済みです)。

```bash
#!/bin/bash
#SBATCH -A <プロジェクトID>
#SBATCH --gpus=8
#SBATCH --ntasks-per-node=4
#SBATCH --time=01:00:00

srun --mpi=pmix apptainer exec --nv ~/mpi-apps.sif ~/myapps/hoge inputfile
```

利用可能な MPI プラグインは `srun --mpi=list` で確認できます。

```console
$ srun --mpi=list
MPI plugin types are...
	none
	cray_shasta
	pmi2
	pmix
specific pmix plugin versions available: pmix_v5
```

### 6.4 インタラクティブ実行

計算ノードを対話的に利用するには `salloc` でノードを確保し、`srun` でシェルを起動します。

```console
$ salloc -A <プロジェクトID> --gpus=1 --time=00:30:00
$ srun --pty bash -i
[<username>@<計算ノード> ~]$ apptainer shell ubuntu2404.sif
Apptainer>
```

インタラクティブジョブ内では、本章で紹介したすべての操作 (イメージのビルド、sandbox の編集、GPU を使った動作確認など) を対話的に実行できます。

## 7. 理究特有の注意点

### 7.1 アーキテクチャに関する注意

理究はログインノード・計算ノードとも aarch64 (Arm) アーキテクチャです。コンテナはハードウェアのエミュレーションを行わないため、**x86_64 (amd64) 用のイメージは理究では動作しません**。イメージを取得する際は、arm64 (aarch64) 版が提供されていることを確認してください。理究上で `pull` / `build` した場合は自動的に arm64 版が選択されますが、イメージによっては arm64 版が提供されていないことがあります。

手元にある SIF イメージのアーキテクチャは、`sif list` コマンドで確認できます。

```console
$ apptainer sif list sample.sif
------------------------------------------------------------------------------
ID   |GROUP   |LINK    |SIF POSITION (start-end)  |TYPE
------------------------------------------------------------------------------
1    |1       |NONE    |32176-32214               |Def.FILE
2    |1       |NONE    |32214-36205               |JSON.Generic
3    |1       |NONE    |36205-36438               |JSON.Generic
4    |1       |NONE    |36864-28946432            |FS (Squashfs/*System/arm64)
```

TYPE 欄に `FS (Squashfs/*System/arm64)` のようにアーキテクチャが表示されます。`arm64` であれば理究で実行できます。

### 7.2 イメージ取得に関する注意

理究からの `docker://` によるイメージ取得は、内部のレジストリミラー (zot) を経由します。docker.io (Docker Hub)・nvcr.io (NVIDIA NGC)・quay.io のイメージが利用できます。

### 7.3 イメージのビルドと作業領域

理究では一般ユーザー権限のまま `--fakeroot` オプションが利用でき、ホームディレクトリ上でもビルドが可能です。特別な準備は必要ありません。ビルドと内部ミラーからのイメージ取得は、ログインノード・計算ノードのどちらでも動作することを確認済みです。ただし、`%post` などでの外部からのパッケージ取得には外部ネットワークへの到達制限があります ([4.2 節](#42-定義ファイルによるカスタムイメージ) の警告を参照)。

sandbox の展開やビルド時の一時ファイルは多数の小ファイルを生成するため、共有ファイルシステムには負荷がかかります。大きめのビルド作業は、スクラッチ領域 (`/tmp`) を作業領域とすることを推奨します ([3.1 節](#31-理究の-apptainer-環境)・[4.1 節](#41-sandbox-を用いる方法)・[4.4 節](#44-ジョブ投入によるイメージ作成) を参照)。スクラッチ領域はジョブ終了時に削除されるため、成果物はホーム領域またはグループ領域へコピーしてください。

### 7.4 マルチノード MPI について

コンテナを用いたマルチノード MPI は、ホスト HPC-X のバインド方式・コンテナ内蔵 Open MPI + PMIx 方式のいずれも、2 ノード×8 ランクの MPI_Allreduce 疎通まで確認済みです ([5.6 節](#56-mpi-並列) を参照)。InfiniBand/UCX が実際に使われているかの確認や通信性能、GPU 対応 MPI、実アプリケーション固有の互換性は未確認のため、本番利用の前に各自のイメージ構成で小規模な動作確認を行ってください。

### 7.5 トラブルシューティング

| 症状 | 主な原因 | 参照 |
|---|---|---|
| コンテナ実行時に `exec format error` が出る | x86_64 (amd64) 用イメージを取得している | [7.1 節](#71-アーキテクチャに関する注意) |
| `%post` の `apt-get` がタイムアウトする | 外部 HTTP (ポート 80) への到達制限 | [4.2 節](#42-定義ファイルによるカスタムイメージ) |
| GPU アプリケーションが CUDA エラーで動かない | コンテナ内の CUDA がホスト対応バージョン (13.0) を超えている | [5.5 節](#55-gpu-の利用) |
| MPI_Init が失敗する (存在しないパスを探す / `PML ob1 cannot be selected`) | HPC-X 系ビルドの Open MPI は実行時に `OPAL_PREFIX` と `LD_LIBRARY_PATH` の指定が必要 | [5.6.4 節](#mpi-container-pmix) |
| `mpirun` が `hwloc_set_cpubind` エラーで失敗する | 既定のプロセスバインドがジョブ割当コアと衝突 | [5.6.1 節](#561-ノード内並列) (`--bind-to none`) |
