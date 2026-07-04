# 利用方法

ユーザが本システムに接続するには、<span class="text-marker">WebブラウザからHTTPSでOpen OnDemandサーバに接続する</span>か、<span class="text-marker">ターミナルソフトウェアからSSHでログインノードに接続します</span>。そして、それぞれサーバから[Slurmジョブスケジューラ](https://slurm.schedmd.com/slurm.html){ target="_blank" rel="noopener" }を介してジョブを投入し、割り当てられた計算ノード上でプログラムを実行します。データは共用ストレージ上に配置して利用できます。

![How to use](../img/howtouse.png){ width="500" }

## Open OnDemand

Open OnDemandはWebブラウザからスーパーコンピュータを利用できるWebポータルです。Open OnDemandには下記のリンクからログインください。

[Open OnDemand](https://ondemand.rikyu.r-ccs.riken.jp){ .md-button .md-button--primary .registration-button .ood-button target="_blank" rel="noopener" }

Open OnDemandは次の機能を提供しています。

* ファイルの送受信・編集
* Webターミナルの利用
* 対話アプリケーション（リモートデスクトップなど）の実行と管理
* ジョブの投入と管理

Open OnDemandは、Google Chrome、Mozilla Firefox、Microsoft Edgeなどの主要なWebブラウザに対応しています（注：Internet Explorer 11は対応していません）。中でもChromeは、リモートデスクトップなどにおいて、文字列のコピー & ペースト機能をネイティブにサポートしていますので、Chromeのご利用をお勧めします。

詳しくは[Open OnDemandの使い方](ood.md)を参照してください。

## ターミナルソフトウェア

ターミナルソフトウェアからSSHで接続する前に、Open OnDemandからSSHの公開鍵を本システムに登録する必要があります。Open OnDemandには下記のリンクからログインください。

[Open OnDemand](https://ondemand.rikyu.r-ccs.riken.jp){ .md-button .md-button--primary .registration-button .ood-button target="_blank" rel="noopener" }

「SSH Public Key」を起動してください。下記の画面が表示されますので、「Add a Public Key」の中のテキストエリアにご自身のSSH公開鍵を入力し、「Add」ボタンをクリックしてください。登録が成功すると、「Registered Public Keys」に登録情報が表示されます。

![SSH public key](../img/sshpubkey.png){ width="800" }

公開鍵の登録後、ターミナルソフトウェアから下記のコマンドでSSHログインできます。以下の`USERNAME`は自分のユーザ名に置き換えてください。

```bash
$ ssh USERNAME@login.rikyu.r-ccs.riken.jp
```

コマンドラインによるジョブの投入方法などについては、[Slurmの使い方](slurm.md)を参照してください。
