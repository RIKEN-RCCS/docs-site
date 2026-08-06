# コンテナの使い方

## はじめに { #introduction }

本ページでは、コンテナプラットフォームApptainerを利用する方法を説明します。

!!! note

    本ページのコマンド例では、次のプレースホルダを使用します。自身の環境に読み替えてください。

    | 表記 | 意味 |
    |---|---|
    | `USERNAME` | 自分のログインユーザ名 |
    | `PROJECT_NAME` | 自分の課題（プロジェクト）のID（rkpXXXXX形式。例：`rkp00010`） |
    | `GROUP` | 自分の所属グループ名（グループ領域`/data1/GROUP`のディレクトリ名） |

### コンテナ { #container }

コンテナは仮想化技術の一種で、ホスト側のカーネルを共有したまま、ルートディレクトリ以下のユーザ環境のみを切り替えて専用の環境でアプリケーションを実行する方式です。

次のような利点があります。

1. カーネルは起動済みのものを共有するため、起動が高速でオーバーヘッドが小さい
2. OS環境・アプリケーション・設定を1つにまとめられ、再現性が高い
3. 一度作成したイメージを複数のシステムで再利用でき、環境構築・検証の手間を減らせる

一方で、次の制限があります。

- コンテナはハードウェアのエミュレーションを行わないため、CPUアーキテクチャ（aarch64 / x86_64など）が異なるイメージは動作しない
- カーネルはホスト側のものを使うため、カーネルバージョンやドライバに依存する機能には注意が必要

### コンテナイメージ { #container-image }

コンテナイメージは、ホストとは別のOS環境・ランタイム・アプリケーションをファイルシステムとして構築し、ファイルに保存したものです。

ApptainerはSIF（Singularity Image Format）と呼ばれる単一ファイル形式を採用しています。ランタイムを含む実行環境一式を1ファイルとして所有でき、保存・転送が容易です。また、Docker Hubなどで配布されている他形式のコンテナイメージを取得してSIFに変換したり、直接実行したりすることもできます。

### 実行 { #execution }

Apptainerはコンテナの起動とアプリケーションの起動を統合しており、コンテナ内のアプリケーションを、あたかもスタティックリンクされた1つのバイナリのように実行できます。

実行方法は大きく4通りあります。

1. コンテナ起動時にシェルを起動し、手動で操作する（`apptainer shell`）
2. イメージ内の任意のコマンドをコンテナ起動と同時に実行する（`apptainer exec`）
3. イメージ内に事前設定されたコマンドを実行する（`apptainer run` / SIFの直接実行）
4. コンテナのみ起動しておき、外部からコマンドを投入する（`apptainer instance`）

バッチジョブでは通常2. と3. を使います。4. は多数のデータを繰り返し処理する場合や、Jupyter Notebookなどのサービスを立ち上げておく場合に適しています。

## 利用の手順 { #getting-started }

本節では、既存イメージの取得からコンテナ起動までの基本的な流れを説明します。イメージを入手・作成する方法は3通りあります。

1. Docker Hubなどで公開されている既存イメージを取得して再利用する
2. イメージをファイルシステムに展開（sandbox化）し、手作業で変更する
3. 定義ファイルを書いてビルドを自動化する

手作業（2.）はデバッグには便利ですが、再現性の観点からは、定義ファイル（3.）をリポジトリ等で管理してビルドする方法を推奨します。ベースイメージにはDocker Hubで配布されているUbuntu、AlmaLinux、Red Hat Universal Base Image（UBI）などの利用を想定しています。

!!! note

    本システムはログインノード・計算ノードともaarch64アーキテクチャです。イメージの取得・作成・実行のいずれもアーキテクチャの食い違いを気にせず行えますが、取得するイメージはarm64（aarch64）版である必要があり、x86_64（amd64）用のイメージは動作しません。本システム上で`pull` / `build`した場合は自動的にarm64版が選択されますが、イメージによってはarm64版が提供されていないことがあります。

### コマンドラインでのイメージ作成 { #build-image-cli }

公開リポジトリからイメージを取得するには`pull`コマンドを使います。`docker://`に続けてイメージ名とタグを指定します。本システムからの取得は内部のレジストリミラー（zot）を経由し、docker.io（Docker Hub）・nvcr.io（NVIDIA NGC）・quay.ioのイメージが利用できます。

```console
apptainer pull ubuntu2404.sif docker://ubuntu:24.04
apptainer pull alma9.sif docker://almalinux:9
apptainer pull cuda13-base.sif docker://nvcr.io/nvidia/cuda:13.0.0-base-ubuntu24.04
apptainer pull busybox.sif docker://quay.io/prometheus/busybox:latest
```

取得の際、Docker形式のイメージレイヤはSIF形式に変換され、レイヤデータは`~/.apptainer/cache`以下にキャッシュされます。SIFイメージの実体はSquashFS形式で、起動すると読み込み専用になります。イメージにアプリケーションを追加するには、後述の定義ファイルによるビルド、またはファイルシステムに展開するsandboxを利用します。

sandboxは、`build`コマンドに`--sandbox`オプションを付けて作成します。

```console
apptainer build --sandbox ubuntu2404 docker://ubuntu:24.04
```

sandbox内のファイルはユーザ自身がオーナとなり、コンテナを起動しなくても直接編集できます。ただし、sandboxからコンテナを起動した場合も既定では読み込み専用です。書き込み可能な状態で起動するには`--writable`オプションを指定します（SIFイメージでは指定できません）。また、root権限を前提とする`apt` / `dnf` / `rpm`などのパッケージ管理コマンドを使うには`--fakeroot`オプションが必要です。

!!! note

    本システムから外部へのHTTP接続は制限されており、`apt`などによる外部からのパッケージ取得は失敗することがあります。

SIFとsandboxは相互に変換できます。

```console
apptainer build from_sandbox.sif ubuntu2404
apptainer build --sandbox from_sif ubuntu2404.sif
```

手元にあるSIFイメージのアーキテクチャは、`sif list`コマンドで確認できます。

```console
apptainer sif list sample.sif
```

出力例：

```text
------------------------------------------------------------------------------
ID   |GROUP   |LINK    |SIF POSITION (start-end)  |TYPE
------------------------------------------------------------------------------
1    |1       |NONE    |32176-32214               |Def.FILE
2    |1       |NONE    |32214-36205               |JSON.Generic
3    |1       |NONE    |36205-36438               |JSON.Generic
4    |1       |NONE    |36864-28946432            |FS (Squashfs/*System/arm64)
```

TYPE欄に`FS (Squashfs/*System/arm64)`のようにアーキテクチャが表示されます。`arm64`であれば本システムで実行できます。

### イメージからのコンテナ起動 { #run-container }

`shell`コマンドでコンテナを起動し、シェルで対話的に操作できます。ここでは、ホストと異なるディストリビューションの例として、[コマンドラインでのイメージ作成](#build-image-cli)で取得したAlmaLinuxイメージを起動してみます。

```console
apptainer shell alma9.sif
Apptainer> cat /etc/os-release
NAME="AlmaLinux"
VERSION="9.8 (Olive Jaguar)"
...
```

ホストOSはUbuntuですが、コンテナ内ではイメージのOS環境（この例ではAlmaLinux）に切り替わり、イメージ内のコマンド・ライブラリのみが利用可能になります。カーネルとユーザはホスト側のものがそのまま使われます。

コンテナ内からは自身のホームディレクトリがそのまま見えます（他ユーザのホームディレクトリは見えません）。コンテナ内の`/etc/passwd`には起動時に自身のエントリーのみが追加されます。また、プロセス空間はホストと共有されるため、`ps`や`kill`はコンテナ内外で相互に有効です。

`exec`コマンドを使うと、コンテナ起動と同時に任意のコマンドを実行できます。

```console
apptainer exec ubuntu2404.sif cat /etc/os-release
```

SIFファイルには実行属性が付いており、スクリプトのように直接起動することもできます。

```console
./ubuntu2404.sif                      # イメージ内のシェルまたは %runscript を起動
./ubuntu2404.sif cat /etc/os-release
```

!!! tip

    イメージ内容を固定して運用したい場合や、起動オーバーヘッドを最小化したい場合は、SIFイメージでの利用を推奨します。SIFは内部が圧縮されており、総ファイル量に比してサイズが小さく、メタデータアクセスの負荷も低いため、アプリケーションの起動が高速かつ安定します。

## イメージの作成 { #building-images }

本節では、実行用のSIFイメージを作成する方法を説明します。

### sandboxを用いる方法 { #sandbox }

sandboxを編集してSIFに固める方法です。手軽な反面、作業履歴が残らないため、確定した手順は定義ファイルに保存することを推奨します。

コンテナを起動せずに済む場合は、既成のアプリケーションやリファレンスデータをsandboxに展開して固めるだけです。

```console
apptainer build --sandbox ubi9_py312 docker://registry.access.redhat.com/ubi9/python-312
tar xvzf ~/application.tar.gz -C ubi9_py312
vi ubi9_py312/usr/local/etc/application.config
apptainer build appl.sif ubi9_py312
```

パッケージの追加など、コンテナを起動してシステムを変更する場合は、`--writable`と`--fakeroot`を指定してsandboxを編集します。

```console
apptainer build --sandbox /tmp/ubuntu-sandbox ubuntu2404.sif
apptainer shell --fakeroot --writable /tmp/ubuntu-sandbox
Apptainer> apt-get update
Apptainer> apt-get install -y XXXXXXX
Apptainer> exit
apptainer build ~/from-sandbox.sif /tmp/ubuntu-sandbox
```

!!! tip

    sandboxは多数の小ファイルで構成されるため、共有ファイルシステム（ホーム領域・グループ領域）上に置くとメタデータアクセスの負荷が大きくなります。sandboxの作成・編集はスクラッチ領域（`/tmp`）上で行うことを推奨します。スクラッチ領域はジョブ終了時に削除されるため、完成したSIFイメージはホーム領域またはグループ領域に保存してください。

### 定義ファイルによるカスタムイメージ { #definition-file }

定義ファイルを書くと、イメージのビルドを自動化・再現可能にできます。定義ファイルは主に次の要素で構成されます。

1. ヘッダ（`Bootstrap:`, `From:`）: ベースイメージの指定
2. `%files`: ホストからイメージへのファイル取り込み
3. `%post`: イメージ内で実行する構築処理（パッケージ追加など）
4. `%environment` / `%runscript`: 実行時の環境変数と既定コマンドの定義
5. `%labels`: メタデータ

例として、Ubuntu 24.04をベースにパッケージとデータを追加する定義ファイル`example.def`を示します。

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
    Author USERNAME@example.org
```

ビルドは`build`コマンドに`--fakeroot`を付けて実行します。

```console
apptainer build --fakeroot ~/from_def.sif example.def
```

!!! tip

    ビルド時の一時展開先は既定でスクラッチ領域（`/tmp`）が使われます。一時領域を明示したい場合は、環境変数`APPTAINER_TMPDIR`で展開先を、`APPTAINER_CACHEDIR`でキャッシュ先を変更できます。ホーム領域の容量を圧迫したくない場合は、`APPTAINER_CACHEDIR`をスクラッチ領域やグループ領域（`/data1/GROUP`）に向けることも有効です。

### 実行環境の埋め込み { #embed-runtime-env }

定義ファイルの`%runscript`に実行コマンドを記述しておくと、SIFイメージを直接実行するだけでアプリケーションを起動できます。[定義ファイルによるカスタムイメージ](#definition-file)の`example.def`では`%runscript`に`python3 "$@"`を設定しているため、次のように使えます。

```console
./from_def.sif hoge.py 1024      # → コンテナ内で python3 hoge.py 1024 が実行される
```

`%environment`に環境変数を埋め込んでおけば設定漏れを防止でき、ジョブスクリプトも簡素になります（[実行方法のイメージへの埋め込み](#slurm-embedded-runscript)を参照）。

!!! note

    定義ファイルの`From:`に`latest`タグを指定すると、ビルドのたびに取得される内容が変わる可能性があります。再現性を重視する場合は、バージョンを固定したタグを指定してください。

### ジョブ投入によるイメージ作成 { #build-via-job }

軽量なイメージであればログインノード上で直接ビルドできますが、多数のパッケージをインストールする大規模なビルドはCPU・メモリ・ストレージへの負荷が大きいため、バッチジョブとして計算ノードで実行することを推奨します。ビルド時の一時ファイルは多数の小ファイルを生成して共有ファイルシステムに負荷をかけるため、作業領域にはスクラッチ領域（`/tmp`）を使い、成果物のみホーム領域またはグループ領域へコピーしてください。

ジョブスクリプトの例を示します（資源の要求方法は [Slurmとの連携](#slurm)を参照）。

```bash
#!/bin/bash
#SBATCH -A PROJECT_NAME
#SBATCH --time=01:00:00

# スクラッチ領域 (/tmp。ジョブ終了時に削除) を作業領域にしてビルドし、
# 成果物のみホーム領域 (大きい場合はグループ領域) に保存する
export APPTAINER_TMPDIR=/tmp/build
mkdir -p $APPTAINER_TMPDIR
apptainer build --fakeroot $APPTAINER_TMPDIR/create_job.sif ~/example.def
cp $APPTAINER_TMPDIR/create_job.sif ~/
```

```console
sbatch ./build_job.sh
```

### 電子署名によるイメージ管理 { #image-signing }

Apptainerは公開鍵暗号によるイメージの署名・検証機能を持ち、イメージの作成者と改竄の有無を確認できます。

キーペアの作成:

```console
apptainer key newpair
```

名前・メールアドレス・コメント・パスフレーズを対話的に入力します。作成した鍵は`~/.apptainer`以下に保存され、次のコマンドで確認できます。

```console
apptainer key list           # 公開鍵の一覧
apptainer key list --secret  # 秘密鍵の一覧
```

署名と検証:

```console
apptainer sign ubuntu2404.sif     # パスフレーズを入力して署名
apptainer verify ubuntu2404.sif   # 署名者・フィンガープリント・検証結果を表示
```

`verify`による検証には署名者の公開鍵が必要です。署名されていないイメージを`verify`すると、次のように "signature not found" エラーで失敗します。

```console
apptainer verify unsigned.sif
```

出力例：

```text
INFO:    Verifying image with PGP key material
WARNING: No default remote in use, falling back to default keyserver: https://keys.openpgp.org
FATAL:   Failed to verify container: integrity: signature not found for object group 1
```

!!! note

    上の出力にあるとおり、手元に該当する公開鍵がない場合、既定では外部のキーサーバ（keys.openpgp.org）が参照されます。

公開鍵のエクスポート・インポート:

```console
apptainer key export ./public.asc
apptainer key import ./public.asc
```

1つのイメージに複数の署名を付けられるため、作成者と管理者による多段階の承認といった運用も可能です。

## 実行時オプションと挙動 { #runtime-options }

### ホスト側の環境の取り込み { #host-environment }

#### 環境変数の取り扱い { #env-vars }

Apptainerはコンテナ起動時に、ホスト側の環境変数をほぼすべてコンテナ内に引き継ぎます。ただし`PATH`と`LD_LIBRARY_PATH`は例外で、コンテナ側で再設定されます。定義ファイルの`%environment`セクションに記述した内容は、イメージ内にスクリプトとして転記され、コンテナ起動時に読み込まれます。

ホスト側で`APPTAINERENV_***`（`***`は任意の変数名）という環境変数を設定しておくと、コンテナ内では`***`という名前の変数として設定されます。ホスト環境に干渉せずにコンテナ内の変数を事前設定でき、イメージを再作成することなく`%environment`の設定を一時的に上書きできます。

```console
export APPTAINERENV_WORKFILE=/data/input.dat
apptainer exec ubuntu2404.sif env | grep WORKFILE
```

出力例：

```text
WORKFILE=/data/input.dat
```

同じ変数が複数の方法で設定されている場合、`APPTAINERENV_***`が最優先され、次に`%environment`の設定、最後にホスト側から引き継がれた値の順で適用されます。個別の変数を渡すには`--env`オプションも利用できます。

```console
apptainer exec --env MYVAR=abc ubuntu2404.sif env | grep MYVAR
```

#### ディレクトリのバインド { #bind-directories }

Apptainerはコンテナ起動時に、次のディレクトリを自動的にバインド（コンテナ内から見えるようにマウント）します。

- ホームディレクトリ
- `/tmp`, `/var/tmp`
- `/dev`, `/proc`, `/sys`
- 起動時のカレントディレクトリ（コンテナ内に同名ディレクトリが存在する場合）

これ以外のディレクトリをバインドするには`-B`オプション（`--bind`の短縮形）を使います。ホスト側パスとコンテナ内のマウントポイントをコロンで区切って指定します（マウント先を省略すると同名パスにバインドされます）。グループ領域`/data1/GROUP`は自動バインドされないため、コンテナ内から利用する場合は明示的に指定してください。

```console
apptainer exec -B /data1/GROUP ubuntu2404.sif ls /data1/GROUP
apptainer exec -B /data1/GROUP:/work ubuntu2404.sif ls -al /work
```

読み取り専用でマウントするには、さらにコロンで`ro`を追加します。次の例は、グループ領域に置いたリファレンスデータを読み取り専用で参照するものです。

```console
apptainer exec -B /data1/GROUP/reference:/opt/data:ro ubuntu2404.sif ls -al /opt/data
```

複数のディレクトリは`-B`を列挙するか、カンマで区切って指定できます。環境変数`APPTAINER_BIND`にあらかじめ設定しておくこともできます。

```console
export APPTAINER_BIND='/data1/GROUP/input:/opt/input:ro,/data1/GROUP/output:/opt/output'
```

!!! warning

    カレントディレクトリは既定で自動バインドされるため、`/usr/bin`や`/usr/lib`などからコンテナを起動すると、コンテナ内の同名ディレクトリがホスト側のもので置き換わり、ランタイムエラーの原因になることがあります。システムディレクトリからの起動は避けてください。

### インスタンス化によるコンテナの常駐 { #instances }

`exec`や`run`はアプリケーション終了と同時にコンテナも終了するため、繰り返し実行するとコンテナ起動のオーバーヘッドが累積します。また、サーバのように常駐するサービスの運用にも向きません。インスタンス化は、コンテナを起動したまま維持し、その中で複数のアプリケーションを実行できる機能です。

```console
apptainer instance start ubuntu2404.sif noble
apptainer instance list
```

出力例：

```text
INSTANCE NAME    PID       IP    IMAGE
noble            PID           /home/USERNAME/ubuntu2404.sif
```

起動中のインスタンスは`instance://INSTANCE_NAME`で参照できます。

```console
apptainer exec instance://noble cat /etc/os-release
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

複数のインスタンスを同時に起動して、異なる環境での処理を1ジョブ内で並行実行することもできます。一般的には、データベースやWebサーバなど、ノード内に何らかのサービスを起動させておく用途で利用されます。インスタンス起動時に自動実行させたい処理は、定義ファイルの`%runscript`の代わりに`%startscript`に記述します。

インスタンスの停止:

```console
apptainer instance stop noble
```

### リポジトリを指定した直接実行 { #run-from-repository }

`exec`などにリポジトリを直接指定して実行できます。初回実行時はSIFイメージ化が行われ、`~/.apptainer`以下にキャッシュされます。

```console
apptainer exec docker://ubuntu:24.04 head -n 5 /etc/os-release
```

再実行時はリポジトリに更新がないかをチェックし、キャッシュを最大限利用して同期をとった上で実行されます。更新がなければキャッシュ済みのSIFイメージが直接起動されます。

キャッシュの確認・削除:

```console
apptainer cache list -v
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

apptainer cache clean
```

!!! note

    この実行方法はリポジトリ側の更新に追従するため、動作実績のある実行環境を維持したい場合には向きません。常に最新版を取り込みたい場合などに限定して利用することをお勧めします。

### Overlay機能について { #overlay }

SIFイメージは読み込み専用ですが、LinuxカーネルのOverlayFSを使って書き込み可能なレイヤを重ね合わせることができます。方法は2つあります。

1. `--writable-tmpfs`オプション: メモリ上のtmpfsを一時的な書き込み領域として重ねる
2. `--overlay`オプション: 永続的な書き込み可能領域（overlayイメージ）を別途用意して重ねる

`--writable-tmpfs`では任意の場所に新しいファイル・ディレクトリを作成できますが、イメージ内の既存ファイルの変更はできず、コンテナ終了後に変更内容は消失します。

```console
apptainer shell --writable-tmpfs something.sif
Apptainer> echo hogefuga > /etc/testfile        # 新規作成は可能
Apptainer> echo hogefuga > /etc/os-release      # 既存ファイルは変更不可
bash: /etc/os-release: Permission denied
```

永続的なoverlayイメージは次のように作成・利用します。

```console
# 1GB の overlay イメージを作成し、マウント用ディレクトリを予め作っておく
apptainer overlay create --size 1024 --create-dir /usr/share/apps overlay.img

# overlay を重ねてデータを展開する (書き込みは overlay 側に保存される)
apptainer exec --overlay overlay.img core.sif tar xzf reference-data.tar.gz -C /usr/share/apps

# 実行時に重ね合わせる
apptainer exec --overlay overlay.img core.sif ls -al /usr/share/apps
```

SIFとoverlayの両方に同一のファイルがある場合はoverlay側が優先されるため、イメージの部分的な改変にも活用できます。overlayイメージはext3形式の単なるファイルであり、`resize2fs`によるリサイズも可能です。また、`apptainer overlay create`の引数にSIFファイルを指定すると、overlayをSIFに埋め込んで1ファイルで運用することもできます。

小サイズのファイルが多数あるワークロードでは、overlayに取り込んでおくことで共有ファイルシステムのメタデータアクセス負荷の軽減にも寄与します。

## GPUとMPI { #gpu-and-mpi }

### GPUの利用 { #gpu }

ホスト側のGPUドライバはCUDA 13.0に対応していますが、コンテナ内で利用するCUDAツールキットは13.0以下のバージョンである必要があります。

コンテナ内からGPUを利用するには、`--nv`オプションを指定します。次の例は、GPUを4基割り当てたジョブ内での実行例です。

```console
apptainer exec --nv docker://ubuntu:24.04 nvidia-smi -L
```

出力例：

```text
GPU 0: NVIDIA GB200 (UUID: OMITTED)
GPU 1: NVIDIA GB200 (UUID: OMITTED)
GPU 2: NVIDIA GB200 (UUID: OMITTED)
GPU 3: NVIDIA GB200 (UUID: OMITTED)
```

このように、コンテナからホストのGPUを認識できます。なお、ジョブ内ではSlurmが割り当てたGPUのみが見えます（例：`--gpus=1`のジョブではGPU 0のみが表示されます）。`--nv`を指定すると、Apptainerは次の処理を行います。

1. `/dev/nvidia*`などのGPUデバイスをコンテナ内で利用可能にする（コンテナ内に`/dev/nvidia*`が現れます）
2. ホスト側のNVIDIAドライバ関連ライブラリをコンテナ内にバインドする
3. バインドしたライブラリが使われるよう、コンテナ内の`LD_LIBRARY_PATH`を設定する

CUDAツールキットやフレームワーク（PyTorch等）はコンテナイメージ側に含め、ドライバはホスト側のものを`--nv`で取り込む、という分担が基本です。GPU用イメージはNVIDIA NGC（`docker://nvcr.io/...`）からarm64（aarch64）版を取得できます（[コマンドラインでのイメージ作成](#build-image-cli)を参照）。

### MPI並列 { #mpi }

#### ノード内並列 { #mpi-intra-node }

1ノード内で完結するMPI並列は、コンテナ内で`mpirun` / `mpiexec`を起動するだけで実行できます。プロセスマネージャがコンテナ内で直接アプリケーションを起動するため、コンテナ外との連携は不要です。コンテナ内にMPIランタイムが含まれていることが前提です。

```console
apptainer exec mpi-apps.sif mpiexec --bind-to none -np 8 ~/myapps/hoge inputfile
```

この場合、起動されるコンテナは1つだけで、その中で複数のプロセスが動作します。

!!! note

    HPC-XビルドのOpen MPIを内蔵するイメージ（NGCのnvhpc系など）では、ノード内実行でも [コンテナ内蔵Open MPI + srun --mpi=pmix](#mpi-container-pmix)の注記にある`OPAL_PREFIX` / `LD_LIBRARY_PATH`の指定が必要です。

#### マルチノード並列の考え方 { #mpi-multi-node }

複数ノードにまたがるMPI並列を、ノード内並列と同じ方法で起動することはできません。他ノードでのプロセス起動時点ではコンテナ環境が立ち上がっていないためです。マルチノード並列では、プロセスの起動にコンテナ起動を含める、すなわち ホスト側のプロセスマネージャから`apptainer exec`を起動する形をとります。ノード内並列とは`mpirun`（`srun`）と`apptainer`の順番が逆になっている点に注意してください。

複数ノードの確保はGPU数の指定で行います（1ノード4基のため、`--gpus=8`で2ノード。[ジョブスケジューラ（Slurm）との連携](#slurm)を参照）。

次は`--gpus=8 --ntasks-per-node=4`のジョブ内（2ノードが確保されている状態）で実行した例です。

```console
srun --mpi=pmix apptainer exec ubuntu2404.sif hostname
```

出力例：

```text
c146
c146
c146
c146
c147
c147
c147
c147
```

この方式では、ホスト側とコンテナ内のMPIが連携して動作する必要があるため、両者のバージョン整合が重要になります。本システムでは次の2つの方式を利用できます。

#### ホスト提供MPIのバインド方式 { #mpi-host-bind }

本システムのホスト側にはNVIDIA HPC-Xが`nvhpc-hpcx`モジュールとして用意されています。HPC-XはHPC SDKの一部として導入されているOpen MPI系で、GPUとInfiniBand相互結合網に最適化されています。

Open MPIやUCXの実体ライブラリはHPC SDKツリー側にあるため、コンテナへのバインドはHPC SDKのディレクトリごと行い、コンテナ内にライブラリの場所を環境変数で伝えます。アプリケーションはホスト側の`mpicc`でビルドすると、ホストMPIとABI（Application Binary Interface）が一致し確実です。

```bash
#!/bin/bash
#SBATCH -A PROJECT_NAME
#SBATCH --gpus=8
#SBATCH --ntasks-per-node=4
#SBATCH --time=01:00:00

module load nvhpc-hpcx

# ホスト側 Open MPI の場所 (OPAL_PREFIX) を mpirun の実体パスから求める
OMPI_PREFIX=$(readlink -f "$(which mpirun)"); OMPI_PREFIX=${OMPI_PREFIX%/bin/mpirun}
UCX_LIB="UCX_LIB_DIR" # HPC SDK 内の hpcx-*/ucx*/lib (libucp.so のある場所。
                                    # 例: find /shared/software/hpc_sdk -name libucp.so で確認)

mpirun --bind-to none -np 8 apptainer exec --nv -B /shared/software/hpc_sdk \
  --env OPAL_PREFIX=$OMPI_PREFIX \
  --env LD_LIBRARY_PATH=$OMPI_PREFIX/lib:$UCX_LIB \
  mpi-apps.sif ~/myapps/hoge inputfile
```

#### コンテナ内蔵Open MPI + srun --mpi=pmix { #mpi-container-pmix }

ホスト側MPIに依存せず、コンテナの可搬性を優先したい場合は、コンテナ内にOpen MPIを内蔵し、SlurmのPMIx連携でプロセスを起動する方式が利用できます。

```console
srun --mpi=pmix apptainer exec mpi-apps.sif ~/myapps/hoge inputfile
```

この方式では、ホスト側のSlurmが各ノードでコンテナを起動し、コンテナ内蔵のMPIランタイムがPMIxを介してプロセス群を集合させます。

!!! note

    NGCのnvhpc系イメージなど、HPC-XビルドのOpen MPIを内蔵するイメージは、ビルド時のインストール先パスが焼き込まれているため、そのままではMPI_Initに失敗します（`PML ob1 cannot be selected`等）。実行時に`--env OPAL_PREFIX=OMPI_PREFIX`と`--env LD_LIBRARY_PATH=OMPI_LIB:UCX_LIB`を指定してください。プレフィックスはコンテナ内の`hpc_sdk/**/hpcx-*/ompi`を探して確認します。

実行時に共有メモリ転送のUCX ERROR（`mm_posix ... Permission denied`）が多数出力されることがありますが、別のトランスポートにフォールバックして正常に完走します。別系統のMPIを内蔵する場合は、事前に疎通確認してください。

### MPI並列ジョブ { #mpi-job }

コンテナ内蔵Open MPI + PMIx方式のジョブスクリプト例を示します。

```bash
#!/bin/bash
#SBATCH -A PROJECT_NAME
#SBATCH --gpus=8
#SBATCH --ntasks-per-node=4
#SBATCH --time=01:00:00

srun --mpi=pmix apptainer exec --nv ~/mpi-apps.sif ~/myapps/hoge inputfile
```

利用可能なMPIプラグインは`srun --mpi=list`で確認できます。

```console
srun --mpi=list
```

出力例：

```text
MPI plugin types are...
	none
	cray_shasta
	pmi2
	pmix
specific pmix plugin versions available: pmix_v5
```

## Slurmとの連携 { #slurm }

Apptainerはホスト環境との親和性が高く、ジョブスクリプト内でコンテナであることをあまり意識せずに利用できます。ジョブの投入方法そのものは [Slurmの使い方](slurm.md)、指定できるGPU数と確保されるノード数・CPUコア数・メモリ量は [ジョブ実行資源](resources.md)を参照してください。

### 実行方法のイメージへの埋め込み { #slurm-embedded-runscript }

`%environment`と`%runscript`をイメージに設定しておくと、ジョブスクリプトをシンプルにできます。

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

このイメージを`hoge`という名前でPATHの通ったディレクトリに実行属性付きで保存しておくと、ジョブスクリプトは通常のアプリケーション実行と変わらなくなります。

```bash
#!/bin/bash
#SBATCH -A PROJECT_NAME
#SBATCH --time=00:15:00

hoge input.txt
```

### インタラクティブ実行 { #slurm-interactive }

計算ノードを対話的に利用するには`salloc`でノードを確保し、`srun`でシェルを起動します。

```console
salloc -A PROJECT_NAME --gpus=1 --time=00:30:00
srun --pty bash -i
```

計算ノード上でシェルが起動したら、そのままコンテナを操作できます。

```console
apptainer shell ubuntu2404.sif
```

インタラクティブジョブ内では、本ページで紹介したすべての操作（イメージのビルド、sandboxの編集、GPUを使った動作確認など）を対話的に実行できます。
