# 利用方法

「理究」でプログラムを実行するには、[Slurmジョブスケジューラ](https://slurm.schedmd.com/slurm.html)を使ってジョブを投入します。ジョブを投入する際はGPU数を指定します。<span class="text-marker">指定できるGPU数は、1、2、3、4、8、12、16です。</span>利用するGPU数によって、確保されるノード数、CPUコア数、メモリ量が異なります。

<div class="spec-table">
<table>
  <tbody>
    <tr>
      <th style="text-align: right;">GPU数</th>
      <th>確保するノード数</th>
      <th>最大CPUコア数/ノード</th>
      <th>最大メモリ量/ノード</th>
      <th>最大実行時間</th>
    </tr>
    <tr>
      <td style="text-align: right;">1</td>
      <td rowspan="4">1</td>
      <td>36</td>
      <td>400GB</td>
      <td rowspan="7">96時間</td>
    </tr>
    <tr>
      <td style="text-align: right;">2</td>
      <td>72</td>
      <td>800GB</td>
    </tr>
    <tr>
      <td style="text-align: right;">3</td>
      <td>108</td>
      <td>1,200GB</td>
    </tr>
    <tr>
      <td style="text-align: right;">4</td>
      <td rowspan="4">144</td>
      <td rowspan="4">1,600GB</td>
    </tr>
     <tr>
      <td style="text-align: right;">8</td>
      <td>2</td>
    </tr>
    <tr>
      <td style="text-align: right;">12</td>
      <td>3</td>
    </tr>
    <tr>
      <td style="text-align: right;">16</td>
      <td>4</td>
    </tr>
  </tbody>
</table>
</div>

「理究」を利用するには、<span class="text-marker">WebブラウザからOpen OnDemandを利用する方法</span>と、<span class="text-marker">ターミナルソフトウェアからSSHで接続する方法</span>があります。

## Open OnDemand

Open OnDemandはWebブラウザからスーパーコンピュータを利用できるWebポータルです。[https://ondemand.rikyu.r-ccs.riken.jp](https://ondemand.rikyu.r-ccs.riken.jp)からログインください。Open OnDemandは下記の機能を提供しています。

* ファイルの送受信・編集
* Webターミナルの利用
* 対話アプリケーション（リモートデスクトップなど）の実行と管理
* ジョブの投入と管理

Open OnDemandは、Google Chrome、Mozilla Firefox、Microsoft Edgeなどの主要なWebブラウザに対応しています（注：Internet Explorer 11は対応していません）。中でもChromeは、リモートデスクトップなどにおいて、文字列のコピー & ペースト機能をネイティブにサポートしていますので、Chromeのご利用をお勧めします。

詳しくは[Open OnDemandの使い方](ood.md)を参照してください。

## ターミナルソフトウェア

ターミナルソフトウェアからSSHで接続する前に、SSHの公開鍵を「理究」に登録する必要があります。

[https://ondemand.rikyu.r-ccs.riken.jp](https://ondemand.rikyu.r-ccs.riken.jp)から「SSH Public Key」を起動してください。下記の画面が表示されますので、「Add a Public Key」の中のテキストエリアにご自身のSSH公開鍵を入力し、「Add」ボタンをクリックしてください。登録が成功すると、「Registered Public Keys」に登録情報が表示されます。

![SSH public key](../img/sshpubkey.png){ width="800" }

公開鍵の登録後、ターミナルソフトウェアから下記のコマンドでSSHログインできます。以下の`USERNAME`は自分のユーザ名に置き換えてください。

```bash
$ ssh USERNAME@login.rikyu.r-ccs.riken.jp
```

コマンドラインによるジョブの投入方法などについては、[Slurmの使い方](slurm.md)を参照してください。
