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

    表中の最大メモリ量は、GPUメモリとCPUメモリを合わせた利用可能量の目安です。GPUメモリは1 GPUあたり173.2 GiBであり、400 GBすべてがGPUメモリではありません。GB200 NVL4ではCPU-GPU間がNVLink-C2Cでキャッシュコヒーレントに接続されているため、CPUとGPUは互いのメモリへアクセスできます。ただし、CPUメモリとGPUメモリは性能特性が異なります。

## ストレージ資源

標準で利用できるストレージ容量は、ホームディレクトリがユーザあたり5 GB、グループディレクトリがグループあたり50 GBです。標準容量を超えてストレージ容量を追加する場合は、追加容量に応じた課金が必要です。ストレージ容量の増量を希望する場合は、下記のリンクからチケットを生成してください。

[チケットサービス](https://support.r-ccs.riken.jp/hc/ja/requests/new){ .md-button .md-button--primary .registration-button .zendesk-button target="_blank" rel="noopener" }

!!! note

    ストレージ容量の追加に対する課金は、Early Access Phase 2の期間中は発生しません。Early Access Phase 2の終了後は課金対象となる予定です。料金は現在調整中です。
