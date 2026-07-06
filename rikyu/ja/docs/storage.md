# ストレージ

本システムのストレージ領域は、<span class="text-marker">ホーム領域</span>、<span class="text-marker">グループ領域</span>、<span class="text-marker">スクラッチ領域</span>の3つに分けられます。本ページでは、各領域の特徴を説明します。用途に応じて使い分けてください。

## ホーム領域

各ユーザは5 GBのホーム領域（`/home/USER_NAME`）を持ちます。`USER_NAME`はユーザ名です。ホーム領域を読み書きできるのは、その領域を持つユーザ本人だけです。ホーム領域は、ユーザごとの設定ファイルや小規模な作業ファイルの保存に適しています。

コマンドラインでホーム領域の利用状況を確認するには、以下のコマンドを実行してください。

```console
$ lfs quota -h -p `lfs project -d $HOME | awk '{print $1}'` /home
Disk quotas for prj 100010 (pid 100010):
Filesystem    used   bquota  blimit  bgrace   files   iquota  ilimit  igrace
     /home   2.42G       0k      5G       -     511        0 1000000       -
```

`used`は使用済み容量、`blimit`は容量の上限、`files`は使用中のファイル数、`ilimit`はファイル数の上限です。

## グループ領域

各グループは1 TBのグループ領域（`/data1/GROUP_NAME`）を持ちます。`GROUP_NAME`はグループ名です。グループ領域は、同じグループのメンバが読み書きできます。グループ領域は、大規模な作業ファイルや同じグループのメンバで共同利用するデータの保存に適しています。

コマンドラインでグループ領域の利用状況を確認するには、以下のコマンドを実行してください（`GROUP_NAME`にはグループ名を指定してください）。

```console
$ lfs quota -h -p `lfs project -d /data1/GROUP_NAME | awk '{print $1}'` /data1
Disk quotas for prj 200013 (pid 200013):
Filesystem    used   bquota  blimit  bgrace   files   iquota  ilimit  igrace
    /data1      4k       0k      1T       -       1        0 10000000       -
```

`used`は使用済み容量、`blimit`は容量の上限、`files`は使用中のファイル数、`ilimit`はファイル数の上限です。

コマンドラインでグループ名を知りたい場合は、`id`コマンドを実行し、`groups=...`に表示される`rkp`で始まる文字列を確認してください。実行例は次のとおりです。1人のユーザは複数のグループを持つことがあります。

```console
rku00011@c000:~$ id
uid=100010(rku00011) gid=200000(rkuser) groups=200000(rkuser),200013(rkp00010)
```

## スクラッチ領域

各計算ノードは、ローカルSSDで構成されたスクラッチ領域（`/tmp`）を持ちます。1 GPUごとに1.5 TBを利用できます。スクラッチ領域を読み書きできるのは、ジョブを実行しているユーザ本人だけです。スクラッチ領域は、計算中の中間結果などを高速なローカルSSD上で扱いたい場合に適しています。

スクラッチ領域上のファイルはジョブ終了時にすべて削除されるため、保存が必要な結果はジョブ終了前にホーム領域またはグループ領域にコピーしてください。

## 各領域の比較

ホーム領域とグループ領域は共用ストレージ上にあるため、計算ノードとログインノードのどちらからでも利用できます。また、複数の計算ノード間でデータを共有できます。スクラッチ領域はジョブが実行されている計算ノード上の一時領域であり、そのノード上で実行される処理からのみ利用できます。読み書きできるユーザは領域によって異なり、ホーム領域とスクラッチ領域はユーザ本人のみ、グループ領域は同じグループのメンバです。

<div class="spec-table">
<table>
  <tbody>
    <tr>
      <th>名称</th>
      <th>マウント先</th>
      <th>容量</th>
      <th>計算ノードからの利用</th>
      <th>ログインノードからの利用と<br>複数ノード間の共有</th>
      <th>読み書きできるユーザ</th>
    </tr>
    <tr>
      <td>ホーム領域</td>
      <td><code>/home/USER_NAME</code></td>
      <td>5 GB</td>
      <td rowspan="3">可能</td>
      <td>可能</td>
      <td>本人のみ</td>
    </tr>
    <tr>
      <td>グループ領域</td>
      <td><code>/data1/GROUP_NAME</code></td>
      <td>グループごとに1 TB</td>
      <td>可能</td>
      <td>同じグループのメンバ</td>
    </tr>
    <tr>
      <td>スクラッチ領域</td>
      <td><code>/tmp</code></td>
      <td>1 GPUごとに1.5 TB</td>
      <td>不可能</td>
      <td>本人のみ</td>
    </tr>
  </tbody>
</table>
</div>

ホーム領域には高速ストレージ2 PB（SSD）を、グループ領域には大容量ストレージ10 PB（HDD）を利用しています。そのため、ホーム領域とグループ領域では性能特性が異なることに注意してください。

## 増量申請

ホーム領域またはグループ領域の容量を追加する場合は、以下のリンクからチケットを作成してください。

[チケット作成](https://support.r-ccs.riken.jp/hc/ja/requests/new){ .md-button .md-button--primary .action-button target="_blank" rel="noopener" }

!!! note

    追加容量に応じた課金が発生する予定ですが、早期アクセスフェーズ2の期間中は課金は発生しません。料金は現在調整中です。
