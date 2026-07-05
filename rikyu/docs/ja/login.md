# ログイン方法

本システムにログインする方法として、<span class="text-marker">WebブラウザからHTTPSでOpen OnDemandサーバに接続する方法</span>と<span class="text-marker">端末ソフトウェアからSSHでログインノードに接続する方法</span>を提供しています。どちらかの方法でログインした後、ログイン先のサーバから[Slurmジョブスケジューラ](https://slurm.schedmd.com/slurm.html){ target="_blank" rel="noopener" }を介して計算ノードにジョブを投入します。データは共用ストレージ上に配置して利用します。

![How to use](../img/howtouse.png){ width="500" }

## Open OnDemand

Open OnDemandは、Webブラウザからスーパーコンピュータを利用できるWebポータルです。Open OnDemandには以下のリンクからログインしてください。

[Open OnDemand](https://ondemand.rikyu.r-ccs.riken.jp){ .md-button .md-button--primary .registration-button .ood-button target="_blank" rel="noopener" }

詳しくは[Open OnDemandの使い方](ood.md)を参照してください。

## 端末ソフトウェア

端末ソフトウェアからSSHで接続する前に、Open OnDemandからSSH公開鍵を本システムに登録する必要があります。Open OnDemandには以下のリンクからログインしてください。

[Open OnDemand](https://ondemand.rikyu.r-ccs.riken.jp){ .md-button .md-button--primary .registration-button .ood-button target="_blank" rel="noopener" }

「SSH Public Key」を起動してください。以下の画面が表示されますので、「Add a Public Key」のテキストエリアにご自身のSSH公開鍵を入力し、「Add」ボタンをクリックしてください。登録が成功すると、「Registered Public Keys」に登録情報が表示されます。

![SSH public key](../img/sshpubkey.png){ width="800" }

公開鍵の登録後、端末ソフトウェアから以下のコマンドでSSHログインできます。`USERNAME`は自分のユーザ名に置き換えてください。

```bash
$ ssh USERNAME@login.rikyu.r-ccs.riken.jp
```

コマンドラインによるジョブの投入方法などについては、[Slurmの使い方](slurm.md)を参照してください。
