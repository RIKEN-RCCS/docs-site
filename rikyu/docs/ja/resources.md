# 利用可能資源

## 計算資源

本システムでプログラムを実行するには、[Slurmジョブスケジューラ](https://slurm.schedmd.com/slurm.html){ target="_blank" rel="noopener" }を使ってジョブを投入します。ジョブを投入する際はGPU数を指定します。<span class="text-marker">指定できるGPU数は、1、2、3、4、8、12、16</span>です。GPU数によって、確保されるノード数、最大CPUコア数、最大メモリ量が異なります。

<div class="spec-table">
<table>
  <tbody>
    <tr>
      <th style="text-align: right;">GPU数</th>
      <th>確保されるノード数</th>
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

!!! note

    表中の最大メモリ量は、GPUメモリとCPUメモリを合わせた利用可能量の目安です。GPUメモリは1 GPUあたり173.2 GiBです。GB200 NVL4ではCPU-GPU間がNVLink-C2Cでキャッシュコヒーレントに接続されているため、CPUとGPUは互いのメモリへアクセスできます。CPUメモリとGPUメモリは性能特性が異なることに注意してください。

## ストレージ資源

### ホーム領域

各ユーザは5 GBのホーム領域（`/home/[USER NAME]`）を持ちます。`[USER NAME]`はユーザ名です。ホーム領域を読み書きできるのは、その領域を持つユーザ本人だけです。ホーム領域は、ユーザごとの設定ファイルや小規模な作業ファイルの保存に適しています。

コマンドラインでホーム領域の利用状況を確認するには、下記のコマンドを実行ください。

```console
$ lfs quota -h -p `lfs project -d $HOME | awk '{print $1}'` /home
Disk quotas for prj 100010 (pid 100010):
Filesystem    used   bquota  blimit  bgrace   files   iquota  ilimit  igrace
     /home   2.42G       0k      5G       -     511        0 1000000       -
```

`used`は使用済み容量、`blimit`は容量の上限、`files`は使用中のファイル数、`ilimit`はファイル数の上限です。

### グループ領域

各グループは1 TBのグループ領域（`/data1/[GROUP NAME]`）を持ちます。`[GROUP NAME]`はグループ名です。グループ領域は、同じグループのメンバが読み書きできます。グループ領域は、大規模な作業ファイルや同じグループのメンバで共同利用するデータの保存に適しています。

コマンドラインでグループ領域の利用状況を確認するには、下記のコマンドを実行ください（`[GROUP NAME]`にはグループ名を指定ください）。

```console
$ lfs quota -h -p `lfs project -d /data1/[GROUP NAME] | awk '{print $1}'` /data1
Disk quotas for prj 200013 (pid 200013):
Filesystem    used   bquota  blimit  bgrace   files   iquota  ilimit  igrace
    /data1      4k       0k      1T       -       1        0 10000000       -
```

`used`は使用済み容量、`blimit`は容量の上限、`files`は使用中のファイル数、`ilimit`はファイル数の上限です。

!!! note
    コマンドラインでグループ名を知りたい場合は、`id`コマンドを実行し、`groups=...`に表示される`rkp`で始まる文字列を確認ください。なお、1人のユーザは複数のグループを持つことがあります。

### スクラッチ領域

ジョブ実行時に各計算ノードはローカルSSDを`/tmp`にマウントします。その領域をスクラッチ領域と呼びます。スクラッチ領域を読み書きできるのは、ジョブを実行しているユーザ本人だけです。スクラッチ領域は、計算中の中間結果などを高速なローカルSSD上で扱いたい場合に適しています。スクラッチ領域上のファイルはジョブ終了時にすべて削除されるため、保存が必要な結果はジョブ終了前にホーム領域もしくはグループ領域にコピーしてください。

### 各領域の比較

ホーム領域とグループ領域は共用ストレージ上にあるため、計算ノードとログインノードのどちらからでも利用できます。また、複数の計算ノード間でデータの共有を行えます。スクラッチ領域はジョブが実行されている計算ノード上の一時領域であり、そのノード上で実行される処理からのみ利用できます。読み書きできるユーザは領域によって異なり、ホーム領域とスクラッチ領域はユーザ本人のみ、グループ領域は同じグループのメンバです。

<div class="spec-table">
<table>
  <tbody>
    <tr>
      <th>名称</th>
      <th>マウント先</th>
      <th>容量</th>
      <th>計算ノードからの利用</th>
      <th>ログインノードからの利用<br>複数ノード間の共有</th>
      <th>読み書きできるユーザ</th>
    </tr>
    <tr>
      <td>ホーム領域</td>
      <td><code>/home/[USER NAME]</code></td>
      <td>5 GB</td>
      <td rowspan="3">可能</td>
      <td rowspan="2">可能</td>
      <td>本人のみ</td>
    </tr>
    <tr>
      <td>グループ領域</td>
      <td><code>/data1/[GROUP NAME]</code></td>
      <td>最大 1 TB</td>
      <td>同じグループのメンバ</td>
    </tr>
    <tr>
      <td>スクラッチ領域</td>
      <td><code>/tmp</code></td>
      <td>最大 7.68 TB</td>
      <td>不可能</td>
      <td>本人のみ</td>
    </tr>
  </tbody>
</table>
</div>

!!! note
    
    ホーム領域には高速ストレージ2 PB（SSD）が、グループ領域には大容量ストレージ10 PB（HDD）を利用しています。そのため、ホーム領域とグループ領域では性能特性が異なることに注意してください。

### 増量申請

ホーム領域もしくはグループ領域の容量を追加する場合は、下記のリンクからチケットを生成してください。

[チケット作成](https://support.r-ccs.riken.jp/hc/ja/requests/new){ .md-button .md-button--primary .registration-button .zendesk-button target="_blank" rel="noopener" }

!!! note

    追加容量に応じた課金が発生する予定ですが、Early Access Phase 2の期間中は課金は発生しません。料金は現在調整中です。
