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

### ホームディレクトリ

各ユーザは5 GBのホームディレクトリ（`/home/[USER NAME]`）を持ちます。`[USER NAME]`はユーザ名です。ホームディレクトリは、ユーザごとの設定ファイルや小規模な作業ファイルの保存に適しています。

コマンドラインでホームディレクトリの利用状況を確認するには、下記のコマンドを実行ください。

```console
$ lfs quota -h -p `lfs project -d $HOME | awk '{print $1}'` /home
Disk quotas for prj 100010 (pid 100010):
Filesystem    used   bquota  blimit  bgrace   files   iquota  ilimit  igrace
     /home   2.42G       0k      5G       -     511        0 1000000       -
```

`used`は使用済み容量、`blimit`は容量の上限、`files`は使用中のファイル数、`ilimit`はファイル数の上限です。

### グループディレクトリ

各グループは1 TBのグループディレクトリ（`/data1/[GROUP NAME]`）を持ちます。`[GROUP NAME]`はグループ名です。グループディレクトリは、大規模な作業ファイルや同じグループのメンバで共同利用するデータの保存に適しています。

コマンドラインでグループディレクトリの利用状況を確認するには、下記のコマンドを実行ください（`[GROUP NAME]`にはグループ名を指定ください）。

```console
$ lfs quota -h -p `lfs project -d /data1/[GROUP NAME] | awk '{print $1}'` /data1
Disk quotas for prj 200013 (pid 200013):
Filesystem    used   bquota  blimit  bgrace   files   iquota  ilimit  igrace
    /data1      4k       0k      1T       -       1        0 10000000       -
```

`used`は使用済み容量、`blimit`は容量の上限、`files`は使用中のファイル数、`ilimit`はファイル数の上限です。

!!! note
    コマンドラインでグループ名を知りたい場合は、`id`コマンドを実行し、`groups=...`に表示される`rkp`で始まる文字列を確認ください。なお、1人のユーザは複数のグループを持つことがあります。

### テンポラリディレクトリ

ジョブ実行時に各計算ノードはローカルSSDを`/tmp`にマウントします。`/tmp`は、計算中の中間結果などを高速なローカルSSD上で扱いたい場合に適しています。`/tmp`上のファイルはジョブ終了時にすべて削除されるため、保存が必要な結果はジョブ終了前にホームディレクトリもしくはグループディレクトリにコピーしてください。

### 各ディレクトリのまとめ

ホームディレクトリとグループディレクトリは共用ストレージ上にあるため、計算ノードとログインノードのどちらからでも利用でき、計算ノード間でデータの共有を行えます。テンポラリディレクトリは各計算ノード上の独立した一時領域であるため、計算ノードからしか利用できず、計算ノード間でデータの共有は行えません。

<div class="spec-table">
<table>
  <tbody>
    <tr>
      <th>名称</th>
      <th>マウント先</th>
      <th>容量</th>
      <th>計算ノードからの利用</th>
      <th>ログインノードからの利用</th>
      <th>複数ノードからの参照</th>
    </tr>
    <tr>
      <td>ホームディレクトリ</td>
      <td><code>/home/[USER NAME]</code></td>
      <td>5 GB</td>
      <td rowspan="3">可能</td>
      <td rowspan="2">可能</td>
      <td rowspan="2">可能</td>
    </tr>
    <tr>
      <td>グループディレクトリ</td>
      <td><code>/data1/[GROUP NAME]</code></td>
      <td>最大 1 TB</td>
    </tr>
    <tr>
      <td>テンポラリディレクトリ</td>
      <td><code>/tmp</code></td>
      <td>最大 7 TB</td>
      <td>不可能</td>
      <td>不可能</td>
    </tr>
  </tbody>
</table>
</div>

### 増量申請

ホームディレクトリもしくはグループディレクトリの容量を追加する場合は、下記のリンクからチケットを生成してください。

[チケット作成](https://support.r-ccs.riken.jp/hc/ja/requests/new){ .md-button .md-button--primary .registration-button .zendesk-button target="_blank" rel="noopener" }

!!! note

    追加容量に応じた課金が発生する予定ですが、Early Access Phase 2の期間中は課金は発生しません。料金は現在調整中です。
